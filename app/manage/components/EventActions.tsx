"use client";

import { useActionState } from "react";
import {
  publishEvent,
  cancelEvent,
  deleteEvent,
  type EventManageFormState,
} from "../actions";

const BTN_PRIMARY =
  "bg-violet-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-violet-600 disabled:opacity-50";
const BTN_SECONDARY =
  "border border-gray-300 text-gray-700 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50";
const BTN_DANGER =
  "border border-red-300 text-red-700 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50";

export default function EventActions({
  eventId,
  status,
  bookingCount,
}: {
  eventId: string;
  status: string;
  bookingCount: number;
}) {
  const [publishState, publishAction, publishPending] = useActionState<
    EventManageFormState,
    FormData
  >(publishEvent, null);
  const [cancelState, cancelAction, cancelPending] = useActionState<
    EventManageFormState,
    FormData
  >(cancelEvent, null);
  const [deleteState, deleteAction, deletePending] = useActionState<
    EventManageFormState,
    FormData
  >(deleteEvent, null);

  const error =
    (publishState && !publishState.success ? publishState.error : undefined) ??
    (cancelState && !cancelState.success ? cancelState.error : undefined) ??
    (deleteState && !deleteState.success ? deleteState.error : undefined);

  const showPublish = status === "DRAFT";
  const showCancel = status === "PUBLISHED";
  const showDelete =
    status === "DRAFT" || (status === "PUBLISHED" && bookingCount === 0);

  if (!showPublish && !showCancel && !showDelete) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {showPublish && (
        <form action={publishAction}>
          <input type="hidden" name="eventId" value={eventId} />
          <button
            type="submit"
            className={BTN_PRIMARY}
            disabled={publishPending}
          >
            {publishPending ? "Δημοσίευση..." : "Δημοσίευση"}
          </button>
        </form>
      )}

      {showCancel && (
        <form
          action={cancelAction}
          onSubmit={(e) => {
            if (
              !window.confirm(
                "Σίγουρα θέλετε να ακυρώσετε την εκδήλωση; Δεν θα επιτρέπονται νέες κρατήσεις, αλλά οι υπάρχουσες διατηρούνται.",
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="eventId" value={eventId} />
          <button
            type="submit"
            className={BTN_SECONDARY}
            disabled={cancelPending}
          >
            {cancelPending ? "Ακύρωση..." : "Ακύρωση"}
          </button>
        </form>
      )}

      {showDelete && (
        <form
          action={deleteAction}
          onSubmit={(e) => {
            if (
              !window.confirm(
                "Σίγουρα θέλετε να διαγράψετε οριστικά την εκδήλωση;",
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="eventId" value={eventId} />
          <button
            type="submit"
            className={BTN_DANGER}
            disabled={deletePending}
          >
            {deletePending ? "Διαγραφή..." : "Διαγραφή"}
          </button>
        </form>
      )}

      {error && (
        <p className="w-full text-right text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
