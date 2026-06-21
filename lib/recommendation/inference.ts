import prisma from "../prisma";

export async function inference(userId: string, n: number): Promise<string[]> {
  const model = await prisma.recommendationModel.findUnique({
    where: { id: "global" },
  });

  if (!model) return [];

  const globalMean = model.globalMean;
  const userBiases = model.userBiases as Record<string, number>;
  const itemBiases = model.itemBiases as Record<string, number>;
  const userFactors = model.userFactors as Record<string, number[]>;
  const itemFactors = model.itemFactors as Record<string, number[]>;

  const b_u = userBiases[userId] || 0;
  const p_u = userFactors[userId];

  // Cold-start: no latent factors for this user, skip recommendations
  if (!p_u) return [];

  const [views, bookings] = await Promise.all([
    prisma.eventVisit.findMany({
      where: { userId },
      select: { eventId: true },
    }),
    prisma.booking.findMany({
      where: { attendeeId: userId },
      select: { ticketType: { select: { eventId: true } } },
    }),
  ]);

  const interactedItems = new Set<string>([
    ...views.map((v) => v.eventId),
    ...bookings.map((b) => b.ticketType.eventId),
  ]);

  const scoredItems: { eventId: string; score: number }[] = [];

  for (const eventId of Object.keys(itemBiases)) {
    if (interactedItems.has(eventId)) continue;

    const b_i = itemBiases[eventId] || 0;
    const q_i = itemFactors[eventId];

    let dotProduct = 0;
    if (p_u && q_i) {
      dotProduct = p_u.reduce((sum, val, idx) => sum + val * q_i[idx], 0);
    }

    const predictedRating = globalMean + b_u + b_i + dotProduct;
    scoredItems.push({ eventId, score: predictedRating });
  }

  return scoredItems
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((item) => item.eventId);
}
