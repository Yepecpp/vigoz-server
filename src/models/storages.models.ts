import { storageDocument } from '@interfaces/primary/storage.i';
import mongoose from 'mongoose';
import { storagesSchema } from '@schemas/storages.schemas';
const storagesModel = mongoose.model<storageDocument>('storages', storagesSchema);
export default storagesModel;
