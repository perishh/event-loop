"use client";

import { EventCategory, EventType } from "@/app/generated/prisma/enums";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { cleanParams } from "@/lib/utils";
import {
  EVENT_CATEGORY_LABELS,
  EVENT_TYPE_CATEGORIES,
  EVENT_TYPE_LABELS,
} from "@/prisma/mapper";
import { Euro, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

interface Props {
  cities: string[];
  params: {
    type: EventType | null;
    dateFrom: string | null;
    dateTo: string | null;
    city: string | null;
    categories: string;
    priceFrom: number | null;
    priceTo: number | null;
    query: string | null;
  };
}

export default function FilterSidebar({ cities, params }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const parsedCategories: EventCategory[] = useMemo(
    () => JSON.parse(params.categories),
    [params.categories],
  );

  const navigate = useCallback(
    (url: string) => {
      startTransition(() => {
        router.replace(url);
      });
    },
    [router],
  );

  const [localPriceFrom, setLocalPriceFrom] = useState(
    params.priceFrom?.toString() ?? "",
  );

  const [localPriceTo, setLocalPriceTo] = useState(
    params.priceTo?.toString() ?? "",
  );

  const [localQuery, setLocalQuery] = useState(params.query ?? "");

  const priceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const queryTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setLocalPriceFrom(params.priceFrom?.toString() ?? "");
  }, [params.priceFrom]);

  useEffect(() => {
    setLocalPriceTo(params.priceTo?.toString() ?? "");
  }, [params.priceTo]);

  useEffect(() => {
    setLocalQuery(params.query ?? "");
  }, [params.query]);

  const debouncedQueryNavigate = useCallback(
    (raw: string) => {
      if (queryTimerRef.current) clearTimeout(queryTimerRef.current);
      queryTimerRef.current = setTimeout(() => {
        const newParams = cleanParams({
          ...params,
          query: raw || null,
        });
        navigate(`/events?${new URLSearchParams(newParams)}`);
      }, 400);
    },
    [params, navigate],
  );

  const debouncedNavigate = useCallback(
    (field: "priceFrom" | "priceTo", raw: string) => {
      if (priceTimerRef.current) clearTimeout(priceTimerRef.current);
      priceTimerRef.current = setTimeout(() => {
        const numValue = raw ? parseFloat(raw) : null;
        const newParams = cleanParams({
          ...params,
          [field]: numValue,
        });
        navigate(`/events?${new URLSearchParams(newParams)}`);
      }, 400);
    },
    [params, navigate],
  );

  return (
    <div
      className={`flex-1 sticky top-[76px] left-0 max-h-[calc(100dvh-76px)] border-r-2 border-r-violet-100 max-w-100 z-20 bg-white transition-opacity${isPending ? " opacity-50 pointer-events-none" : ""}`}
    >
      <div className="overflow-y-auto p-4 max-h-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-violet-600" />
            <h2 className="text-sm font-bold tracking-widest text-violet-600 uppercase">
              ΦΙΛΤΡΑ
            </h2>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Καθαρισμός φίλτρων"
            title="Καθαρισμός"
            onClick={() => {
              navigate("/events");
            }}
          >
            <X size={16} />
          </button>
        </div>

        <InputField
          id="event-query"
          label="Αναζήτηση"
          type="text"
          icon={Search}
          placeholder="Τίτλος, περιγραφή, τοποθεσία"
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            debouncedQueryNavigate(e.target.value);
          }}
          wrapperClassName="mt-4"
        />

        <SelectField
          id="event-type"
          label="Τύπος"
          wrapperClassName="mt-4"
          value={params.type || ""}
          onChange={(e) => {
            const newParams = cleanParams({
              ...params,
              type: e.target.value || null,
              categories: e.target.value ? params.categories : null,
            });

            navigate(`/events?${new URLSearchParams(newParams)}`);
          }}
        >
          <option value="">Όλοι οι τύποι</option>
          {Object.values(EventType).map((t) => (
            <option key={t} value={t}>
              {EVENT_TYPE_LABELS[t]}
            </option>
          ))}
        </SelectField>

        <div className="flex gap-4 mt-4">
          <InputField
            id="event-dateFrom"
            label="Ημερομηνία από"
            type="date"
            value={params.dateFrom ?? ""}
            onChange={(e) => {
              const date = e.target.value;
              const newParams = cleanParams({
                ...params,
                dateFrom: date || null,
              });
              navigate(`/events?${new URLSearchParams(newParams)}`);
            }}
            placeholder=""
          />
          <InputField
            id="event-dateTo"
            label="Ημερομηνία έως"
            type="date"
            value={params.dateTo ?? ""}
            onChange={(e) => {
              const date = e.target.value;
              const newParams = cleanParams({
                ...params,
                dateTo: date || null,
              });
              navigate(`/events?${new URLSearchParams(newParams)}`);
            }}
            placeholder=""
          />
        </div>

        <div className="flex gap-4 mt-4">
          <InputField
            id="event-priceFrom"
            label="Τιμή από"
            type="number"
            min={0}
            icon={Euro}
            placeholder="Δωρεάν"
            value={localPriceFrom}
            onChange={(e) => {
              setLocalPriceFrom(e.target.value);
              debouncedNavigate("priceFrom", e.target.value);
            }}
          />
          <InputField
            id="event-priceTo"
            label="Τιμή έως"
            icon={Euro}
            type="number"
            min={0}
            placeholder="∞"
            value={localPriceTo}
            onChange={(e) => {
              setLocalPriceTo(e.target.value);
              debouncedNavigate("priceTo", e.target.value);
            }}
          />
        </div>

        <SelectField
          id="event-city"
          label="Πόλη"
          wrapperClassName="mt-4"
          value={params.city ?? ""}
          onChange={(e) => {
            const newParams = cleanParams({
              ...params,
              city: e.target.value || null,
            });
            navigate(`/events?${new URLSearchParams(newParams)}`);
          }}
        >
          <option value="">Όλες οι πόλεις</option>
          {cities.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </SelectField>

        <p className="block text-sm tracking-wide font-semibold mb-1 ml-1 opacity-70 mt-4">
          Κατηγορίες
        </p>
        <div className="flex flex-wrap gap-2">
          {(params.type
            ? EVENT_TYPE_CATEGORIES[params.type]
            : Object.values(EventCategory)
          ).map((category) => (
            <button
              key={category}
              onClick={() => {
                const newCategories = parsedCategories.includes(category)
                  ? parsedCategories.filter((c) => c !== category)
                  : [...parsedCategories, category];
                const newParams = cleanParams({
                  ...params,
                  categories:
                    newCategories.length > 0
                      ? JSON.stringify(newCategories)
                      : null,
                });
                navigate(`/events?${new URLSearchParams(newParams)}`);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                parsedCategories.includes(category)
                  ? "bg-violet-500 text-white border-violet-500"
                  : "bg-white text-gray-600 border-violet-200 hover:border-violet-400 hover:text-violet-700"
              }`}
            >
              {EVENT_CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
