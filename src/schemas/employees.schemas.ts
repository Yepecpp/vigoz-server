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
    amounts: [{ type: Number, required: true }],
    currency: {
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      code: { type: String, required: true },
    },
    period: { type: String, required: true },
  },
  birthDate: { type: Date, required: true },
  identity: identity,
  address: address,
  details: {
    position: { type: String, required: true },
    type: {
      type: String,
      enum: ['fulltime', 'part-time', 'contractor', 'inter'],
      default: 'fulltime',
    },
    contract: {
      hireday: { type: Date, required: true, default: Date.now(), immutable: true },
      terminated: { type: Date },
      Id: { type: String },
    },
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other',
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', unique: true },
  role: { type: String, required: true },
});

employeesSchema.methods.ToClient = function (): IEmployee {
  const curr = this as employeeDocument;
  const employee = {
    id: curr._id.toString(),
    department: curr.department,
    salary: curr.salary,
    identity: curr.identity,
    birthDate: curr.birthDate,
    address: curr.address,
    user: curr.user,
    role: curr.role,
    details: curr.details,
    gender: curr.gender,
  };
  return employee;
};

employeesSchema.methods.VerifySchema = function (Epdata?: any): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: IEmployee;
} {
  if (!Epdata) {
    Epdata = this as any;
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
