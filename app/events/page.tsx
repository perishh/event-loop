import Breadcrumb from "@/components/Breadcrumb";
import { EventCategory, EventType } from "../generated/prisma/enums";
import z from "zod";
import { redirect } from "next/navigation";
import { cleanParams } from "@/lib/utils";
import { EVENT_TYPE_CATEGORIES } from "@/prisma/mapper";
import { Suspense } from "react";
import { ResolvedParams } from "./types";
import FilterSidebarSkeleton from "./_browse/FilterSidebarSkeleton";
import AsyncFilterSidebar from "./_browse/AsyncFilterSidebar";
import EventGridSkeleton from "./_browse/EventGridSkeleton";
import AsyncEventGrid from "./_browse/AsyncEventGrid";

const isValidDate = (date: string) =>
  new Date(date) instanceof Date && !isNaN(new Date(date).getTime());

interface SearchParams {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  city?: string;
  categories?: string;
  priceFrom?: string;
  priceTo?: string;
}

const CategoriesSchema = z.enum(EventCategory);
const CategoriesArraySchema = z.array(CategoriesSchema);

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { type, dateFrom, dateTo, city, categories, priceFrom, priceTo } =
    await searchParams;
  let selectedType: EventType | null = null;
  if (type && type in EventType) {
    selectedType = type as EventType;
  }

  if (dateFrom) {
    if (!isValidDate(dateFrom)) {
      redirect(
        `/events?${new URLSearchParams(cleanParams({ type, dateTo, city, categories, priceFrom, priceTo }))}`,
      );
    }
  }

  if (dateTo) {
    if (!isValidDate(dateTo)) {
      redirect(
        `/events?${new URLSearchParams(cleanParams({ type, dateFrom, city, categories, priceFrom, priceTo }))}`,
      );
    }
  }

  let selectedPriceFrom: number | null = null;
  if (priceFrom) {
    const price = parseFloat(priceFrom);
    if (isNaN(price)) {
      redirect(
        `/events?${new URLSearchParams(cleanParams({ type, dateFrom, dateTo, city, categories, priceTo }))}`,
      );
    }
    selectedPriceFrom = price;
  }

  let selectedPriceTo: number | null = null;
  if (priceTo) {
    const price = parseFloat(priceTo);
    if (isNaN(price)) {
      redirect(
        `/events?${new URLSearchParams(cleanParams({ type, dateFrom, dateTo, city, categories, priceFrom }))}`,
      );
    }
    selectedPriceTo = price;
  }

  try {
    const rawData = JSON.parse(categories ?? "[]");
    const parsed = CategoriesArraySchema.parse(rawData);
    if (selectedType !== null) {
      const valid = Object.values(EVENT_TYPE_CATEGORIES[selectedType]);
      for (const category of parsed) {
        if (!valid.includes(category)) {
          throw new Error(
            `Invalid category ${category} for type ${selectedType}`,
          );
        }
      }
    }
  } catch {
    redirect(
      `/events?${new URLSearchParams(cleanParams({ type, dateFrom, dateTo, city, priceFrom, priceTo }))}`,
    );
  }

  const resolvedParams: ResolvedParams = {
    type: selectedType,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
    city: city || null,
    categories: categories ?? "[]",
    priceFrom: selectedPriceFrom,
    priceTo: selectedPriceTo,
  };

  const searchKey = `${selectedType}|${dateFrom}|${dateTo}|${city}|${categories}|${selectedPriceFrom}|${selectedPriceTo}`;

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex flex-1">
        <Suspense fallback={<FilterSidebarSkeleton />}>
          <AsyncFilterSidebar params={resolvedParams} />
        </Suspense>

        <div className="flex-3">
          <div className="sticky top-[76px] left-0 bg-white z-10 py-4 px-6 border-b-2 border-b-violet-100">
            <Breadcrumb
              breadcrumbItems={[
                { href: "/", label: "Αρχική" },
                { href: "/events", label: "Εκδηλώσεις" },
              ]}
            />
            <h1 className="text-3xl font-bold mt-1">Εκδηλώσεις</h1>
          </div>

          <Suspense key={`grid-${searchKey}`} fallback={<EventGridSkeleton />}>
            <AsyncEventGrid params={resolvedParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
