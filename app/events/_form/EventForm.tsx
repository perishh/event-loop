"use client";

import {
  EventCategory,
  EventStatus,
  EventType,
} from "@/app/generated/prisma/enums";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import TextareaField from "@/components/TextareaField";
import {
  EVENT_CATEGORY_LABELS,
  EVENT_TYPE_CATEGORIES,
  EVENT_TYPE_LABELS,
} from "@/prisma/mapper";
import { Clock3, ListChecks, Tag, Users } from "lucide-react";
import { useState } from "react";
import LocationPicker from "./LocationPicker";
import MediaList from "./MediaList";
import TicketEntry from "./TicketEntry";
import { TicketDraft } from "./types";
import { EventInputSchema } from "./schema";
import z from "zod";
import { useRouter } from "next/navigation";
import { LatLng } from "@/components/Map";
import type { EditableEvent } from "../[id]/edit/types";

const getDefaultTicket = (): TicketDraft => ({
  id: Date.now(),
  name: "Γενική Είσοδος",
  price: "10",
  quantity: "50",
});

interface Props {
  eventToEdit?: EditableEvent;
}

export default function EventForm({ eventToEdit }: Props) {
  const router = useRouter();

  const [type, setType] = useState<EventType>(
    eventToEdit?.type ?? EventType.CONCERT,
  );

  const [categories, setCategories] = useState<Set<EventCategory>>(
    new Set(eventToEdit?.categories ?? []),
  );

  const [tickets, setTickets] = useState<TicketDraft[]>(
    eventToEdit?.ticketTypes?.map(
      (t): TicketDraft => ({
        id: t.id,
        name: t.name,
        price: t.price.toString(),
        quantity: t.quantity.toString(),
      }),
    ) ?? [getDefaultTicket()],
  );

  const [media, setMedia] = useState<string[]>(eventToEdit?.media ?? []);

  const [latLng, setLatLng] = useState<LatLng | undefined>(
    eventToEdit?.latitude && eventToEdit?.longitude
      ? [eventToEdit.latitude, eventToEdit.longitude]
      : undefined,
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");

  const toggleCategory = (category: EventCategory) => {
    setCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const status = (e.nativeEvent as SubmitEvent).submitter?.getAttribute(
      "name",
    ) as EventStatus | undefined;
    if (!status) {
      setMessage("Προέκυψε σφάλμα κατά την υποβολή της φόρμας.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      categories: Array.from(categories),
      media,
      ticketTypes: tickets.map(({ name, price, quantity }) => ({
        name,
        price,
        quantity,
      })),
      latitude: latLng?.[0],
      longitude: latLng?.[1],
      status,
      updatedAt: eventToEdit?.updatedAt?.toISOString(),
    };

    const validationResult = EventInputSchema.safeParse(payload);

    if (!validationResult.success) {
      const flattened = z.flattenError(validationResult.error);
      setErrors(flattened.fieldErrors);
      setMessage("Μη έγκυρη τιμή.");
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const url = eventToEdit
        ? `/api/events/${encodeURIComponent(eventToEdit.id)}`
        : "/api/events";
      const method = eventToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const response = await res.json();

      if (!response.success) {
        setErrors(response.fieldErrors || {});
        setMessage(
          response.message ||
            (eventToEdit
              ? "Σφάλμα κατά την επεξεργασία της εκδήλωσης."
              : "Σφάλμα κατά τη δημιουργία της εκδήλωσης."),
        );
        return;
      }

      if (response.message) {
        router.replace(`/events/${encodeURIComponent(response.message)}`);
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-violet-50 rounded-2xl shadow-lg shadow-violet-100/80 p-6">
      <form className="w-full space-y-5" onSubmit={submit} noValidate>
        <section className="w-full rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
          <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-4">
            ΒΑΣΙΚΕΣ ΛΕΠΤΟΜΕΡΕΙΕΣ
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              wrapperClassName="col-span-2"
              icon={Tag}
              id="title"
              defaultValue={eventToEdit?.title}
              error={errors.title?.[0]}
              name="title"
              label="Τίτλος"
              placeholder="Live Concert"
            />
            <TextareaField
              wrapperClassName="col-span-2"
              id="description"
              name="description"
              defaultValue={eventToEdit?.description}
              error={errors.description?.[0]}
              label="Περιγραφή"
              placeholder="Μια συναυλία με τους καλύτερους καλλιτέχνες της πόλης!"
            />
            <SelectField
              id="type"
              label="Τύπος"
              error={errors.type?.[0]}
              name="type"
              icon={ListChecks}
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
            >
              {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
            <InputField
              id="capacity"
              label="Χωρητικότητα"
              name="capacity"
              defaultValue={eventToEdit?.capacity.toString()}
              icon={Users}
              placeholder="100"
              type="number"
              error={errors.capacity?.[0]}
              min={1}
            />
          </div>
        </section>

        <section className="w-full rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 space-y-4">
          <p className="text-xs font-bold tracking-[0.22em] text-violet-500">
            ΚΑΤΗΓΟΡΙΕΣ
          </p>

          <div className="flex flex-wrap gap-2 text-sm">
            {EVENT_TYPE_CATEGORIES[type].map((category) => {
              const selected = categories.has(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`shrink-0 inline-flex whitespace-nowrap rounded-2xl border-2 px-4 py-1.5 text-left font-medium transition-all ${
                    selected
                      ? "border-violet-300 bg-violet-50 text-violet-800"
                      : "border-violet-100 hover:border-violet-200 text-gray-700"
                  }`}
                >
                  {EVENT_CATEGORY_LABELS[category]}
                </button>
              );
            })}
          </div>
        </section>

        <section className="w-full rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
          <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-4">
            ΗΜΕΡΟΜΗΝΙΑ & ΩΡΑ
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              label="Έναρξη"
              name="startDateTime"
              defaultValue={eventToEdit?.startDateTime
                .toISOString()
                .slice(0, 16)}
              type="datetime-local"
              icon={Clock3}
              placeholder=""
              id="startDateTime"
              error={errors.startDateTime?.[0]}
            />
            <InputField
              label="Λήξη"
              name="endDateTime"
              defaultValue={eventToEdit?.endDateTime.toISOString().slice(0, 16)}
              type="datetime-local"
              icon={Clock3}
              id="endDateTime"
              placeholder=""
              error={errors.endDateTime?.[0]}
            />
          </div>
        </section>

        <LocationPicker
          latLng={latLng}
          setLatLng={setLatLng}
          errors={errors}
          defaultValues={
            eventToEdit
              ? {
                  address: eventToEdit.address,
                  city: eventToEdit.city,
                  country: eventToEdit.country,
                  venue: eventToEdit.venue,
                }
              : undefined
          }
        />
        <MediaList
          media={media}
          setMedia={setMedia}
          error={errors.media?.[0]}
        />
        <TicketEntry
          tickets={tickets}
          setTickets={setTickets}
          error={errors.ticketTypes?.[0]}
        />

        {!loading && message && (
          <p className="text-sm text-red-700 mt-4 ml-1" role="alert">
            {message}
          </p>
        )}

        <div className="flex justify-end mt-6 space-x-2">
          {(!eventToEdit || eventToEdit.status === EventStatus.DRAFT) && (
            <button
              type="submit"
              name={EventStatus.DRAFT}
              className="bg-white text-violet-500 px-3 py-2 rounded-lg ring-2 ring-violet-500 transition-all hover:ring-offset-1 focus:ring-offset-2 outline-0 tracking-wide font-semibold"
              disabled={loading}
            >
              {loading ? "Αποστολή…" : "Αποθήκευση"}
            </button>
          )}
          <button
            name={EventStatus.PUBLISHED}
            type="submit"
            className="bg-violet-500 text-white px-3 py-2 rounded-lg ring-0 hover:ring-2 ring-violet-500 transition-all active:ring-offset-1 focus:ring-offset-2 outline-0 tracking-wide font-semibold"
            disabled={loading}
          >
            {loading ? "Αποστολή…" : "Δημοσίευση"}
          </button>
        </div>
      </form>
    </div>
  );
}
