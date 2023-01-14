import { Response } from 'express';
import BranchesModel from '@models/branches.models';
import { PrivReq as Request } from '@utils/middleware';
import Logger from '@libs/logger';

// Fuction of the route: GET /api/v1/branches
export const getBranch = async (_req: Request, res: Response) => {
  const branches = await BranchesModel.find();

  if (!branches) {
    Logger.warn('no branches found');
    res.status(404).send({ msg: 'no branches found' });
    return;
  }
  res.status(200).send({ msg: 'branches', branches: branches.map((branch) => branch.ToClient()) });
};

// Fuction of the route: POST /api/v1/branches
export const postBranch = async (req: Request, res: Response) => {
  const branch = new BranchesModel(req.body.branch);
  const check = branch.VerifySchema();

  if (!check.success) {
    Logger.warn('branch data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ msg: 'branch data is not valid', err: check.err });
    return;
  }

  await branch.save();
  res.status(201).send({ msg: 'branch added', branch: branch.ToClient() });
};

// Fuction of the route: PUT /api/v1/branches
export const putBranch = async (req: Request, res: Response) => {
  const branch = await BranchesModel.findById(req.body.branch._id);

  if (!branch) {
    Logger.warn("cant update this branch beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant update this branch beacuse it doesn't exists",
    });
    return;
  }

  const newdata = req.body.branch;
  const check = branch.VerifySchema(newdata);

  if (!check.success) {
    Logger.warn('branch data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'branch data is not valid' });
    return;
  }

  branch.company = newdata.company;
  branch.name = newdata.name;
  branch.address = newdata.address;
  branch.phone = newdata.phone;
  branch.email = newdata.email;

  //   await branch.save();
  res.status(200).send({ msg: 'branch updated', branch: branch.ToClient() });
};
