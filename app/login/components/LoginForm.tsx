"use client";

import { useState, type FormEvent } from "react";
import { getRawInput, SignInInputSchema } from "../schema";
import z from "zod";
import InputField from "@/components/InputField";
import Breadcrumb from "@/components/Breadcrumb";
import { Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAction } from "../actions";

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

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const rawInput = getRawInput(new FormData(event.currentTarget));
    const parsed = SignInInputSchema.safeParse(rawInput);

    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const result = await signInAction(rawInput);

      if (result.success) {
        router.replace(result.message);
        return;
      }

      setErrors(result.fieldErrors ?? {});
      setMessage(result.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-md mx-auto mt-8 px-4">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Σύνδεση", href: "/login" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-wide mt-4 mb-6">
        Συνδεθείτε στον λογαριασμό σας
      </h1>

      <div className="bg-violet-50 rounded-2xl shadow-lg shadow-violet-100/80 p-6">
        <form
          id="eventloop-login-form"
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <section className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 space-y-4">
            <p className="text-xs font-bold tracking-[0.22em] text-violet-500">
              ΣΤΟΙΧΕΙΑ ΕΙΣΟΔΟΥ
            </p>

            <div className="grid grid-cols-1 gap-3">
              <InputField
                name="username"
                id="login-username"
                label="Όνομα χρήστη"
                type="text"
                icon={User}
                placeholder="john_doe"
                error={getFieldError(errors, "username")}
              />
              <InputField
                id="login-password"
                name="password"
                label="Κωδικός πρόσβασης"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={getFieldError(errors, "password") || message}
              />
            </div>
          </section>
        </form>

        {!loading && message && (
          <p className="text-sm text-red-700 mt-4 ml-1" role="alert">
            {message}
          </p>
        )}

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm">
            <span>Δεν έχετε λογαριασμό;</span>
            <br />
            <Link
              className="text-violet-700 hover:underline font-semibold"
              href="/register"
            >
              Εγγραφείτε εδώ
            </Link>
          </p>
          <button
            form="eventloop-login-form"
            type="submit"
            className="bg-violet-500 text-white px-3 py-2 rounded-lg ring-0 hover:ring-2 ring-violet-500 transition-all active:ring-offset-1 focus:ring-offset-2 outline-0 tracking-wide font-semibold"
            disabled={loading}
          >
            {loading ? "Είσοδος…" : "Είσοδος"}
          </button>
        </div>
      </div>
    </section>
  );
}
