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
    total: z.number().min(0),
    fromStorage: storageZod.or(z.string().nullish()),
  }),
  state: z.object({
    status: z.enum(['pending', 'approved', 'canceled']).default('pending'),
    updated: z.date().default(new Date()),
    handledBy: employeeZod.or(z.string().nullish()).optional(),
  }),

  value: z.object({
    total: z.number().min(0).optional(),
    indivudual: z.number().min(0),
    currency: currencyZod,
  }),
  sellerEmp: employeeZod.or(z.string().nullish()),
  destination: z.object({
    type: z.enum(['client', 'unoficial', 'distribution']).default('unoficial'),
    clients: z.array(clientZod.or(z.string().nullish())).optional(),
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
