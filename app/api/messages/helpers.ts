import prisma from "@/lib/prisma";

export async function resolveParticipant(
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
