import { branchDocument, IBranch, branchZod } from '@interfaces/primary/branch.i';
import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';

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

branchesSchema.methods.VerifySchema = function (Bdata?: branchDocument): {
  success: boolean;
  err?: any;
  data?: IBranch;
} {
  Bdata = Bdata ? Bdata : (this as branchDocument);
  const parse = branchZod.safeParse(Bdata);
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

branchesSchema.methods.ToClient = function (): IBranch {
  const curr = this as branchDocument;
  const branch = {
    id: curr._id.toString(),
    name: curr.name,
    address: curr.address,
    phone: curr.phone,
    email: curr.email,
    company: curr.company,
  };
  return branch;
};
