"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";
import { CircleCheck } from "lucide-react";


export default function PendingStatus() {
  const router = useRouter();

  return (
    <section className="max-w-lg mx-auto mt-8 px-4">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Εγγραφή", href: "/register" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-wide mt-4 mb-6">
        Αναμονή επιβεβαίωσης νέου λογαριασμού
      </h1>

      <div className="bg-violet-50 rounded-2xl shadow-lg shadow-violet-100/80 p-6">
        <ul className="space-y-4">
          <li className="flex items-start space-x-3">
            <CircleCheck className="text-violet-500 mt-0.5 shrink-0" size={20} />
            <span className="text-sm leading-relaxed">
              Η εγγραφή σας υποβλήθηκε επιτυχώς. Η αίτησή σας εκκρεμεί έγκριση
              από τον διαχειριστή.
            </span>
          </li>

          <li className="flex items-start space-x-3">
            <CircleCheck className="text-violet-500 mt-0.5 shrink-0" size={20} />
            <span className="text-sm leading-relaxed">
              Μετά θα μπορείτε να εισέλθετε με το{" "}
              <span className="font-semibold text-violet-700">email</span> και τον{" "}
              <span className="font-semibold text-violet-700">κωδικό</span> σας.
            </span>
          </li>
        </ul>

        <button
          onClick={() => router.replace("/")}
          className="mt-6 w-full bg-violet-500 text-white px-3 py-2 rounded-lg ring-0 hover:ring-2 ring-violet-500 transition-all active:ring-offset-1 focus:ring-offset-2 outline-0 tracking-wide font-semibold"
        >
          Επιστροφή στην Αρχική σελίδα
        </button>
      </div>
    </section>
  );
}
