"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { useState } from "react";

/**
 * @brief  Renders the login form content.
 * @return The JSX structure of the login page content.
 */
export default function LoginForm() {
  const router = useRouter();

  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  /**
   * @brief Handles the temporary dummy login form submission.
   * @param loginFormEvent the form submission event.
   */
  function handleDummyLogin(loginFormEvent: FormEvent<HTMLFormElement>) {
    loginFormEvent.preventDefault();

    const loginFormData = new FormData(loginFormEvent.currentTarget);
    const submittedUsername = String(loginFormData.get("username") ?? "");
    const submittedPassword = String(loginFormData.get("password") ?? "");

    if (
      submittedUsername === dummyUser.username &&
      submittedPassword === dummyUser.password
    ) {
      localStorage.setItem(dummyUserLoginStorageKey, "true");

      router.push("/");

      return;
    }

    setLoginErrorMessage("Λάθος όνομα χρήστη ή κωδικός χρήστη.");
  }

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
          onSubmit={handleDummyLogin}
        >
          <div className="eventloop-login-field">
            <label htmlFor="username" className="eventloop-login-label">
              Όνομα χρήστη
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder=" "
              className="eventloop-login-input"
            />
          </div>

          <div className="eventloop-login-field">
            <label htmlFor="password" className="eventloop-login-label">
              Κωδικός χρήστη
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder=" "
              className="eventloop-login-input"
            />
          </div>

          {loginErrorMessage !== "" && (
            <p className="eventloop-login-error-message">{loginErrorMessage}</p>
          )}
        </form>

        <button
          form="eventloop-login-form"
          type="submit"
          className="eventloop-login-submit-button"
        >
          Συνέχεια
        </button>
      </div>
    </section>
  );
}
