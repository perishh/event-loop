"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { deleteConversationForMe } from "../actions";

export default function ConversationActions({
  conversationId,
}: {
  conversationId: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const handleDelete = () => {
    setOpen(false);
    if (
      !window.confirm("Διαγραφή ολόκληρης της συνομιλίας από τη δική σας προβολή;")
    ) {
      return;
    }
    void deleteConversationForMe(conversationId);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Επιλογές συνομιλίας"
        className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-7 z-20 w-48 overflow-hidden rounded-lg border border-violet-100 bg-white py-1 shadow-lg shadow-violet-200/50">
          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Διαγραφή συνομιλίας
          </button>
        </div>
      )}
    </div>
  );
}
