import { UserRole } from "@/app/generated/prisma/enums";
import Breadcrumb from "@/components/Breadcrumb";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EventForm from "../../_form/EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session || session.role !== UserRole.ORGANIZER) {
    notFound();
  }

  const id = (await params).id;
  const event = await prisma.event.findUnique({
    where: {
      id,
      organizerId: session.sub,
    },
    omit: {
      organizerId: true,
    },
    include: {
      ticketTypes: {
        omit: {
          eventId: true,
        },
      },
    },
  });
  if (!event) {
    notFound();
  }

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
            label: "Επεξεργασία",
            href: `/events/${encodeURIComponent(event.id)}/edit`,
          },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-wide mt-4 mb-6">
        Επεξεργασία εκδήλωσης
      </h1>

      <EventForm eventToEdit={event} />
    </section>
  );
}
