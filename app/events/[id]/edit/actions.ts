"use server";

import { BookingStatus, UserRole } from "@/app/generated/prisma/enums";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { EventInputSchema } from "../../_form/schema";
import { EventTickets } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";

function isPrismaNotFound(err: unknown): boolean {
  return (
    err instanceof Error &&
    "code" in err &&
    (err as { code: string }).code === "P2025"
  );
}

export async function updateEventAction(
  eventId: string,
  rawInput: unknown,
): Promise<ActionResult> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "Πρέπει να είστε συνδεδεμένος για να επεξεργαστείτε εκδήλωση.",
    };
  }

  if (session.role !== UserRole.ORGANIZER && session.role !== UserRole.ADMIN) {
    return {
      success: false,
      message: "Μόνο οι διοργανωτές μπορούν να επεξεργαστούν εκδηλώσεις.",
    };
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      organizerId: true,
    },
  });

  if (!event) {
    return {
      success: false,
      message: "Η εκδήλωση δεν βρέθηκε.",
    };
  }

  if (event.organizerId !== session.sub && session.role !== UserRole.ADMIN) {
    return {
      success: false,
      message: "Δεν έχετε δικαίωμα επεξεργασίας αυτής της εκδήλωσης.",
    };
  }

  const parsed = EventInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
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
      const upd: Omit<EventTickets, "eventId">[] = [];
      const create: Omit<EventTickets, "available" | "eventId" | "id">[] = [];

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
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Σφάλμα κατά την επεξεργασία της εκδήλωσης.",
    };
  }

  revalidatePath(`/events/${event.id}`);
  revalidatePath(`/events/${event.id}/edit`);
  revalidatePath(`/events/${event.id}/book`);

  return {
    success: true,
    message: event.id,
  };
}
