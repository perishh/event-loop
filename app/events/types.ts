import { EventType } from "../generated/prisma/enums";

export type EventActionResult =
  | { success: true; message: string }
  | {
      success: false;
      message?: string;
      fieldErrors?: Record<string, string[]>;
    };

export interface ResolvedParams {
  type: EventType | null;
  dateFrom: string | null;
  dateTo: string | null;
  city: string | null;
  categories: string;
  priceFrom: number | null;
  priceTo: number | null;
}
