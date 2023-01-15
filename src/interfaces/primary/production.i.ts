import { z } from 'zod';
import { storageZod } from './storage.i';
import { employeeZod } from './employee.i';
import { Document } from 'mongoose';
import zoderr from '@utils/zoderr';
export const productionZod = z.object({
  id: z.string().uuid().nullish(),
  date: z.date().default(new Date()),
  product: z.object({
    type: z.enum(['Ice', 'Bags']).default('Ice'),
    quantity: z.number().positive().default(0),
  }),
  storage: storageZod || z.string().nullish(),
  employee: employeeZod || z.string().nullish(),
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