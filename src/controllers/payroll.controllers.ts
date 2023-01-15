import { Response } from 'express';
import Logger from '@libs/logger';
import { PrivReq as Request } from '@utils/middleware';
import PayrollsModel from '@models/payrolls.models';

// Fuction for set the payroll values (deductions, taxes, etc)
const deductions = (payroll) => {
  const salary = payroll.values.salary;
  const salaryType = {
    exempt: 34685.0,
    rentOne: 52027.42,
    rentTwo: 72260.25,
  };
  let twentyfivePercent,
    twentyPercent,
    surplus = 0;

  payroll.values.social.health.amount =
    payroll.values.salary * payroll.values.social.health.percentage;
  payroll.values.social.pension.amount =
    payroll.values.salary * payroll.values.social.pension.percentage;
  payroll.values.social.total.amount =
    payroll.values.social.health.amount + payroll.values.social.pension.amount;
  payroll.values.social.total.percentage =
    payroll.values.social.health.percentage + payroll.values.social.pension.percentage;

  if (salary > salaryType.rentTwo) {
    surplus = salary - salaryType.rentTwo;
    twentyfivePercent = surplus * 0.25;
    payroll.values.tax.amount = 79776.0 + twentyfivePercent;
  }

  if (salary > salaryType.rentOne && salary <= salaryType.rentTwo) {
    surplus = salary - salaryType.rentOne;
    twentyPercent = surplus * 0.2;
    payroll.values.tax.amount = 31216.0 + twentyPercent;
  }

  if (salary > salaryType.exempt && salary <= salaryType.rentOne) {
    surplus = salary - salaryType.exempt;
    payroll.values.tax.amount = surplus * 0.15;
  }

  payroll.values.tax.percentage = 0;
  payroll.values.netAmount =
    salary - payroll.values.social.total.amount - payroll.values.tax.amount;
};

// Fuction of the route: GET /api/v1/payrolls
export const getPayrolls = async (req: Request, res: Response) => {
  //this is where we get all the payrolls;
  if (req.auth?.role === undefined || req.auth.role > 1) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }
  const query = req.query as any;
  const payrolls = await PayrollsModel.find(query);
  res
    .status(200)
    .send({ msg: 'payrolls', payrolls: payrolls.map((payroll) => payroll.ToClient()) });
};

// Fuction of the route: POST /api/v1/payrolls
export const postPayrolls = async (req: Request, res: Response) => {
  //this is where we register a new payroll
  if (req.auth?.role === undefined || req.auth.role > 1) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }
  const payroll = new PayrollsModel(req.body.payroll);
  deductions(payroll);
  payroll.process.processedBy = req.auth.employee?._id;

  const check = payroll.VerifySchema();

  //   TODO: we have a problem here, check.err is does not exist
  if (!check.success) {
    Logger.warn('Payroll data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'Payroll data is not valid' });
    return;
  }

  await payroll.save();
  res.status(200).send({ msg: 'payroll added', payroll: payroll.ToClient() });
};

// Fuction of the route: PUT /api/v1/payrolls
export const putPayrolls = async (req: Request, res: Response) => {
  //this is where we update a payroll
  if (req.auth?.role === undefined || req.auth.role > 1) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }

  const payroll = await PayrollsModel.findById(req.body.payroll.id);

  if (!payroll) {
    Logger.warn("cant update this department beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant update this department beacuse it doesn't exists",
    });
    return;
  }

  if (req.body.payroll.values.netAmount !== payroll.values.netAmount) {
    deductions(payroll);
  }

  const newdata = req.body.payroll;
  const check = payroll.VerifySchema(newdata);

  //   TODO: we have a problem here, check.err is does not exist
  if (!check.success) {
    Logger.warn('payroll data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'Payroll data is not valid' });
    return;
  }

  payroll.period = newdata.period;
  payroll.employee = newdata.employee;
  payroll.values = newdata.values;
  payroll.createdAt = newdata.createdAt;
  payroll.process = newdata.process;

  await payroll.save();
  res.status(200).send({ msg: 'payroll updated', payroll: payroll.ToClient() });
};

// only the route is missing to delete a payroll
