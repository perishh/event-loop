import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { UserRole } from "@/app/generated/prisma/enums";
import { TrainHyperparamsSchema } from "@/app/admin/train/schema";
import { train } from "@/lib/recommendation/training";
import type { TrainingHyperparams } from "@/lib/recommendation/training";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawInput: unknown;
  try {
    rawInput = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  const parsed = TrainHyperparamsSchema.safeParse(rawInput);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { success: false, error: firstError.message },
      { status: 400 },
    );
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
    return NextResponse.json({
      success: true,
      message: "Το μοντέλο εκπαιδεύτηκε επιτυχώς.",
    });
  } catch (err) {
    console.error("Training failed:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Αποτυχία εκπαίδευσης μοντέλου. Δείτε τα logs για περισσότερες λεπτομέρειες.",
      },
      { status: 500 },
    );
  }
}
