"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";import { useRouter } from "next/navigation";
import { signInFormAction, type SignInFormState } from "../actions";
import { getRawInput, SignInInputSchema } from "../schema";
import z from "zod";
import InputField from "./InputField";
import LoginField from "./loginField";
import Breadcrumb from "@/components/Breadcrumb";

/* -------------------------------------------------------------------------- */
/*  Field definitions                                                         */
/* -------------------------------------------------------------------------- */

const loginFields: LoginField[] = [
  {
    id: "login-email",
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    id: "login-password",
    name: "password",
    label: "Κωδικός χρήστη",
    type: "password",
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

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

export default function LoginForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<
    SignInFormState,
    FormData
  >(signInFormAction, null);

  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = SignInInputSchema.safeParse(getRawInput(formData));

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

  // If login succeeded, redirect to home.
  useEffect(() => {
    if (state && state.success) {
      router.push("/");
    }
  }, [state, router]);

  return (
    <section className="eventloop-login-page-content">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Σύνδεση", href: "/login" },
        ]}
      />
      <h1 className="eventloop-login-page-title">
        Συνδεθείτε στον λογαριασμό σας:
      </h1>

      <div className="eventloop-login-form-wrapper">
        <form
          id="eventloop-login-form"
          className="eventloop-login-card"
          action={formAction}
          onSubmit={handleSubmit}
          noValidate
        >
          {loginFields.map((loginField) => (
            <InputField
              key={loginField.id}
              loginField={loginField}
              error={getFieldError(fieldErrors, loginField.name)}
            />
          ))}

          {state && !state.success && state.error && (
            <p className="eventloop-login-error-message" role="alert">
              {state.error}
            </p>
          )}
        </form>

        <button
          form="eventloop-login-form"
          type="submit"
          className="eventloop-login-submit-button"
          disabled={isPending}
        >
          {isPending ? "Αποστολή…" : "Συνέχεια"}
        </button>
      </div>
    </section>
  );
}
