import Link from "next/link";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { UserRole } from "@/app/generated/prisma/enums";
import { EVENT_TYPE_LABELS } from "@/prisma/mapper";
import { formatDate, formatTime } from "@/lib/utils";
import EventActions from "./components/EventActions";

const EVENT_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Πρόχειρη",
  PUBLISHED: "Δημοσιευμένη",
  CANCELLED: "Ακυρωμένη",
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-amber-100 text-amber-800",
  PUBLISHED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function Page() {
  const session = await getSession();

  if (!session || session.role !== UserRole.ORGANIZER) {
    redirect("/login?next=/manage");
  }

  const events = await prisma.event.findMany({
    where: { organizerId: session.sub },
    orderBy: { startDateTime: "desc" },
    include: {
      ticketTypes: {
        select: {
          quantity: true,
          available: true,
          _count: { select: { bookings: true } },
        },
      },
    },
  });

  const publishedCount = events.filter((e) => e.status === "PUBLISHED").length;

  return (
    <main>
      <div className="bg-white sticky left-0 top-[76px] p-6 shadow-sm shadow-violet-100/60 z-10">
        <Breadcrumb
          breadcrumbItems={[
            { label: "Αρχική", href: "/" },
            { label: "Οι διοργανώσεις μου", href: "/manage" },
          ]}
        />
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-gray-900">
            Διαχείριση εκδηλώσεων
          </h1>
          <Link
            href="/events/new"
            className="shrink-0 text-sm bg-violet-600 text-white rounded-lg px-4 py-2 hover:bg-violet-700"
          >
            Νέα εκδήλωση
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          {events.length} εκδηλώσεις · {publishedCount} δημοσιευμένες
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">
          Δεν έχεις δημιουργήσει εκδηλώσεις ακόμη.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 px-6 pt-2 pb-6">
          {events.map((event) => {
            const booked = event.ticketTypes.reduce(
              (sum, t) => sum + (t.quantity - t.available),
              0,
            );
            const bookingCount = event.ticketTypes.reduce(
              (sum, t) => sum + t._count.bookings,
              0,
            );

            return (
              <li
                key={event.id}
                className="flex flex-col gap-2 rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 shadow-sm shadow-violet-100/60"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-gray-900">
                      {event.title}
                    </span>
                    <div className="mt-1 grid grid-cols-[max-content_auto] items-center gap-x-2 gap-y-1">
                      <span className="text-xs text-gray-500">
                        Τύπος εκδήλωσης:
                      </span>
                      <span className="justify-self-start text-xs text-gray-600 border border-gray-300 rounded px-2 py-0.5">
                        {EVENT_TYPE_LABELS[event.type]}
                      </span>
                      <span className="text-xs text-gray-500">
                        Ημερομηνία/ώρα εκδήλωσης:
                      </span>
                      <span className="justify-self-start text-xs text-gray-600 border border-gray-300 rounded px-2 py-0.5">
                        {formatDate(event.startDateTime)},{" "}
                        {formatTime(event.startDateTime)}
                      </span>
                      <span className="text-xs text-gray-500">Τοποθεσία:</span>
                      <span className="justify-self-start text-xs text-gray-600 border border-gray-300 rounded px-2 py-0.5">
                        {event.city}
                      </span>
                      <span className="text-xs text-gray-500">Κρατήσεις:</span>
                      <span className="justify-self-start text-xs text-gray-600 border border-gray-300 rounded px-2 py-0.5">
                        {booked}/{event.capacity}
                      </span>
                      <span className="text-xs text-gray-500">
                        Κατάσταση εκδήλωσης:
                      </span>
                      <span
                        className={`justify-self-start text-xs rounded px-2 py-0.5 ${
                          STATUS_STYLES[event.status] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {EVENT_STATUS_LABELS[event.status]}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 text-sm">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-violet-700 hover:underline"
                    >
                      Προβολή
                    </Link>
                    <Link
                      href={`/events/${event.id}/edit`}
                      className="text-violet-700 hover:underline"
                    >
                      Επεξεργασία
                    </Link>
                    <Link
                      href={`/events/${event.id}/book`}
                      className="text-violet-700 hover:underline"
                    >
                      Κρατήσεις
                    </Link>
                  </div>
                </div>

                <EventActions
                  eventId={event.id}
                  status={event.status}
                  bookingCount={bookingCount}
                />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
