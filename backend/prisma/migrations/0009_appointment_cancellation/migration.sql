-- Story: cancel-appointment — one cancellation record per cancelled appointment.
-- Depends on the Appointment table owned by Story: book-appointment (0007); that
-- table is not altered — cancelling sets Appointment.status = 'CANCELLED' (already
-- allowed by its status check), which frees the slot because slot/clash queries
-- only count status = 'BOOKED'. "late" is the late-cancellation policy flag.
CREATE TABLE "AppointmentCancellation" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "cancelledById" TEXT NOT NULL,
    "late" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentCancellation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AppointmentCancellation_appointmentId_key" ON "AppointmentCancellation"("appointmentId");

ALTER TABLE "AppointmentCancellation" ADD CONSTRAINT "AppointmentCancellation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AppointmentCancellation" ADD CONSTRAINT "AppointmentCancellation_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
