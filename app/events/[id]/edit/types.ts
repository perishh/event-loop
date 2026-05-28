import {
  EventCategory,
  EventStatus,
  EventType,
} from "@/app/generated/prisma/enums";

export type EditableEvent = {
  ticketTypes: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    available: number;
  }[];
} & {
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
  media: string[];
};
