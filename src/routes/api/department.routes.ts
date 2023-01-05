import { Response, Router } from 'express';
import UserModel from '@models/users.models';
import DeparmentModel from '@models/departments.models';
import BranchesModel from '@models/branches.models';
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
  //this is where we register a new department
  const department = new DeparmentModel(req.body.department);
  const branch = await BranchesModel.findOne();

  if (!branch) {
    Logger.warn('branch not found');
    res.status(404).send({ msg: 'branch not found' });
    return;
  }

  department.branch = branch._id.toString();
  const check = department.VerifySchema();

  if (!check.success) {
    Logger.warn('Department data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'Department data is not valid' });
    return;
  }

  // await department.save();
  res.status(200).send({ msg: 'department added', department: department.ToClient() });
});

export default router;
