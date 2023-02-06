import { Response } from 'express';
import Logger from '@libs/logger';
import storagesModel from '@models/storages.models';
import EmployeesModel from '@models/employees.models';
import { PrivReq as Request } from '@utils/middleware';
import BranchesModel from '@models/branches.models';
import { ToQuery } from '@utils/mongooseUtils';
import productionsModel from '@models/productions.models';
export const getStorages = async (req: Request, res: Response) => {
  const query = ToQuery(req.query);
  const storages = await storagesModel.find(query);
  res.status(200).send({ msg: 'storages', storages: storages.map((storage) => storage.ToClient()) });
};
export const postStorage = async (req: Request, res: Response) => {
  const newstorage = req.body.storage;
  const storage = new storagesModel(newstorage);
  const check = storage.VerifySchema(newstorage);
  if (!check.success) {
    Logger.warn('storage data is not valid');
    res.status(400).send({ msg: 'storage data is not valid', err: check.error });
    return;
  }
  if (storage.currentCapacity > storage.maxCapacity) {
    Logger.warn('storage currentCapacity is greater than maxCapacity');
    res.status(400).send({ msg: 'storage currentCapacity is greater than maxCapacity' });
    return;
  }
  const branch = BranchesModel.findById(storage.branch);
  if (!branch) {
    Logger.warn('branch not found');
    res.status(404).send({ msg: 'branch not found' });
    return;
  }
  await storage.save();
  res.status(201).send({ msg: 'storage added', storage: storage.ToClient() });
};
export const putStorage = async (req: Request, res: Response) => {
  if (req.auth?.role === undefined || req.auth.role > 1) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }
  const newstorage = req.body.storage;
  const storage = await storagesModel.findOne({ _id: newstorage.id });
  if (!storage) {
    Logger.warn('storage not found');
    res.status(404).send({ msg: 'storage not found' });
    return;
  }
  const check = storage.VerifySchema(newstorage);
  if (!check.success) {
    Logger.warn('storage data is not valid');
    res.status(400).send({ msg: 'storage data is not valid', err: check.error });
    return;
  }
  if (newstorage.currentCapacity > newstorage.maxCapacity) {
    Logger.warn('storage currentCapacity is greater than maxCapacity');
    res.status(400).send({ msg: 'storage currentCapacity is greater than maxCapacity' });
    return;
  }
  const branch = BranchesModel.findById(storage.branch);
  if (!branch) {
    Logger.warn('branch not found');
    res.status(404).send({ msg: 'branch not found' });
    return;
  }
  storage.name = newstorage.name;
  storage.category = newstorage.category;
  storage.status = newstorage.status;
  storage.maxCapacity = newstorage.maxCapacity;
  storage.currentCapacity = newstorage.currentCapacity;
  storage.updatedAt = new Date();
  await storage.save();
  res.status(200).send({ msg: 'storage updated', storage: storage.ToClient() });
};

export const getProduction = async (req: Request, res: Response) => {
  const query = ToQuery(req.query);
  const production = await productionsModel.find(query);
  res.status(200).send({ msg: 'production', production: production.map((production) => production.ToClient()) });
};
export const postProduction = async (req: Request, res: Response) => {
  const newproduction = req.body.production;
  const production = new productionsModel(newproduction);
  const check = production.VerifySchema(newproduction);
  if (!check.success) {
    Logger.warn('production data is not valid');
    res.status(400).send({ msg: 'production data is not valid', err: check.err });
    return;
  }
  const [storage, employee] = await Promise.all([storagesModel.findById(newproduction.storage), EmployeesModel.findById(newproduction.employee)]);
  if (!storage) {
    Logger.warn('storage not found');
    res.status(404).send({ msg: 'storage not found' });
    return;
  }
  if (production.product.quantity > storage.maxCapacity - storage.currentCapacity) {
    Logger.warn('storage currentCapacity is greater than maxCapacity');
    res.status(400).send({ msg: 'storage currentCapacity is greater than maxCapacity' });
    return;
  }
  if (!employee) {
    Logger.warn('employee not found');
    res.status(404).send({ msg: 'employee not found' });
    return;
  }
  await production.save();
};

export const putProduction = async (req: Request, res: Response) => {
  const newproduction = req.body.production;
  const production = await productionsModel.findById(newproduction.id);
  if (!production) {
    Logger.warn('production not found');
    res.status(404).send({ msg: 'production not found' });
    return;
  }
  const check = production.VerifySchema(newproduction);
  if (!check.success) {
    Logger.warn('production data is not valid');
    res.status(400).send({ msg: 'production data is not valid', err: check.err });
    return;
  }
  const [storage, employee] = await Promise.all([storagesModel.findById(newproduction.storage), EmployeesModel.findById(newproduction.employee)]);
  if (!storage) {
    Logger.warn('storage not found');
    res.status(404).send({ msg: 'storage not found' });
    return;
  }
  if (production.product.quantity > storage.maxCapacity - storage.currentCapacity) {
    Logger.warn('storage currentCapacity is greater than maxCapacity');
    res.status(400).send({ msg: 'storage currentCapacity is greater than maxCapacity' });
    return;
  }
  if (!employee) {
    Logger.warn('employee not found');
    res.status(404).send({ msg: 'employee not found' });
    return;
  }
  production.product = newproduction.product;
  production.storage = newproduction.storage;
  production.employee = newproduction.employee;
  production.updatedAt = new Date();
  await production.save();
};

