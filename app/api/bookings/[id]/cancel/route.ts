import { NextRequest, NextResponse } from "next/server";
import { BookingStatus } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorizeOrganizer } from "../../helpers";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: bookingId } = await params;

  const auth = await authorizeOrganizer(bookingId);

  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status },
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true, numberOfTickets: true, ticketTypeId: true },
  });

  if (!booking) {
    return NextResponse.json(
      { success: false, error: "Η κράτηση δεν βρέθηκε." },
      { status: 404 },
    );
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
      return NextResponse.json(
        {
          success: false,
          error: "Η κράτηση είναι ήδη ακυρωμένη.",
        },
        { status: 409 },
      );
    }
    throw e;
  }

  revalidatePath(`/events/${encodeURIComponent(auth.eventId)}`);
  revalidatePath(`/events/${encodeURIComponent(auth.eventId)}/book`);

  return NextResponse.json({ success: true });
}
