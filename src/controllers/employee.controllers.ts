import { Response } from 'express';
import EmployeesModel from '@models/employees.models';
import { PrivReq as Request } from '@utils/middleware';
import Logger from '@libs/logger';
import DepartmentModel from '@models/departments.models';

// Fuction of the route: GET /api/v1/employees
export const getEmployee = async (req: Request, res: Response) => {
  //this is where we get all the employees;
  const employees = await EmployeesModel.find(req.query);
  if (!employees) {
    Logger.warn('no employees found');
    res.status(404).send({ msg: 'no employees found' });
    return;
  }
  res.status(200).send({ employees: employees.map((employee) => employee.ToClient()) });
};

// Fuction of the route: POST /api/v1/employees
export const postEmployee = async (req: Request, res: Response) => {
  //this is where we create a new employee;
  if (req.auth?.role === undefined || req.auth.role > 1) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }
  const employee = new EmployeesModel(req.body.employee);
  if (!employee.salary.currency) {
    const department = await DepartmentModel.findById(employee.department)
      .populate('branches')
      .populate('companies');
    if (!department) {
      Logger.warn('cant add employee because department doesnt exist');
      res.status(404).send({
        msg: 'cant add employee because department doesnt exist',
        err: {
          code: 404,
          expected: 'string',
          recived: employee.department,
        },
        where: 'department',
      });
      return;
    }
    employee.salary.currency = department.branch.company.currencies.default;
  }
  const check = employee.VerifySchema();

  if (!check.success) {
    Logger.warn('employee data is not valid', req.logData);
    res.status(400).send({ msg: 'employee data is not valid', err: check.err });
    return;
  }

  await employee.save();
  res.status(201).send({ msg: 'employee added', employee: employee.ToClient() });
};

// Fuction of the route: PUT /api/v1/employees
export const putEmployee = async (req: Request, res: Response) => {
  //this is where we update a employee;
  const employee = await EmployeesModel.findById(req.body.employee._id);

  if (!employee) {
    Logger.warn("cant update this employee beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant update this employee beacuse it doesn't exists",
    });
    return;
  }

  const newdata = req.body.employee;
  const check = employee.VerifySchema(newdata);

  if (!check.success) {
    Logger.warn('employee data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'employee data is not valid' });
    return;
  }

  employee.user = newdata.user;
  employee.department = newdata.department;
  employee.address = newdata.address;
  employee.identity = newdata.identity;
  employee.salary = newdata.salary;
  employee.role = newdata.role;

  console.log(employee);

  // await employee.save();
  res.status(200).send({ msg: 'employee updated', employee: employee.ToClient() });
};
