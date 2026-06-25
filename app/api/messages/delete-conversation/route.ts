import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { resolveParticipant } from "../helpers";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawInput: { conversationId?: string };
  try {
    rawInput = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  const conversationId = rawInput.conversationId;
  if (typeof conversationId !== "string" || conversationId.length === 0) {
    return NextResponse.json(
      { success: false, error: "Μη έγκυρο αίτημα." },
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

  await prisma.message.updateMany({
    where: { conversationId },
    data: participant.isAttendee
      ? { hiddenByAttendee: true }
      : { hiddenByOrganizer: true },
  });

  return NextResponse.json({ success: true });
}
