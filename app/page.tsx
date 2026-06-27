import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { inference } from "@/lib/recommendation/inference";
import Hero from "./components/Hero";
import PopularEventsCarousel from "./components/PopularEventsCarousel";
import RecommendedEventsCarousel from "./components/RecommendedEventsCarousel";
import { EventStatus } from "./generated/prisma/enums";


export default async function Page() {
  // Most Booked (primary), Most Visited (secondary)

  const mostBookedIds = await prisma.booking.groupBy({
    by: ["ticketTypeId"],
    where: {
      ticketType: {
        event: {
          status: EventStatus.PUBLISHED,
          endDateTime: {
            gte: new Date(),
          },
        },
      },
    },
    _count: {
      ticketTypeId: true,
    },
    orderBy: {
      _count: {
        ticketTypeId: "desc",
      },
    },
  });

  const featuringEvents = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      media: true,
      startDateTime: true,
      venue: true,
      city: true,
      type: true,
    },
    where: {
      status: EventStatus.PUBLISHED,
      endDateTime: {
        gte: new Date(),
      },
      ticketTypes: {
        some: {
          id: {
            in: mostBookedIds.map((x) => x.ticketTypeId),
          },
        },
      },
    },
    orderBy: {
      eventVisits: {
        _count: "desc",
      },
    },
    take: 5,
  });

  // Most Visited
  const popularEvents = await prisma.event.findMany({
    where: {
      status: EventStatus.PUBLISHED,
      endDateTime: {
        gte: new Date(),
      },
      eventVisits: {
        some: {
          visitedAt: {
            // Last 7 days
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
    },
    orderBy: {
      eventVisits: {
        _count: "desc",
      },
    },
    take: 10,
  });

  if (popularEvents.length < 10) {
    const additionalEvents = await prisma.event.findMany({
      where: {
        id: {
          notIn: popularEvents.map((event) => event.id),
        },
        status: EventStatus.PUBLISHED,
        endDateTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        eventVisits: {
          _count: "desc",
        },
      },
      take: 10 - popularEvents.length,
    });

    popularEvents.push(...additionalEvents);
  }

  // Recommended events (personalised)
  const session = await getSession();
  let recommendedEvents: typeof popularEvents = [];

  if (session) {
    const recommendedIds = await inference(session.sub, 10);

    if (recommendedIds.length > 0) {
      recommendedEvents = await prisma.event.findMany({
        where: {
          id: { in: recommendedIds },
          status: EventStatus.PUBLISHED,
          endDateTime: { gte: new Date() },
        },
        orderBy: {
          eventVisits: {
            _count: "desc",
          },
        },
      });
    }
  }

  return (
    <main className="eventloop-main-page">
      <section className="eventloop-welcome-page-content">
        <Hero
          events={featuringEvents.map((x) => ({
            id: x.id,
            title: x.title,
            image: x.media[0],
            startDateTime: x.startDateTime,
            venue: x.venue,
            city: x.city,
            type: x.type,
          }))}
        />
        {recommendedEvents.length > 0 && (
          <RecommendedEventsCarousel
            events={recommendedEvents.map((x) => ({
              city: x.city,
              country: x.country,
              id: x.id,
              image: x.media[0] || null,
              startDateTime: x.startDateTime,
              title: x.title,
              type: x.type,
              venue: x.venue,
            }))}
          />
        )}
        <PopularEventsCarousel
          events={popularEvents.map((x) => ({
            city: x.city,
            country: x.country,
            id: x.id,
            image: x.media[0] || null,
            startDateTime: x.startDateTime,
            title: x.title,
            type: x.type,
            venue: x.venue,
          }))}
        />
      </section>
    </main>
  );
}
