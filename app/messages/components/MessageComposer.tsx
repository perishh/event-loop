"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { sendMessage, type MessageFormState } from "../actions";

export default function MessageComposer({
  conversationId,
}: {
  conversationId: string;
}) {
  const [state, formAction, pending] = useActionState<
    MessageFormState,
    FormData
  >(sendMessage, null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear the field after a successful send and keep focus for the next message.
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="shrink-0 border-t border-violet-100 p-3"
    >
      <div className="flex gap-2">
        <input type="hidden" name="conversationId" defaultValue={conversationId} />
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
      {state && !state.success && (
        <p className="mt-1 px-2 text-xs text-red-600">{state.error}</p>
      )}
    </form>
  );
}
