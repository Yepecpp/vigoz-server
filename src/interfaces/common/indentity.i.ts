import { z } from 'zod';
export const identityZod = z.object({
  type: z.enum(['id', 'passport']).default('id'),
  number: z.string(),
  expiration: z.date(),
  country: z.string(),
  state: z.string(),
});
export type IIdentity = z.infer<typeof identityZod>;
