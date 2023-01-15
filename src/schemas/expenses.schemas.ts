import { expenseDocument, expenseZod, IExpense } from '@interfaces/primary/expense.i';
import mongoose from 'mongoose';
import zoderr from '@utils/zoderr';

export const expensesSchema = new mongoose.Schema<expenseDocument>({
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Object, required: true },
  date_ex: { type: Date, required: true },
  state: { type: Boolean, required: true },
  empReq: { type: mongoose.Schema.Types.ObjectId, ref: 'Employees', required: true },
  empTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employees', required: false },
});

expensesSchema.methods.VerifySchema = function (Edata?: IExpense | expenseDocument): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: IExpense;
} {
  if (!Edata) {
    Edata = this;
  }
  let parse = expenseZod.safeParse(Edata);
  if (!parse.success) {
    return { success: false, err: zoderr(parse.error) };
  }
  return { success: true, data: parse.data };
};

expensesSchema.methods.ToClient = function (): IExpense {
  const curr = this as expenseDocument;
  const expense = {
    id: curr._id.toString(),
    category: curr.category,
    description: curr.description,
    amount: curr.amount,
    date_ex: curr.date_ex,
    state: curr.state,
    empReq: curr.empReq,
    empTo: curr.empTo,
  };
  return expense;
};
