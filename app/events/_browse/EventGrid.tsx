"use client";

import { useState } from "react";
import { getFilteredEvents } from "../actions";
import {
  EventCategory,
  EventStatus,
  EventType,
} from "@/app/generated/prisma/enums";
import { EventCard } from "./EventCard";
import type { ResolvedParams } from "../types";

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

interface Props {
  initialEvents: EventBrowseResult[];
  initialHasMore: boolean;
  filterParams: ResolvedParams;
}

export default function EventGrid({
  initialEvents,
  initialHasMore,
  filterParams,
}: Props) {
  const [page, setPage] = useState(2);
  const [results, setResults] = useState<Record<number, EventBrowseResult[]>>({
    1: initialEvents,
  });
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const { events, hasMore: more } = await getFilteredEvents(
      {
        categories:
          filterParams.categories && filterParams.categories !== "[]"
            ? JSON.parse(filterParams.categories)
            : null,
        type: filterParams.type,
        dateFrom: filterParams.dateFrom
          ? new Date(filterParams.dateFrom)
          : null,
        dateTo: filterParams.dateTo ? new Date(filterParams.dateTo) : null,
        city: filterParams.city ?? null,
        priceFrom: filterParams.priceFrom,
        priceTo: filterParams.priceTo,
      },
      page,
    );
    setResults((prevResults) => ({ ...prevResults, [page]: events }));
    setPage((prevPage) => prevPage + 1);
    setHasMore(more);
    setLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        {Object.values(results)
          .flat()
          .map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="rounded-2xl border-2 border-violet-200 text-violet-700 px-4 py-2 font-semibold hover:bg-violet-50 transition-colors mx-auto mt-8 block"
        >
          {loading ? "Φόρτωση..." : "Περισσότερα"}
        </button>
      )}
    </>
  );
}
