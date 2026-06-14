import {
  EventCategory,
  EventStatus,
  EventType,
} from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import BookingForm from "./components/BookingForm";
import { AlertCircle } from "lucide-react";
import BookingList from "./components/BookingList";
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

export default async function AttendeeBookingsPage({
  event,
  session,
}: {
  event: Event;
  session: SessionTokenPayload;
}) {
  const existingBookings = await prisma.booking.findMany({
    where: {
      attendeeId: session.sub,
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
    },
    orderBy: {
      time: "desc",
    },
  });

  const now = new Date();
  const isPastEvent = event.endDateTime < now; // TODO: Maybe check start datetime?

  return (
    <>
      {isPastEvent ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm shadow-amber-100/60 text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-2" size={32} />
          <h2 className="text-lg font-semibold text-amber-800">
            Η εκδήλωση έχει ολοκληρωθεί
          </h2>
          <p className="text-amber-700 text-sm mt-1">
            Δεν είναι δυνατή η κράτηση εισιτηρίων για εκδηλώσεις που έχουν
            παρέλθει.
          </p>
        </div>
      ) : (
        <BookingForm eventId={event.id} ticketTypes={event.ticketTypes} />
      )}
      <BookingList bookings={existingBookings} />
    </>
  );
}
