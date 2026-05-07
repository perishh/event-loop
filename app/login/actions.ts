"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getRawInput, SignInInputSchema } from "./schema";
import z from "zod";

export type SignInResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/** Type used by useActionState, null means idle */
export type SignInFormState = SignInResult | null;

// Server action for signin
export const signIn = async (rawInput: unknown): Promise<SignInResult> => {
  const parsed = SignInInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      error: "Μη έγκυρα πεδία.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // Look up the user first to check approval status before signing them in.
  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { approved: true },
  });

  if (!existingUser) {
    return {
      success: false,
      error: "Λάθος email ή κωδικός χρήστη.",
    };
  }

  if (!existingUser.approved) {
    return {
      success: false,
      error: "Ο λογαριασμός σας δεν έχει εγκριθεί ακόμη.",
    };
  }

  try {
    await auth.api.signInEmail({
      body: parsed.data,
      asResponse: false,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Λάθος email ή κωδικός χρήστη.",
    };
  }
};

// Form-action wrapper for useActionState.
export const signInFormAction = async (
  _prevState: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> => {
  return signIn(getRawInput(formData));
};
