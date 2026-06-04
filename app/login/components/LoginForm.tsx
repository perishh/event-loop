"use client";

import { useState, type FormEvent } from "react";
import { getRawInput, SignInInputSchema } from "../schema";
import z from "zod";
import InputField from "../../../components/InputField";
import Breadcrumb from "@/components/Breadcrumb";
import { Lock, SquareArrowRightEnter, User } from "lucide-react";
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
    <>
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Σύνδεση", href: "/login" },
        ]}
        className="m-3"
      />
      <section className="bg-violet-50 w-fit mx-auto rounded-2xl shadow-lg shadow-violet-100/80 mt-8 p-4">
        <div className="flex items-center space-x-4 mb-6 mt-2">
          <div className="text-violet-800 bg-violet-200 p-2 rounded-xl">
            <SquareArrowRightEnter size={32} />
          </div>
          <div className="">
            <h1 className="font-bold text-2xl leading-5.5">Σύνδεση</h1>
            <h1 className="leading-5.5 text-sm">Καλώς ήρθατε ξανά</h1>
          </div>
        </div>

        <div className="eventloop-login-form-wrapper">
          <form
            id="eventloop-login-form"
            className="eventloop-login-card"
            onSubmit={handleSubmit}
            noValidate
          >
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
              label="Κωδικός χρήστη"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              wrapperClassName="mt-2"
              error={getFieldError(errors, "password") || message}
            />
          </form>

          <div className="flex items-center justify-between mt-4">
            <p className="leading-4 text-xs">
              <span>Δεν έχετε λογαριασμό;</span>
              <br />
              <Link
                className="text-violet-700 hover:underline"
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
    </>
  );
}
