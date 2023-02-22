import { Response } from 'express';
//import UserModel from '@models/users.models';
import ExpensesModel from '@models/expenses.models';
//import EmployeesModel from '@models/employees.models';
import Logger from '@libs/logger';
import { PrivReq as Request } from '@utils/middleware';
import ProvidersModel from '@models/providers.models';
import EmployeesModel from '@models/employees.models';
import { ToQuery } from '@utils/mongooseUtils';
import { IExpense } from '@interfaces/primary/expense.i';

// Fuction of the route: GET /api/v1/expenses
export const getExpenses = async (req: Request, res: Response) => {
  //this is where we get all the users;
  if (!req.auth) {
    Logger.warn('no token provided on auth routes');
    res.status(401).send({ msg: 'no token provided' });
    return;
  }
  const query = ToQuery(req.query);
  const expenses = await ExpensesModel.find(query);

  res.status(200).send({ expenses: expenses.map((exp) => exp.ToClient()) });
};
const VerifyDestination = async (destination: string, destinationData: string) => {
  const model: any = destination === 'employee' ? EmployeesModel : ProvidersModel;
  return model.findOne({ _id: destinationData });
};
// Fuction of the route: POST /api/v1/expenses
export const postExpenses = async (req: Request, res: Response) => {
  //this is where we register a new expense
  const newExpense = req.body.expense as IExpense;
  newExpense.creatorEmp = req.auth?.employee?._id.toString() as string;
  const expense = new ExpensesModel(newExpense);
  const verify = expense.VerifySchema(newExpense);
  if (!verify.success) {
    console.log(verify.err);
    res.status(400).send({ err: verify.err, msg: 'invalid schema' });
    return;
  }
  const destination = await VerifyDestination(expense.destination, expense.destinationData.toString());
  if (!destination) {
    console.log('destination not valid');
    console.log(expense.destination);
    res.status(400).send({ msg: 'destination not valid' });
    return;
  }
  await expense.save();
  res.status(200).send({ expense: expense.ToClient() });
  return;
};

// Fuction of the route: PUT /api/v1/expenses/
export const putExpense = async (req: Request, res: Response) => {
  //this is where we update a specific expense
  const expense = await ExpensesModel.findById(req.params.id);
  if (!expense) {
    res.status(404).send({ msg: 'expense not found' });
    return;
  }
  const newExpense = req.body.expense;
  const verify = expense.VerifySchema(newExpense);
  if (!verify.success) {
    res.status(400).send({ msg: verify.err });
    return;
  }
  const destination = await VerifyDestination(expense.destination, expense.destinationData as string);
  if (!destination) {
    res.status(400).send({ msg: 'destination not valid' });
    return;
  }
  expense.set(newExpense);

  await expense.save();
  res.status(200).send({ expense: expense.ToClient() });
  return;
};
