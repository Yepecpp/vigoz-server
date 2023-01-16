import { z } from 'zod';
// import { branchZod } from './branch.i';
import { Document } from 'mongoose';
import zoderr from '@utils/zoderr';
import { branchZod } from './branch.i';

export const departmentZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  phone: z.string().optional(),
  branch: branchZod.optional().or(z.string()),
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
