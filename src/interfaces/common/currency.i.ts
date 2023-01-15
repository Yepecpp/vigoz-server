import z from 'zod';
export const currencyZod = z.object({
  name: z.string(),
  code: z.string().max(4).min(1),
  symbol: z.string(),
});
export type ICurrency = z.infer<typeof currencyZod>;
