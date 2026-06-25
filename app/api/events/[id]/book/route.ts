import { NextRequest, NextResponse } from "next/server";
import { EventStatus, UserRole } from "@/app/generated/prisma/enums";
import { BookingInputSchema } from "@/app/events/[id]/book/_attendee/schema";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: eventId } = await params;

  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: "Πρέπει να είστε συνδεδεμένος για να κάνετε κράτηση.",
      },
      { status: 401 },
    );
  }

  if (session.role !== UserRole.ATTENDEE) {
    return NextResponse.json(
      {
        success: false,
        error: "Μόνο οι συμμετέχοντες μπορούν να κάνουν κράτηση.",
      },
      { status: 403 },
    );
  }

  let rawInput: unknown;
  try {
    rawInput = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Μη έγκυρο αίτημα.",
      },
      { status: 400 },
    );
  }

  const parsed = BookingInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;

    for (const key in errors) {
      if (errors[key] === undefined) {
        errors[key] = [];
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Υπάρχουν σφάλματα στην υποβολή της φόρμας.",
        fieldErrors: errors as Record<string, string[]>,
      },
      { status: 400 },
    );
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
    return NextResponse.json(
      {
        success: false,
        error: "Η εκδήλωση δεν βρέθηκε.",
      },
      { status: 404 },
    );
  }

  if (event.status !== EventStatus.PUBLISHED) {
    return NextResponse.json(
      {
        success: false,
        error: "Δεν μπορείτε να κάνετε κράτηση σε αυτή την εκδήλωση.",
      },
      { status: 400 },
    );
  }

  for (const [ticketTypeId, numberOfTickets] of Object.entries(input)) {
    const ticketType = event.ticketTypes.find(
      (t) => t.id === parseInt(ticketTypeId, 10),
    );
    if (!ticketType) {
      return NextResponse.json(
        {
          success: false,
          error: "Ο τύπος εισιτηρίου δεν βρέθηκε.",
        },
        { status: 404 },
      );
    }
    if (ticketType.available < numberOfTickets) {
      return NextResponse.json(
        {
          success: false,
          error: `Δεν υπάρχουν αρκετά διαθέσιμα εισιτήρια για τον τύπο ${ticketType.name}. Διαθέσιμα: ${ticketType.available}`,
        },
        { status: 409 },
      );
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
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Σφάλμα κατά την κράτηση.",
      },
      { status: 500 },
    );
  }

  revalidatePath(`/events/${encodeURIComponent(eventId)}`);
  revalidatePath(`/events/${encodeURIComponent(eventId)}/book`);

  return NextResponse.json({ success: true });
}
