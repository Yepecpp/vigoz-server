import { IProvider, providerZod, providerDocument } from '@interfaces/primary/provider.i';
import zoderr from '@utils/zoderr';
import mongoose from 'mongoose';
import { address } from './common';
export const providersSchema = new mongoose.Schema<providerDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  address: address,
  description: { type: String, required: false },
});
providersSchema.methods.VerifySchema = function (Udata?: IProvider | providerDocument): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: IProvider;
} {
  if (!Udata) {
    Udata = this;
  }
  let parse = providerZod.safeParse(Udata);
  if (!parse.success) {
    return { success: false, err: zoderr(parse.error) };
  }
  return { success: true, data: parse.data };
};
providersSchema.methods.ToClient = function (): IProvider {
  const curr = this as providerDocument;
  const provider = {
    id: curr._id.toString(),
    name: curr.name,
    email: curr.email,
    phone: curr.phone,
    address: curr.address,
    description: curr.description,
  };
  return provider;
};
