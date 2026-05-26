import { z } from "zod";

export const UserActionInputSchema = z.strictObject({
  userId: z
    .string({ message: "Το αναγνωριστικό χρήστη είναι απαραίτητο." })
    .min(1, { message: "Το αναγνωριστικό χρήστη είναι απαραίτητο." }),
});

export type UserActionInput = z.infer<typeof UserActionInputSchema>;

export const getRawInput = (formData: FormData) => {
  return {
    userId: formData.get("userId"),
  };
};
