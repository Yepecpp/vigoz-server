import { z } from 'zod';
import { employeeZod } from './employee.i';
import { Document } from 'mongoose';
import { currencyZod } from '@interfaces/common/currency.i';
import zoderr from '@utils/zoderr';
import { providerZod } from './provider.i';
export const expenseZod = z.object({
  id: z.string().optional(),
  category: z.string(),
  description: z.string(),
  amount: z.object({
    value: z.number(),
    currency: currencyZod,
  }),
  date_ex: z.date(),
  state: z.object({
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
    updated: z.date().default(new Date()),
  }),
  creatorEmp: employeeZod.or(z.string()),
  method: z.enum(['cash', 'bank', 'credit card']),
  destination: z.enum(['employees', 'providers']),
  destinationData: providerZod.or(employeeZod).or(z.string()),
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
