import { Response, Router } from 'express';
import EmployeesModel from '@models/employees.models';
import { PrivReq as Request } from '@utils/middleware';
import Logger from '@libs/logger';
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  //this is where we get all the employees;
  console.log(req.query);
  const employees = await EmployeesModel.find();
  res
    .status(200)
    .send({ msg: 'employees', employees: employees.map((employee) => employee.ToClient()) });
});

router.get('/:id', async (req: Request, res: Response) => {
  //this is where we get a single employee;
  const employee = await EmployeesModel.findById(req.params.id);
  if (!employee) {
    res.status(404).send({ msg: 'employee not found' });
  } else {
    res.status(200).send({ msg: 'employee', employee: employee.ToClient() });
  }
});

// In this route, we have a problem, i don't know how to fix it, is with zoderr.
router.post('/', async (req: Request, res: Response) => {
  //this is where we create a new employee;
  const employee = new EmployeesModel(req.body.employee);
  const check = employee.VerifySchema();

  if (!check.success) {
    Logger.warn('employee data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ msg: 'employee data is not valid', err: check.err });
    return;
  }

  await employee.save();
  res.status(201).send({ msg: 'employee added', employee: employee.ToClient() });
});

router.put('/', async (req: Request, res: Response) => {
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
});

export default router;
