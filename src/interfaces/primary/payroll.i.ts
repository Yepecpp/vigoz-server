import { z } from 'zod';
import zoderr from '@utils/zoderr';
import { Document } from 'mongoose';
import { currencyZod } from '../common/currency.i';
import { employeeZod } from './employee.i';
export const payrollZod = z.object({
  id: z.string().uuid().optional(),
  period: z.date().default(new Date()),
  employee: employeeZod || z.string().uuid(),
  values: z.object({
    currency: currencyZod,
    totalAmount: z.number().positive(),
    tax: z.number().positive(),
    social: z.object({
      health: z.number().positive(),
      pension: z.number().positive(),
      total: z.number().positive(),
    }),
    netAmount: z.number().positive(),
  }),
  createdAt: z.date().default(new Date()),
  process: z.object({
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
    updatedAt: z.date().default(new Date()),
    processedBy: employeeZod || z.string().uuid().optional(),
  }),
});
export type IPayroll = z.infer<typeof payrollZod>;
export type payrollDocument = IPayroll &
  Document & {
    VerifySchema(Pdata?: IPayroll | payrollDocument): {
      success: boolean;
      error?: ReturnType<typeof zoderr>;
      data?: IPayroll;
    };
    ToClient(): IPayroll;
  };

