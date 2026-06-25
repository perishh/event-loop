"use client";

import { useState, type FormEvent } from "react";
import { getRawInput, SignUpInputSchema } from "../schema";
import z from "zod";
import PendingStatus from "./PendingStatus";
import Breadcrumb from "@/components/Breadcrumb";
import Switcher from "@/components/Switcher";
import {
  Building2,
  Fingerprint,
  Globe,
  Lock,
  Mail,
  MapPinned,
  User,
} from "lucide-react";
import InputField from "@/components/InputField";

import { LucideProps } from "lucide-react";
import { ComponentType } from "react";
import { UserRole } from "@/app/generated/prisma/enums";

interface RegisterField {
  id: string;
  name: string;
  label: string;
  type: string;
  icon: ComponentType<LucideProps>;
  placeholder: string;
}

interface RegisterSection {
  title: string;
  fields: RegisterField[];
}

/* -------------------------------------------------------------------------- */
/*  Field definitions                                                         */
/* -------------------------------------------------------------------------- */

const sections: RegisterSection[] = [
  {
    title: "ΣΤΟΙΧΕΙΑ ΕΙΣΟΔΟΥ",
    fields: [
      {
        id: "register-username",
        name: "username",
        label: "Όνομα χρήστη",
        type: "text",
        icon: User,
        placeholder: "••••••••",
      },
      {
        id: "register-email",
        name: "email",
        label: "Email",
        type: "email",
        icon: Mail,
        placeholder: "john@example.com",
      },
      {
        id: "register-password",
        name: "password",
        label: "Κωδικός πρόσβασης",
        type: "password",
        icon: Lock,
        placeholder: "••••••••",
      },
      {
        id: "register-confirm-password",
        name: "confirmPassword",
        label: "Επιβεβαίωση κωδικού",
        type: "password",
        icon: Lock,
        placeholder: "••••••••",
      },
    ],
  },
  {
    title: "ΠΡΟΣΩΠΙΚΑ ΣΤΟΙΧΕΙΑ",
    fields: [
      {
        id: "register-first-name",
        name: "firstName",
        label: "Όνομα",
        type: "text",
        icon: User,
        placeholder: "John",
      },
      {
        id: "register-last-name",
        name: "lastName",
        label: "Επώνυμο",
        type: "text",
        icon: User,
        placeholder: "Doe",
      },
      {
        id: "register-afm",
        name: "afm",
        label: "ΑΦΜ",
        type: "text",
        icon: Fingerprint,
        placeholder: "123456789",
      },
    ],
  },
  {
    title: "ΔΙΕΥΘΥΝΣΗ",
    fields: [
      {
        id: "register-country",
        name: "country",
        label: "Χώρα",
        type: "text",
        icon: Globe,
        placeholder: "Ελλάδα",
      },
      {
        id: "register-city",
        name: "city",
        label: "Πόλη",
        type: "text",
        icon: Building2,
        placeholder: "Αθήνα",
      },
      {
        id: "register-area",
        name: "area",
        label: "Περιοχή",
        type: "text",
        icon: MapPinned,
        placeholder: "Βασ. Σοφίας 123",
      },
    ],
  },
];
/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Returns the first error message for a given field name, or undefined.
 */
function getFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  fieldName: string,
): string | undefined {
  const messages = fieldErrors?.[fieldName];
  return messages?.length ? messages[0] : undefined;
}

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [showPending, setShowPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const rawInput = getRawInput(new FormData(event.currentTarget));
    const parsed = SignUpInputSchema.safeParse(rawInput);

    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rawInput),
      });
      const result = await response.json();

      if (result.success) {
        setShowPending(true);
        return;
      }

      setErrors(result.fieldErrors ?? {});
      setMessage(result.error);
    } finally {
      setLoading(false);
    }
  }

  if (showPending) return <PendingStatus />;

  return (
    <section className="max-w-3xl mx-auto mt-8 px-4">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Εγγραφή", href: "/register" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-wide mt-4 mb-6">
        Δημιουργήστε νέο λογαριασμό
      </h1>

      <div className="bg-violet-50 rounded-2xl shadow-lg shadow-violet-100/80 p-6">
        <form
          id="eventloop-register-form"
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <section className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
            <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
              ΡΟΛΟΣ
            </p>

            <Switcher
              left={{
                label: "ΔΙΟΡΓΑΝΩΤΗΣ",
                value: UserRole.ORGANIZER,
              }}
              right={{
                label: "ΣΥΜΜΕΤΕΧΩΝ",
                value: UserRole.ATTENDEE,
              }}
              name="role"
            />
          </section>

          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 space-y-4"
            >
              <p className="text-xs font-bold tracking-[0.22em] text-violet-500">
                {section.title}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.fields.map((registerField) => (
                  <InputField
                    key={registerField.id}
                    {...registerField}
                    error={getFieldError(errors, registerField.name)}
                  />
                ))}
              </div>
            </section>
          ))}
        </form>

        {!loading && message && (
          <p className="text-sm text-red-700 mt-4 ml-1" role="alert">
            {message}
          </p>
        )}

        <div className="flex justify-end mt-6">
          <button
            form="eventloop-register-form"
            type="submit"
            className="bg-violet-500 text-white px-3 py-2 rounded-lg ring-0 hover:ring-2 ring-violet-500 transition-all active:ring-offset-1 focus:ring-offset-2 outline-0 tracking-wide font-semibold"
            disabled={loading}
          >
            {loading ? "Αποστολή…" : "Συνέχεια"}
          </button>
        </div>
      </div>
    </section>
  );
}
