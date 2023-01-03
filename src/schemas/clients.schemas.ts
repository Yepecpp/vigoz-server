import mongoose from 'mongoose';
import { IClient, clientDocument, clientZod } from '@interfaces/primary/client.i';
export const clientsSchema = new mongoose.Schema<clientDocument>({
  name: { type: String, required: true },
  address: { type: Object, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  identity: { type: Object, required: true },
  phone: { type: String, required: true },
  rnc: { type: String, required: true },
});
clientsSchema.methods.VerifySchema = function (Udata?: clientDocument) {
  const check = clientZod.safeParse(Udata || this);
  if (check.success) {
    return { success: true, data: check.data };
  }
  return { success: false, error: check.error };
};
clientsSchema.methods.ToClient = function () {
  const data = this as any;
  return {
    id: data._id,
    name: data.name,
    address: data.address,
    user: data.user,
    identity: data.identity,
    phone: data.phone,
    rnc: data.rnc,
  } as IClient;
};
