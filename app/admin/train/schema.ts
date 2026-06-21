import { z } from "zod";

const NumberField = () =>
  z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .pipe(z.number().optional());

export const TrainHyperparamsSchema = z.strictObject({
  latentFactorsCount: NumberField().pipe(
    z
      .number("Ο αριθμός λανθανόντων παραγόντων πρέπει να είναι αριθμός.")
      .int("Ο αριθμός λανθανόντων παραγόντων πρέπει να είναι ακέραιος.")
      .min(1, "Ο αριθμός λανθανόντων παραγόντων πρέπει να είναι τουλάχιστον 1.")
      .max(
        200,
        "Ο αριθμός λανθανόντων παραγόντων δεν μπορεί να υπερβαίνει το 200.",
      )
      .optional(),
  ),
  learningRate: NumberField().pipe(
    z
      .number("Ο ρυθμός εκμάθησης πρέπει να είναι αριθμός.")
      .positive("Ο ρυθμός εκμάθησης πρέπει να είναι θετικός.")
      .max(1, "Ο ρυθμός εκμάθησης δεν μπορεί να υπερβαίνει το 1.")
      .optional(),
  ),
  regularization: NumberField().pipe(
    z
      .number("Η κανονικοποίηση πρέπει να είναι αριθμός.")
      .min(0, "Η κανονικοποίηση δεν μπορεί να είναι αρνητική.")
      .max(1, "Η κανονικοποίηση δεν μπορεί να υπερβαίνει το 1.")
      .optional(),
  ),
  epochs: NumberField().pipe(
    z
      .number("Ο αριθμός εποχών πρέπει να είναι αριθμός.")
      .int("Ο αριθμός εποχών πρέπει να είναι ακέραιος.")
      .min(1, "Ο αριθμός εποχών πρέπει να είναι τουλάχιστον 1.")
      .max(10000, "Ο αριθμός εποχών δεν μπορεί να υπερβαίνει τις 10000.")
      .optional(),
  ),
  bookingWeight: NumberField().pipe(
    z
      .number("Το βάρος κράτησης πρέπει να είναι αριθμός.")
      .min(0, "Το βάρος κράτησης δεν μπορεί να είναι αρνητικό.")
      .max(100, "Το βάρος κράτησης δεν μπορεί να υπερβαίνει το 100.")
      .optional(),
  ),
  visitWeight: NumberField().pipe(
    z
      .number("Το βάρος επίσκεψης πρέπει να είναι αριθμός.")
      .min(0, "Το βάρος επίσκεψης δεν μπορεί να είναι αρνητικό.")
      .max(100, "Το βάρος επίσκεψης δεν μπορεί να υπερβαίνει το 100.")
      .optional(),
  ),
  negativePerUser: NumberField().pipe(
    z
      .number("Ο αριθμός αρνητικών δειγμάτων πρέπει να είναι αριθμός.")
      .int("Ο αριθμός αρνητικών δειγμάτων πρέπει να είναι ακέραιος.")
      .min(0, "Ο αριθμός αρνητικών δειγμάτων δεν μπορεί να είναι αρνητικός.")
      .max(
        1000,
        "Ο αριθμός αρνητικών δειγμάτων δεν μπορεί να υπερβαίνει τα 1000.",
      )
      .optional(),
  ),
});

export type TrainHyperparamsInput = z.infer<typeof TrainHyperparamsSchema>;

export const getRawInput = (formData: FormData) => {
  return {
    latentFactorsCount: formData.get("latentFactorsCount"),
    learningRate: formData.get("learningRate"),
    regularization: formData.get("regularization"),
    epochs: formData.get("epochs"),
    bookingWeight: formData.get("bookingWeight"),
    visitWeight: formData.get("visitWeight"),
    negativePerUser: formData.get("negativePerUser"),
  } as Record<string, FormDataEntryValue | null>;
};
