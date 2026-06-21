-- CreateTable
CREATE TABLE "RecommendationModel" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "globalMean" DOUBLE PRECISION NOT NULL,
    "userBiases" JSONB NOT NULL,
    "itemBiases" JSONB NOT NULL,
    "userFactors" JSONB NOT NULL,
    "itemFactors" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecommendationModel_pkey" PRIMARY KEY ("id")
);
