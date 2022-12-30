import { z } from 'zod';
export const addressZod = z.object({
  street1: z.string(),
  street2: z.string().optional(),
  city: z.string(),
  zip: z.string().optional(),
});
export type IAddress = z.infer<typeof addressZod>;
