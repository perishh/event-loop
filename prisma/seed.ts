import "dotenv/config";

import usersData from "./dataset/users.json";
import eventsData from "./dataset/events.json";
import ticketTypesData from "./dataset/ticket_types.json";
import bookingsData from "./dataset/bookings.json";
import conversationsData from "./dataset/conversations.json";
import messagesData from "./dataset/messages.json";
import {
  BookingCreateManyInput,
  EventCreateManyInput,
  UserCreateManyInput,
} from "@/app/generated/prisma/models";
import prisma from "@/lib/prisma";
import {
  BookingStatus,
  EventCategory,
  EventStatus,
  EventType,
  UserRole,
} from "@/app/generated/prisma/enums";

async function main() {
  console.log("Seeding database...");

  const ticketBookingsCount: Record<number, number> = {};
  for (const booking of bookingsData) {
    ticketBookingsCount[booking.ticketTypeId] =
      (ticketBookingsCount[booking.ticketTypeId] ?? 0) +
      booking.numberOfTickets;
  }

  const users: UserCreateManyInput[] = usersData.map((u) => ({
    ...u,
    role: u.role as UserRole,
    afm: String(u.afm),
  }));

  const events: EventCreateManyInput[] = eventsData.map((e) => ({
    ...e,
    type: e.type as EventType,
    categories: e.categories.map((x) => x as EventCategory),
    status: e.status as EventStatus,
  }));

  const bookings: BookingCreateManyInput[] = bookingsData.map((b) => ({
    ...b,
    status: b.status as BookingStatus,
  }));

  console.log("Clearing existing data...");
  await prisma.recommendationModel.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.eventTickets.deleteMany();
  await prisma.eventVisit.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log(`Inserting ${users.length} users...`);
  await prisma.user.createMany({ data: users });

  console.log(`Inserting ${events.length} events...`);
  await prisma.event.createMany({ data: events });

  console.log(`Inserting ${ticketTypesData.length} ticket types...`);
  await prisma.eventTickets.createMany({ data: ticketTypesData });

  console.log(`Inserting ${bookings.length} bookings...`);
  await prisma.booking.createMany({ data: bookings });

  console.log(`Inserting ${conversationsData.length} conversations...`);
  await prisma.conversation.createMany({ data: conversationsData });

  console.log(`Inserting ${messagesData.length} messages...`);
  await prisma.message.createMany({ data: messagesData });

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
