"use server";

import { UserRole } from "@/app/generated/prisma/enums";
import { getSession } from "@/lib/auth/session";
import { EventInputSchema } from "./schema";
import z from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type EventActionResult =
  | { success: true; message: string }
  | {
      success: false;
      message?: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function createEventAction(
  rawInput: unknown,
): Promise<EventActionResult> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "Πρέπει να είστε συνδεδεμένος για να δημιουργήσετε εκδήλωση.",
    };
  }

  if (session.role !== UserRole.ORGANIZER) {
    return {
      success: false,
      message: "Μόνο διοργανωτές μπορούν να δημιουργήσουν εκδηλώσεις.",
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

  const created = await prisma.event.create({
    data: {
      ...input,
      organizerId: session.sub,
      ticketTypes: {
        create: input.ticketTypes.map((ticketType) => ({
          name: ticketType.name,
          price: ticketType.price,
          quantity: ticketType.quantity,
          available: ticketType.quantity,
        })),
      },
    },
  });

  revalidatePath(`/events/${encodeURIComponent(created.id)}`);

  return {
    success: true,
    message: created.id,
  };
}
