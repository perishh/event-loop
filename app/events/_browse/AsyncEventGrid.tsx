import { getFilteredEvents } from "../actions";
import { ResolvedParams } from "../types";
import EventGrid from "./EventGrid";

export default async function AsyncEventGrid({
  params,
}: {
  params: ResolvedParams;
}) {
  const { events: initialData, hasMore } = await getFilteredEvents(
    {
      categories:
        params.categories && params.categories !== "[]"
          ? JSON.parse(params.categories)
          : null,
      type: params.type,
      dateFrom: params.dateFrom ? new Date(params.dateFrom) : null,
      dateTo: params.dateTo ? new Date(params.dateTo) : null,
      city: params.city ?? null,
      priceFrom: params.priceFrom,
      priceTo: params.priceTo,
      query: params.query ?? null,
    },
    1,
  );

  return (
    <EventGrid
      key={`${params.type}|${params.city}|${params.categories}|${params.priceFrom}|${params.priceTo}|${params.dateFrom}|${params.dateTo}|${params.query}`}
      initialEvents={initialData}
      initialHasMore={hasMore}
      filterParams={params}
    />
  );
}
