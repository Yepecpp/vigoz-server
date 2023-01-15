import { z } from 'zod';
import { Document } from 'mongoose';
import zoderr from '@utils/zoderr';
export const saleZod = z.object({
  id: z.string().uuid().nullish(),
  date: z.date().default(new Date()),
  amount: z.number().positive().default(0),
  state: z.enum(['pending', 'approved', 'canceled']).default('pending'),
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

