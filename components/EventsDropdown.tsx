"use client";

import Link from "next/link";
import { useRef, useState, useEffect, ComponentType } from "react";
import {
  Balloon,
  ChevronDown,
  Drama,
  LucideProps,
  MicVocal,
  Volleyball,
} from "lucide-react";
import { EventType } from "@/app/generated/prisma/enums";

const eventTypeItems: {
  label: string;
  type: EventType;
  icon: ComponentType<LucideProps>;
}[] = [
  { label: "Συναυλία", type: EventType.CONCERT, icon: MicVocal },
  { label: "Θέατρο", type: EventType.THEATER, icon: Drama },
  { label: "Αθλητικά", type: EventType.SPORTS, icon: Volleyball },
  { label: "Φεστιβάλ", type: EventType.FESTIVAL, icon: Balloon },
];

export default function EventsDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sharedButtonClasses =
    "flex items-center text-white font-semibold text-sm px-3 py-2 rounded-xl transition-colors hover:bg-white/10";

  const sharedLinkClasses =
    "block w-full text-left px-4 py-2 text-sm font-medium text-gray-800 hover:bg-violet-50 transition-colors whitespace-nowrap flex items-center gap-3";

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link href="/events" className={`hidden md:flex ${sharedButtonClasses}`}>
        Εκδηλώσεις
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </Link>

      <button
        type="button"
        className={`flex md:hidden ${sharedButtonClasses}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Εκδηλώσεις
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="absolute top-full left-0 right-0 h-1 z-40" />

          <div className="absolute top-[calc(100%+0.25rem)] left-0 bg-white rounded-xl shadow-lg shadow-violet-100 border border-violet-100 py-1 min-w-40 z-50">
            <Link
              href="/events"
              className={`md:hidden ${sharedLinkClasses}`}
              onClick={() => setOpen(false)}
            >
              Όλες
            </Link>
            <div className="h-px bg-violet-100 mx-2 md:hidden" />

            {eventTypeItems.map((item) => (
              <Link
                key={item.type}
                href={`/events?type=${item.type}`}
                className={sharedLinkClasses}
                onClick={() => setOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
