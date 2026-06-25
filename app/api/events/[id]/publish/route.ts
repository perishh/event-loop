import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EventStatus } from "@/app/generated/prisma/enums";
import { authorizeOwner } from "../../helpers";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const auth = await authorizeOwner(id);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 403 },
    );
  }

  if (auth.status !== EventStatus.DRAFT) {
    return NextResponse.json(
      {
        success: false,
        error: "Μόνο πρόχειρες εκδηλώσεις μπορούν να δημοσιευτούν.",
      },
      { status: 400 },
    );
  }

  await prisma.event.update({
    where: { id },
    data: { status: EventStatus.PUBLISHED },
  });

  return NextResponse.json({ success: true });
}
