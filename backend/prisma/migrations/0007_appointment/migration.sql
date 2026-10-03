-- Story: book-appointment — a customer's booking of a service time slot.
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BOOKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Appointment_window_check" CHECK ("endsAt" > "startsAt"),
    CONSTRAINT "Appointment_status_check" CHECK ("status" IN ('BOOKED', 'CANCELLED'))
);

CREATE INDEX "Appointment_serviceId_startsAt_idx" ON "Appointment"("serviceId", "startsAt");
CREATE INDEX "Appointment_providerId_startsAt_idx" ON "Appointment"("providerId", "startsAt");
CREATE INDEX "Appointment_customerId_idx" ON "Appointment"("customerId");

-- Double-booking guard: a provider can hold only one active booking per start time.
CREATE UNIQUE INDEX "Appointment_active_slot_key" ON "Appointment"("providerId", "startsAt") WHERE "status" = 'BOOKED';

ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
