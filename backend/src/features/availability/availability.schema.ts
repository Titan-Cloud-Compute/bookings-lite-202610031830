import { z } from 'zod';

export const WindowSchema = z
  .object({
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startMinute: z.coerce.number().int().min(0).max(24 * 60),
    endMinute: z.coerce.number().int().min(0).max(24 * 60),
  })
  .refine((w) => w.startMinute < w.endMinute, { message: 'startMinute must be before endMinute' });

export const WeeklySchema = z.object({
  windows: z.array(WindowSchema).max(7 * 24),
});

export const BlockSchema = z
  .object({
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
  })
  .refine((b) => b.startsAt.getTime() < b.endsAt.getTime(), { message: 'startsAt must be before endsAt' });

export const SlotsQuerySchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type WindowDto = z.infer<typeof WindowSchema>;
export type BlockDto = z.infer<typeof BlockSchema>;
