import { NextRequest, NextResponse } from "next/server";
import { getFilteredEvents } from "@/lib/events/filters";
import { EventType, UserRole } from "@/app/generated/prisma/enums";
import { getSession } from "@/lib/auth/session";
import { EventInputSchema } from "@/app/events/_form/schema";
import prisma from "@/lib/prisma";
import z from "zod";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const type = searchParams.get("type") as EventType | null;
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const city = searchParams.get("city");
  const categories = searchParams.get("categories");
  const priceFrom = searchParams.get("priceFrom");
  const priceTo = searchParams.get("priceTo");
  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  const events = await getFilteredEvents(
    {
      type: type && type in EventType ? (type as EventType) : null,
      dateFrom: dateFrom ? new Date(dateFrom) : null,
      dateTo: dateTo ? new Date(dateTo) : null,
      city: city || null,
      categories: categories ? JSON.parse(categories) : null,
      priceFrom: priceFrom ? parseFloat(priceFrom) : null,
      priceTo: priceTo ? parseFloat(priceTo) : null,
      query: query || null,
    },
    page,
    pageSize,
  );

  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Πρέπει να είστε συνδεδεμένος για να δημιουργήσετε εκδήλωση.",
      },
      { status: 401 },
    );
  }

  if (session.role !== UserRole.ORGANIZER) {
    return NextResponse.json(
      {
        success: false,
        message: "Μόνο διοργανωτές μπορούν να δημιουργήσουν εκδηλώσεις.",
      },
      { status: 403 },
    );
  }

  let rawInput: unknown;
  try {
    rawInput = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  const parsed = EventInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const input = parsed.data;

  const created = await prisma.event.create({
    data: {
      ...input,
      organizerId: session.sub,
      ticketTypes: {
        create: input.ticketTypes.map((ticketType) => ({
          name: ticketType.name,
          price: ticketType.price,
          quantity: ticketType.quantity,
          available: ticketType.quantity,
        })),
      },
    },
  });

  revalidatePath(`/events/${encodeURIComponent(created.id)}`);

  return NextResponse.json({ success: true, message: created.id });
}
