import { z } from 'zod';

export const BookAppointmentSchema = z.object({
  serviceId: z.string().trim().min(1),
  startsAt: z.coerce.date(),
});

export type BookAppointmentDto = z.infer<typeof BookAppointmentSchema>;

/** YYYY-MM-DD (UTC day) for slot lookups. */
export const SlotDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const SLOT_UNAVAILABLE = 'SLOT_UNAVAILABLE';
