import { Response } from 'express';
import Logger from '@libs/logger';
import { PrivReq as Request } from '@utils/middleware';
import PayrollsModel from '@models/payrolls.models';
import { IPayroll } from '@interfaces/primary/payroll.i';
import EmployeesModel from '@models/employees.models';
const salaryType = [
  { value: 34685.0, percent: 0 },
  { value: 52027.42, percent: 0 },
  { value: 72260.25, percent: 0 },
];
const socialTypes = {
  health: {
    percentage: 3.04,
  },
  pension: {
    percentage: 0,
  },
};
// Fuction for set the payroll values (deductions, taxes, etc)
const deductions = (payroll: IPayroll, totalSalary: number) => {
  const values = payroll.values;
  const salaryBfTax = values.salary + values.extra;
  const selectedType = salaryType.sort((a, b) => b.value - a.value).find((s) => s.value < totalSalary);
  const taxPercentage = selectedType ? selectedType.percent : 0;
  values.tax = {
    percentage: taxPercentage,
    amount: salaryBfTax * (taxPercentage / 100),
  };
  values.social = {
    health: {
      percentage: socialTypes.health.percentage,
      amount: salaryBfTax * (socialTypes.health.percentage / 100),
    },
    pension: {
      percentage: socialTypes.pension.percentage,
      amount: salaryBfTax * (socialTypes.pension.percentage / 100),
    },
    total: {
      percentage: socialTypes.health.percentage + socialTypes.pension.percentage,
      amount: salaryBfTax * ((socialTypes.health.percentage + socialTypes.pension.percentage) / 100),
    },
  };
  values.netAmount = salaryBfTax - values.tax.amount - values.social.total.amount;
  return values;
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
  res.status(200).send({ msg: 'payrolls', payrolls: payrolls.map((payroll) => payroll.ToClient()) });
};
/*here we recive {
    payroll:{
      employee: string,
      values:{
        currency: {
          code: string,
          name: string,
          symbol: string
        }
        extra: number,
      }
      process:{
        status: string
      }
  }
  */
// Fuction of the route: POST /api/v1/payrolls
export const postPayrolls = async (req: Request, res: Response) => {
  //this is where we register a new payroll
  if (req.auth?.role === undefined || req.auth.role > 1) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }
  const payroll = req.body.payroll as IPayroll;
  // here we check if the employee exists
  const employee = await EmployeesModel.findById(payroll.employee);
  if (!employee) {
    Logger.warn('cant add payroll because employee doesnt exist');
    res.status(404).send({
      msg: 'cant add payroll because employee doesnt exist',
      err: {
        code: 404,
        expected: 'string',
        recived: payroll.employee,
      },
      where: 'employee',
    });
    return;
  }
  const lastPayroll = await PayrollsModel.findOne({ employee: payroll.employee }).sort({
    createdAt: -1,
  });
  if (lastPayroll) {
    if (lastPayroll.process.status === 'pending') {
      Logger.warn('cant add payroll because employee has a pending payroll');
      res.status(400).send({
        msg: 'cant add payroll because employee has a pending payroll',
        err: {
          code: 400,
          expected: 'string',
          recived: payroll.employee,
        },
        where: 'employee',
      });
      return;
    }
    if (lastPayroll.period === payroll.period) {
      payroll.values.salary = employee.salary.amounts[1] ? employee.salary.amounts[1] : 0;
    }
  } else {
    payroll.values.salary = employee.salary.amounts[0] ? employee.salary.amounts[0] : 0;
  }
  // here we insert the values of the employee salary
  payroll.process.processedBy = req.auth.employee?._id.toString();
  payroll.values.extra = payroll.values.extra ? payroll.values.extra : 0;
  // here we calculate the payroll,
  payroll.values = deductions(
    payroll,
    employee.salary.amounts.reduce((a, b) => a + b, 0),
  );
  payroll.values.currency = !payroll.values.currency ? employee.salary.currency : payroll.values.currency;
  // here we set the status of the payroll
  payroll.process.status = payroll.process.status ? payroll.process.status : 'pending';
  const payrolldb = new PayrollsModel(payroll);
  const check = payrolldb.VerifySchema(payroll);

  if (!check.success) {
    Logger.warn('Payroll data is not valid');
    res.status(400).send({ err: check.err, msg: 'Payroll data is not valid' });
    return;
  }
  await payrolldb.save();
  res.status(200).send({ msg: 'payroll added', payroll: payrolldb.ToClient() });
};

// Fuction of the route: PUT /api/v1/payrolls
export const putPayrolls = async (req: Request, res: Response) => {
  //this is where we update a payroll
  if (req.auth?.role === undefined || req.auth.role !== 0) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }

  const payroll = await PayrollsModel.findById(req.body.payroll.id);

  if (!payroll) {
    Logger.warn("cant update this payroll beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant update this payroll beacuse it doesn't exists",
      err: {
        code: 404,
        expected: 'string',
        recived: req.body.payroll.id,
      },
      where: 'id',
    });
    return;
  }
  const newdata = req.body.payroll as IPayroll;
  const employee = await EmployeesModel.findById(payroll.employee);
  if (!employee) {
    Logger.warn('cant update payroll because employee doesnt exist');
    res.status(404).send({
      msg: 'cant update payroll because employee doesnt exist',
      err: {
        code: 404,
        expected: 'string',
        recived: payroll.employee,
      },
      where: 'employee',
    });
    return;
  }
  const check = payroll.VerifySchema(newdata);
  if (!check.success) {
    Logger.warn('payroll data is not valid');
    res.status(400).send({ err: check.err, msg: 'Payroll data is not valid' });
    return;
  }
  if (newdata.values.extra !== payroll.values.extra) {
    payroll.values = deductions(
      payroll,
      employee.salary.amounts.reduce((a, b) => a + b, 0),
    );
  }
  payroll.process = newdata.process;

  await payroll.save();
  res.status(200).send({ msg: 'payroll updated', payroll: payroll.ToClient() });
};

// only the route is missing to delete a payroll
