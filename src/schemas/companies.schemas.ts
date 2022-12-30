import { CompanyDocument } from '@interfaces/primary/company.i';
import mongoose from 'mongoose';
export const companiesSchema = new mongoose.Schema<CompanyDocument>({
  name: { type: String, required: true },
  address: { type: Object, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String, required: false },
  logo: { type: Array, required: false },
  description: { type: String, required: false },
  status: { type: String, required: true, default: 'active' },
  created_at: {
    type: Date,
    required: false,
    default: Date.now,
    immutable: true,
  },
  updated_at: { type: Date, required: false, default: Date.now },
  currencies: { type: Object, required: true },
});
