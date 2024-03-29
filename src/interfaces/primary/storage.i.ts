import { z } from 'zod';
import { branchZod } from './branch.i';
import { Document } from 'mongoose';
import zoderr from '@utils/zoderr';
export const storageZod = z
  .object({
    id: z.string().nullish(),
    name: z.string(),
    category: z.string(),
    status: z.enum(['active', 'inactive', 'Damaged']).default('active'),
    maxCapacity: z.number().min(0).default(0),
    currentCapacity: z.number().min(0).default(0),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
    branch: branchZod.or(z.string()),
  })
  .refine((value) => value.maxCapacity > value.currentCapacity, {
    message: 'currentCapacity cannot be greater than maxCapacity',
    path: ['currentCapacity'],
  });
export type IStorage = z.infer<typeof storageZod>;
export type storageDocument = IStorage &
  Document & {
    VerifySchema(Udata?: IStorage | storageDocument): {
      success: boolean;
      error?: ReturnType<typeof zoderr>;
      data?: IStorage;
    };
    ToClient(): IStorage;
  };
