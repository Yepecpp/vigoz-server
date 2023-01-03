import { z } from 'zod';
import { branchZod } from './branch.i';
import { Document } from 'mongoose';
export const departmentZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  phone: z.string().optional(),
  branch: branchZod || z.string(),
});
export type IDepartment = z.infer<typeof departmentZod>;
export type departmentDocument = IDepartment & Document & {};
