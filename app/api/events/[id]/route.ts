import { NextRequest, NextResponse } from "next/server";
import { BookingStatus, UserRole } from "@/app/generated/prisma/enums";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { EventInputSchema } from "@/app/events/_form/schema";
import { revalidatePath } from "next/cache";
import z from "zod";

function isPrismaNotFound(err: unknown): boolean {
  return (
    err instanceof Error &&
    "code" in err &&
    (err as { code: string }).code === "P2025"
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: eventId } = await params;

  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Πρέπει να είστε συνδεδεμένος για να επεξεργαστείτε εκδήλωση.",
      },
      { status: 401 },
    );
  }

  if (session.role !== UserRole.ORGANIZER && session.role !== UserRole.ADMIN) {
    return NextResponse.json(
      {
        success: false,
        message: "Μόνο οι διοργανωτές μπορούν να επεξεργαστούν εκδηλώσεις.",
      },
      { status: 403 },
    );
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      organizerId: true,
    },
  });

  if (!event) {
    return NextResponse.json(
      { success: false, message: "Η εκδήλωση δεν βρέθηκε." },
      { status: 404 },
    );
  }

  if (event.organizerId !== session.sub && session.role !== UserRole.ADMIN) {
    return NextResponse.json(
      {
        success: false,
        message: "Δεν έχετε δικαίωμα επεξεργασίας αυτής της εκδήλωσης.",
      },
      { status: 403 },
    );
  }

  let rawInput: unknown;
  try {
    rawInput = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  const parsed = EventInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const {
    ticketTypes: inputTicketTypes,
    updatedAt: inputUpdatedAt,
    ...eventData
  } = input;

  try {
    await prisma.$transaction(async (tx) => {
      // Re-read ticket types with bookings inside the transaction to prevent
      // race conditions with concurrent bookings
      const currentTickets = await tx.eventTickets.findMany({
        where: { eventId: event.id },
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
          bookings: {
            select: {
              numberOfTickets: true,
              status: true,
            },
          },
        },
        orderBy: { id: "asc" },
      });

      const del: number[] = [];
      const upd: {
        id: number;
        name: string;
        price: number;
        quantity: number;
        available: number;
      }[] = [];
      const create: { name: string; price: number; quantity: number }[] = [];

      for (const ticket of currentTickets) {
        const updatedTicket = inputTicketTypes.find(
          (t) => t.name === ticket.name,
        );
        const bookedUnits = ticket.bookings
          .filter((b) => b.status !== BookingStatus.CANCELLED)
          .reduce((sum, b) => sum + b.numberOfTickets, 0);

        if (!updatedTicket) {
          if (bookedUnits > 0) {
            throw new Error(
              `Δεν μπορείτε να διαγράψετε τον τύπο εισιτηρίου "${ticket.name}" επειδή υπάρχουν κρατήσεις για αυτόν.`,
            );
          }
          del.push(ticket.id);
        } else {
          if (bookedUnits > updatedTicket.quantity) {
            throw new Error(
              `Δεν μπορείτε να μειώσετε την ποσότητα του τύπου εισιτηρίου "${ticket.name}" κάτω από ${bookedUnits} επειδή υπάρχουν τόσες κρατήσεις για αυτόν.`,
            );
          }
          upd.push({
            ...updatedTicket,
            id: ticket.id,
            available: updatedTicket.quantity - bookedUnits,
          });
        }
      }

      for (const ticket of inputTicketTypes) {
        if (currentTickets.some((t) => t.name === ticket.name)) continue;
        create.push(ticket);
      }

      try {
        await tx.event.update({
          where: {
            id: event.id,
            updatedAt: inputUpdatedAt,
          },
          data: {
            ...eventData,
            ticketTypes: {
              deleteMany: {
                id: { in: del },
              },
              updateMany: upd.map((ticket) => ({
                where: { id: ticket.id },
                data: {
                  name: ticket.name,
                  price: ticket.price,
                  quantity: ticket.quantity,
                  available: ticket.available,
                },
              })),
              create: create.map((ticket) => ({
                name: ticket.name,
                price: ticket.price,
                quantity: ticket.quantity,
                available: ticket.quantity,
              })),
            },
          },
        });
      } catch (err) {
        if (isPrismaNotFound(err)) {
          throw new Error(
            "Η εκδήλωση έχει τροποποιηθεί από άλλον χρήστη. Παρακαλώ ανανεώστε τη σελίδα και προσπαθήστε ξανά.",
          );
        }
        throw err;
      }
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Σφάλμα κατά την επεξεργασία της εκδήλωσης.",
      },
      { status: 409 },
    );
  }

  revalidatePath(`/events/${event.id}`);
  revalidatePath(`/events/${event.id}/edit`);
  revalidatePath(`/events/${event.id}/book`);

  return NextResponse.json({ success: true, message: event.id });
}
