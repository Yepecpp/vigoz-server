import mongoose from 'mongoose';
import { payrollDocument } from '@interfaces/primary/payroll.i';
import { payrollsSchema } from '@schemas/payrolls.schemas';
const PayrollsModel = mongoose.model<payrollDocument>('payrolls', payrollsSchema);
export default PayrollsModel;

