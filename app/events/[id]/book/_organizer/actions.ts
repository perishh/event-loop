"use server";

import { BookingStatus, UserRole } from "@/app/generated/prisma/enums";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type BookingActionResult =
  | { success: true }
  | { success: false; error: string };

type AuthResult =
  | {
      authorized: true;
      eventId: string;
    }
  | {
      authorized: false;
      error: string;
    };

async function authorizeOrganizer(bookingId: string): Promise<AuthResult> {
  const session = await getSession();

  if (!session) {
    return {
      authorized: false,
      error: "Πρέπει να είστε συνδεδεμένος για να διαχειριστείτε κρατήσεις.",
    };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      ticketType: {
        select: {
          eventId: true,
        },
      },
    },
  });

  if (!booking) {
    return {
      authorized: false,
      error: "Η κράτηση δεν βρέθηκε.",
    };
  }

  const event = await prisma.event.findUnique({
    where: { id: booking.ticketType.eventId },
    select: { organizerId: true },
  });

  if (
    !event ||
    (event.organizerId !== session.sub && session.role !== UserRole.ADMIN)
  ) {
    return {
      authorized: false,
      error: "Δεν έχετε δικαίωμα διαχείρισης αυτής της κράτησης.",
    };
  }

  return {
    authorized: true,
    eventId: booking.ticketType.eventId,
  };
}

export async function confirmBookingAction(
  bookingId: string,
): Promise<BookingActionResult> {
  const auth = await authorizeOrganizer(bookingId);

  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true },
  });

  if (!booking) {
    return { success: false, error: "Η κράτηση δεν βρέθηκε." };
  }

  if (booking.status !== BookingStatus.PENDING) {
    return {
      success: false,
      error:
        booking.status === BookingStatus.CONFIRMED
          ? "Η κράτηση είναι ήδη επιβεβαιωμένη."
          : "Δεν μπορείτε να επιβεβαιώσετε μια ακυρωμένη κράτηση.",
    };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CONFIRMED },
  });

  revalidatePath(`/events/${encodeURIComponent(auth.eventId)}`);
  revalidatePath(`/events/${encodeURIComponent(auth.eventId)}/book`);

  return { success: true };
}

export async function cancelBookingAction(
  bookingId: string,
): Promise<BookingActionResult> {
  const auth = await authorizeOrganizer(bookingId);

  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true, numberOfTickets: true, ticketTypeId: true },
  });

  if (!booking) {
    return { success: false, error: "Η κράτηση δεν βρέθηκε." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Atomically check status and update — prevents a race where
      // two concurrent cancellations could both refund tickets.
      const result = await tx.booking.updateMany({
        where: {
          id: bookingId,
          status: { not: BookingStatus.CANCELLED },
        },
        data: { status: BookingStatus.CANCELLED },
      });

      if (result.count === 0) {
        throw new Error("ALREADY_CANCELLED");
      }

      // Restore available ticket count when cancelling
      await tx.eventTickets.update({
        where: { id: booking.ticketTypeId },
        data: {
          available: {
            increment: booking.numberOfTickets,
          },
        },
      });
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "ALREADY_CANCELLED") {
      return {
        success: false,
        error: "Η κράτηση είναι ήδη ακυρωμένη.",
      };
    }
    throw e;
  }

  revalidatePath(`/events/${encodeURIComponent(auth.eventId)}`);
  revalidatePath(`/events/${encodeURIComponent(auth.eventId)}/book`);

  return { success: true };
}
