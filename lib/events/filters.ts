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
  const now = new Date();
  const where: Record<string, unknown> = {
    status: EventStatus.PUBLISHED,
    endDateTime: { gte: now },
  };

  if (params.type) where.type = params.type;
  if (params.city) where.city = params.city;

  if (params.dateFrom && params.dateFrom > now) {
    where.endDateTime = { gte: params.dateFrom };
  }

  if (params.dateTo) {
    where.startDateTime = { lte: params.dateTo };
  }

  if (params.categories) {
    where.categories = { hasSome: params.categories };
  }

  if (params.priceFrom != null || params.priceTo != null) {
    const price: { gte?: number; lte?: number } = {};
    if (params.priceFrom != null) price.gte = params.priceFrom;
    if (params.priceTo != null) price.lte = params.priceTo;
    where.ticketTypes = { some: { price } };
  }

  if (params.query && params.query.trim() !== "") {
    const term = params.query.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { venue: { contains: term, mode: "insensitive" } },
      { address: { contains: term, mode: "insensitive" } },
      { city: { contains: term, mode: "insensitive" } },
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
