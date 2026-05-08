import { UserRole } from "@/app/generated/prisma/enums";
import { jwtVerify, SignJWT } from "jose";

export type SessionTokenPayload = {
  sub: string;
  username: string;
  role: UserRole;
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  return new TextEncoder().encode(secret);
}

export async function signSessionToken(
  payload: SessionTokenPayload,
): Promise<string> {
  return new SignJWT({ role: payload.role, username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.username !== "string"
    ) {
      return null;
    }

    if (
      payload.role !== UserRole.ORGANIZER &&
      payload.role !== UserRole.ATTENDEE &&
      payload.role !== UserRole.ADMIN
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export const sessionTtlSeconds = SESSION_TTL_SECONDS;
