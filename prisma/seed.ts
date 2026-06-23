import "dotenv/config";
import { hash } from "bcryptjs";
import prisma from "../lib/prisma";
import {
  UserRole,
  EventType,
  EventCategory,
  EventStatus,
  BookingStatus,
} from "../app/generated/prisma/enums";

const SEED_USERS = [
  {
    firstName: "System",
    lastName: "Admin",
    username: "admin",
    email: "admin@eventloop.local",
    password: "admin1234",
    role: UserRole.ADMIN,
    afm: "000000000",
  },
  {
    firstName: "Test",
    lastName: "Attendee",
    username: "user",
    email: "user@eventloop.local",
    password: "user1234",
    role: UserRole.ATTENDEE,
    afm: "000000001",
  },
  {
    firstName: "Test",
    lastName: "Organizer",
    username: "organizer",
    email: "organizer@eventloop.local",
    password: "organizer1234",
    role: UserRole.ORGANIZER,
    afm: "000000002",
  },
];

const DEMO_EVENT_ID = "e856abb6-8990-4fc5-ae4e-0479c46022a3";

async function main() {
  let organizerId: string | null = null;
  let attendeeId: string | null = null;

  for (const u of SEED_USERS) {
    const hashedPassword = await hash(u.password, 12);

    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        firstName: u.firstName,
        lastName: u.lastName,
        username: u.username,
        email: u.email,
        hash: hashedPassword,
        role: u.role,
        afm: u.afm,
        area: "-",
        city: "-",
        country: "-",
        approved: true,
      },
    });

    if (u.role === UserRole.ORGANIZER) {
      organizerId = user.id;
    }
    if (u.role === UserRole.ATTENDEE) {
      attendeeId = user.id;
    }

    console.log(`Seeded account: ${u.username} (${u.role}).`);
  }

  if (organizerId && attendeeId) {
    const existingEvent = await prisma.event.findUnique({
      where: { id: DEMO_EVENT_ID },
    });

    if (!existingEvent) {
      // PUBLISHED event. Holds the attendee's CONFIRMED (VIP) and PENDING
      // (General) bookings, so its ticket availability is decremented to match.
      const demo = await prisma.event.create({
        data: {
          id: DEMO_EVENT_ID,
          title: "Demo Tech Conference 2026",
          description:
            "A sample event seeded for testing the media carousel, map and ticket display. Edit or delete it freely.",
          type: EventType.CONFERENCE,
          categories: [
            EventCategory.TECH_IT,
            EventCategory.PROFESSIONAL_DEVELOPMENT,
          ],
          venue: "Athens Conference Center",
          address: "Vasilissis Sofias Avenue 1",
          city: "Athens",
          country: "Greece",
          latitude: 37.9838,
          longitude: 23.7275,
          startDateTime: new Date("2026-09-15T09:00:00Z"),
          endDateTime: new Date("2026-09-15T18:00:00Z"),
          capacity: 200,
          status: EventStatus.PUBLISHED,
          media: [
            "https://images.unsplash.com/photo-1762968274962-20c12e6e8ecd?w=1600&h=700&fit=crop&auto=format&q=80",
            "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&h=1000&fit=crop&auto=format&q=80",
          ],
          organizerId,
          ticketTypes: {
            create: [
              {
                name: "General Admission",
                price: 20,
                quantity: 150,
                available: 148,
              },
              { name: "VIP", price: 50, quantity: 50, available: 49 },
            ],
          },
        },
        include: { ticketTypes: true },
      });

      const demoGeneral = demo.ticketTypes.find(
        (t) => t.name === "General Admission",
      )!;
      const demoVip = demo.ticketTypes.find((t) => t.name === "VIP")!;

      // DRAFT event (not published yet).
      await prisma.event.create({
        data: {
          title: "React Programming Workshop",
          description:
            "Hands-on workshop covering modern React patterns. Still a draft.",
          type: EventType.WORKSHOP,
          categories: [EventCategory.TECH_IT, EventCategory.SKILL_BUILDING],
          venue: "Innovation Hub",
          address: "Tsimiski 100",
          city: "Thessaloniki",
          country: "Greece",
          startDateTime: new Date("2026-11-10T10:00:00Z"),
          endDateTime: new Date("2026-11-10T16:00:00Z"),
          capacity: 80,
          status: EventStatus.DRAFT,
          media: [],
          organizerId,
          ticketTypes: {
            create: [
              {
                name: "General Admission",
                price: 15,
                quantity: 80,
                available: 80,
              },
            ],
          },
        },
      });

      // CANCELLED event. Hosts the attendee's PENDING/CONFIRMED/CANCELLED
      // bookings; the two active ones were placed before cancellation, so they
      // still consume availability (cancelled ones do not).
      const jazz = await prisma.event.create({
        data: {
          title: "Jazz Night",
          description: "An evening of live jazz. This event was cancelled.",
          type: EventType.CONCERT,
          categories: [EventCategory.LIVE_MUSIC],
          venue: "Patras Open Theater",
          address: "Riga Fereou 5",
          city: "Patras",
          country: "Greece",
          startDateTime: new Date("2026-10-03T20:00:00Z"),
          endDateTime: new Date("2026-10-03T23:00:00Z"),
          capacity: 100,
          status: EventStatus.CANCELLED,
          media: [],
          organizerId,
          ticketTypes: {
            create: [
              {
                name: "General Admission",
                price: 25,
                quantity: 100,
                available: 98,
              },
            ],
          },
        },
        include: { ticketTypes: true },
      });

      const jazzGeneral = jazz.ticketTypes[0];

      // Past PUBLISHED event; shown as completed, derived from the end date.
      // Hosts the attendee's PENDING/CONFIRMED/CANCELLED bookings.
      const food = await prisma.event.create({
        data: {
          title: "Food Festival 2025",
          description: "A past food festival with dozens of vendors.",
          type: EventType.FESTIVAL,
          categories: [EventCategory.FOOD_DRINK],
          venue: "Zappeion",
          address: "Vasilissis Olgas Avenue",
          city: "Athens",
          country: "Greece",
          startDateTime: new Date("2025-05-20T11:00:00Z"),
          endDateTime: new Date("2025-05-20T22:00:00Z"),
          capacity: 300,
          status: EventStatus.PUBLISHED,
          media: [],
          organizerId,
          ticketTypes: {
            create: [
              {
                name: "General Admission",
                price: 10,
                quantity: 300,
                available: 298,
              },
            ],
          },
        },
        include: { ticketTypes: true },
      });

      const foodGeneral = food.ticketTypes[0];

      // PUBLISHED event with NO bookings. On /manage this is the only state
      // where a published event can still be deleted, so it shows both
      // "Ακύρωση" and "Διαγραφή".
      await prisma.event.create({
        data: {
          title: "City Basketball Tournament",
          description: "A published event that has no bookings yet.",
          type: EventType.SPORTS,
          categories: [EventCategory.TOURNAMENT],
          venue: "Athens Indoor Arena",
          address: "Leoforos Mesogeion 200",
          city: "Athens",
          country: "Greece",
          latitude: 38.0006,
          longitude: 23.7826,
          startDateTime: new Date("2026-12-05T18:00:00Z"),
          endDateTime: new Date("2026-12-05T21:00:00Z"),
          capacity: 120,
          status: EventStatus.PUBLISHED,
          media: [],
          organizerId,
          ticketTypes: {
            create: [
              {
                name: "General Admission",
                price: 12,
                quantity: 120,
                available: 120,
              },
            ],
          },
        },
      });

      // Attendee bookings: every booking status (PENDING/CONFIRMED/CANCELLED)
      // across a PUBLISHED, a past PUBLISHED and a CANCELLED event, so /bookings
      // shows every combination of the two tags. CONFIRMED rows also expose
      // the "message the organizer" button.
      await prisma.booking.createMany({
        data: [
          // PUBLISHED event (Demo Tech Conference).
          {
            ticketTypeId: demoVip.id,
            attendeeId,
            numberOfTickets: 1,
            totalCost: demoVip.price * 1,
            status: BookingStatus.CONFIRMED,
            time: new Date("2026-06-01T10:00:00Z"),
          },
          {
            ticketTypeId: demoGeneral.id,
            attendeeId,
            numberOfTickets: 2,
            totalCost: demoGeneral.price * 2,
            status: BookingStatus.PENDING,
            time: new Date("2026-06-10T14:00:00Z"),
          },
          {
            ticketTypeId: demoGeneral.id,
            attendeeId,
            numberOfTickets: 1,
            totalCost: demoGeneral.price * 1,
            status: BookingStatus.CANCELLED,
            time: new Date("2026-06-11T09:00:00Z"),
          },
          // Past published event (Food Festival).
          {
            ticketTypeId: foodGeneral.id,
            attendeeId,
            numberOfTickets: 1,
            totalCost: foodGeneral.price * 1,
            status: BookingStatus.CONFIRMED,
            time: new Date("2025-05-01T10:00:00Z"),
          },
          {
            ticketTypeId: foodGeneral.id,
            attendeeId,
            numberOfTickets: 1,
            totalCost: foodGeneral.price * 1,
            status: BookingStatus.PENDING,
            time: new Date("2025-05-02T10:00:00Z"),
          },
          {
            ticketTypeId: foodGeneral.id,
            attendeeId,
            numberOfTickets: 1,
            totalCost: foodGeneral.price * 1,
            status: BookingStatus.CANCELLED,
            time: new Date("2025-05-03T10:00:00Z"),
          },
          // CANCELLED event (Jazz Night).
          {
            ticketTypeId: jazzGeneral.id,
            attendeeId,
            numberOfTickets: 1,
            totalCost: jazzGeneral.price * 1,
            status: BookingStatus.CONFIRMED,
            time: new Date("2026-06-04T12:00:00Z"),
          },
          {
            ticketTypeId: jazzGeneral.id,
            attendeeId,
            numberOfTickets: 1,
            totalCost: jazzGeneral.price * 1,
            status: BookingStatus.PENDING,
            time: new Date("2026-06-05T12:00:00Z"),
          },
          {
            ticketTypeId: jazzGeneral.id,
            attendeeId,
            numberOfTickets: 1,
            totalCost: jazzGeneral.price * 1,
            status: BookingStatus.CANCELLED,
            time: new Date("2026-06-06T12:00:00Z"),
          },
        ],
      });

      // Demo conversation (organizer <-> attendee) on the published demo event.
      // Greek demo messages; the last two are left unread so the organizer sees
      // an unread indicator, and the longer thread lets us test chat scrolling.
      await prisma.conversation.create({
        data: {
          eventId: demo.id,
          attendeeId,
          messages: {
            create: [
              { body: "Γεια σας! Έκλεισα ένα εισιτήριο VIP για το συνέδριο.", senderId: attendeeId, read: true, createdAt: new Date("2026-06-15T10:00:00Z") },
              { body: "Καλησπέρα! Σας ευχαριστούμε για την κράτηση. Πώς μπορώ να βοηθήσω;", senderId: organizerId, read: true, createdAt: new Date("2026-06-15T10:02:00Z") },
              { body: "Ήθελα να ρωτήσω αν υπάρχει διαθέσιμη θέση στάθμευσης στον χώρο.", senderId: attendeeId, read: true, createdAt: new Date("2026-06-15T10:05:00Z") },
              { body: "Ναι, υπάρχει δωρεάν πάρκινγκ για τους κατόχους εισιτηρίων VIP.", senderId: organizerId, read: true, createdAt: new Date("2026-06-15T10:06:00Z") },
              { body: "Τέλεια! Και τι ώρα ανοίγουν οι πόρτες;", senderId: attendeeId, read: true, createdAt: new Date("2026-06-15T10:08:00Z") },
              { body: "Οι πόρτες ανοίγουν στις 08:30, μισή ώρα πριν την έναρξη.", senderId: organizerId, read: true, createdAt: new Date("2026-06-15T10:09:00Z") },
              { body: "Ωραία. Θα υπάρχει διάλειμμα για καφέ;", senderId: attendeeId, read: true, createdAt: new Date("2026-06-15T10:11:00Z") },
              { body: "Βεβαίως, υπάρχουν δύο διαλείμματα με ελαφρύ μπουφέ για τους VIP.", senderId: organizerId, read: true, createdAt: new Date("2026-06-15T10:12:00Z") },
              { body: "Πολύ ωραία, ανυπομονώ!", senderId: attendeeId, read: true, createdAt: new Date("2026-06-15T10:15:00Z") },
              { body: "Κι εμείς! Θα λάβετε email με το αναλυτικό πρόγραμμα λίγες μέρες πριν.", senderId: organizerId, read: true, createdAt: new Date("2026-06-15T10:16:00Z") },
              { body: "Μια τελευταία ερώτηση: μπορώ να φέρω κι έναν συνάδελφο;", senderId: attendeeId, read: false, createdAt: new Date("2026-06-15T10:20:00Z") },
              { body: "Αν χρειάζεται, μπορώ να κλείσω κι άλλο εισιτήριο.", senderId: attendeeId, read: false, createdAt: new Date("2026-06-15T10:21:00Z") },
            ],
          },
        },
      });

      console.log("Seeded a demo conversation (organizer <-> attendee).");

      console.log(
        "Seeded 5 events covering every /manage action state (DRAFT, PUBLISHED with/without bookings, past PUBLISHED, CANCELLED) and 9 attendee bookings covering every booking-status x event-status combination for /bookings.",
      );
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
