import { Response, Router } from 'express';
import DeparmentModel from '@models/departments.models';
import BranchesModel from '@models/branches.models';
import Logger from '@libs/logger';
import { PrivReq as Request } from '@utils/middleware';
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const departments = await DeparmentModel.find();
  console.log(req.query);
  res.status(200).send({
    msg: 'departments',
    departments: departments.map((department) => department.ToClient()),
  });
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

  await department.save();
  res.status(200).send({ msg: 'department added', department: department.ToClient() });
});

router.put('/', async (req: Request, res: Response) => {
  //this is where we update a department
  const department = await DeparmentModel.findById(req.body.department._id);

  if (!department) {
    Logger.warn("cant update this department beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant update this department beacuse it doesn't exists",
    });
    return;
  }

  const newdata = req.body.department;
  const check = department.VerifySchema(newdata);

  if (!check.success) {
    Logger.warn('Department data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'Department data is not valid' });
    return;
  }

  department.name = newdata.name;
  department.description = newdata.description;
  department.phone = newdata.phone;
  department.branch = newdata.branch;

  await department.save();
  res.status(200).send({ msg: 'department updated', department: department.ToClient() });
});

export default router;
