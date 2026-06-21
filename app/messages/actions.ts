"use server";

import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole, BookingStatus } from "@/app/generated/prisma/enums";

export type MessageActionResult =
  | { success: true }
  | { success: false; error: string };

export type MessageFormState = MessageActionResult | null;

// A conversation belongs to its (event, attendee) pair; only those two may act.
async function resolveParticipant(
  conversationId: string,
  userId: string,
): Promise<{ ok: true; isAttendee: boolean } | { ok: false; error: string }> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      attendeeId: true,
      event: { select: { organizerId: true } },
    },
  });

  if (!conversation) {
    return { ok: false, error: "Η συνομιλία δεν βρέθηκε." };
  }

  const isAttendee = conversation.attendeeId === userId;
  const isOrganizer = conversation.event.organizerId === userId;

  if (!isAttendee && !isOrganizer) {
    return { ok: false, error: "Δεν έχετε πρόσβαση σε αυτή τη συνομιλία." };
  }

  return { ok: true, isAttendee };
}

export async function sendMessage(
  prevState: MessageFormState,
  formData: FormData,
): Promise<MessageActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Πρέπει να είστε συνδεδεμένος." };
  }

  const conversationId = formData.get("conversationId");
  const body = formData.get("body");

  if (typeof conversationId !== "string" || conversationId.length === 0) {
    return { success: false, error: "Μη έγκυρο αίτημα." };
  }

  const text = typeof body === "string" ? body.trim() : "";
  if (text.length === 0) {
    return { success: false, error: "Το μήνυμα είναι κενό." };
  }

  const participant = await resolveParticipant(conversationId, session.sub);
  if (!participant.ok) return { success: false, error: participant.error };

  // Update through the conversation to bump updatedAt.
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { messages: { create: { body: text, senderId: session.sub } } },
  });

  revalidatePath("/messages");
  return { success: true };
}

export async function deleteMessageForMe(
  prevState: MessageFormState,
  formData: FormData,
): Promise<MessageActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Πρέπει να είστε συνδεδεμένος." };
  }

  const messageId = formData.get("messageId");
  if (typeof messageId !== "string" || messageId.length === 0) {
    return { success: false, error: "Μη έγκυρο αίτημα." };
  }

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: {
      conversation: {
        select: {
          attendeeId: true,
          event: { select: { organizerId: true } },
        },
      },
    },
  });

  if (!message) return { success: false, error: "Το μήνυμα δεν βρέθηκε." };

  const isAttendee = message.conversation.attendeeId === session.sub;
  const isOrganizer = message.conversation.event.organizerId === session.sub;

  if (!isAttendee && !isOrganizer) {
    return { success: false, error: "Δεν έχετε πρόσβαση σε αυτό το μήνυμα." };
  }

  // Hide only from the acting user; the other party still sees it.
  await prisma.message.update({
    where: { id: messageId },
    data: isAttendee ? { hiddenByAttendee: true } : { hiddenByOrganizer: true },
  });

  revalidatePath("/messages");
  return { success: true };
}

// Hides every message of the conversation from the acting user, then redirects.
export async function deleteConversationForMe(conversationId: string) {
  const session = await getSession();
  if (!session) return;

  const participant = await resolveParticipant(conversationId, session.sub);
  if (!participant.ok) return;

  await prisma.message.updateMany({
    where: { conversationId },
    data: participant.isAttendee
      ? { hiddenByAttendee: true }
      : { hiddenByOrganizer: true },
  });

  redirect("/messages");
}

// Marks the conversation's received messages as read (on open).
export async function markConversationRead(conversationId: string) {
  const session = await getSession();
  if (!session) return;

  const participant = await resolveParticipant(conversationId, session.sub);
  if (!participant.ok) return;

  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: session.sub }, read: false },
    data: { read: true },
  });

  revalidatePath("/messages");
}

// Gets or creates the (event, attendee) conversation for the booking's event,
// then opens it. Only an attendee who booked that event may start it.
export async function startConversation(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== UserRole.ATTENDEE) {
    redirect("/login?next=/bookings");
  }

  const eventId = formData.get("eventId");
  if (typeof eventId !== "string" || eventId.length === 0) {
    redirect("/bookings");
  }

  // Only an attendee with a CONFIRMED booking may message the organizer.
  const booking = await prisma.booking.findFirst({
    where: {
      attendeeId: session.sub,
      status: BookingStatus.CONFIRMED,
      ticketType: { eventId },
    },
    select: { id: true },
  });
  if (!booking) {
    redirect("/bookings");
  }

  const conversation = await prisma.conversation.upsert({
    where: { eventId_attendeeId: { eventId, attendeeId: session.sub } },
    update: {},
    create: { eventId, attendeeId: session.sub },
    select: { id: true },
  });

  redirect(`/messages?c=${conversation.id}`);
}
