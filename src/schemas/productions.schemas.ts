import { IProduction, productionDocument, productionZod } from '@interfaces/primary/production.i';
import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';
export const productionsSchema = new mongoose.Schema<productionDocument>({
  date: { type: Date, required: true, default: Date.now },
  product: {
    type: { type: String, required: true, enum: ['Ice', 'Bags'], default: 'Ice' },
    quantity: { type: Number, required: true, default: 0 },
  },
  storage: { type: mongoose.Schema.Types.ObjectId, ref: 'storages', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true },
});
productionsSchema.methods.VerifySchema = function (Udata?: IProduction | productionDocument): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: IProduction;
} {
  if (!Udata) {
    Udata = this;
  }
  let parse = productionZod.safeParse(Udata);
  if (!parse.success) {
    return { success: false, err: zoderr(parse.error) };
  }
  return { success: true, data: parse.data };
};
productionsSchema.methods.ToClient = function (): IProduction {
  const curr = this as productionDocument;
  const production = {
    id: curr._id.toString(),
    date: curr.date,
    product: curr.product,
    storage: curr.storage,
    employee: curr.employee,
  };
  return production;
};
