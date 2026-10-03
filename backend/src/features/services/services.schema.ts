import { z } from 'zod';

export const CreateServiceSchema = z.object({
  name: z.string().trim().min(1).max(200),
  durationMinutes: z.coerce.number().int().positive().max(24 * 60),
  priceCents: z.coerce.number().int().min(0).max(100_000_000),
});

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
