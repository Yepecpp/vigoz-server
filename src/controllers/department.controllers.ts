import { Response } from 'express';
import DeparmentModel from '@models/departments.models';
import BranchesModel from '@models/branches.models';
import Logger from '@libs/logger';
import { PrivReq as Request } from '@utils/middleware';
import { ToQuery } from '@utils/mongooseUtils';

// Fuction of the route: GET /api/v1/department
export const getDeparment = async (req: Request, res: Response) => {
  //this is where we get all the departments
  const query = ToQuery(req.query);
  const departments = await DeparmentModel.find(query);
  res.status(200).send({
    msg: 'departments',
    departments: departments.map((department) => department.ToClient()),
  });
};

// Fuction of the route: POST /api/v1/department
export const postDepartment = async (req: Request, res: Response) => {
  //this is where we register a new department
  const newdepartment = req.body.department;
  const branch = await BranchesModel.findOne();
  if (!branch) {
    Logger.warn('branch not found');
    res.status(404).send({ msg: 'branch not found' });
    return;
  }

  newdepartment.branch = branch._id.toString();
  const department = new DeparmentModel(newdepartment);
  const check = department.VerifySchema(newdepartment);

  if (!check.success) {
    Logger.warn('Department data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'Department data is not valid' });
    return;
  }

  await department.save();
  res.status(200).send({ msg: 'department added', department: department.ToClient() });
};

// Fuction of the route: PUT /api/v1/department
export const putDepartment = async (req: Request, res: Response) => {
  //this is where we update a department
  const department = await DeparmentModel.findById(req.body.department.id);

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
};
