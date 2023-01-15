import { expensesSchema } from '@schemas/expenses.schemas';
import { expenseDocument } from '@interfaces/primary/expense.i';
import mongoose from 'mongoose';

const ExpensesModel = mongoose.model<expenseDocument>('Expenses', expensesSchema);
export default ExpensesModel;
