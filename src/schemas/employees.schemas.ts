import { employeeDocument } from '@interfaces/primary/employee.i';
import mongoose from 'mongoose';
export const employeesSchema = new mongoose.Schema<employeeDocument>({
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'departments' },
  salary: { type: Object, required: true },
  identity: { type: Object, required: true },
  address: { type: Object, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  role: { type: String, required: true },
});
