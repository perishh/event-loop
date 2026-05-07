"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";

/**
 * @brief  Renders the pending approval status content.
 * @return The JSX structure of the pending approval status
 */
export default function PendingStatus() {
  const router = useRouter();

  return (
    <section className="eventloop-pending-page-content">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Εγγραφή", href: "/register" },
        ]}
      />
      <h1 className="eventloop-pending-page-title">
        Αναμονή επιβεβαίωσης νέου λογαριασμού
      </h1>

      <div className="eventloop-pending-wrapper">
        <div className="eventloop-pending-card">
          <ul className="eventloop-pending-list">
            <li className="eventloop-pending-list-item">
              <span
                className="eventloop-pending-custom-bullet"
                aria-hidden="true"
              />

              <span className="eventloop-pending-list-item-content">
                Η εγγραφή σας υποβλήθηκε επιτυχώς. Η αίτησή σας εκκρεμεί έγκριση
                από τον διαχειριστή.
              </span>
            </li>

            <li className="eventloop-pending-list-item">
              <span
                className="eventloop-pending-custom-bullet"
                aria-hidden="true"
              />

              <span className="eventloop-pending-list-item-content">
                Μετά θα μπορείτε να εισέλθετε με το
                <span className="eventloop-pending-highlight-inline">
                  email
                </span>
                και τον
                <span className="eventloop-pending-highlight-inline">
                  κωδικό
                </span>
                σας.
              </span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => router.replace("/")}
          className="eventloop-pending-button"
        >
          Επιστροφή στην Αρχική σελίδα
        </button>
      </div>
    </section>
  );
}
