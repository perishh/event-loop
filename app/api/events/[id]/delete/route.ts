import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EventStatus } from "@/app/generated/prisma/enums";
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

  // Spec: delete only before publishing, or at the latest before the first booking.
  const canDelete =
    auth.status === EventStatus.DRAFT ||
    (auth.status === EventStatus.PUBLISHED && auth.bookingCount === 0);

  if (!canDelete) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Η διαγραφή επιτρέπεται μόνο πριν τη δημοσίευση ή πριν την πρώτη κράτηση.",
      },
      { status: 400 },
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany({ where: { ticketType: { eventId: id } } });
      await tx.eventTickets.deleteMany({ where: { eventId: id } });
      await tx.event.delete({ where: { id } });
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Σφάλμα κατά τη διαγραφή της εκδήλωσης." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
