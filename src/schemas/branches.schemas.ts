import { branchDocument } from '@interfaces/primary/branch.i';
import mongoose from 'mongoose';
export const branchesSchema = new mongoose.Schema<branchDocument>({
  name: { type: String, required: true },
  address: { type: Object, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies',
    required: true,
  },
});
