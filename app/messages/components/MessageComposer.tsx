"use client";

import { useState, useRef, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MessageComposer({
  conversationId,
}: {
  conversationId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = (formData.get("body") as string) ?? "";

    if (!body.trim()) {
      setError("Το μήνυμα είναι κενό.");
      return;
    }

    setPending(true);

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, body: body.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Αποτυχία αποστολής.");
        return;
      }

      formRef.current?.reset();
      inputRef.current?.focus();

      router.refresh();
    } catch {
      setError("Σφάλμα δικτύου.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-violet-100 p-3"
    >
      <div className="flex gap-2">
        <input
          ref={inputRef}
          name="body"
          autoComplete="off"
          placeholder="Γράψτε μήνυμα..."
          className="flex-1 rounded-full border border-violet-200 px-4 py-2 text-sm text-gray-800 outline-none focus:border-violet-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white transition hover:bg-violet-600 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-1 px-2 text-xs text-red-600">{error}</p>}
    </form>
  );
}
