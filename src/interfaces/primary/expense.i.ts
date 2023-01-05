import { z } from 'zod';
import { employeeZod } from './employee.i';
import { Document } from 'mongoose';
import { currencyZod } from '@interfaces/common/currency.i';
import zoderr from '@utils/zoderr';

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
  empReq: employeeZod || z.string(),
  empTo: employeeZod || z.string().optional(),
});

export type IExpense = z.infer<typeof expenseZod>;
export type expenseDocument = IExpense &
  Document & {
    VerifySchema(Edata?: IExpense | expenseDocument): {
      success: boolean;
      err?: ReturnType<typeof zoderr>;
      data?: IExpense;
    };
    ToClient(): IExpense;
  };
