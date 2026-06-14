"use client";

import { useState } from "react";
import { BookingStatus } from "@/app/generated/prisma/enums";
import BookingRequest from "./BookingRequest";
import { BookingRow } from "../types";

interface Props {
  bookings: BookingRow[];
}

type FilterTab = "all" | BookingStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Όλες" },
  { key: BookingStatus.PENDING, label: "Σε εκκρεμότητα" },
  { key: BookingStatus.CONFIRMED, label: "Επιβεβαιωμένες" },
  { key: BookingStatus.CANCELLED, label: "Ακυρωμένες" },
];

export default function OrganizerBookingList({ bookings }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filtered =
    activeFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  const counts = {
    all: bookings.length,
    [BookingStatus.PENDING]: bookings.filter(
      (b) => b.status === BookingStatus.PENDING,
    ).length,
    [BookingStatus.CONFIRMED]: bookings.filter(
      (b) => b.status === BookingStatus.CONFIRMED,
    ).length,
    [BookingStatus.CANCELLED]: bookings.filter(
      (b) => b.status === BookingStatus.CANCELLED,
    ).length,
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
        <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
          ΚΡΑΤΗΣΕΙΣ
        </p>
        <p className="text-gray-500 text-sm">
          Δεν υπάρχουν κρατήσεις για αυτή την εκδήλωση.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 mt-4">
      <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
        ΚΡΑΤΗΣΕΙΣ
      </p>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === tab.key
                ? "bg-violet-600 text-white"
                : "bg-violet-50 text-violet-700 hover:bg-violet-100"
            }`}
          >
            {tab.label}
            {tab.key !== "all" && counts[tab.key] > 0 && (
              <span
                className={`ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                  activeFilter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-violet-200 text-violet-700"
                }`}
              >
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="divide-y divide-violet-100">
        {filtered.map((booking) => (
          <BookingRequest key={`booking-${booking.id}`} booking={booking} />
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center">
            Δεν υπάρχουν κρατήσεις σε αυτή την κατηγορία.
          </p>
        )}
      </div>
    </div>
  );
}
