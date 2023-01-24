import { saleDocument } from '@interfaces/primary/sale.i';
import mongoose from 'mongoose';
import { salesSchema } from '@schemas/sales.schemas';
const salesModel = mongoose.model<saleDocument>('sales', salesSchema);
export default salesModel;
