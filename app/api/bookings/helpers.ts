import { UserRole } from "@/app/generated/prisma/enums";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";

type AuthResult =
  | {
      authorized: true;
      eventId: string;
    }
  | {
      authorized: false;
      error: string;
      status: number;
    };

export async function authorizeOrganizer(
  bookingId: string,
): Promise<AuthResult> {
  const session = await getSession();

  if (!session) {
    return {
      authorized: false,
      error: "Πρέπει να είστε συνδεδεμένος για να διαχειριστείτε κρατήσεις.",
      status: 401,
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
      status: 404,
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
      status: 403,
    };
  }

  return {
    authorized: true,
    eventId: booking.ticketType.eventId,
  };
}
