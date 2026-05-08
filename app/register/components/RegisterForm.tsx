"use client";

import { useActionState, useState, type FormEvent } from "react";
import { signUpFormAction, type SignUpFormState } from "../actions";
import { getRawInput, SignUpInputSchema } from "../schema";
import z from "zod";
import PendingStatus from "./PendingStatus";
import RoleSelect from "./RoleSelect";
import InputField from "./InputField";
import RegisterField from "./registerField";
import Breadcrumb from "@/components/Breadcrumb";

/* -------------------------------------------------------------------------- */
/*  Field definitions                                                         */
/* -------------------------------------------------------------------------- */

const leftRegisterFields: RegisterField[] = [
  {
    id: "register-username",
    name: "username",
    label: "Όνομα χρήστη",
    type: "text",
  },
  {
    id: "register-password",
    name: "password",
    label: "Κωδικός χρήστη",
    type: "password",
  },
  {
    id: "register-confirm-password",
    name: "confirmPassword",
    label: "Επιβεβαίωση κωδικού χρήστη",
    type: "password",
  },
  {
    id: "register-name",
    name: "name",
    label: "Όνομα",
    type: "text",
  },
  {
    id: "register-last-name",
    name: "lastName",
    label: "Επώνυμο",
    type: "text",
  },
  {
    id: "register-afm",
    name: "afm",
    label: "ΑΦΜ",
    type: "text",
  },
];

const rightRegisterFields: RegisterField[] = [
  {
    id: "register-email",
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    id: "register-country",
    name: "country",
    label: "Χώρα",
    type: "text",
  },
  {
    id: "register-city",
    name: "city",
    label: "Πόλη",
    type: "text",
  },
  {
    id: "register-area",
    name: "area",
    label: "Διεύθυνση",
    type: "text",
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
  const [state, formAction, isPending] = useActionState<
    SignUpFormState,
    FormData
  >(signUpFormAction, null);

  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = SignUpInputSchema.safeParse(getRawInput(formData));

    if (!parsed.success) {
      event.preventDefault();
      setErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setErrors(null);
  }

  // Prefer client-side validation errors if present, otherwise use server-side errors from state.
  const fieldErrors =
    errors ?? (state && !state.success ? state.fieldErrors : undefined);

  // If register succeeded, show pending confirmation status
  if (state && state.success) return <PendingStatus />;

  return (
    <section className="max-w-3xl mx-auto mt-8 px-4">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Εγγραφή", href: "/register" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-wide mt-4 mb-6">
        Δημιουργήστε νέο λογαριασμό:
      </h1>

      <div className="bg-violet-50 rounded-2xl shadow-lg shadow-violet-100/80 p-6">
        <form
          id="eventloop-register-form"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          action={formAction}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-3">
            {leftRegisterFields.map((registerField) => (
              <InputField
                key={registerField.id}
                registerField={registerField}
                error={getFieldError(fieldErrors, registerField.name)}
              />
            ))}
          </div>

          <div className="space-y-3">
            {rightRegisterFields.map((registerField) => (
              <InputField
                key={registerField.id}
                registerField={registerField}
                error={getFieldError(fieldErrors, registerField.name)}
              />
            ))}

            <RoleSelect error={getFieldError(fieldErrors, "role")} />
          </div>
        </form>

        {state && !state.success && state.error && (
          <p className="text-sm text-red-700 mt-4 ml-1" role="alert">
            {state.error}
          </p>
        )}

        <div className="flex justify-end mt-6">
          <button
            form="eventloop-register-form"
            type="submit"
            className="bg-violet-500 text-white px-3 py-2 rounded-lg ring-0 hover:ring-2 ring-violet-500 transition-all active:ring-offset-1 focus:ring-offset-2 outline-0 tracking-wide font-semibold"
            disabled={isPending}
          >
            {isPending ? "Αποστολή…" : "Συνέχεια"}
          </button>
        </div>
      </div>
    </section>
  );
}
