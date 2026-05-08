"use server";

import { deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

/**
 * @brief Signs the current user out by clearing the better-auth session
 *        and redirects them back to the welcome page.
 */
export async function signOut() {
  await deleteSession();
  redirect("/login");
}
