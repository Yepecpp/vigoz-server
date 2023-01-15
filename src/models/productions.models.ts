import { productionDocument } from '@interfaces/primary/production.i';
import mongoose from 'mongoose';
import { productionsSchema } from '@schemas/productions.schemas';
const productionsModel = mongoose.model<productionDocument>('productions', productionsSchema);
export default productionsModel;
