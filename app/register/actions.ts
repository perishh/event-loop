"use server";

import { auth } from "@/lib/auth";
import { getRawInput, SignUpInputSchema } from "./schema";
import z from "zod";

export type SignUpResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/** Type used by useActionState, null means idle */
export type SignUpFormState = SignUpResult | null;

// Server action for signup
export const signUp = async (rawInput: unknown): Promise<SignUpResult> => {
  const parsed = SignUpInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      error: "Μη έγκυρα πεδία.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await auth.api.signUpEmail({
      body: parsed.data,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Προέκυψε σφάλμα.",
    };
  }
};

// Form-action wrapper for useActionState.
export const signUpFormAction = async (
  _prevState: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> => {
  return signUp(getRawInput(formData));
};
