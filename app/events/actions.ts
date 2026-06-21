"use server";

import prisma from "@/lib/prisma";
import {
  EventCategory,
  EventStatus,
  EventType,
} from "../generated/prisma/enums";

interface FilterParams {
  type: EventType | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  city: string | null;
  categories: EventCategory[] | null;
  priceFrom: number | null;
  priceTo: number | null;
}

export async function getFilteredEvents(
  params: FilterParams,
  page: number = 1,
  pageSize: number = 10,
) {
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
