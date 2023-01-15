import { CompanyDocument, ICompany, companyZod } from '@interfaces/primary/company.i';
import zoderr from '@utils/zoderr';
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

companiesSchema.methods.VerifySchema = function (Cdata?: CompanyDocument): {
  success: boolean;
  err?: any;
  data?: ICompany;
} {
  Cdata = Cdata ? Cdata : (this as CompanyDocument);
  const parse = companyZod.safeParse(Cdata);
  if (parse.success) {
    return {
      success: true,
      data: parse.data,
    };
  }
  return {
    success: false,
    err: zoderr(parse.error),
  };
};

companiesSchema.methods.ToClient = function (): ICompany {
  const curr = this as CompanyDocument;
  const company = {
    id: curr._id.toString(),
    name: curr.name,
    address: curr.address,
    phone: curr.phone,
    email: curr.email,
    website: curr.website,
    logo: curr.logo,
    description: curr.description,
    status: curr.status,
    created_at: curr.created_at,
    updated_at: curr.updated_at,
    currencies: curr.currencies,
  };
  return company;
};
