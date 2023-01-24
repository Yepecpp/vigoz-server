import { z } from 'zod';
import { addressZod } from '@interfaces/common/address.i';
import { currencyZod } from '@interfaces/common/currency.i';
import { Document } from 'mongoose';

export const companyZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: addressZod,
  phone: z.string(),
  email: z.string(),
  website: z.string().optional(),
  logo: z.array(z.string()).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  currencies: z.object({
    default: currencyZod,
    Available: z.array(
      z.object({
        currency: currencyZod,
      }),
    ),
  }),
});

export type ICompany = z.infer<typeof companyZod>;
export type CompanyDocument = ICompany &
  Document & {
    VerifySchema(Cdata?: ICompany | CompanyDocument): {
      success: boolean;
      err?: any;
      data?: ICompany;
    };
    ToClient(): ICompany;
  };
