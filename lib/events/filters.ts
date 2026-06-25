import {
  EventCategory,
  EventStatus,
  EventType,
} from "@/app/generated/prisma/enums";
import prisma from "../prisma";

export type EventBrowseResult = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  categories: EventCategory[];
  venue: string;
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  startDateTime: Date;
  endDateTime: Date;
  capacity: number;
  status: EventStatus;
  updatedAt: Date;
  media: string[];
  organizerId: string;
};

export interface FilterParams {
  type: EventType | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  city: string | null;
  categories: EventCategory[] | null;
  priceFrom: number | null;
  priceTo: number | null;
  query: string | null;
}

export async function getFilteredEvents(
  params: FilterParams,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ events: EventBrowseResult[]; hasMore: boolean }> {
  const where: Record<string, unknown> = {
    status: EventStatus.PUBLISHED,
  };

  if (params.type) where.type = params.type;
  if (params.city) where.city = params.city;

  if (params.dateFrom) {
    where.startDateTime = { gte: params.dateFrom };
  }

  if (params.dateTo) {
    where.endDateTime = { lte: params.dateTo };
  }

  if (params.categories) {
    where.categories = { hasSome: params.categories };
  }

  if (params.priceFrom || params.priceTo) {
    where.ticketTypes = {
      ...(params.priceFrom
        ? { some: { price: { gte: params.priceFrom } } }
        : {}),
      ...(params.priceTo ? { some: { price: { lte: params.priceTo } } } : {}),
    };
  }

  if (params.query && params.query.trim() !== "") {
    const term = params.query.trim();
    where.OR = [
      { title: { contains: term } },
      { description: { contains: term } },
      { venue: { contains: term } },
      { address: { contains: term } },
      { city: { contains: term } },
    ];
  }

  const events = await prisma.event.findMany({
    where,
    take: pageSize + 1,
    skip: (page - 1) * pageSize,
    orderBy: {
      startDateTime: "asc",
    },
  });

  const hasMore = events.length > pageSize;
  if (hasMore) events.pop();

  return { events, hasMore };
}
