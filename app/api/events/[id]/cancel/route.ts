import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BookingStatus, EventStatus } from "@/app/generated/prisma/enums";
import { authorizeOwner } from "../../helpers";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const auth = await authorizeOwner(id);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 403 },
    );
  }

  if (auth.status !== EventStatus.PUBLISHED) {
    return NextResponse.json(
      {
        success: false,
        error: "Μόνο δημοσιευμένες εκδηλώσεις μπορούν να ακυρωθούν.",
      },
      { status: 400 },
    );
  }

  // Cancellation keeps all data; the booking flow already blocks new bookings
  // on non-PUBLISHED events, and existing bookings are preserved.
  await prisma.event.update({
    where: { id },
    data: { status: EventStatus.CANCELLED },
  });

  // Notify every attendee with a CONFIRMED booking: one message per
  // (event, attendee) conversation, sent on behalf of the organizer.
  const attendees = await prisma.booking.findMany({
    where: { ticketType: { eventId: id }, status: BookingStatus.CONFIRMED },
    select: { attendeeId: true },
    distinct: ["attendeeId"],
  });

  const body = `Η εκδήλωση «${auth.title}» ακυρώθηκε από τον διοργανωτή.`;

  for (const { attendeeId } of attendees) {
    await prisma.conversation.upsert({
      where: { eventId_attendeeId: { eventId: id, attendeeId } },
      update: {
        messages: { create: { body, senderId: auth.organizerId } },
      },
      create: {
        eventId: id,
        attendeeId,
        messages: { create: { body, senderId: auth.organizerId } },
      },
    });
  }

  return NextResponse.json({ success: true });
}
