import { Response } from 'express';
//import UserModel from '@models/users.models';
import ExpensesModel from '@models/expenses.models';
//import EmployeesModel from '@models/employees.models';
import Logger from '@libs/logger';
import { PrivReq as Request } from '@utils/middleware';

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

// Fuction of the route: POST /api/v1/expenses
export const postExpenses = async (_req: Request, _res: Response) => {
  //this is where we register a new expense
  return;
};
