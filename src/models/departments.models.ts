import mongoose from 'mongoose';
import { departmentDocument } from '@interfaces/primary/department.i';
import { departmentsSchema } from '@schemas/department.schemas';
const DepartmentModel = mongoose.model<departmentDocument>('departments', departmentsSchema);
export default DepartmentModel;
