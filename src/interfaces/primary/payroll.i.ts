import { z } from 'zod';
import zoderr from '@utils/zoderr';
import { Document } from 'mongoose';
import { currencyZod } from '../common/currency.i';
import { employeeZod } from './employee.i';
export const payrollZod = z.object({
  id: z.string().optional(),
  period: z.string().default(() => {
    const date = new Date();
    return `${date.getMonth() + 1}-${date.getFullYear()}`;
  }),
  employee: employeeZod.optional().or(z.string()),
  values: z.object({
    currency: currencyZod,
    salary: z.number().min(0),
    extra: z.number().min(0),
    tax: z.object({
      percentage: z.number().min(0).max(100),
      amount: z.number().min(0),
    }),
    social: z.object({
      health: z.object({
        percentage: z.number().min(0).max(100),
        amount: z.number().min(0),
      }),
      pension: z.object({
        percentage: z.number().min(0).max(100),
        amount: z.number().min(0),
      }),
      total: z.object({
        percentage: z.number().min(0).max(100),
        amount: z.number().min(0),
      }),
    }),
    netAmount: z.number().min(0),
  }),
  createdAt: z.date().default(new Date()),
  process: z.object({
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
    updatedAt: z.date().default(new Date()),
    processedBy: employeeZod.optional().or(z.string()),
  }),
});
export type IPayroll = z.infer<typeof payrollZod>;
export type payrollDocument = IPayroll &
  Document & {
    VerifySchema(Pdata?: IPayroll | payrollDocument): {
      success: boolean;
      err?: ReturnType<typeof zoderr>;
      data?: IPayroll;
    };
    ToClient(): IPayroll;
  };
