import { z } from "zod";

export const SignInInputSchema = z.strictObject({
  username: z.string().min(1, { message: "Το όνομα χρήστη είναι απαραίτητο." }),
  password: z
    .string({ message: "Ο κωδικός πρόσβασης είναι απαραίτητος." })
    .min(1, { message: "Ο κωδικός πρόσβασης είναι απαραίτητος." }),
});

export type SignInInput = z.infer<typeof SignInInputSchema>;

export const getRawInput = (formData: FormData) => {
  return {
    username: formData.get("username"),
    password: formData.get("password"),
  };
};
