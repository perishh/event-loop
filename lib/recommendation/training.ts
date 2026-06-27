import { EventStatus } from "@/app/generated/prisma/enums";
import prisma from "../prisma";

export interface TrainingHyperparams {
  latentFactorsCount: number;
  learningRate: number;
  regularization: number;
  epochs: number;
  bookingWeight: number;
  visitWeight: number;
  maxRating: number;
  negativePerUser: number;
}

const DEFAULT_HYPERPARAMS: TrainingHyperparams = {
  latentFactorsCount: 10,
  learningRate: 0.005,
  regularization: 0.02,
  epochs: 200,
  bookingWeight: 3.0,
  visitWeight: 1.0,
  maxRating: 5.0,
  negativePerUser: 10,
};

interface Interaction {
  userId: string;
  eventId: string;
  rating: number;
}

async function getInteractions(
  weights: { booking: number; visit: number },
  maxRating: number,
): Promise<Interaction[]> {
  const [visits, bookings] = await Promise.all([
    prisma.eventVisit.findMany({
      where: { event: { status: { not: EventStatus.CANCELLED } } },
      select: {
        userId: true,
        eventId: true,
      },
    }),
    prisma.booking.findMany({
      where: { ticketType: { event: { status: { not: EventStatus.CANCELLED } } } },
      select: {
        attendeeId: true,
        ticketType: {
          select: {
            eventId: true,
          },
        },
      },
    }),
  ]);

  const interactionMap = new Map<string, number>();

  visits.forEach((visit) => {
    const key = `${visit.userId}|${visit.eventId}`;
    const existing = interactionMap.get(key) || 0;
    interactionMap.set(key, Math.min(existing + weights.visit, maxRating));
  });

  bookings.forEach((booking) => {
    const key = `${booking.attendeeId}|${booking.ticketType.eventId}`;
    const existing = interactionMap.get(key) || 0;
    interactionMap.set(key, Math.min(existing + weights.booking, maxRating));
  });

  return Array.from(interactionMap.entries()).map(([key, rating]) => {
    const [userId, eventId] = key.split("|");
    return { userId, eventId, rating };
  });
}

function addNegativeSamples(
  interactions: Interaction[],
  userIds: string[],
  eventIds: string[],
  negativePerUser: number,
): void {
  const userPositiveItems = new Map<string, Set<string>>();
  for (const { userId, eventId } of interactions) {
    if (!userPositiveItems.has(userId)) {
      userPositiveItems.set(userId, new Set());
    }
    userPositiveItems.get(userId)!.add(eventId);
  }

  for (const userId of userIds) {
    const positiveSet = userPositiveItems.get(userId) || new Set();
    const candidates = eventIds.filter((e) => !positiveSet.has(e));

    // Fisher-Yates shuffle
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const sampled = candidates.slice(
      0,
      Math.min(negativePerUser, candidates.length),
    );

    for (const eventId of sampled) {
      interactions.push({ userId, eventId, rating: 0 });
    }
  }
}

export async function train(
  hyperparams?: Partial<TrainingHyperparams>,
): Promise<TrainingHyperparams> {
  const params: TrainingHyperparams = {
    ...DEFAULT_HYPERPARAMS,
    ...hyperparams,
  };

  const interactions = await getInteractions(
    { booking: params.bookingWeight, visit: params.visitWeight },
    params.maxRating,
  );

  const userIds = Array.from(new Set(interactions.map((i) => i.userId)));

  const allEvents = await prisma.event.findMany({
    where: { status: { not: EventStatus.CANCELLED } },
    select: { id: true },
  });
  const eventIds = allEvents.map((e) => e.id);

  addNegativeSamples(interactions, userIds, eventIds, params.negativePerUser);

  const totalRating = interactions.reduce((sum, i) => sum + i.rating, 0);
  const globalMean = totalRating / interactions.length;

  const userBiases: Record<string, number> = {};
  userIds.forEach((id) => (userBiases[id] = 0));

  const itemBiases: Record<string, number> = {};
  eventIds.forEach((id) => (itemBiases[id] = 0));

  const userFactors: Record<string, number[]> = {};
  userIds.forEach((id) => {
    userFactors[id] = Array.from(
      { length: params.latentFactorsCount },
      () => Math.random() * 0.1,
    );
  });

  const itemFactors: Record<string, number[]> = {};
  eventIds.forEach((id) => {
    itemFactors[id] = Array.from(
      { length: params.latentFactorsCount },
      () => Math.random() * 0.1,
    );
  });

  for (let epoch = 0; epoch < params.epochs; epoch++) {
    const shuffledInteractions = [...interactions].sort(
      () => Math.random() - 0.5,
    );

    for (const interaction of shuffledInteractions) {
      const { userId, eventId, rating } = interaction;

      const userFactor = userFactors[userId];
      const itemFactor = itemFactors[eventId];

      const dotProduct = userFactor.reduce(
        (sum, uf, idx) => sum + uf * itemFactor[idx],
        0,
      );

      const prediction =
        globalMean + userBiases[userId] + itemBiases[eventId] + dotProduct;

      const error = rating - prediction;

      userBiases[userId] +=
        params.learningRate *
        (error - params.regularization * userBiases[userId]);
      itemBiases[eventId] +=
        params.learningRate *
        (error - params.regularization * itemBiases[eventId]);

      for (let f = 0; f < params.latentFactorsCount; f++) {
        const uF = userFactor[f];
        const iF = itemFactor[f];

        userFactor[f] +=
          params.learningRate * (error * iF - params.regularization * uF);
        itemFactor[f] +=
          params.learningRate * (error * uF - params.regularization * iF);
      }
    }
    console.log(`Epoch ${epoch + 1}/${params.epochs} completed.`);
  }

  await prisma.recommendationModel.upsert({
    where: { id: "global" },
    update: {
      globalMean,
      userBiases,
      itemBiases,
      userFactors,
      itemFactors,
    },
    create: {
      id: "global",
      globalMean,
      userBiases,
      itemBiases,
      userFactors,
      itemFactors,
    },
  });

  return params;
}
