import { z } from 'zod';
import Convert from '@utils/convert';
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
const eRoles = Convert.convertToTuple(Object.keys(Object.create(Roles)));

export const employeeZod = z.object({
  id: z.string().optional(),
  user: userZod || z.string(),
  address: addressZod,
  identity: identityZod,
  salary: z.object({
    amount: z.number(),
    currency: currencyZod,
    period: z.enum(['hour', 'day', 'week', 'month']).default('month'),
  }),
  department: departmentZod || z.string(),
  role: z.enum(eRoles).default('staff'),
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
