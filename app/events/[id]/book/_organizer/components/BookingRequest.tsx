"use client";

import { Check, Clock, Euro, Ticket, User, X } from "lucide-react";
import { BookingRow } from "../types";
import { formatDate, formatTime } from "@/lib/dateUtils";
import { cancelBookingAction, confirmBookingAction } from "../actions";
import { useState } from "react";
import { BookingStatus } from "@/app/generated/prisma/enums";
import { STATUS_LABELS } from "@/prisma/mapper";

const STATUS_STYLES: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "bg-amber-100 text-amber-700 border-amber-200",
  [BookingStatus.CONFIRMED]:
    "bg-emerald-100 text-emerald-700 border-emerald-200",
  [BookingStatus.CANCELLED]: "bg-red-100 text-red-700 border-red-200",
};

interface Props {
  booking: BookingRow;
}

export default function BookingRequest({ booking }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const result = await confirmBookingAction(booking.id);
      if (!result.success) {
        setError(result.error);
      }
    } catch {
      setError("Σφάλμα κατά την επιβεβαίωση της κράτησης.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const result = await cancelBookingAction(booking.id);
      if (!result.success) {
        setError(result.error);
      }
    } catch {
      setError("Σφάλμα κατά την ακύρωση της κράτησης.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      key={booking.id}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 first:pt-0 last:pb-0 gap-2"
    >
      <div className="flex items-start gap-3 min-w-0">
        <Ticket className="mt-0.5 text-violet-500 shrink-0" size={20} />
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 leading-tight truncate">
            {booking.ticketType.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>
                {booking.attendee.firstName} {booking.attendee.lastName}
              </span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>
                {formatDate(booking.time)}, {formatTime(booking.time)}
              </span>
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-8 sm:ml-0">
        <div className="text-center">
          <div className="flex items-center gap-1 text-lg font-bold text-gray-800 leading-1">
            {booking.totalCost.toFixed(2)}
            <Euro size={16} className="text-violet-500" />
          </div>
          <span className="text-xs text-gray-500 leading-1">
            {booking.numberOfTickets} × {booking.ticketType.price.toFixed(2)} €
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[booking.status]}`}
        >
          {STATUS_LABELS[booking.status]}
        </span>

        <div className="flex items-center gap-1">
          {booking.status === BookingStatus.PENDING && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Επιβεβαίωση κράτησης"
              title="Επιβεβαίωση"
            >
              <Check size={16} />
            </button>
          )}
          {booking.status !== BookingStatus.CANCELLED && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Ακύρωση κράτησης"
              title="Ακύρωση"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
