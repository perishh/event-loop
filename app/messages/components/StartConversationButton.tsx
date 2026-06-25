"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

export default function StartConversationButton({
  eventId,
  children,
  className,
}: {
  eventId: string;
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/messages/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Αποτυχία έναρξης συνομιλίας.");
      return;
    }

    const data = await res.json();
    router.push(`/messages?c=${data.conversationId}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="eventId" value={eventId} />
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
