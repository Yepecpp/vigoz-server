import { z } from 'zod';
import { addressZod } from '@interfaces/common/address.i';
import { userZod } from './user.i';
import { currencyZod } from '@interfaces/common/currency.i';
import { departmentZod } from '@interfaces/primary/department.i';
import { Document } from 'mongoose';
import { identityZod } from '@interfaces/common/indentity.i';
import zoderr from '@utils/zoderr';

export enum Roles {
  admin = 0,
  supervisor = 1,
  staff = 2,
}

export const employeeZod = z.object({
  id: z.string().optional(),
  user: userZod.or(z.string()),
  address: addressZod,
  identity: identityZod,
  birthDate: z.date().or(z.string()),
  details: z.object({
    position: z.string(),
    type: z.enum(['fulltime', 'parttime', 'contractor', 'inter']).default('fulltime'),
    contract: z.object({
      hireday: z.date().or(z.string()),
      terminated: z.date().or(z.string()).optional(),
      Id: z.string().optional(),
    }),
  }),
  gender: z.enum(['male', 'female', 'other']).default('other'),
  salary: z.object({
    amounts: z.array(z.number()).max(2).min(1),
    currency: currencyZod,
    period: z.string(),
  }),
  department: departmentZod.or(z.string()),
  role: z.enum(['admin', 'supervisor', 'staff']).default('staff'),
});

export type IEmployee = z.infer<typeof employeeZod>;
export type employeeDocument = IEmployee &
  Document & {
    VerifySchema(Epdata?: IEmployee | employeeDocument): {
      success: boolean;
      err?: ReturnType<typeof zoderr>;
      data?: IEmployee;
    };
    ToClient(): IEmployee;
  };
