import { Response } from 'express';
//import UserModel from '@models/users.models';
import ExpensesModel from '@models/expenses.models';
//import EmployeesModel from '@models/employees.models';
import Logger from '@libs/logger';
import { PrivReq as Request } from '@utils/middleware';
import ProvidersModel from '@models/providers.models';
import EmployeesModel from '@models/employees.models';

// Fuction of the route: GET /api/v1/expenses
export const getExpenses = async (req: Request, res: Response) => {
  //this is where we get all the users;
  if (!req.auth) {
    Logger.warn('no token provided on auth routes');
    res.status(401).send({ msg: 'no token provided' });
    return;
  }
  const query = req.query as any;
  const expenses = await ExpensesModel.find(query);

  res.status(200).send({ users: expenses.map((exp) => exp.ToClient()) });
};
const VerifyDestination = async (destination: string, destinationData: string): Promise<boolean> => {
  const model: any = destination === 'employees' ? EmployeesModel : ProvidersModel;
  const data = await model.findById(destinationData);
  return !data ? false : true;
};
// Fuction of the route: POST /api/v1/expenses
export const postExpenses = async (req: Request, res: Response) => {
  //this is where we register a new expense
  const newExpense = req.body.expense;
  const expense = new ExpensesModel(newExpense);
  const verify = expense.VerifySchema(newExpense);
  if (!verify.success) {
    res.status(400).send({ msg: verify.err });
  }
  const destination = await VerifyDestination(expense.destination, expense.destinationData as string);
  if (!destination) {
    res.status(400).send({ msg: 'destination not valid' });
    return;
  }
  await expense.save();
  return;
};
// Fuction of the route: GET /api/v1/expenses/
export const getExpense = async (req: Request, res: Response) => {
  //this is where we get a specific expense
  const id = req.params.id;
  const expense = await ExpensesModel.findById(id);
  if (!expense) {
    res.status(404).send({ msg: 'expense not found' });
    return;
  }
  res.status(200).send({ expense: expense.ToClient() });
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
};
