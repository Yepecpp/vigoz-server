import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';
import { departmentZod, departmentDocument, IDepartment } from '@interfaces/primary/department.i';

export const departmentsSchema = new mongoose.Schema<departmentDocument>({
  name: { type: String, required: true },
  description: { type: String, required: false }, // I commented this out because it was causing an error
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'branches', required: true },
  phone: { type: String, required: false },
});

departmentsSchema.methods.VerifySchema = function (Ddata?: IDepartment | departmentDocument): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: IDepartment;
} {
  if (!Ddata) {
    Ddata = this;
  }
  let parse = departmentZod.safeParse(Ddata);
  if (!parse.success) {
    return { success: false, err: zoderr(parse.error) };
  }
  return { success: true, data: parse.data };
};

departmentsSchema.methods.ToClient = function (): IDepartment {
  const curr = this as departmentDocument;
  const department = {
    id: curr._id.toString(),
    name: curr.name,
    description: curr.description,
    branch: curr.branch,
    phone: curr.phone,
  };
  return department;
};
