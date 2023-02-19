import { Document } from 'mongoose';
import { z } from 'zod';
import { loginZod } from '../common/login.i';
import zoderr from '@utils/zoderr';
export const userZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  last_name: z.string(),
  login: loginZod,
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'deleted']).default('active'),
  phone: z.string().optional(),
  meta: z.any().nullish(),
  info: z.any().nullish(),
  images: z
    .object({
      images: z.array(z.string()).max(10).optional(),
      avatar: z.string().optional(),
      background: z.array(z.string()).max(5).optional(),
    })
    .optional(), // array of strings
  is_verified: z.boolean().default(false),
  is_employee: z.boolean().default(false),
});
export type IUser = z.infer<typeof userZod>;
export type userDocument = Document &
  IUser & {
    VerifySchema(Udata?: IUser | userDocument): {
      success: boolean;
      err?: ReturnType<typeof zoderr>;
      data?: IUser;
    };
    ToClient(): IUser;
  };

/* test
const data = {
    name: "John",
    last_name: "Doe",
    login: {
        email: "yepe@yepe.me",
        username: "yepe",
        passw: "12345678",
        provider: "local"
    },
    roles: "admin",
} as any 
console.log(userZod.safeParse(data));
*/
