import { z } from "zod";

export const BookingInputSchema = z
  .record(
    z.coerce
      .number({ message: "Το id τύπου εισιτηρίου πρέπει να είναι αριθμός" })
      .int("Το id τύπου εισιτηρίου πρέπει να είναι ακέραιος")
      .positive("Το id τύπου εισιτηρίου πρέπει να είναι μεγαλύτερο από 0"),
    z.coerce
      .number({ message: "Η ποσότητα εισιτηρίων πρέπει να είναι αριθμός" })
      .int("Η ποσότητα εισιτηρίων πρέπει να είναι ακέραιος")
      .positive("Η ποσότητα εισιτηρίων πρέπει να είναι μεγαλύτερη από 0"),
  )
  .refine((value) => Object.keys(value).length > 0, {
    message: "Προσθέστε τουλάχιστον έναν τύπο εισιτηρίου",
  });

export type BookingInput = z.infer<typeof BookingInputSchema>;
