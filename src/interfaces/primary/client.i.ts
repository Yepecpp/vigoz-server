import { z } from 'zod';
import { addressZod } from '@interfaces/common/address.i';
import { userZod } from './user.i';
import { identityZod } from '@interfaces/common/indentity.i';
import { Document } from 'mongoose';
export const clientZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: addressZod,
  user: userZod || z.string().nullish(),
  identity: identityZod,
  rnc: z.string(),
  phone: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type IClient = z.infer<typeof clientZod>;
export type clientDocument = IClient &
  Document & {
    VerifySchema(Udata?: IClient | clientDocument): {
      success: boolean;
      error?: z.ZodError<IClient>;
      data?: IClient;
    };
    ToClient(): IClient;
  };
