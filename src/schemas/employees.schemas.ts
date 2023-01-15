import { employeeDocument, employeeZod, IEmployee } from '@interfaces/primary/employee.i';
import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';
import usersModel from '@models/users.models';
import { address, identity } from './common';
export const employeesSchema = new mongoose.Schema<employeeDocument>({
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'departments' } || {
    type: String,
    required: true,
  },
  salary: {
    amount: { type: Number, required: true, positive: true },
    currency: { type: String, required: true },
    period: {
      type: String,
      enum: ['hour', 'day', 'week', 'fortnight', 'month'],
      default: 'fortnight',
    },
  },
  identity: identity,
  address: address,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  role: { type: String, required: true },
});

employeesSchema.methods.ToClient = function (): IEmployee {
  const curr = this as employeeDocument;
  const employee = {
    id: curr._id.toString(),
    department: curr.department,
    salary: curr.salary,
    identity: curr.identity,
    address: curr.address,
    user: curr.user,
    role: curr.role,
  };
  return employee;
};

employeesSchema.methods.VerifySchema = function (Epdata?: IEmployee): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: IEmployee;
} {
  if (!Epdata) {
    Epdata = this as IEmployee;
  }
  const parse = employeeZod.safeParse(Epdata);
  if (parse.success) {
    return {
      success: true,
      data: parse.data,
    };
  }
  return {
    success: false,
    err: zoderr(parse.error),
  };
};

employeesSchema.pre('save', async function (next) {
  if (this.isNew) {
    await usersModel.findByIdAndUpdate(this.user, { is_employee: true });
  }
  next();
});
