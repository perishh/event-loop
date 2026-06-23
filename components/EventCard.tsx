import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { EVENT_TYPE_LABELS } from "@/prisma/mapper";
import { EventType } from "@/app/generated/prisma/enums";
import SafeImage from "./SafeImage";

export interface EventCardProps {
  id: string;
  image: string | null;
  title: string;
  type: EventType;
  startDateTime: Date;
  city: string;
  venue: string;
}

export function EventCard({
  id,
  image,
  title,
  type,
  startDateTime,
  city,
  venue,
}: EventCardProps) {
  return (
    <Link
      href={`/events/${encodeURIComponent(id)}`}
      className="group h-full rounded-2xl border border-violet-100 bg-white/80 shadow-sm shadow-violet-100/60 transition-all hover:shadow-md hover:shadow-violet-200/60 hover:-translate-y-0.5 flex flex-col"
    >
      <div className="overflow-hidden rounded-t-2xl">
        <SafeImage
          src={image}
          alt={title}
          fill
          wrapperClassName="w-full h-48 transition-transform group-hover:scale-105"
          className="object-cover"
        />
      </div>

      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="rounded-full bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-0.5">
            {EVENT_TYPE_LABELS[type]}
          </span>
        </div>

        <h3 className="text-lg font-bold tracking-tight text-gray-900 line-clamp-2 leading-snug">
          {title}
        </h3>

        <p className="text-sm text-violet-600 font-medium mt-2">
          {formatDate(startDateTime)}
        </p>

        <p className="text-xs text-gray-500 mt-1 truncate">
          {city}, {venue}
        </p>
      </div>
    </Link>
  );
}
