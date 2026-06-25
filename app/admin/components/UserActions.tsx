"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AsyncButton from "@/components/AsyncButton";

export default function UserActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [approvePending, setApprovePending] = useState(false);
  const [rejectPending, setRejectPending] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const approve = async () => {
    if (approvePending) return;
    setApprovePending(true);
    setError(undefined);

    const res = await fetch("/api/admin/users/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Σφάλμα κατά την έγκριση.");
      setApprovePending(false);
      return;
    }

    router.refresh();
  };

  const reject = async () => {
    if (rejectPending) return;
    if (
      !window.confirm(
        "Σίγουρα θέλετε να απορρίψετε αυτόν τον χρήστη; Ο λογαριασμός θα διαγραφεί οριστικά.",
      )
    ) {
      return;
    }

    setRejectPending(true);
    setError(undefined);

    const res = await fetch("/api/admin/users/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Σφάλμα κατά την απόρριψη.");
      setRejectPending(false);
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <AsyncButton
        label="Έγκριση"
        loading={approvePending}
        theme="primary"
        onClick={approve}
      />

      <AsyncButton
        label="Απόρριψη"
        loading={rejectPending}
        theme="secondary"
        onClick={reject}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
