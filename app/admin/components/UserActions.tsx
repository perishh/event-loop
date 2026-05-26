"use client";

import { useActionState } from "react";
import { approveUser, rejectUser, type UserActionFormState } from "../actions";

export default function UserActions({ userId }: { userId: string }) {
  const [approveState, approveAction, approvePending] = useActionState<
    UserActionFormState,
    FormData
  >(approveUser, null);

  const [rejectState, rejectAction, rejectPending] = useActionState<
    UserActionFormState,
    FormData
  >(rejectUser, null);

  // Prefer whichever action failed, to show its message.
  const error =
    (approveState && !approveState.success ? approveState.error : undefined) ??
    (rejectState && !rejectState.success ? rejectState.error : undefined);

  return (
    <div className="flex items-center gap-2 shrink-0">
      <form action={approveAction}>
        <input type="hidden" name="userId" value={userId} />
        <button
          type="submit"
          className="bg-violet-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-violet-600 disabled:opacity-50"
          disabled={approvePending}
        >
          {approvePending ? "Έγκριση..." : "Έγκριση"}
        </button>
      </form>

      <form
        action={rejectAction}
        onSubmit={(e) => {
          if (
            !window.confirm(
              "Σίγουρα θέλετε να απορρίψετε αυτόν τον χρήστη; Ο λογαριασμός θα διαγραφεί οριστικά."
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="userId" value={userId} />
        <button
          type="submit"
          className="border border-gray-300 text-gray-700 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          disabled={rejectPending}
        >
          {rejectPending ? "Απόρριψη..." : "Απόρριψη"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
