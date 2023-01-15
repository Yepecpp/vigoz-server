import { expensesSchema } from '@schemas/expenses.schemas';
import { expenseDocument } from '@interfaces/primary/expense.i';
import mongoose from 'mongoose';

const ExpensesModel = mongoose.model<expenseDocument>('expenses', expensesSchema);
export default ExpensesModel;
