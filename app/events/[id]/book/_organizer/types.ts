import { BookingStatus } from "@/app/generated/prisma/enums";

export type BookingRow = {
  id: string;
  time: Date;
  status: BookingStatus;
  numberOfTickets: number;
  totalCost: number;
  ticketType: {
    id: number;
    name: string;
    price: number;
  };
  attendee: {
    id: string;
    firstName: string;
    lastName: string;
  };
};
