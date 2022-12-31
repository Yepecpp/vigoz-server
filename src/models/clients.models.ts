import { clientsSchema } from '@schemas/clients.schemas';
import { clientDocument } from '@interfaces/primary/client.i';
import mongoose from 'mongoose';
const ClientsModel = mongoose.model<clientDocument>('Clients', clientsSchema);
export default ClientsModel;
