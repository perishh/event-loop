"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { EVENT_TYPE_LABELS } from "@/prisma/mapper";
import { useState } from "react";
import { EventBrowseResult } from "./EventGrid";

function EventCardImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-t-2xl border border-dashed border-violet-200 bg-violet-50/80 text-violet-700 ${className ?? ""}`}
      >
        <div className="text-center px-4">
          <p className="font-semibold text-sm">Χωρίς εικόνα</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

interface Props {
  event: EventBrowseResult;
}

export function EventCard({ event }: Props) {
  return (
    <Link
      href={`/events/${encodeURIComponent(event.id)}`}
      className="group block rounded-2xl border border-violet-100 bg-white/80 shadow-sm shadow-violet-100/60 transition-all hover:shadow-md hover:shadow-violet-200/60 hover:-translate-y-0.5"
    >
      <div className="overflow-hidden rounded-t-2xl">
        <EventCardImage
          src={event.media[0]}
          alt={event.title}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="rounded-full bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-0.5">
            {EVENT_TYPE_LABELS[event.type]}
          </span>
        </div>

        <h3 className="text-lg font-bold tracking-tight text-gray-900 line-clamp-2 leading-snug">
          {event.title}
        </h3>

        <p className="text-sm text-violet-600 font-medium mt-2">
          {formatDate(event.startDateTime)}
        </p>

        <p className="text-xs text-gray-500 mt-1 truncate">
          {event.city}
          {event.venue ? `, ${event.venue}` : ""}
        </p>
      </div>
    </Link>
  );
}
