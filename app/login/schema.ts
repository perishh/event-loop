import { z } from "zod";

export const SignInInputSchema = z.strictObject({
  email: z.email({ message: "Μη έγκυρο email." }),
  password: z
    .string({ message: "Ο κωδικός πρόσβασης είναι απαραίτητος." })
    .min(1, { message: "Ο κωδικός πρόσβασης είναι απαραίτητος." }),
});

export type SignInInput = z.infer<typeof SignInInputSchema>;

export const getRawInput = (formData: FormData) => {
  return {
    email: formData.get("email"),
    password: formData.get("password"),
  };
};
