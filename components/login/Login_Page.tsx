"use client";

/*
 * =========================================================================
 * FILE         :   components/login/Login_Page.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Login page content component.
 *                  Displays the Greek login form used by visitors.
 * =========================================================================
 */


/* Imports the router hook used for temporary redirect after dummy login. */
import { useRouter } from "next/navigation";

/* Imports the form event type used by the login form submit handler. */
import type { FormEvent } from "react";

/* Imports the state hook used for the temporary login error message. */
import { useState } from "react";

/* Imports the temporary dummy user data. */
import { dummyUser, dummyUserLoginStorageKey } from "../../lib/dummy_user";

/* Imports the shared breadcrumb component. */
import EventLoop_Breadcrumb from "../breadcrumb/EventLoop_Breadcrumb";


/**
 * @brief  Renders the login form content.
 * @return The JSX structure of the login page content.
 */
export default function Login_Page() {
    /* Stores the Next.js router instance used for navigation. */
    const router = useRouter();

    /* Stores the temporary login error message. */
    const [loginErrorMessage, setLoginErrorMessage] = useState("");

    /**
     * @brief Handles the temporary dummy login form submission.
     * @param loginFormEvent the form submission event.
     */
    function handleDummyLogin(loginFormEvent: FormEvent<HTMLFormElement>) {
        /* Prevents the browser from reloading the page after form submission. */
        loginFormEvent.preventDefault();

        /* Stores the submitted login form data. */
        const loginFormData = new FormData(loginFormEvent.currentTarget);

        /* Stores the submitted username. */
        const submittedUsername = String(loginFormData.get("username") ?? "");

        /* Stores the submitted password. */
        const submittedPassword = String(loginFormData.get("password") ?? "");

        /* Checks if the submitted credentials match the temporary dummy user. */
        if (submittedUsername === dummyUser.username && submittedPassword === dummyUser.password) {
            /* Stores the temporary logged-in state in localStorage. */
            localStorage.setItem(dummyUserLoginStorageKey, "true");

            /* Sends the user back to the welcome page. */
            router.push("/");

            /* Stops the function after successful dummy login. */
            return;
        }

        /* Shows a temporary error message for wrong credentials. */
        setLoginErrorMessage("Λάθος όνομα χρήστη ή κωδικός χρήστη.");
    }

    /* Returns the visible login page content. */
    return (
        /* Page content area below the shared header. */
        <section className="eventloop-login-page-content">
            {/* Renders the login page breadcrumb. */}
            <EventLoop_Breadcrumb
                /* Shows the current login page location. */
                breadcrumbItems={[
                    { label: "Αρχική", href: "/" },
                    { label: "Σύνδεση", href: "/login" },
                ]}
            />
                        
            {/* Greek login page title. */}
            <h1 className="eventloop-login-page-title">
                Συνδεθείτε στον λογαριασμό σας:
            </h1>

            {/* Login form and action button wrapper. */}
            <div className="eventloop-login-form-wrapper">
                {/* Login card that contains only the input fields. */}
                <form
                    /* Defines the form id so the external button can submit it. */
                    id="eventloop-login-form"
                    /* Applies the login card style. */
                    className="eventloop-login-card"
                    /* Handles the temporary dummy login submission. */
                    onSubmit={handleDummyLogin}
                >
                    {/* Username field wrapper. */}
                    <div className="eventloop-login-field">
                        {/* Username field label. */}
                        <label htmlFor="username" className="eventloop-login-label">
                            {/* Prints the username label. */}
                            Όνομα χρήστη
                        </label>

                        {/* Username input field. */}
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder=" "
                            className="eventloop-login-input"
                        />
                    </div>

                    {/* Password field wrapper. */}
                    <div className="eventloop-login-field">
                        {/* Password field label. */}
                        <label htmlFor="password" className="eventloop-login-label">
                            {/* Prints the password label. */}
                            Κωδικός χρήστη
                        </label>

                        {/* Password input field. */}
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder=" "
                            className="eventloop-login-input"
                        />
                    </div>

                    {/* Shows the temporary login error message when needed. */}
                    {loginErrorMessage !== "" && (
                        <p className="eventloop-login-error-message">
                            {loginErrorMessage}
                        </p>
                    )}
                </form>

                {/* Continue button placed outside the white login card. */}
                <button
                    /* Submits the login form even though it is outside the form card. */
                    form="eventloop-login-form"
                    /* Defines the button as a submit action for the login form. */
                    type="submit"
                    /* Applies the login continue button style. */
                    className="eventloop-login-submit-button"
                >
                    {/* Prints the button label. */}
                    Συνέχεια
                </button>
            </div>
        </section>
    );
}


