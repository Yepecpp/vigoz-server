import { z } from 'zod';
import { userZod } from './user.i';
import { Document } from 'mongoose';
import { currencyZod } from '@interfaces/common/currency.i';

export const expenseZod = z.object({
  id: z.string().optional(),
  category: z.string(),
  description: z.string(),
  amount: z.object({
    value: z.number(),
    currency: currencyZod,
  }),
  date_ex: z.date(),
  state: z.boolean(),
  user: userZod.optional(),
});

export type IExpense = z.infer<typeof expenseZod>;
export type expenseDocument = IExpense &
  Document & {
    VerifySchema(Edata?: IExpense | expenseDocument): {
      success: boolean;
      error?: z.ZodError<IExpense>;
      data?: IExpense;
    };
    ToClient(): IExpense;
  };
