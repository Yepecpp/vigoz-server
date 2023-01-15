import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';
import { IClient, clientDocument, clientZod } from '@interfaces/primary/client.i';

export const clientsSchema = new mongoose.Schema<clientDocument>({
  name: { type: String, required: true },
  address: { type: Object, required: true } || { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  identity: { type: Object, required: true } || { type: String, required: true },
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
