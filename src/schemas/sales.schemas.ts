import { ISale, saleDocument, saleZod } from '@interfaces/primary/sale.i';
import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';
export const salesSchema = new mongoose.Schema<saleDocument>({
  date: { type: Date, required: true, default: Date.now },
  amount: {
    total: { type: Number, required: true },
    fromStorage: { type: mongoose.Schema.Types.ObjectId, ref: 'storages' },
  },
  state: {
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'canceled'],
      default: 'pending',
    },
    updated: { type: Date, required: true, default: Date.now },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' },
  },
  value: {
    total: { type: Number, required: true },
    indivudual: { type: Number, required: true },
    currency: {
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      code: { type: String, required: true },
    },
  },
  sellerEmp: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' },
  destination: {
    type: {
      type: String,
      required: true,
      enum: ['client', 'unoficial', 'distribution'],
      default: 'unoficial',
    },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'clients' }],
  },
});
salesSchema.methods.VerifySchema = function (Udata?: ISale | saleDocument): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: ISale;
} {
  if (!Udata) {
    Udata = this;
  }
  let parse = saleZod.safeParse(Udata);
  if (!parse.success) {
    return { success: false, err: zoderr(parse.error) };
  }
  return { success: true, data: parse.data };
};
salesSchema.methods.ToClient = function () {};
