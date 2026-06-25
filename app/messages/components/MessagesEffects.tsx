"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  conversationId: string | null;
  highlightMessageId: string | null;
};

export default function MessagesEffects({
  conversationId,
  highlightMessageId,
}: Props) {
  const router = useRouter();

  // Mark the open conversation's received messages as read.
  useEffect(() => {
    if (!conversationId) return;
    fetch("/api/messages/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId }),
    })
      .catch(() => {})
      .then(() => {
        router.refresh();
      });
  }, [conversationId, router]);

  // Scroll the message picked from Inbox/Sent into view.
  useEffect(() => {
    if (!highlightMessageId) return;
    const el = document.getElementById(`msg-${highlightMessageId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightMessageId]);

  return null;
}
