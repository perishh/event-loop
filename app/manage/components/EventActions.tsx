"use client";

import { useState } from "react";
import AsyncButton from "@/components/AsyncButton";
import { EventStatus } from "@/app/generated/prisma/enums";
import { useRouter } from "next/navigation";

type ActionType = "publish" | "cancel" | "delete";

export default function EventActions({
  eventId,
  status,
  bookingCount,
}: {
  eventId: string;
  status: EventStatus;
  bookingCount: number;
}) {
  const router = useRouter();
  const [action, setAction] = useState<ActionType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showPublish = status === EventStatus.DRAFT;
  const showCancel = status === EventStatus.PUBLISHED;
  const showDelete =
    status === EventStatus.DRAFT ||
    (status === EventStatus.PUBLISHED && bookingCount === 0);

  if (!showPublish && !showCancel && !showDelete) {
    return null;
  }

  const performAction = async (actionType: ActionType) => {
    setAction(actionType);
    setError(null);
    try {
      const res = await fetch(
        `/api/events/${encodeURIComponent(eventId)}/${actionType}`,
        { method: "POST" },
      );
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        setError(data.error ?? "Σφάλμα κατά την εκτέλεση της ενέργειας.");
        setAction(null);
      }
    } catch {
      setError("Σφάλμα επικοινωνίας με τον διακομιστή.");
      setAction(null);
    }
  };

  const handlePublish = () => performAction("publish");
  const handleCancel = () => {
    if (
      window.confirm(
        "Σίγουρα θέλετε να ακυρώσετε την εκδήλωση; Δεν θα επιτρέπονται νέες κρατήσεις, αλλά οι υπάρχουσες διατηρούνται.",
      )
    ) {
      performAction("cancel");
    }
  };
  const handleDelete = () => {
    if (window.confirm("Σίγουρα θέλετε να διαγράψετε οριστικά την εκδήλωση;")) {
      performAction("delete");
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {showPublish && (
        <AsyncButton
          type="button"
          label="Δημοσίευση"
          loading={action === "publish"}
          disabled={action !== null}
          theme="primary"
          onClick={handlePublish}
        />
      )}

      {showCancel && (
        <AsyncButton
          type="button"
          label="Ακύρωση"
          loading={action === "cancel"}
          disabled={action !== null}
          theme="secondary"
          onClick={handleCancel}
        />
      )}

      {showDelete && (
        <AsyncButton
          type="button"
          label="Διαγραφή"
          loading={action === "delete"}
          disabled={action !== null}
          theme="secondary"
          onClick={handleDelete}
          className="ring-red-300! text-red-700! hover:bg-red-50!"
        />
      )}

      {error && (
        <p className="w-full text-right text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
