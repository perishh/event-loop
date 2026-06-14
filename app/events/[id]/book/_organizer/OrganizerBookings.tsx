import {
  BookingStatus,
  EventCategory,
  EventStatus,
  EventType,
} from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { BarChart3 } from "lucide-react";
import OrganizerBookingList from "./components/OrganizerBookingList";
import { SessionTokenPayload } from "@/lib/auth/jwt";

type Event = {
  ticketTypes: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    available: number;
  }[];
} & {
  id: string;
  title: string;
  description: string;
  type: EventType;
  categories: EventCategory[];
  venue: string;
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  startDateTime: Date;
  endDateTime: Date;
  capacity: number;
  status: EventStatus;
  updatedAt: Date;
  media: string[];
  organizerId: string;
};

export default async function OrganizerBookingsPage({
  event,
}: {
  event: Event;
  session: SessionTokenPayload;
}) {
  const bookings = await prisma.booking.findMany({
    where: {
      ticketType: {
        eventId: event.id,
      },
    },
    include: {
      ticketType: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      attendee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      time: "desc",
    },
  });

  // Summary stats
  const pendingCount = bookings.filter(
    (b) => b.status === BookingStatus.PENDING,
  ).length;
  const confirmedCount = bookings.filter(
    (b) => b.status === BookingStatus.CONFIRMED,
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status === BookingStatus.CANCELLED,
  ).length;
  const totalRevenue = bookings
    .filter((b) => b.status !== BookingStatus.CANCELLED)
    .reduce((sum, b) => sum + b.totalCost, 0);

  const stats = [
    { label: "Συνολικές", value: bookings.length },
    { label: "Σε εκκρεμότητα", value: pendingCount },
    { label: "Επιβεβαιωμένες", value: confirmedCount },
    { label: "Ακυρωμένες", value: cancelledCount },
  ];

  return (
    <>
      <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="text-violet-500 shrink-0" size={18} />
          <p className="text-xs font-bold tracking-[0.22em] text-violet-500">
            ΣΥΝΟΨΗ
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-violet-50 p-3 text-center"
            >
              <p className="text-2xl font-bold text-violet-700">{stat.value}</p>
              <p className="text-xs text-violet-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-violet-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">Συνολικά έσοδα</span>
          <span className="text-lg font-bold text-gray-800">
            {totalRevenue.toFixed(2)} €
          </span>
        </div>
      </div>

      <OrganizerBookingList bookings={bookings} />
    </>
  );
}
