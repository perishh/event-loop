"use server";

import { getRawInput, UserActionInputSchema } from "./schema";
import z from "zod";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export type UserActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/** Type used by useActionState, null means idle */
export type UserActionFormState = UserActionResult | null;

export async function approveUser(
  prevState: UserActionFormState,
  formData: FormData,
): Promise<UserActionResult> {
  const parsed = UserActionInputSchema.safeParse(getRawInput(formData));

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      error: "Μη έγκυρο αίτημα.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, approved: true },
  });

  if (!user) {
    return { success: false, error: "Ο χρήστης δεν βρέθηκε." };
  }

  if (user.approved) {
    return { success: false, error: "Ο χρήστης είναι ήδη εγκεκριμένος." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { approved: true },
  });

  redirect("/admin", "replace");
}

export async function rejectUser(
  prevState: UserActionFormState,
  formData: FormData,
): Promise<UserActionResult> {
  const parsed = UserActionInputSchema.safeParse(getRawInput(formData));

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      error: "Μη έγκυρο αίτημα.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, approved: true },
  });

  if (!user) {
    return { success: false, error: "Ο χρήστης δεν βρέθηκε." };
  }

  if (user.approved) {
    return {
      success: false,
      error: "Δεν επιτρέπεται απόρριψη ήδη εγκεκριμένου χρήστη.",
    };
  }

  await prisma.user.delete({
    where: { id: user.id },
  });

  redirect("/admin", "replace");
}
