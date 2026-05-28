import { UserRole } from "@/app/generated/prisma/enums";
import Breadcrumb from "@/components/Breadcrumb";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import EventForm from "../_form/EventForm";

export default async function NewEventPage() {
  const session = await getSession();

  if (!session || session.role !== UserRole.ORGANIZER) {
    redirect("/login?next=/events/new");
  }

  return (
    <section className="w-full max-w-3xl mx-auto mt-8 px-4">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Εκδηλώσεις", href: "/events" },
          { label: "Δημιουργία", href: "/events/new" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-wide mt-4 mb-6">
        Δημιουργία νέας εκδήλωσης
      </h1>

      <EventForm />
    </section>
  );
}
