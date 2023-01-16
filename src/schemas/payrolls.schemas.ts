import { payrollZod, payrollDocument, IPayroll } from '@interfaces/primary/payroll.i';
import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';
export const payrollsSchema = new mongoose.Schema<payrollDocument>({
  period: {
    type: String,
    default: () => {
      const date = new Date();
      return `${date.getMonth() + 1}-${date.getFullYear()}`;
    },
  },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' } || {
    type: String,
    required: true,
  },
  values: {
    currency: {
      symbol: { type: String, required: true },
      name: { type: String, required: true },
      code: { type: String, required: true },
    },
    salary: { type: Number, required: true, positive: true },
    extra: { type: Number, required: true, positive: true },
    tax: {
      percentage: { type: Number, required: true, positive: true },
      amount: { type: Number, required: true, positive: true },
    },
    social: {
      health: {
        percentage: { type: Number, required: true, positive: true },
        amount: { type: Number, required: true, positive: true },
      },
      pension: {
        percentage: { type: Number, required: true, positive: true },
        amount: { type: Number, required: true, positive: true },
      },
      total: {
        percentage: { type: Number, required: true, positive: true },
        amount: { type: Number, required: true, positive: true },
      },
    },
    netAmount: { type: Number, required: true, positive: true },
  },
  createdAt: { type: Date, default: new Date() },
  process: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    updatedAt: { type: Date, default: new Date() },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' } || {
      type: String,
      required: true,
    },
  },
});
payrollsSchema.methods.VerifySchema = function (Pdata?: IPayroll | payrollDocument): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: IPayroll;
} {
  const data = (Pdata as any) || (this as any);
  const check = payrollZod.safeParse(data);
  if (!check.success) {
    return { success: false, err: zoderr(check.error) };
  }
  return { success: true, data: check.data };
};
payrollsSchema.methods.ToClient = function (): IPayroll {
  const curr = this as any;
  const payroll = {
    id: curr._id.toString(),
    period: curr.period,
    employee: curr.employee,
    values: curr.values,
    createdAt: curr.createdAt,
    process: curr.process,
  };
  return payroll;
};

