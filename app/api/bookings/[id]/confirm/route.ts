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
    select: { status: true },
  });

  if (!booking) {
    return NextResponse.json(
      { success: false, error: "Η κράτηση δεν βρέθηκε." },
      { status: 404 },
    );
  }

  if (booking.status !== BookingStatus.PENDING) {
    return NextResponse.json(
      {
        success: false,
        error:
          booking.status === BookingStatus.CONFIRMED
            ? "Η κράτηση είναι ήδη επιβεβαιωμένη."
            : "Δεν μπορείτε να επιβεβαιώσετε μια ακυρωμένη κράτηση.",
      },
      { status: 409 },
    );
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CONFIRMED },
  });

  revalidatePath(`/events/${encodeURIComponent(auth.eventId)}`);
  revalidatePath(`/events/${encodeURIComponent(auth.eventId)}/book`);

  return NextResponse.json({ success: true });
}
