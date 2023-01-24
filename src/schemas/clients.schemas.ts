import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';
import { IClient, clientDocument, clientZod } from '@interfaces/primary/client.i';
import { address, identity } from './common';
export const clientsSchema = new mongoose.Schema<clientDocument>({
  name: { type: String, required: true },
  address: address,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false },
  identity: {
    type: {
      type: String,
      enum: ['Fisical', 'Company'],
      default: 'Company',
    },
    identity: identity,
  },
  phone: { type: String, required: true },
  rnc: { type: String, required: true },
});

clientsSchema.methods.VerifySchema = function (Cdata?: clientDocument): {
  success: boolean;
  err?: any;
  data?: IClient;
} {
  Cdata = Cdata ? Cdata : (this as clientDocument);
  const parse = clientZod.safeParse(Cdata);
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

clientsSchema.methods.ToClient = function (): IClient {
  const curr = this as clientDocument;
  const client = {
    id: curr._id.toString(),
    name: curr.name,
    address: curr.address,
    user: curr.user,
    identity: curr.identity,
    phone: curr.phone,
    rnc: curr.rnc,
  };
  return client;
};
