"use client";

import { useState } from "react";
import { EventCard } from "../../../components/EventCard";
import AsyncButton from "@/components/AsyncButton";
import type { ResolvedParams } from "../types";
import { EventBrowseResult } from "@/lib/events/filters";

interface Props {
  initialEvents: EventBrowseResult[];
  initialHasMore: boolean;
  filterParams: ResolvedParams;
}

async function fetchEventsFromApi(params: ResolvedParams, page: number) {
  const sp = new URLSearchParams();
  if (params.type) sp.set("type", params.type);
  if (params.dateFrom) sp.set("dateFrom", params.dateFrom);
  if (params.dateTo) sp.set("dateTo", params.dateTo);
  if (params.city) sp.set("city", params.city);
  if (params.categories && params.categories !== "[]")
    sp.set("categories", params.categories);
  if (params.priceFrom != null) sp.set("priceFrom", String(params.priceFrom));
  if (params.priceTo != null) sp.set("priceTo", String(params.priceTo));
  if (params.query) sp.set("query", params.query);
  sp.set("page", String(page));

  const res = await fetch(`/api/events?${sp.toString()}`);
  if (!res.ok) throw new Error("Αποτυχία φόρτωσης εκδηλώσεων");
  return res.json() as Promise<{
    events: EventBrowseResult[];
    hasMore: boolean;
  }>;
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
    const { events, hasMore: more } = await fetchEventsFromApi(
      filterParams,
      page,
    );
    setResults((prevResults) => ({ ...prevResults, [page]: events }));
    setPage((prevPage) => prevPage + 1);
    setHasMore(more);
    setLoading(false);
  };

  return (
    <>
      <div className="px-4 py-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        {Object.values(results)
          .flat()
          .map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              city={event.city}
              image={event.media[0] || null}
              startDateTime={new Date(event.startDateTime)}
              title={event.title}
              type={event.type}
              venue={event.venue}
            />
          ))}
      </div>
      {hasMore && (
        <AsyncButton
          type="button"
          label="Περισσότερα"
          loading={loading}
          theme="secondary"
          onClick={loadMore}
          className="rounded-2xl border-2 border-violet-200 text-violet-700! px-4 py-2 mx-auto mb-8 block"
        />
      )}
    </>
  );
}
