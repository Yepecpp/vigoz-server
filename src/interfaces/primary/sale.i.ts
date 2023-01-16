import { z } from 'zod';
import { Document } from 'mongoose';
import zoderr from '@utils/zoderr';
import { employeeZod } from './employee.i';
import { currencyZod } from '@interfaces/common/currency.i';
import { clientZod } from './client.i';
import { storageZod } from './storage.i';
export const saleZod = z.object({
  id: z.string().nullish(),
  date: z.date().default(new Date()),
  amount: z.object({
    total: z.number().positive(),
    fromStorage: storageZod || z.string().nullish(),
  }),
  state: z.object({
    status: z.enum(['pending', 'approved', 'canceled']).default('pending'),
    updated: z.date().default(new Date()),
    handledBy: employeeZod || z.string().nullish(),
  }),

  value: z.object({
    total: z.number().positive(),
    indivudual: z.number().positive(),
    currency: currencyZod,
  }),
  sellerEmp: employeeZod || z.string().nullish(),
  destination: z.object({
    type: z.enum(['client', 'unoficial', 'distribution']).default('unoficial'),
    clients: z.array(clientZod || z.string().nullish()),
  }),
});

export type ISale = z.infer<typeof saleZod>;
export type saleDocument = ISale &
  Document & {
    VerifySchema(Udata?: ISale | saleDocument): {
      success: boolean;
      error?: ReturnType<typeof zoderr>;
      data?: ISale;
    };
    ToClient(): ISale;
  };
