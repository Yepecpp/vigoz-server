import { clientsSchema } from '@schemas/clients.schemas';
import { clientDocument } from '@interfaces/primary/client.i';
import mongoose from 'mongoose';
const ClientsModel = mongoose.model<clientDocument>('clients', clientsSchema);
export default ClientsModel;
