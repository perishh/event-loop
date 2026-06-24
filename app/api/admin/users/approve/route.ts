import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { UserRole } from "@/app/generated/prisma/enums";
import { UserActionInputSchema } from "@/app/admin/schema";
import z from "zod";

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

  const parsed = UserActionInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
        error: "Μη έγκυρο αίτημα.",
      },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, approved: true },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Ο χρήστης δεν βρέθηκε." },
      { status: 404 },
    );
  }

  if (user.approved) {
    return NextResponse.json(
      { success: false, error: "Ο χρήστης είναι ήδη εγκεκριμένος." },
      { status: 409 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { approved: true },
  });

  return NextResponse.json({ success: true });
}
