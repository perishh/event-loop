"use client";

import { useEffect } from "react";
import { markConversationRead } from "../actions";

type Props = {
  conversationId: string | null;
  highlightMessageId: string | null;
};

export default function MessagesEffects({
  conversationId,
  highlightMessageId,
}: Props) {
  // Mark the open conversation's received messages as read.
  useEffect(() => {
    if (conversationId) void markConversationRead(conversationId);
  }, [conversationId]);

  // Scroll the message picked from Inbox/Sent into view.
  useEffect(() => {
    if (!highlightMessageId) return;
    const el = document.getElementById(`msg-${highlightMessageId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightMessageId]);

  return null;
}
