"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MessageActions({
  messageId,
  align = "left",
}: {
  messageId: string;
  align?: "left" | "right";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside of it.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleDelete = async () => {
    setOpen(false);
    if (!window.confirm("Διαγραφή του μηνύματος από τη δική σας προβολή;")) {
      return;
    }
    await fetch("/api/messages/delete-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    });
    router.refresh();
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Επιλογές μηνύματος"
        className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div
          className={`absolute top-7 z-20 w-44 overflow-hidden rounded-lg border border-violet-100 bg-white py-1 shadow-lg shadow-violet-200/50 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Διαγραφή για εσάς
          </button>
        </div>
      )}
    </div>
  );
}
