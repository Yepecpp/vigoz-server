import { z } from 'zod';
import { addressZod } from '@interfaces/common/address.i';
import { companyZod } from './company.i';
import { Document } from 'mongoose';
export const branchZod = z.object({
  id: z.string().optional(),
  company: companyZod || z.string(),
  name: z.string(),
  address: addressZod,
  phone: z.string(),
  email: z.string(),
});
export type IBranch = z.infer<typeof branchZod>;
export type branchDocument = IBranch & Document & {};
