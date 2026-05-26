import {
  EventCategory,
  EventStatus,
  EventType,
} from "@/app/generated/prisma/enums";
import { EVENT_TYPE_CATEGORIES } from "@/prisma/mapper";
import { z } from "zod";

const datetimeInputSchema = z
  .string()
  .min(1, "Συμπληρώστε ημερομηνία και ώρα")
  .transform((value) => new Date(value))
  .refine((value) => !Number.isNaN(value.getTime()), {
    message: "Μη έγκυρη ημερομηνία ή ώρα",
  });

const ticketTypeSchema = z.strictObject({
  id: z.int("Το id πρέπει να είναι ακέραιος"),
  name: z.string().trim().min(2, "Το όνομα εισιτηρίου είναι υποχρεωτικό"),
  price: z.coerce
    .number({ message: "Η τιμή πρέπει να είναι αριθμός" })
    .min(0, "Η τιμή δεν μπορεί να είναι αρνητική"),
  quantity: z.coerce
    .number({ message: "Η ποσότητα πρέπει να είναι αριθμός" })
    .int("Η ποσότητα πρέπει να είναι ακέραιος")
    .positive("Η ποσότητα πρέπει να είναι μεγαλύτερη από 0"),
});

export const EventInputSchema = z
  .strictObject({
    title: z
      .string()
      .trim()
      .min(3, "Ο τίτλος πρέπει να έχει τουλάχιστον 3 χαρακτήρες"),
    description: z
      .string()
      .trim()
      .min(20, "Η περιγραφή πρέπει να έχει τουλάχιστον 20 χαρακτήρες"),
    type: z.enum(EventType),
    categories: z.array(z.enum(EventCategory)),
    venue: z.string().trim().min(2, "Ο χώρος είναι υποχρεωτικός"),
    address: z.string().trim().min(3, "Η διεύθυνση είναι υποχρεωτική"),
    city: z.string().trim().min(2, "Η πόλη είναι υποχρεωτική"),
    country: z.string().trim().min(2, "Η χώρα είναι υποχρεωτική"),
    latitude: z
      .union([z.number(), z.nan()])
      .optional()
      .transform((value) =>
        value === undefined || Number.isNaN(value) ? undefined : value,
      )
      .refine((value) => value === undefined || (value >= -90 && value <= 90), {
        message: "Το γεωγραφικό πλάτος πρέπει να είναι μεταξύ -90 και 90",
      }),
    longitude: z
      .union([z.number(), z.nan()])
      .optional()
      .transform((value) =>
        value === undefined || Number.isNaN(value) ? undefined : value,
      )
      .refine(
        (value) => value === undefined || (value >= -180 && value <= 180),
        {
          message: "Το γεωγραφικό μήκος πρέπει να είναι μεταξύ -180 και 180",
        },
      ),
    startDateTime: datetimeInputSchema,
    endDateTime: datetimeInputSchema,
    capacity: z.coerce
      .number({ message: "Η χωρητικότητα πρέπει να είναι αριθμός" })
      .int("Η χωρητικότητα πρέπει να είναι ακέραιος")
      .positive("Η χωρητικότητα πρέπει να είναι μεγαλύτερη από 0"),
    media: z
      .array(z.url("Μη έγκυρο URL πολυμέσου"))
      .max(8, "Μέχρι 8 σύνδεσμοι πολυμέσων"),
    ticketTypes: z
      .array(ticketTypeSchema)
      .min(1, "Προσθέστε τουλάχιστον έναν τύπο εισιτηρίου")
      .superRefine((ticketTypes, ctx) => {
        const seenIds = new Set<number>();

        ticketTypes.forEach((ticketType, index) => {
          if (!ticketType.id) return;

          if (seenIds.has(ticketType.id)) {
            ctx.addIssue({
              code: "custom",
              path: [index, "id"],
              message: "Δεν επιτρέπεται διπλότυπο id εισιτηρίου",
            });
            return;
          }

          seenIds.add(ticketType.id);
        });
      }),
    status: z.enum([EventStatus.DRAFT, EventStatus.PUBLISHED]),
  })
  .superRefine((data, ctx) => {
    const allowedCategories = new Set<EventCategory>(
      EVENT_TYPE_CATEGORIES[data.type],
    );

    if (data.categories.some((category) => !allowedCategories.has(category))) {
      ctx.addIssue({
        code: "custom",
        path: ["categories"],
        message:
          "Οι κατηγορίες δεν αντιστοιχούν στον επιλεγμένο τύπο εκδήλωσης",
      });
    }
  })
  .refine(
    (data) =>
      data.capacity >=
      data.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0),
    {
      message:
        "Η χωρητικότητα πρέπει να είναι μεγαλύτερη ή ίση με το σύνολο των διαθέσιμων εισιτηρίων",
      path: ["capacity"],
    },
  )
  .refine((data) => data.endDateTime > data.startDateTime, {
    message: "Η ημερομηνία λήξης πρέπει να είναι μετά την ημερομηνία έναρξης",
    path: ["endDateTime"],
  });

export type EventInput = z.infer<typeof EventInputSchema>;
