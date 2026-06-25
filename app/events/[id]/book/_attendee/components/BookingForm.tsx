"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "../actions";
import { BookingInputSchema } from "../schema";
import z from "zod";
import { Ticket, Euro, Minus, Plus, CircleCheck } from "lucide-react";
import AsyncButton from "@/components/AsyncButton";

interface TicketTypeData {
  id: number;
  name: string;
  price: number;
  available: number;
  quantity: number;
}

interface BookingFormProps {
  eventId: string;
  ticketTypes: TicketTypeData[];
}

export default function BookingForm({
  eventId,
  ticketTypes,
}: BookingFormProps) {
  const router = useRouter();

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const hasAnyTickets = ticketTypes.length > 0;

  const totalCost = ticketTypes.reduce((sum, tt) => {
    const qty = quantities[tt.id] || 0;
    return sum + tt.price * qty;
  }, 0);

  const hasSelection = Object.values(quantities).some((q) => q > 0);

  function increment(id: number, available: number) {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current >= available) return prev;
      return { ...prev, [id]: current + 1 };
    });
  }

  function decrement(id: number) {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      return { ...prev, [id]: current - 1 };
    });
  }

  function handleQuantityInput(id: number, value: string, available: number) {
    const num = parseInt(value, 10);
    if (value === "" || isNaN(num) || num < 0) {
      setQuantities((prev) => ({ ...prev, [id]: 0 }));
      return;
    }
    setQuantities((prev) => ({ ...prev, [id]: Math.min(num, available) }));
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const rawInput: Record<string, number> = {};
    for (const tt of ticketTypes) {
      const qty = quantities[tt.id] || 0;
      if (qty > 0) {
        rawInput[tt.id] = qty;
      }
    }

    const parsed = BookingInputSchema.safeParse(rawInput);

    if (!parsed.success) {
      const errors = z.flattenError(parsed.error).fieldErrors;

      for (const key in errors) {
        if (errors[key] === undefined) {
          errors[key] = [];
        }
      }

      setFieldErrors(errors as Record<string, string[]>);
      return;
    }

    setFieldErrors({});
    setMessage("");
    setLoading(true);

    try {
      const result = await createBookingAction(eventId, rawInput);

      if (result.success) {
        setSuccess(true);
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setMessage(result.error);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 shadow-sm shadow-emerald-100/60 text-center">
        <CircleCheck className="mx-auto text-emerald-500 mb-3" size={48} />
        <h2 className="text-xl font-bold text-emerald-800">
          Η κράτηση ολοκληρώθηκε!
        </h2>
        <p className="text-emerald-700 text-sm mt-2 max-w-md mx-auto">
          Η κράτηση των εισιτηρίων σας πραγματοποιήθηκε με επιτυχία.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <button
            type="button"
            onClick={() =>
              router.push(`/events/${encodeURIComponent(eventId)}`)
            }
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
          >
            Επιστροφή στην εκδήλωση
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 mt-4">
        <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
          ΤΥΠΟΙ ΕΙΣΙΤΗΡΙΩΝ
        </p>

        {!hasAnyTickets ? (
          <p className="text-gray-500 text-sm">
            Δεν υπάρχουν διαθέσιμα εισιτήρια.
          </p>
        ) : (
          <div className="divide-y divide-violet-100">
            {ticketTypes.map((ticket) => {
              const qty = quantities[ticket.id] || 0;
              const errorKey = String(ticket.id);
              const fieldError = fieldErrors?.[errorKey]?.[0];

              return (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <Ticket className="text-violet-500 shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800 leading-tight">
                        {ticket.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticket.available.toLocaleString("el-GR")} /{" "}
                        {ticket.quantity.toLocaleString("el-GR")} διαθέσιμα
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-end">
                      <div className="flex items-center gap-1 text-lg font-bold text-gray-800 leading-tight">
                        {ticket.price.toFixed(2)}
                        <Euro size={16} className="text-violet-500" />
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => decrement(ticket.id)}
                        disabled={loading || qty === 0}
                        className="p-1.5 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Μείωση ποσότητας"
                      >
                        <Minus size={16} />
                      </button>

                      <input
                        type="number"
                        id={`ticket-qty-${ticket.id}`}
                        name={String(ticket.id)}
                        min={0}
                        max={ticket.available}
                        value={qty}
                        onChange={(e) =>
                          handleQuantityInput(
                            ticket.id,
                            e.target.value,
                            ticket.available,
                          )
                        }
                        disabled={loading}
                        className="w-14 text-center bg-white border border-violet-200 rounded-lg py-1.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-violet-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                        aria-label={`Ποσότητα για ${ticket.name}`}
                      />

                      <button
                        type="button"
                        onClick={() => increment(ticket.id, ticket.available)}
                        disabled={loading || qty >= ticket.available}
                        className="p-1.5 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Αύξηση ποσότητας"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {fieldError && (
                      <p className="text-xs text-red-600 mt-0.5" role="alert">
                        {fieldError}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600">
                  Σύνολο
                </span>
                <span className="text-xl font-bold text-gray-800 flex items-center gap-1">
                  {totalCost.toFixed(2)}
                  <Euro size={18} className="text-violet-500" />
                </span>
              </div>

              {message && (
                <div
                  className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
                  role="alert"
                >
                  {message}
                </div>
              )}

              <AsyncButton
                label="Ολοκλήρωση κράτησης"
                loading={loading}
                disabled={!hasSelection}
                className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 rounded-xl"
              />

              {!hasSelection && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  Επιλέξτε τουλάχιστον ένα εισιτήριο για να συνεχίσετε.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
