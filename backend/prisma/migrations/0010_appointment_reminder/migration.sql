-- Story: reminder-notifications — one row per reminder sent for an appointment.
-- The Appointment table (owned by book-appointment) is NOT altered; the unique
-- (appointmentId, kind) key guarantees a reminder is never sent twice.
CREATE TABLE "AppointmentReminder" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT '24H',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentReminder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AppointmentReminder_appointmentId_kind_key" ON "AppointmentReminder"("appointmentId", "kind");
CREATE INDEX "AppointmentReminder_customerId_sentAt_idx" ON "AppointmentReminder"("customerId", "sentAt");

ALTER TABLE "AppointmentReminder" ADD CONSTRAINT "AppointmentReminder_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AppointmentReminder" ADD CONSTRAINT "AppointmentReminder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
