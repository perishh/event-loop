"use client";

import { Euro, Plus, Trash2 } from "lucide-react";
import { Dispatch, useState } from "react";
import { TicketDraft } from "../types";
import InputField from "@/components/InputField";

interface Props {
  tickets: TicketDraft[];
  setTickets: Dispatch<React.SetStateAction<TicketDraft[]>>;
  error: string | undefined;
}

export default function TicketEntry({ tickets, setTickets, error }: Props) {
  const updateTicket = (
    id: number,
    field: keyof Omit<TicketDraft, "id">,
    value: string,
  ) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket,
      ),
    );
  };

  const addTicket = () => {
    setTickets((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        price: "0",
        quantity: "1",
      },
    ]);
  };

  const removeTicket = (id: number) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  return (
    <section className="w-full rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
      <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-4">
        ΤΥΠΟΙ ΕΙΣΙΤΗΡΙΩΝ
      </p>

      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="flex items-center gap-3 border border-violet-100 rounded-2xl p-4"
          >
            <div className="flex-3">
              <InputField
                label="Ονομασία"
                id="name"
                type="text"
                value={ticket.name}
                onChange={(e) =>
                  updateTicket(ticket.id, "name", e.target.value)
                }
                placeholder="VIP"
                className="w-full rounded-xl border-2 border-violet-100 hover:border-violet-200 focus:border-violet-300 px-3 py-2 outline-0"
              />
            </div>
            <div className="flex-1">
              <InputField
                icon={Euro}
                placeholder="20.00"
                label="Τιμή"
                id="price"
                type="number"
                min="0"
                step="1.0"
                value={ticket.price}
                onChange={(e) =>
                  updateTicket(ticket.id, "price", e.target.value)
                }
                className="w-full rounded-xl border-2 border-violet-100 hover:border-violet-200 focus:border-violet-300 px-3 py-2 outline-0 flex-1"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Ποσότητα"
                id="quantity"
                type="number"
                placeholder="100"
                min="1"
                step="1"
                value={ticket.quantity}
                onChange={(e) =>
                  updateTicket(ticket.id, "quantity", e.target.value)
                }
                className="w-full rounded-xl border-2 border-violet-100 hover:border-violet-200 focus:border-violet-300 px-3 py-2 outline-0"
              />
            </div>
            <div className="sm:col-span-2 flex items-end justify-end">
              {tickets.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeTicket(ticket.id)}
                  className="rounded-xl p-2 border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                  aria-label={`Αφαίρεση τύπου εισιτηρίου ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>
          </div>
        ))}

        {error && <p className="text-sm text-red-600 mt-1 ml-2">{error}</p>}

        <button
          type="button"
          onClick={addTicket}
          className="rounded-2xl border-2 border-violet-200 text-violet-700 px-4 py-2 font-semibold hover:bg-violet-50 transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus size={16} />
          Προσθήκη τύπου εισιτηρίου
        </button>
      </div>
    </section>
  );
}
