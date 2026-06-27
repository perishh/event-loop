import { SignUpInputSchema } from "@/app/register/schema";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
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

  const parsed = SignUpInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        error: "Μη έγκυρα πεδία.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: parsed.data.email },
        { afm: parsed.data.afm },
        { username: parsed.data.username },
      ],
    },
    select: { email: true, afm: true, username: true },
  });

  if (existing) {
    const fieldErrors: Record<string, string[]> = {};

    if (existing.email === parsed.data.email) {
      fieldErrors.email = ["Το email χρησιμοποιείται ήδη."];
    }
    if (existing.afm === parsed.data.afm) {
      fieldErrors.afm = ["Το ΑΦΜ χρησιμοποιείται ήδη."];
    }
    if (existing.username === parsed.data.username) {
      fieldErrors.username = ["Το όνομα χρήστη χρησιμοποιείται ήδη."];
    }

    return Response.json(
      {
        success: false,
        error: "Υπάρχει ήδη χρήστης με αυτά τα στοιχεία.",
        fieldErrors,
      },
      { status: 400 },
    );
  }

  const hashedPassword = await hashPassword(parsed.data.password);
  await prisma.user.create({
    data: {
      afm: parsed.data.afm,
      email: parsed.data.email,
      phone: parsed.data.phone,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      role: parsed.data.role,
      username: parsed.data.username,
      area: parsed.data.area,
      city: parsed.data.city,
      country: parsed.data.country,
      hash: hashedPassword,
    },
  });

  return Response.json({ success: true });
}
