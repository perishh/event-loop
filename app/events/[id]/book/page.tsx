import { EventStatus, UserRole } from "@/app/generated/prisma/enums";
import { EVENT_TYPE_LABELS } from "@/prisma/mapper";
import Breadcrumb from "@/components/Breadcrumb";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import BookingForm from "./components/BookingForm";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EventBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await getSession();

  if (!session || session.role !== UserRole.ATTENDEE) {
    notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: {
        omit: { eventId: true },
      },
    },
  });

  if (!event || event.status !== EventStatus.PUBLISHED) {
    notFound();
  }

  const now = new Date();
  const isPastEvent = event.endDateTime < now; // TODO: Maybe check start datetime?

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

  const startDate = formatDate(event.startDateTime);
  const startTime = formatTime(event.startDateTime);
  const endDate = formatDate(event.endDateTime);
  const endTime = formatTime(event.endDateTime);
  const isMultiDay = startDate !== endDate;

  return (
    <section className="w-full max-w-3xl mx-auto mt-8 px-4">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Εκδηλώσεις", href: "/events" },
          {
            label: event.title,
            href: `/events/${encodeURIComponent(event.id)}`,
          },
          {
            label: "Κράτηση",
            href: `/events/${encodeURIComponent(event.id)}/book`,
          },
        ]}
      />

      <h1 className="text-3xl font-semibold mt-4">Κράτηση</h1>
      <h1 className="text-lg tracking-wide text-gray-900">
        {event.title}{" "}
        <span className="rounded-full bg-violet-100 text-violet-700 text-sm font-semibold px-2 py-1">
          {EVENT_TYPE_LABELS[event.type]}
        </span>
      </h1>

      <div className="flex items-start gap-3 mt-2">
        <MapPin className="mt-0.5 text-violet-500 shrink-0" size={20} />
        <p>
          <span className="font-semibold text-gray-800">{event.venue}</span>
          <span className="text-sm text-gray-600">
            , {event.address}, {event.city}
          </span>
          <span className="text-sm text-gray-500">, {event.country}</span>
        </p>
      </div>

      <div className="space-y-4 mb-8 mt-4">
        {/* Date & Time */}
        <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
          <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
            ΗΜΕΡΟΜΗΝΙΑ & ΩΡΑ
          </p>
          <div className="space-y-4 md:flex md:space-y-0">
            <div className="flex items-start flex-1 space-x-3">
              <Calendar className="mt-0.5 text-violet-500 shrink-0" size={20} />
              <div>
                <p className="text-sm text-gray-500">Έναρξη</p>
                <p className="font-semibold text-gray-800">{startDate}</p>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={14} />
                  <span className="text-sm">{startTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-start flex-1 space-x-3">
              <Calendar className="mt-0.5 text-violet-500 shrink-0" size={20} />
              <div>
                <p className="text-sm text-gray-500">Λήξη</p>
                <p className="font-semibold text-gray-800">
                  {isMultiDay ? endDate : startDate}
                </p>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={14} />
                  <span className="text-sm">{endTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      </div>
    </section>
  );
}
