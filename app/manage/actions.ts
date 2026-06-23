"use server";

import { EventStatus, UserRole, BookingStatus } from "@/app/generated/prisma/enums";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type EventManageActionResult =
  | { success: true }
  | { success: false; error: string };

/** State used by useActionState; null means idle. */
export type EventManageFormState = EventManageActionResult | null;

type AuthResult =
  | { authorized: true; status: EventStatus; bookingCount: number }
  | { authorized: false; error: string };

async function authorizeOwner(eventId: string): Promise<AuthResult> {
  const session = await getSession();

  if (!session) {
    return { authorized: false, error: "Πρέπει να είστε συνδεδεμένος." };
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      organizerId: true,
      status: true,
      ticketTypes: {
        select: { _count: { select: { bookings: true } } },
      },
    },
  });

  if (!event) {
    return { authorized: false, error: "Η εκδήλωση δεν βρέθηκε." };
  }

  if (event.organizerId !== session.sub && session.role !== UserRole.ADMIN) {
    return {
      authorized: false,
      error: "Δεν έχετε δικαίωμα διαχείρισης αυτής της εκδήλωσης.",
    };
  }

  const bookingCount = event.ticketTypes.reduce(
    (sum, t) => sum + t._count.bookings,
    0,
  );

  return { authorized: true, status: event.status, bookingCount };
}

function getEventId(formData: FormData): string | null {
  const id = formData.get("eventId");
  return typeof id === "string" && id.length > 0 ? id : null;
}

export async function publishEvent(
  prevState: EventManageFormState,
  formData: FormData,
): Promise<EventManageActionResult> {
  const eventId = getEventId(formData);
  if (!eventId) return { success: false, error: "Μη έγκυρο αίτημα." };

  const auth = await authorizeOwner(eventId);
  if (!auth.authorized) return { success: false, error: auth.error };

  if (auth.status !== EventStatus.DRAFT) {
    return {
      success: false,
      error: "Μόνο πρόχειρες εκδηλώσεις μπορούν να δημοσιευτούν.",
    };
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { status: EventStatus.PUBLISHED },
  });

  redirect("/manage");
}

export async function cancelEvent(
  prevState: EventManageFormState,
  formData: FormData,
): Promise<EventManageActionResult> {
  const eventId = getEventId(formData);
  if (!eventId) return { success: false, error: "Μη έγκυρο αίτημα." };

  const auth = await authorizeOwner(eventId);
  if (!auth.authorized) return { success: false, error: auth.error };

  if (auth.status !== EventStatus.PUBLISHED) {
    return {
      success: false,
      error: "Μόνο δημοσιευμένες εκδηλώσεις μπορούν να ακυρωθούν.",
    };
  }

  // Cancellation keeps all data; the booking flow already blocks new bookings
  // on non-PUBLISHED events, and existing bookings are preserved.
  const event = await prisma.event.update({
    where: { id: eventId },
    data: { status: EventStatus.CANCELLED },
    select: { title: true, organizerId: true },
  });

  // Notify every attendee with a CONFIRMED booking: one message per
  // (event, attendee) conversation, sent on behalf of the organizer.
  const attendees = await prisma.booking.findMany({
    where: { ticketType: { eventId }, status: BookingStatus.CONFIRMED },
    select: { attendeeId: true },
    distinct: ["attendeeId"],
  });

  const body = `Η εκδήλωση «${event.title}» ακυρώθηκε από τον διοργανωτή.`;

  for (const { attendeeId } of attendees) {
    await prisma.conversation.upsert({
      where: { eventId_attendeeId: { eventId, attendeeId } },
      update: { messages: { create: { body, senderId: event.organizerId } } },
      create: {
        eventId,
        attendeeId,
        messages: { create: { body, senderId: event.organizerId } },
      },
    });
  }

  revalidatePath("/messages");
  redirect("/manage");
}

export async function deleteEvent(
  prevState: EventManageFormState,
  formData: FormData,
): Promise<EventManageActionResult> {
  const eventId = getEventId(formData);
  if (!eventId) return { success: false, error: "Μη έγκυρο αίτημα." };

  const auth = await authorizeOwner(eventId);
  if (!auth.authorized) return { success: false, error: auth.error };

  // Spec: delete only before publishing, or at the latest before the first booking.
  const canDelete =
    auth.status === EventStatus.DRAFT ||
    (auth.status === EventStatus.PUBLISHED && auth.bookingCount === 0);

  if (!canDelete) {
    return {
      success: false,
      error:
        "Η διαγραφή επιτρέπεται μόνο πριν τη δημοσίευση ή πριν την πρώτη κράτηση.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany({ where: { ticketType: { eventId } } });
      await tx.eventTickets.deleteMany({ where: { eventId } });
      await tx.event.delete({ where: { id: eventId } });
    });
  } catch {
    return { success: false, error: "Σφάλμα κατά τη διαγραφή της εκδήλωσης." };
  }

  redirect("/manage");
}
