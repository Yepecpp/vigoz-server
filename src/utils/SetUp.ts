import UsersModel from '@models/users.models';
import CompaniesModel from '@models/companies.models';
import BranchesModel from '@models/branches.models';
import DepartamentsModel from '@models/departments.models';
import EmployeesModel from '@models/employees.models';
import Encrypt from '@utils/encyrpt';
import Logger from '@libs/logger';
import mongoose from 'mongoose';
const SetUp = async () => {
  const compid = await CheckCompanie();
  const depid = await CheckDepartament(await CheckBranch(compid));
  await CheckEmployee(await CheckAdmin(), depid);
};

const CheckCompanie = async () => {
  const Companie = await CompaniesModel.findOne({});
  if (Companie) return Companie._id as mongoose.Types.ObjectId;
  const companie = new CompaniesModel({
    name: 'Hielo Vigoz',
    phone: '0000000000',
    status: 'active',
    address: {
      street1: 'admin',
      street2: 'admin',
      city: 'admin',
      zip: '00000',
    },
    email: 'hey@hey.com',
    currencies: {
      default: {
        name: 'Dominican Peso',
        symbol: '$',
        code: 'DOP',
      },
      available: [],
    },
  });
  await companie.save();
  Logger.info('Companie created');
  return companie._id as mongoose.Types.ObjectId;
};
const CheckAdmin = async () => {
  const Admin = await UsersModel.findOne({ roles: 'admin' });
  if (Admin) return Admin._id as mongoose.Types.ObjectId;
  const admin = new UsersModel({
    login: {
      username: 'admin',
      passw: await Encrypt.hash('admin'),
      email: 'admin@admin.com',
      provider: 'local',
    },
    name: 'admin',
    last_name: 'admin',
    phone: '0000000000',
    status: 'active',
  });
  await admin.save();
  Logger.info('Admin created');
  return admin._id as mongoose.Types.ObjectId;
};
const CheckEmployee = async (id: mongoose.Types.ObjectId, depid: mongoose.Types.ObjectId) => {
  const Employee = await EmployeesModel.findOne({});
  if (Employee) return;
  const employee = new EmployeesModel({
    department: depid,
    salary: {
      amount: 0,
      currency: 'DOP',
    },
    identity: {
      type: 'ID',
      number: '0000000000',
      expiration: new Date(),
      country: 'Dominican Republic',
      state: 'Santo Domingo',
    },
    address: {
      street1: 'admin',
      street2: 'admin',
      city: 'admin',
      zip: '00000',
    },
    user: id,
    role: 'admin',
    status: 'active',
  });
  await employee.save();
  Logger.info('Employee created');
  return;
};
const CheckBranch = async (id: mongoose.Types.ObjectId) => {
  const Branch = await BranchesModel.findOne({ name: 'Principal' });
  if (Branch) return Branch._id as mongoose.Types.ObjectId;
  const branch = new BranchesModel({
    name: 'Principal',
    phone: '0000000000',
    address: {
      street1: 'admin',
      street2: 'admin',
      city: 'admin',
      zip: '00000',
    },
    email: 'email@email.com',
    company: id,
  });
  await branch.save();
  Logger.info('Branch created');
  return branch._id as mongoose.Types.ObjectId;
};
const CheckDepartament = async (id: mongoose.Types.ObjectId) => {
  const Departament = await DepartamentsModel.findOne({});
  if (Departament) return Departament._id as mongoose.Types.ObjectId;
  const departament = new DepartamentsModel({
    name: 'IT',
    phone: '0000000000',
    status: 'active',
    branch: id,
  });
  await departament.save();
  Logger.info('Departament created');
  return departament._id as mongoose.Types.ObjectId;
};
export default SetUp;
