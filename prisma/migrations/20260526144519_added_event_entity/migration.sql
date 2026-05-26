-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CONFERENCE', 'WORKSHOP', 'SEMINAR', 'NETWORKING', 'CONCERT', 'EXHIBITION', 'FESTIVAL', 'GALA', 'PARTY', 'MEETUP', 'WEBINAR', 'SPORTS', 'THEATER', 'COMMUNITY', 'FUNDRAISER', 'OTHER');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('ACADEMIC', 'TECH_IT', 'SKILL_BUILDING', 'PROFESSIONAL_DEVELOPMENT', 'PANEL_DISCUSSION', 'LIVE_MUSIC', 'STAND_UP_COMEDY', 'FILM_FESTIVAL', 'FOOD_DRINK', 'BUSINESS_MIXER', 'VOLUNTEER_FAIR', 'CHARITY_AUCTION', 'TOURNAMENT', 'FITNESS_CLASS', 'ESPORTS', 'GENERAL', 'PRIVATE_EVENT');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REMOVED');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "categories" "EventCategory"[],
    "venue" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "media" TEXT[],
    "organizerId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTickets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "available" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "EventTickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventTickets_eventId_idx" ON "EventTickets"("eventId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTickets" ADD CONSTRAINT "EventTickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
