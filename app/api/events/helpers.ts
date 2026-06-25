import { EventStatus, UserRole } from "@/app/generated/prisma/enums";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";

export type AuthResult =
  | {
      authorized: true;
      status: EventStatus;
      bookingCount: number;
      organizerId: string;
      title: string;
    }
  | { authorized: false; error: string };

export async function authorizeOwner(eventId: string): Promise<AuthResult> {
  const session = await getSession();

  if (!session) {
    return { authorized: false, error: "Πρέπει να είστε συνδεδεμένος." };
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      organizerId: true,
      status: true,
      title: true,
      ticketTypes: {
        select: { _count: { select: { bookings: true } } },
      },
    },
  });

  if (!event) {
    return { authorized: false, error: "Η εκδήλωση δεν βρέθηκε." };
  }

  if (event.organizerId !== session.sub && session.role !== UserRole.ADMIN) {
    return {
      authorized: false,
      error: "Δεν έχετε δικαίωμα διαχείρισης αυτής της εκδήλωσης.",
    };
  }

  const bookingCount = event.ticketTypes.reduce(
    (sum, t) => sum + t._count.bookings,
    0,
  );

  return {
    authorized: true,
    status: event.status as EventStatus,
    bookingCount,
    organizerId: event.organizerId,
    title: event.title,
  };
}
