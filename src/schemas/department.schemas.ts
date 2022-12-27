import mongoose from 'mongoose';
import { departmentDocument } from '@interfaces/primary/department.i';
export const departmentsSchema = new mongoose.Schema<departmentDocument>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "branches", required: true },
});