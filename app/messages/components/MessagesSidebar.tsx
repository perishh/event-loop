"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Inbox, Send, MessageSquare } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

type SectionKey = "inbox" | "sent" | "conv";

type Props = {
  inboxBadge: number;
  inbox: ReactNode;
  sent: ReactNode;
  conv: ReactNode;
};

export default function MessagesSidebar({
  inboxBadge,
  inbox,
  sent,
  conv,
}: Props) {
  // Each section opens/closes independently; several can be open at once.
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    inbox: false,
    sent: false,
    conv: false,
  });

  // Expanding a section only toggles visibility; messages are marked read
  // when their conversation is actually opened, so unread is tracked per
  // conversation and the inbox badge decrements one conversation at a time.
  const toggle = (key: SectionKey) => {
    setOpen((o) => ({ ...o, [key]: !o[key] }));
  };

  const headerClass = (isOpen: boolean) =>
    `flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium transition ${
      isOpen
        ? "bg-violet-100 text-violet-800"
        : "text-gray-700 hover:bg-violet-100"
    }`;

  return (
    <aside className="flex w-72 shrink-0 flex-col bg-violet-50">
      <Breadcrumb
        className="px-4 pt-4 pb-2"
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Μηνύματα", href: "/messages" },
        ]}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <button
          type="button"
          onClick={() => toggle("inbox")}
          className={headerClass(open.inbox)}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open.inbox ? "" : "-rotate-90"}`}
          />
          <Inbox className="h-4 w-4" />
          <span className="flex-1 text-left">Εισερχόμενα</span>
          {inboxBadge > 0 && (
            <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              +{inboxBadge}
            </span>
          )}
        </button>
        {open.inbox && inbox}

        <button
          type="button"
          onClick={() => toggle("sent")}
          className={headerClass(open.sent)}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open.sent ? "" : "-rotate-90"}`}
          />
          <Send className="h-4 w-4" />
          <span className="flex-1 text-left">Απεσταλμένα</span>
        </button>
        {open.sent && sent}

        <button
          type="button"
          onClick={() => toggle("conv")}
          className={headerClass(open.conv)}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open.conv ? "" : "-rotate-90"}`}
          />
          <MessageSquare className="h-4 w-4" />
          <span className="flex-1 text-left">Συζητήσεις</span>
        </button>
        {open.conv && conv}
      </div>
    </aside>
  );
}
