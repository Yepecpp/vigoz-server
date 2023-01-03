import {
  expenseDocument,
  expenseZod,
  IExpense,
} from '@interfaces/primary/expense.i';
import { z } from 'zod';
import mongoose from 'mongoose';

export const expensesSchema = new mongoose.Schema<expenseDocument>({
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Object, required: true },
  date_ex: { type: Date, required: true },
  state: { type: Boolean, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

expensesSchema.methods.VerifySchema = function (
  Edata?: IExpense | expenseDocument
): {
  success: boolean;
  error?: z.ZodError<IExpense>;
  data?: IExpense;
} {
  if (!Edata) {
    Edata = this;
  }
  let parse = expenseZod.safeParse(Edata);
  if (!parse.success) {
    return { success: false, error: parse.error };
  }
  return { success: true, data: parse.data };
};
