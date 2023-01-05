import { Response, Router } from 'express';
import UserModel from '@models/users.models';
import ExpensesModel from '@models/expenses.models';
import EmployeesModel from '@models/employees.models';
import Logger from '@libs/logger';
import { PrivReq as Request } from '@utils/middleware';
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  //this is where we get all the users;
  if (!req.auth) {
    Logger.warn('no token provided on auth routes');
    res.status(401).send({ msg: 'no token provided' });
    return;
  }

  const users = await UserModel.find();

  res.status(200).send({ msg: 'users', users: users.map((user) => user.ToClient()) });
});

router.post('/', async (req: Request, res: Response) => {
  //this is where we register a new expense
  const expense = new ExpensesModel(req.body.expense);
  const check = expense.VerifySchema();

  if (!check.success) {
    Logger.warn('Expensive data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'Expensive data is not valid' });
    return;
  }
  const employees = await EmployeesModel.find({
    $or: [{ _id: expense.empReq }, { _id: expense.empTo }],
  });
  if (employees.length !== 2) {
    Logger.warn('Employee not found');
    res.status(404).send({
      msg: 'Employee not found',
      err: employees.map((emp) => {
        const id = emp._id;
        return { id: id, found: id === expense.empReq || id === expense.empTo };
      }),
    });
    return;
  }
  await expense.save();
  res.status(200).send({ msg: 'expense added', expense: expense.ToClient() });
});

export default router;
