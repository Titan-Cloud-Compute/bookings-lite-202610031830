-- Story: set-availability — provider weekly hours and blocked time slots.
CREATE TABLE "AvailabilityWindow" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityWindow_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AvailabilityWindow_dayOfWeek_check" CHECK ("dayOfWeek" >= 0 AND "dayOfWeek" <= 6),
    CONSTRAINT "AvailabilityWindow_minutes_check" CHECK ("startMinute" >= 0 AND "endMinute" <= 1440 AND "startMinute" < "endMinute")
);

CREATE INDEX "AvailabilityWindow_providerId_idx" ON "AvailabilityWindow"("providerId");

ALTER TABLE "AvailabilityWindow" ADD CONSTRAINT "AvailabilityWindow_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AvailabilityBlock" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvailabilityBlock_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AvailabilityBlock_range_check" CHECK ("startsAt" < "endsAt")
);

CREATE INDEX "AvailabilityBlock_providerId_idx" ON "AvailabilityBlock"("providerId");

ALTER TABLE "AvailabilityBlock" ADD CONSTRAINT "AvailabilityBlock_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
