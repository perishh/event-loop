import { BookingStatus } from "@/app/generated/prisma/enums";
import { STATUS_LABELS } from "@/prisma/mapper";
import { Ticket, Clock, Euro } from "lucide-react";

interface ExistingBooking {
  id: string;
  time: Date;
  status: BookingStatus;
  numberOfTickets: number;
  totalCost: number;
  ticketType: {
    id: number;
    name: string;
    price: number;
  };
}

interface Props {
  bookings: ExistingBooking[];
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "bg-amber-100 text-amber-700 border-amber-200",
  [BookingStatus.CONFIRMED]:
    "bg-emerald-100 text-emerald-700 border-emerald-200",
  [BookingStatus.CANCELLED]: "bg-red-100 text-red-700 border-red-200",
};

export default function BookingList({ bookings }: Props) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("el-GR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("el-GR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (bookings.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
      <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
        ΟΙ ΚΡΑΤΗΣΕΙΣ ΜΟΥ
      </p>

      <div className="divide-y divide-violet-100">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <Ticket className="text-violet-500 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-gray-800 leading-tight">
                  {booking.ticketType.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span>
                    {booking.numberOfTickets}{" "}
                    {booking.numberOfTickets === 1 ? "εισιτήριο" : "εισιτήρια"}
                  </span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>
                      {formatDate(booking.time)}, {formatTime(booking.time)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-lg font-bold text-gray-800 leading-tight">
                {booking.totalCost.toFixed(2)}
                <Euro size={16} className="text-violet-500" />
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[booking.status]}`}
              >
                {STATUS_LABELS[booking.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
