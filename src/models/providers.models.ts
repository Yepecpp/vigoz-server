import { providerDocument } from '@interfaces/primary/provider.i';
import mongoose from 'mongoose';
import { providersSchema } from '@schemas/providers.schemas';
const providersModel = mongoose.model<providerDocument>('providers', providersSchema);
export default providersModel;
