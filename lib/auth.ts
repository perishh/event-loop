import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { UserRole } from "@/app/generated/prisma/enums";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: [UserRole.ORGANIZER, UserRole.ATTENDEE, UserRole.ADMIN],
        required: true,
      },
      approved: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      lastName: {
        type: "string",
        required: true,
      },
      afm: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
      area: {
        type: "string",
        required: true,
      },
      city: {
        type: "string",
        required: true,
      },
      country: {
        type: "string",
        required: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
  plugins: [nextCookies()],
});
