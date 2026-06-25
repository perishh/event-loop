import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Πρέπει να είστε συνδεδεμένος." },
      { status: 401 },
    );
  }

  let rawInput: { messageId?: string };
  try {
    rawInput = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  const messageId = rawInput.messageId;
  if (typeof messageId !== "string" || messageId.length === 0) {
    return NextResponse.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
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

  if (!message) {
    return NextResponse.json(
      { success: false, error: "Το μήνυμα δεν βρέθηκε." },
      { status: 404 },
    );
  }

  const isAttendee = message.conversation.attendeeId === session.sub;
  const isOrganizer = message.conversation.event.organizerId === session.sub;

  if (!isAttendee && !isOrganizer) {
    return NextResponse.json(
      { success: false, error: "Δεν έχετε πρόσβαση σε αυτό το μήνυμα." },
      { status: 403 },
    );
  }

  await prisma.message.update({
    where: { id: messageId },
    data: isAttendee ? { hiddenByAttendee: true } : { hiddenByOrganizer: true },
  });

  return NextResponse.json({ success: true });
}
