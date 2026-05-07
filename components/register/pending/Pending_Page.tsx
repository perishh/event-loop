"use client";

/*
 * =========================================================================
 * FILE         :   components/pending/Pending_Page.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Pending approval page content component.
 *                  Displays the temporary account approval message.
 * =========================================================================
 */


/* Imports the Next.js Link component for internal navigation. */
import Link from "next/link";

/* Imports the effect and state hooks used to read the temporary email. */
import { useEffect, useState } from "react";

/* Imports the shared breadcrumb component. */
import EventLoop_Breadcrumb from "../../breadcrumb/EventLoop_Breadcrumb";


/**
 * @brief  Renders the pending approval page content.
 * @return The JSX structure of the pending approval page content.
 */
export default function Pending_Page() {
    /* Stores the email shown on the pending approval page. */
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);

    /* Stores whether a pending email exists. */
    const pendingEmailExists = pendingEmail !== null && pendingEmail !== "";

    /* Stores whether the pending page is still loading. */
    const pendingPageIsLoading = pendingEmail === null;

    /* Reads the temporary pending email when the page loads. */
    useEffect(() => {
        /**
         * @brief Loads the temporary pending email from the server memory route.
         */
        async function loadPendingEmail() {
            try {
                /* Requests the latest temporary pending email. */
                const pendingEmailResponse = await fetch("/api/pending-email");

                /* Checks that the temporary email request succeeded. */
                if (!pendingEmailResponse.ok) {
                    /* Stores an empty value when the request fails. */
                    setPendingEmail("");

                    /* Stops if the temporary request failed. */
                    return;
                }

                /* Reads the response body as JSON. */
                const pendingEmailData = await pendingEmailResponse.json();

                /* Stores the returned pending email. */
                setPendingEmail(String(pendingEmailData.email ?? ""));
            } catch {
                /* Stores an empty value when the temporary request crashes. */
                setPendingEmail("");
            }
        }

        /* Loads the temporary pending email. */
        loadPendingEmail();
    }, []);

    /* Returns the visible pending approval page content. */
    return (
        /* Page content area below the shared header. */
        <section className="eventloop-pending-page-content">
            {/* Renders the pending page breadcrumb. */}
            <EventLoop_Breadcrumb
                /* Shows the current pending page location. */
                breadcrumbItems={[
                    { label: "Αρχική", href: "/" },
                    { label: "Εγγραφή", href: "/register" },
                    { label: "Αναμονή επιβεβαίωσης", href: "/register/pending" },
                ]}
            />
            
            {/* Greek pending approval page title. */}
            <h1 className="eventloop-pending-page-title">
                {pendingEmailExists
                    ? "Αναμονή επιβεβαίωσης νέου λογαριασμού:"
                    : "Δεν υπάρχει πρόσφατη αίτηση εγγραφής:"}
            </h1>

            {/* Pending approval message and action button wrapper. */}
            <div className="eventloop-pending-wrapper">
                {/* White card that contains the pending approval message. */}
                <div className="eventloop-pending-card">
                    {/* Pending approval message list. */}
                    <ul className="eventloop-pending-list">
                        {/* Shows a loading message while the temporary email is being checked. */}
                        {pendingPageIsLoading && (
                            <li className="eventloop-pending-list-item">
                                {/* Shows a custom large purple bullet. */}
                                <span className="eventloop-pending-custom-bullet" aria-hidden="true" />

                                {/* Shows the loading message text. */}
                                <span className="eventloop-pending-list-item-content">
                                    Γίνεται έλεγχος της πρόσφατης αίτησης εγγραφής.
                                </span>
                            </li>
                        )}

                        {/* Shows the normal pending approval message when an email exists. */}
                        {pendingEmailExists && (
                            <>
                                {/* First pending approval message. */}
                                <li className="eventloop-pending-list-item">
                                    {/* Shows a custom large purple bullet. */}
                                    <span className="eventloop-pending-custom-bullet" aria-hidden="true" />

                                    {/* Shows the first pending approval message text. */}
                                    <span className="eventloop-pending-list-item-content">
                                        Η εγγραφή σας υποβλήθηκε επιτυχώς. Η αίτησή σας εκκρεμεί έγκριση από τον διαχειριστή.
                                    </span>
                                </li>

                                {/* Second pending approval message. */}
                                <li className="eventloop-pending-list-item">
                                    {/* Shows a custom large purple bullet. */}
                                    <span className="eventloop-pending-custom-bullet" aria-hidden="true" />

                                    {/* Shows the second pending approval message text. */}
                                    <span className="eventloop-pending-list-item-content">
                                        Όταν ο λογαριασμός σας ενεργοποιηθεί θα ενημερωθείτε στο email:
                                        <span className="eventloop-pending-highlight">
                                            {pendingEmail}
                                        </span>
                                    </span>
                                </li>

                                {/* Third pending approval message. */}
                                <li className="eventloop-pending-list-item">
                                    {/* Shows a custom large purple bullet. */}
                                    <span className="eventloop-pending-custom-bullet" aria-hidden="true" />

                                    {/* Shows the third pending approval message text. */}
                                    <span className="eventloop-pending-list-item-content">
                                        Μετά θα μπορείτε να εισέλθετε με το
                                        <span className="eventloop-pending-highlight-inline">
                                            όνομα χρήστη
                                        </span>
                                        και τον
                                        <span className="eventloop-pending-highlight-inline">
                                            κωδικό
                                        </span>
                                        σας.
                                    </span>
                                </li>
                            </>
                        )}

                        {/* Shows fallback content when the page was opened without register flow. */}
                        {!pendingPageIsLoading && !pendingEmailExists && (
                            <>
                                {/* First fallback message. */}
                                <li className="eventloop-pending-list-item">
                                    {/* Shows a custom large purple bullet. */}
                                    <span className="eventloop-pending-custom-bullet" aria-hidden="true" />

                                    {/* Shows the first fallback message text. */}
                                    <span className="eventloop-pending-list-item-content">
                                        Δεν βρέθηκε πρόσφατη αίτηση εγγραφής για εμφάνιση.
                                    </span>
                                </li>

                                {/* Second fallback message. */}
                                <li className="eventloop-pending-list-item">
                                    {/* Shows a custom large purple bullet. */}
                                    <span className="eventloop-pending-custom-bullet" aria-hidden="true" />

                                    {/* Shows the second fallback message text. */}
                                    <span className="eventloop-pending-list-item-content">
                                        Για να εμφανιστεί μήνυμα αναμονής, πρέπει πρώτα να συμπληρωθεί επιτυχώς η φόρμα εγγραφής.
                                    </span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Link that sends the user to the correct page. */}
                <Link
                    href={pendingEmailExists ? "/" : "/register"}
                    className="eventloop-pending-button"
                >
                    {/* Prints the button label. */}
                    {pendingEmailExists
                        ? "Επιστροφή στην Αρχική σελίδα"
                        : "Μετάβαση στη σελίδα εγγραφής"}
                </Link>
            </div>
        </section>
    );
}


