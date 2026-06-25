"use server";

import { EventStatus, UserRole } from "@/app/generated/prisma/enums";
import { BookingInputSchema } from "./schema";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";

export type BookActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createBookingAction(
  eventId: string,
  rawInput: unknown,
): Promise<BookActionResult> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      error: "Πρέπει να είστε συνδεδεμένος για να κάνετε κράτηση.",
    };
  }

  if (session.role !== UserRole.ATTENDEE) {
    return {
      success: false,
      error: "Μόνο οι συμμετέχοντες μπορούν να κάνουν κράτηση.",
    };
  }

  const parsed = BookingInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;

    for (const key in errors) {
      if (errors[key] === undefined) {
        errors[key] = [];
      }
    }

    return {
      success: false,
      error: "Υπάρχουν σφάλματα στην υποβολή της φόρμας.",
      fieldErrors: errors as Record<string, string[]>,
    };
  }

  const input = parsed.data;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      status: true,
      ticketTypes: {
        where: {
          id: {
            in: Object.keys(input).map((key) => parseInt(key, 10)),
          },
        },
        select: {
          id: true,
          name: true,
          price: true,
          available: true,
        },
      },
    },
  });

  if (!event) {
    return {
      success: false,
      error: "Η εκδήλωση δεν βρέθηκε.",
    };
  }

  if (event.status !== EventStatus.PUBLISHED) {
    return {
      success: false,
      error: "Δεν μπορείτε να κάνετε κράτηση σε αυτή την εκδήλωση.",
    };
  }

  for (const [ticketTypeId, numberOfTickets] of Object.entries(input)) {
    const ticketType = event.ticketTypes.find(
      (t) => t.id === parseInt(ticketTypeId, 10),
    );
    if (!ticketType) {
      return {
        success: false,
        error: "Ο τύπος εισιτηρίου δεν βρέθηκε.",
      };
    }
    if (ticketType.available < numberOfTickets) {
      return {
        success: false,
        error: `Δεν υπάρχουν αρκετά διαθέσιμα εισιτήρια για τον τύπο ${ticketType.name}. Διαθέσιμα: ${ticketType.available}`,
      };
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const [ticketTypeId, numberOfTickets] of Object.entries(input)) {
        const ticketType = event.ticketTypes.find(
          (t) => t.id === parseInt(ticketTypeId, 10),
        );
        if (!ticketType) {
          throw new Error("Ο τύπος εισιτηρίου δεν βρέθηκε.");
        }

        try {
          await tx.eventTickets.update({
            where: {
              id: ticketType.id,
              available: {
                gte: numberOfTickets,
              },
            },
            data: {
              available: {
                decrement: numberOfTickets,
              },
            },
          });
        } catch {
          throw new Error(
            `Δεν υπάρχουν αρκετά διαθέσιμα εισιτήρια για τον τύπο ${ticketType.name}.`,
          );
        }

        await tx.booking.create({
          data: {
            ticketTypeId: ticketType.id,
            attendeeId: session.sub,
            numberOfTickets: numberOfTickets,
            totalCost: ticketType.price * numberOfTickets,
          },
        });
      }
    });
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Σφάλμα κατά την κράτηση.",
    };
  }

  revalidatePath(`/events/${encodeURIComponent(eventId)}`);
  revalidatePath(`/events/${encodeURIComponent(eventId)}/book`);

  return {
    success: true,
  };
}
