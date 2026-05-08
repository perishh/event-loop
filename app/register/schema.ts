import { z } from "zod";
import { UserRole } from "../generated/prisma/enums";

export const SignUpInputSchema = z
  .strictObject({
    email: z.email({ message: "Μη έγκυρο email." }),
    password: z
      .string({ message: "Ο κωδικός πρόσβασης είναι απαραίτητος." })
      .min(8, {
        message:
          "Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες.",
      })
      .max(128, {
        message:
          "Ο κωδικός πρόσβασης μπορεί να περιέχει το πολύ 128 χαρακτήρες.",
      }),
    confirmPassword: z.string(),
    firstName: z
      .string({ message: "Το όνομα είναι απαραίτητο." })
      .min(1, { message: "Το όνομα είναι απαραίτητο." }),
    lastName: z
      .string({ message: "Το επώνυμο είναι απαραίτητο." })
      .min(1, { message: "Το επώνυμο είναι απαραίτητο." }),
    afm: z
      .string({ message: "Το ΑΦΜ είναι απαραίτητο." })
      .min(1, { message: "Το ΑΦΜ είναι απαραίτητο." })
      .regex(/^\d{9}$/, { message: "Το ΑΦΜ πρέπει να έχει ακριβώς 9 ψηφία." }),
    username: z
      .string({ message: "Το όνομα χρήστη είναι απαραίτητο." })
      .min(3, {
        message: "Το όνομα χρήστη πρέπει να περιέχει τουλάχιστον 3 χαρακτήρες.",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "Το όνομα χρήστη μπορεί να περιέχει μόνο γράμματα, αριθμούς και κάτω παύλες.",
      }),
    role: z.enum([UserRole.ORGANIZER, UserRole.ATTENDEE], {
      message: "Μη έγκυρος ρόλος.",
    }),
    area: z
      .string({ message: "Η περιοχή είναι απαραίτητη." })
      .min(1, { message: "Η περιοχή είναι απαραίτητη." }),
    city: z
      .string({ message: "Η πόλη είναι απαραίτητη." })
      .min(1, { message: "Η πόλη είναι απαραίτητη." }),
    country: z
      .string({ message: "Η χώρα είναι απαραίτητη." })
      .min(1, { message: "Η χώρα είναι απαραίτητη." }),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Οι κωδικοί δεν ταιριάζουν.",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof SignUpInputSchema>;

export const getRawInput = (formData: FormData) => {
  return {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    afm: formData.get("afm"),
    username: formData.get("username"),
    role: formData.get("role"),
    area: formData.get("area"),
    city: formData.get("city"),
    country: formData.get("country"),
  };
};
