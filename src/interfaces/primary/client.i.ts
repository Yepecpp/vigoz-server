import { z } from 'zod';
import { addressZod } from '@interfaces/common/address.i';
import { userZod } from './user.i';
import { identityZod } from '@interfaces/common/indentity.i';
import { Document } from 'mongoose';
import zoderr from '@utils/zoderr';

export const clientZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: addressZod,
  user: userZod.or(z.string()).optional(),
  identity: z.object({
    type: z.enum(['Fisical', 'Company']).default('Company'), //could be a normal civilian or a company
    identity: identityZod,
  }),
  rnc: z.string(),
  phone: z.string(),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

export type IClient = z.infer<typeof clientZod>;
export type clientDocument = IClient &
  Document & {
    VerifySchema(Cdata?: IClient | clientDocument): {
      success: boolean;
      err?: ReturnType<typeof zoderr>;
      data?: IClient;
    };
    ToClient(): IClient;
  };
