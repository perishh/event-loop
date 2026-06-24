import { SignInInputSchema } from "@/app/login/schema";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { UserRole } from "@/app/generated/prisma/enums";
import z from "zod";

export async function POST(request: Request) {
  let rawInput: unknown;
  try {
    rawInput = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  const parsed = SignInInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
        error: "Μη έγκυρα στοιχεία σύνδεσης.",
      },
      { status: 200 },
    );
  }

  const input = parsed.data;

  const user = await prisma.user.findUnique({
    where: { username: input.username },
    select: {
      id: true,
      hash: true,
      approved: true,
      role: true,
      username: true,
    },
  });

  if (!user) {
    return Response.json(
      {
        success: false,
        fieldErrors: { password: ["Μη έγκυρα στοιχεία σύνδεσης."] },
        error: "Μη έγκυρα στοιχεία σύνδεσης.",
      },
      { status: 400 },
    );
  }

  const isPasswordValid = await verifyPassword(input.password, user.hash);
  if (!isPasswordValid) {
    return Response.json(
      {
        success: false,
        fieldErrors: { password: ["Μη έγκυρα στοιχεία σύνδεσης."] },
        error: "Μη έγκυρα στοιχεία σύνδεσης.",
      },
      { status: 400 },
    );
  }

  if (!user.approved) {
    return Response.json(
      {
        success: false,
        fieldErrors: {
          username: ["Ο λογαριασμός σας αναμένει έγκριση από διαχειριστή."],
        },
        error: "Ο λογαριασμός σας αναμένει έγκριση από διαχειριστή.",
      },
      { status: 400 },
    );
  }

  await createSession({
    sub: user.id,
    username: user.username,
    role: user.role,
  });

  return Response.json({
    success: true,
    redirectTo: user.role === UserRole.ADMIN ? "/admin" : "/",
  });
}
