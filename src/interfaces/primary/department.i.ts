import { z } from 'zod';
// import { branchZod } from './branch.i';
import { Document } from 'mongoose';
import zoderr from '@utils/zoderr';

export const departmentZod = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional(),
  phone: z.string().optional(),
  branch: z.string() /* || branchZod.optional() */, // I commented this out because it was causing an error
});

export type IDepartment = z.infer<typeof departmentZod>;
export type departmentDocument = IDepartment &
  Document & {
    VerifySchema(Ddata?: IDepartment | departmentDocument): {
      success: boolean;
      err?: ReturnType<typeof zoderr>;
      data?: IDepartment;
    };
    ToClient(): IDepartment;
  };
