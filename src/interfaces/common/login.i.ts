import { z } from 'zod';
export const loginZod = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  passw: z.string().min(8),
  // provider is an enum of the providers we support
  provider: z.enum(['local', 'google', 'facebook', 'github']),
  lastLogin: z.date().default(new Date()),
});
export type ILogin = z.infer<typeof loginZod>;
