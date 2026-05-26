"use server";

import { getRawInput, SignInInputSchema } from "./schema";
import z from "zod";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";

export type SignInResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/** Type used by useActionState, null means idle */
export type SignInFormState = SignInResult | null;

export async function signInAction(
  prevState: SignInFormState,
  formData: FormData,
): Promise<SignInResult> {
  const parsed = SignInInputSchema.safeParse(getRawInput(formData));

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      error: "Μη έγκυρα στοιχεία σύνδεσης.",
    };
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
    return {
      success: false,
      fieldErrors: { password: ["Μη έγκυρα στοιχεία σύνδεσης."] },
      error: "Μη έγκυρα στοιχεία σύνδεσης.",
    };
  }

  const isPasswordValid = await verifyPassword(input.password, user.hash);
  if (!isPasswordValid) {
    return {
      success: false,
      fieldErrors: { password: ["Μη έγκυρα στοιχεία σύνδεσης."] },
      error: "Μη έγκυρα στοιχεία σύνδεσης.",
    };
  }

  if (!user.approved) {
    return {
      success: false,
      fieldErrors: {
        username: ["Ο λογαριασμός σας αναμένει έγκριση από διαχειριστή."],
      },
      error: "Ο λογαριασμός σας αναμένει έγκριση από διαχειριστή.",
    };
  }

  await createSession({
    sub: user.id,
    username: user.username,
    role: user.role,
  });

  redirect(user.role === UserRole.ADMIN ? "/admin" : "/", "replace");
}
