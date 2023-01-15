import { IStorage, storageZod, storageDocument } from '@interfaces/primary/storage.i';
import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';
const storagesSchema = new mongoose.Schema<storageDocument>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  maxCapacity: { type: Number, required: true },
  currentCapacity: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now, immutable: true },
  updatedAt: { type: Date, required: true, default: Date.now },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branches', required: true },
});
storagesSchema.methods.VerifySchema = function (Udata?: IStorage | storageDocument): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: IStorage;
} {
  if (!Udata) {
    Udata = this;
  }
  let parse = storageZod.safeParse(Udata);
  if (!parse.success) {
    return { success: false, err: zoderr(parse.error) };
  }
  return { success: true, data: parse.data };
};
storagesSchema.methods.ToClient = function (): IStorage {
  const curr = this as storageDocument;
  const storage = {
    id: curr._id.toString(),
    name: curr.name,
    category: curr.category,
    status: curr.status,
    maxCapacity: curr.maxCapacity,
    currentCapacity: curr.currentCapacity,
    createdAt: curr.createdAt,
    updatedAt: curr.updatedAt,
    branch: curr.branch,
  };
  return storage;
};

