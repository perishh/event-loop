import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { UserRole, BookingStatus } from "@/app/generated/prisma/enums";
import { EVENT_TYPE_LABELS } from "@/prisma/mapper";
import { formatDate, formatTime } from "@/lib/utils";
import { startConversation } from "@/app/messages/actions";
import Breadcrumb from "@/components/Breadcrumb";

// Application (booking) status — descriptive, attendee-facing.
const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "Εκκρεμεί επιβεβαίωση αίτησης συμμετοχής από τον διοργανωτή",
  CONFIRMED: "Η αίτηση συμμετοχής εγκρίθηκε από τον διοργανωτή",
  CANCELLED: "Η αίτηση συμμετοχής ακυρώθηκε από τον διοργανωτή",
};

const BOOKING_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

// Event status — attendee-facing, driven by event.status (same source as /manage).
const EVENT_STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Προσεχής εκδήλωση",
  COMPLETED: "Ολοκληρωμένη εκδήλωση",
  CANCELLED: "Ακυρωμένη εκδήλωση",
};

const EVENT_STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const currency = new Intl.NumberFormat("el-GR", {
  style: "currency",
  currency: "EUR",
});

export default async function Page() {
  const session = await getSession();

  if (!session || session.role !== UserRole.ATTENDEE) {
    redirect("/login?next=/bookings");
  }

  const bookings = await prisma.booking.findMany({
    where: { attendeeId: session.sub },
    orderBy: { time: "desc" },
    include: {
      ticketType: {
        select: {
          name: true,
          event: {
            select: {
              id: true,
              title: true,
              type: true,
              status: true,
              startDateTime: true,
              endDateTime: true,
              city: true,
            },
          },
        },
      },
    },
  });

  return (
    <main>
      <div className="bg-white sticky left-0 top-[76px] p-6 shadow-sm shadow-violet-100/60 z-10">
        <Breadcrumb
          breadcrumbItems={[
            { label: "Αρχική", href: "/" },
            { label: "Κρατήσεις", href: "/bookings" },
          ]}
        />

        <h1 className="text-xl font-semibold text-gray-900">
          Οι κρατήσεις μου
        </h1>
        <p className="text-sm text-gray-500">{bookings.length} κρατήσεις</p>
      </div>

      {bookings.length === 0 ? (
        <p className="text-gray-500">Δεν έχεις κάνει κρατήσεις ακόμη.</p>
      ) : (
        <ul className="flex flex-col gap-2 pt-2 pb-6 px-6">
          {bookings.map((booking) => {
            const event = booking.ticketType.event;

            // A past published event is shown as completed; there is no
            // COMPLETED status, so it is derived from the end date.
            const eventStatusKey =
              event.status === "PUBLISHED" && event.endDateTime < new Date()
                ? "COMPLETED"
                : event.status;

            return (
              <li
                key={booking.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 shadow-sm shadow-violet-100/60"
              >
                <div className="min-w-0">
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
                    {EVENT_STATUS_LABELS[eventStatusKey] && (
                      <>
                        <span className="text-xs text-gray-500">
                          Κατάσταση εκδήλωσης:
                        </span>
                        <span
                          className={`justify-self-start text-xs rounded px-2 py-0.5 ${
                            EVENT_STATUS_STYLES[eventStatusKey] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {EVENT_STATUS_LABELS[eventStatusKey]}
                        </span>
                      </>
                    )}
                    <span className="text-xs text-gray-500">
                      Κατάσταση αίτησης συμμετοχής:
                    </span>
                    <span
                      className={`justify-self-start text-xs rounded px-2 py-0.5 ${
                        BOOKING_STATUS_STYLES[booking.status] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    {booking.ticketType.name} × {booking.numberOfTickets} ·{" "}
                    <span className="font-medium">
                      {currency.format(booking.totalCost)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {booking.status === BookingStatus.CONFIRMED && (
                    <form action={startConversation}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <button
                        type="submit"
                        className="flex items-center gap-1 text-sm text-violet-700 hover:underline"
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        Μήνυμα στον διοργανωτή
                      </button>
                    </form>
                  )}
                  <Link
                    href={`/events/${event.id}`}
                    className="text-sm text-violet-700 hover:underline"
                  >
                    Προβολή
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
