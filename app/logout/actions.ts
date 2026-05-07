"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * @brief Signs the current user out by clearing the better-auth session
 *        and redirects them back to the welcome page.
 */
export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}
