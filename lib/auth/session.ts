import "server-only";

import { cookies } from "next/headers";
import {
  SessionTokenPayload,
  sessionTtlSeconds,
  signSessionToken,
  verifySessionToken,
} from "./jwt";

export const SESSION_COOKIE_NAME = "openplanner_session";

export async function createSession(
  payload: SessionTokenPayload,
): Promise<void> {
  const token = await signSessionToken(payload);
  const expiresAt = new Date(Date.now() + sessionTtlSeconds * 1000);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}
