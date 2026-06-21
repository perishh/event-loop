"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { train } from "@/lib/recommendation/training";
import type { TrainingHyperparams } from "@/lib/recommendation/training";
import { revalidatePath } from "next/cache";
import { TrainHyperparamsSchema } from "./schema";
import { EventStatus, UserRole } from "@/app/generated/prisma/enums";

export type TrainActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function getModelStatus() {
  const session = await getSession();
  if (!session || session.role !== UserRole.ADMIN) {
    return null;
  }

  const model = await prisma.recommendationModel.findUnique({
    where: { id: "global" },
    select: {
      globalMean: true,
      updatedAt: true,
    },
  });

  const [userCount, eventCount, interactionCount] = await Promise.all([
    prisma.user.count(),
    prisma.event.count({ where: { status: { not: EventStatus.REMOVED } } }),
    prisma.eventVisit.count(),
  ]);

  const bookingCount = await prisma.booking.count();

  return {
    exists: model !== null,
    globalMean: model?.globalMean ?? null,
    updatedAt: model?.updatedAt ?? null,
    userCount,
    eventCount,
    visitCount: interactionCount,
    bookingCount,
  };
}

export async function trainRecommendationsModel(
  rawInput: unknown,
): Promise<TrainActionResult> {
  const session = await getSession();
  if (!session || session.role !== UserRole.ADMIN) {
    return { success: false, error: "Μη εξουσιοδοτημένη ενέργεια." };
  }
  const parsed = TrainHyperparamsSchema.safeParse(rawInput);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError.message,
    };
  }

  // Filter out undefined values - only pass explicitly provided params
  const hyperparams: Partial<TrainingHyperparams> = {};
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      (hyperparams as Record<string, unknown>)[key] = value;
    }
  }

  try {
    await train(hyperparams);
    revalidatePath("/admin/train");
    return {
      success: true,
      message: "Το μοντέλο εκπαιδεύτηκε επιτυχώς.",
    };
  } catch (err) {
    console.error("Training failed:", err);
    return {
      success: false,
      error:
        "Αποτυχία εκπαίδευσης μοντέλου. Δείτε τα logs για περισσότερες λεπτομέρειες.",
    };
  }
}
