import { z } from 'zod';
import { Document } from 'mongoose';
import { addressZod } from '@interfaces/common/address.i';
import zoderr from '@utils/zoderr';
export const providerZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().min(1, "email can't be empty").email('This is not a valid email'),
  phone: z.string().optional(),
  address: addressZod,
  description: z.string().optional(),
});
export type IProvider = z.infer<typeof providerZod>;
export type providerDocument = IProvider &
  Document & {
    VerifySchema(Udata?: IProvider | providerDocument): {
      success: boolean;
      err?: ReturnType<typeof zoderr>;
      data?: IProvider;
    };
    ToClient(): IProvider;
  };
