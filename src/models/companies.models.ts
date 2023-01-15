import { companiesSchema } from '@schemas/companies.schemas';
import { CompanyDocument } from '@interfaces/primary/company.i';
import mongoose from 'mongoose';
const Companies = mongoose.model<CompanyDocument>('companies', companiesSchema);
export default Companies;
