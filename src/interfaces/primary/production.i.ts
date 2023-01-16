import { z } from 'zod';
import { storageZod } from './storage.i';
import { employeeZod } from './employee.i';
import { Document } from 'mongoose';
import zoderr from '@utils/zoderr';
export const productionZod = z.object({
  id: z.string().nullish(),
  date: z.date().default(new Date()),
  product: z.object({
    type: z.enum(['Ice', 'Bags']).default('Ice'),
    quantity: z.number().min(0).default(0),
  }),
  storage: storageZod.optional().or(z.string()).nullish(),
  employee: employeeZod.optional().or(z.string()).nullish(),
});
export type IProduction = z.infer<typeof productionZod>;
export type productionDocument = IProduction &
  Document & {
    VerifySchema: (Udata?: IProduction | productionDocument) => {
      success: boolean;
      err?: ReturnType<typeof zoderr>;
      data?: IProduction;
    };
    ToClient: () => IProduction;
  };
