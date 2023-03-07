import { z } from 'zod';
import { Document } from 'mongoose';
import zoderr from '@utils/zoderr';
import { userZod } from './user.i';
export const todoZod = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  status: z
    .object({
      isCompleted: z.boolean().default(false),
      createdAt: z.date().or(z.string()).default(new Date()),
      completedAt: z.date().or(z.string()).optional(),
    })
    .optional(),
  flags: z.array(z.enum(['important', 'urgent', 'private', 'public', 'completed', 'incomplete', 'renegated'])).optional(),
  createdBy: z
    .object({
      profile: z.string().or(userZod.optional()),
    })
    .optional(),
});
export const VerifySchema = function (Tdata?: ITodo | todoDocument): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: ITodo;
} {
  if (!Tdata) {
    Tdata = this;
  }
  let parse = todoZod.safeParse(Tdata);
  if (!parse.success) {
    return { success: false, err: zoderr(parse.error) };
  }
  return { success: true, data: parse.data };
};
export type ITodo = z.infer<typeof todoZod>;
export type todoDocument = ITodo &
  Document & {
    VerifySchema(Bdata?: ITodo | todoDocument): {
      success: boolean;
      err?: any;
      data?: ITodo;
    };
    ToClient(): ITodo;
  };

// example data :

