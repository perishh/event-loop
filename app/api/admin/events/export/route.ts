import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { EventStatus, UserRole } from "@/app/generated/prisma/enums";

type ExportTicketType = {
  ticketTypeId: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
};

type ExportBooking = {
  bookingId: string;
  attendee: string;
  time: string;
  ticketTypeRef: string;
  numberOfTickets: number;
  totalCost: number;
  bookingStatus: string;
};

type ExportEvent = {
  eventId: string;
  title: string;
  categories: string[];
  eventType: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  geoLocation: { latitude: number; longitude: number } | null;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  ticketTypes: ExportTicketType[];
  bookings: ExportBooking[];
  organizer: string;
  status: string;
  description: string;
  media: string[];
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toXml(events: ExportEvent[]): string {
  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', "<Events>"];

  for (const e of events) {
    lines.push(`  <Event EventID="${escapeXml(e.eventId)}">`);
    lines.push(`    <Title>${escapeXml(e.title)}</Title>`);
    for (const category of e.categories) {
      lines.push(`    <Category>${escapeXml(category)}</Category>`);
    }
    lines.push(`    <EventType>${escapeXml(e.eventType)}</EventType>`);
    lines.push(`    <Venue>${escapeXml(e.venue)}</Venue>`);
    lines.push(`    <Address>${escapeXml(e.address)}</Address>`);
    lines.push(`    <City>${escapeXml(e.city)}</City>`);
    lines.push(`    <Country>${escapeXml(e.country)}</Country>`);
    if (e.geoLocation) {
      lines.push(
        `    <GeoLocation Latitude="${e.geoLocation.latitude}" Longitude="${e.geoLocation.longitude}"/>`,
      );
    }
    lines.push(`    <StartDateTime>${e.startDateTime}</StartDateTime>`);
    lines.push(`    <EndDateTime>${e.endDateTime}</EndDateTime>`);
    lines.push(`    <Capacity>${e.capacity}</Capacity>`);

    lines.push(`    <TicketTypes>`);
    for (const ticket of e.ticketTypes) {
      lines.push(`      <TicketType TicketTypeID="${escapeXml(ticket.ticketTypeId)}">`);
      lines.push(`        <Name>${escapeXml(ticket.name)}</Name>`);
      lines.push(`        <Price>${ticket.price}</Price>`);
      lines.push(`        <Quantity>${ticket.quantity}</Quantity>`);
      lines.push(`        <Available>${ticket.available}</Available>`);
      lines.push(`      </TicketType>`);
    }
    lines.push(`    </TicketTypes>`);

    lines.push(`    <Bookings>`);
    for (const booking of e.bookings) {
      lines.push(`      <Booking BookingID="${escapeXml(booking.bookingId)}">`);
      lines.push(`        <Attendee UserID="${escapeXml(booking.attendee)}"/>`);
      lines.push(`        <Time>${booking.time}</Time>`);
      lines.push(`        <TicketTypeRef>${escapeXml(booking.ticketTypeRef)}</TicketTypeRef>`);
      lines.push(`        <NumberOfTickets>${booking.numberOfTickets}</NumberOfTickets>`);
      lines.push(`        <TotalCost>${booking.totalCost}</TotalCost>`);
      lines.push(`        <BookingStatus>${escapeXml(booking.bookingStatus)}</BookingStatus>`);
      lines.push(`      </Booking>`);
    }
    lines.push(`    </Bookings>`);

    lines.push(`    <Organizer UserID="${escapeXml(e.organizer)}"/>`);
    lines.push(`    <Status>${escapeXml(e.status)}</Status>`);
    lines.push(`    <Description>${escapeXml(e.description)}</Description>`);

    if (e.media.length > 0) {
      lines.push(`    <Media>`);
      for (const photo of e.media) {
        lines.push(`      <Photo>${escapeXml(photo)}</Photo>`);
      }
      lines.push(`    </Media>`);
    }

    lines.push(`  </Event>`);
  }

  lines.push("</Events>");
  return lines.join("\n");
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const format =
    request.nextUrl.searchParams.get("format") === "json" ? "json" : "xml";

  const events = await prisma.event.findMany({
    orderBy: { startDateTime: "asc" },
    include: {
      organizer: { select: { username: true } },
      ticketTypes: {
        include: {
          bookings: { include: { attendee: { select: { username: true } } } },
        },
      },
    },
  });

  const now = new Date();
  const normalized: ExportEvent[] = events.map((e) => {
    const status =
      e.status === EventStatus.PUBLISHED && e.endDateTime < now
        ? "COMPLETED"
        : e.status;

    const bookings: ExportBooking[] = e.ticketTypes.flatMap((ticket) =>
      ticket.bookings.map((booking) => ({
        bookingId: booking.id,
        attendee: booking.attendee.username,
        time: booking.time.toISOString(),
        ticketTypeRef: String(booking.ticketTypeId),
        numberOfTickets: booking.numberOfTickets,
        totalCost: booking.totalCost,
        bookingStatus: booking.status,
      })),
    );

    return {
      eventId: e.id,
      title: e.title,
      categories: e.categories,
      eventType: e.type,
      venue: e.venue,
      address: e.address,
      city: e.city,
      country: e.country,
      geoLocation:
        e.latitude != null && e.longitude != null
          ? { latitude: e.latitude, longitude: e.longitude }
          : null,
      startDateTime: e.startDateTime.toISOString(),
      endDateTime: e.endDateTime.toISOString(),
      capacity: e.capacity,
      ticketTypes: e.ticketTypes.map((ticket) => ({
        ticketTypeId: String(ticket.id),
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.quantity,
        available: ticket.available,
      })),
      bookings,
      organizer: e.organizer.username,
      status,
      description: e.description,
      media: e.media,
    };
  });

  if (format === "json") {
    return new NextResponse(JSON.stringify({ events: normalized }, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="events.json"',
      },
    });
  }

  return new NextResponse(toXml(normalized), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": 'attachment; filename="events.xml"',
    },
  });
}
