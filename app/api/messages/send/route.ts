import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { resolveParticipant } from "../helpers";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Πρέπει να είστε συνδεδεμένος." },
      { status: 401 },
    );
  }

  let rawInput: { conversationId?: string; body?: string };
  try {
    rawInput = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  const conversationId = rawInput.conversationId;
  const text = (rawInput.body ?? "").trim();

  if (typeof conversationId !== "string" || conversationId.length === 0) {
    return NextResponse.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  if (text.length === 0) {
    return NextResponse.json(
      { success: false, error: "Το μήνυμα είναι κενό." },
      { status: 400 },
    );
  }

  const participant = await resolveParticipant(conversationId, session.sub);
  if (!participant.ok) {
    return NextResponse.json(
      { success: false, error: participant.error },
      { status: 403 },
    );
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { messages: { create: { body: text, senderId: session.sub } } },
  });

  return NextResponse.json({ success: true });
}
