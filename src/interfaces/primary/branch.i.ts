import { z } from 'zod';
import { addressZod } from '@interfaces/common/address.i';
import { companyZod } from './company.i';
import { Document } from 'mongoose';
export const branchZod = z.object({
  company: companyZod || z.string(),
  name: z.string(),
  address: addressZod,
  phone: z.string(),
  email: z.string(),
});

export type IBranch = z.infer<typeof branchZod>;
export type branchDocument = IBranch &
  Document & {
    VerifySchema(Bdata?: IBranch | branchDocument): {
      success: boolean;
      err?: any;
      data?: IBranch;
    };
    ToClient(): IBranch;
  };
