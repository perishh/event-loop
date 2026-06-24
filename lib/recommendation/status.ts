import prisma from "@/lib/prisma";
import { EventStatus } from "@/app/generated/prisma/enums";

export interface ModelStatus {
  exists: boolean;
  globalMean: number | null;
  updatedAt: Date | null;
  userCount: number;
  eventCount: number;
  visitCount: number;
  bookingCount: number;
}

export async function getModelStatus(): Promise<ModelStatus> {
  const model = await prisma.recommendationModel.findUnique({
    where: { id: "global" },
    select: {
      globalMean: true,
      updatedAt: true,
    },
  });

  const [userCount, eventCount, interactionCount] = await Promise.all([
    prisma.user.count(),
    prisma.event.count({ where: { status: { not: EventStatus.CANCELLED } } }),
    prisma.eventVisit.count(),
  ]);

  const bookingCount = await prisma.booking.count();

  return {
    exists: model !== null,
    globalMean: model?.globalMean ?? null,
    updatedAt: model?.updatedAt ?? null,
    userCount,
    eventCount,
    visitCount: interactionCount,
    bookingCount,
  };
}
