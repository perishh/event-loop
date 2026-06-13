import Breadcrumb from "@/components/Breadcrumb";
import MediaCarousel from "@/components/MediaCarousel";
import Map from "@/components/Map";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { EVENT_CATEGORY_LABELS, EVENT_TYPE_LABELS } from "@/prisma/mapper";
import { Calendar, Clock, MapPin, Users, Ticket, Euro } from "lucide-react";
import { notFound } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import Link from "next/link";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await getSession();

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: {
        omit: { eventId: true },
      },
    },
  });

  if (
    !event ||
    (event.status === "DRAFT" &&
      (!session || session.sub !== event.organizerId))
  ) {
    notFound();
  }

  // TODO: move to utils
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
        ]}
      />

      <div className="mt-4 mb-6">
        <MediaCarousel
          images={event.media}
          eventTitle={event.title}
          showEmptyState
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="rounded-full bg-violet-100 text-violet-700 text-sm font-semibold px-3 py-1">
            {EVENT_TYPE_LABELS[event.type]}
          </span>
          <div className="flex items-center space-x-2">
            {session && session.sub === event.organizerId && (
              <a
                href={`/events/${encodeURIComponent(event.id)}/edit`}
                className="text-xs text-violet-600 hover:text-violet-800 underline"
              >
                Επεξεργασία
              </a>
            )}
            {event.status === "DRAFT" && (
              <span className="rounded-full bg-orange-100 text-amber-800 text-sm font-semibold px-3 py-1">
                Πρόχειρο
              </span>
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-4">
          {event.title}
        </h1>
      </div>

      <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
        {event.description}
      </p>

      <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 pb-5 md:pb-2 shadow-sm shadow-violet-100/60">
        <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
          ΗΜΕΡΟΜΗΝΙΑ & ΩΡΑ
        </p>
        <div className="space-y-5 md:flex">
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

      <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 mt-5">
        <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
          ΤΟΠΟΘΕΣΙΑ
        </p>
        <div className="flex">
          <div className="space-y-2 flex-1">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 text-violet-500 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-gray-800">{event.venue}</p>
                <p className="text-sm text-gray-600">
                  {event.address}, {event.city}
                </p>
                <p className="text-sm text-gray-500">{event.country}</p>
              </div>
            </div>
          </div>
          {event.latitude && event.longitude && (
            <Map
              marker={[event.latitude, event.longitude]}
              initialPosition={[event.latitude, event.longitude]}
              initialZoom={14}
              className="h-40 mt-3 flex-2"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
          <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
            ΧΩΡΗΤΙΚΟΤΗΤΑ
          </p>
          <div className="flex items-center gap-3">
            <Users className="text-violet-500 shrink-0" size={24} />
            <p className="text-xl font-bold text-gray-800">
              {event.capacity.toLocaleString("el-GR")}{" "}
              <span className="text-sm font-normal text-gray-500">άτομα</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
          <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
            ΚΑΤΗΓΟΡΙΕΣ
          </p>
          <div className="flex flex-wrap gap-2">
            {event.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1.5 border border-violet-200"
              >
                {EVENT_CATEGORY_LABELS[category]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 mb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold tracking-[0.22em] text-violet-500">
            ΤΥΠΟΙ ΕΙΣΙΤΗΡΙΩΝ
          </p>

          {session && session.role === UserRole.ATTENDEE && (
            <Link
              href={`/events/${encodeURIComponent(event.id)}/book`}
              className="bg-violet-500 text-white rounded-xl px-3 py-2 text-sm font-medium tracking-wide"
            >
              Κράτηση
            </Link>
          )}
        </div>

        {event.ticketTypes.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Δεν υπάρχουν διαθέσιμα εισιτήρια.
          </p>
        ) : (
          <div className="divide-y divide-violet-100">
            {event.ticketTypes.map((ticket) => (
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
                  </div>
                </div>
                <div className="text-end">
                  <div className="flex items-center gap-1 text-lg font-bold text-gray-800 leading-tight">
                    {ticket.price.toFixed(2)}
                    <Euro size={16} className="text-violet-500" />
                  </div>
                  <p className="text-xs text-gray-500">
                    {ticket.available.toLocaleString("el-GR")} /{" "}
                    {ticket.quantity.toLocaleString("el-GR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
