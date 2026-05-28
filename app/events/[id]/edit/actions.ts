"use server";

import { EventStatus, UserRole } from "@/app/generated/prisma/enums";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { EventInputSchema } from "../../_form/schema";
import { EventTickets } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";

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
      status: true,
      organizerId: true,
      ticketTypes: {
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!event) {
    return {
      success: false,
      message: "Η εκδήλωση δεν βρέθηκε.",
    };
  }

  // TODO: When bookings implemented, check

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

  const ticketsToDelete: number[] = [];
  const ticketsToUpdate: Omit<EventTickets, "eventId">[] = [];
  const ticketsToCreate: Omit<EventTickets, "available" | "eventId" | "id">[] =
    [];

  for (const ticket of event.ticketTypes) {
    const updatedTicket = input.ticketTypes.find((t) => t.name === ticket.name);
    const bookedUnits = 0; // TODO
    if (!updatedTicket) {
      // Ticket removed
      if (bookedUnits > 0) {
        return {
          success: false,
          message: `Δεν μπορείτε να διαγράψετε τον τύπο εισιτηρίου "${ticket.name}" επειδή υπάρχουν κρατήσεις για αυτόν.`,
        };
      }
      ticketsToDelete.push(ticket.id);
    } else {
      // TODO: Check for race conditions
      if (bookedUnits > updatedTicket.quantity) {
        return {
          success: false,
          message: `Δεν μπορείτε να μειώσετε την ποσότητα του τύπου εισιτηρίου "${ticket.name}" κάτω από ${bookedUnits} επειδή υπάρχουν τόσες κρατήσεις για αυτόν.`,
        };
      }
      ticketsToUpdate.push({
        ...updatedTicket,
        id: ticket.id,
        available: updatedTicket.quantity - bookedUnits,
      });
    }
  }

  // Handle new tickets
  for (const ticket of input.ticketTypes) {
    if (event.ticketTypes.some((t) => t.name === ticket.name)) continue;
    ticketsToCreate.push(ticket);
  }

  await prisma.event.update({
    where: { id: event.id },
    data: {
      ...input,
      ticketTypes: {
        deleteMany: {
          id: { in: ticketsToDelete },
        },
        updateMany: ticketsToUpdate.map((ticket) => ({
          where: { id: ticket.id },
          data: {
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity,
            available: ticket.available,
          },
        })),
        create: ticketsToCreate.map((ticket) => ({
          name: ticket.name,
          price: ticket.price,
          quantity: ticket.quantity,
          available: ticket.quantity,
        })),
      },
    },
  });

  revalidatePath(`/events/${event.id}`);
  revalidatePath(`/events/${event.id}/edit`);

  return {
    success: true,
    message: event.id,
  };
}
