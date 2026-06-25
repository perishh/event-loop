import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { UserRole, BookingStatus } from "@/app/generated/prisma/enums";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== UserRole.ATTENDEE) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let rawInput: { eventId?: string };
  try {
    rawInput = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  const eventId = rawInput.eventId;
  if (typeof eventId !== "string" || eventId.length === 0) {
    return NextResponse.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
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
    return NextResponse.json(
      {
        success: false,
        error: "Δεν έχετε επιβεβαιωμένη κράτηση για αυτή την εκδήλωση.",
      },
      { status: 403 },
    );
  }

  const conversation = await prisma.conversation.upsert({
    where: { eventId_attendeeId: { eventId, attendeeId: session.sub } },
    update: {},
    create: { eventId, attendeeId: session.sub },
    select: { id: true },
  });

  return NextResponse.json({ success: true, conversationId: conversation.id });
}
