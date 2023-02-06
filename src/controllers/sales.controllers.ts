import salesModel from '@models/sales.models';
import { Response } from 'express';
import { PrivReq as Request } from '@utils/middleware';
import Logger from '@libs/logger';
import { ToQuery } from '@utils/mongooseUtils';
import { ISale } from '@interfaces/primary/sale.i';
import storagesModel from '@models/storages.models';
import EmployeesModel from '@models/employees.models';
import ClientsModel from '@models/clients.models';
export const getSales = async (req: Request, res: Response) => {
  const query = ToQuery(req.query);
  const sales = await salesModel.find(query);
  res.status(200).send({ msg: 'sales', sales: sales.map((sale) => sale.ToClient()) });
};
export const postSale = async (req: Request, res: Response) => {
  const newsale = req.body.sale as ISale;
  const sale = new salesModel(newsale);
  const check = sale.VerifySchema(newsale);
  if (!check.success) {
    Logger.warn('sale data is not valid');
    res.status(400).send({ msg: 'sale data is not valid', err: check.error });
    return;
  }
  await sale.save();
  res.status(201).send({ msg: 'sale added', sale: sale.ToClient() });
  const storage = await storagesModel.findById(newsale.amount.fromStorage);
  if (!storage) {
    Logger.warn('storage not found');
    res.status(404).send({ msg: 'storage not found' });
    return;
  }
  if (storage.currentCapacity < newsale.amount.total) {
    Logger.warn('not enough capacity');
    res.status(400).send({ msg: 'not enough capacity' });
    return;
  }
  const [employee, handledBy] = await Promise.all([
    EmployeesModel.findById(newsale.sellerEmp),
    EmployeesModel.findById(newsale.state.handledBy ? newsale.state.handledBy : ''),
  ]);
  if (!employee) {
    Logger.warn('employee not found');
    res.status(404).send({ msg: 'employee not found' });
    return;
  }
  if (!handledBy) {
    if (newsale.state.handledBy) {
      Logger.warn('handledBy not found');
      res.status(404).send({ msg: 'handledBy not found' });
      return;
    }
  }
  if (newsale.destination.clients && newsale.destination.clients.length > 0) {
    const clients = await Promise.all(newsale.destination.clients.map((client) => ClientsModel.findById(client)));
    if (clients.some((client) => !client)) {
      Logger.warn('client not found');
      res.status(404).send({ msg: 'client not found', err: clients.find((client) => !client) });
      return;
    }
  }
  storage.currentCapacity -= newsale.amount.total;
  sale.value.total = sale.amount.total * sale.value.indivudual;
  storage.save();
  await sale.save();
  res.status(201).send({ msg: 'sale added', sale: sale.ToClient() });
};
export const putSale = async (req: Request, res: Response) => {
  const newsale = req.body.sale as ISale;
  const sale = await salesModel.findById(req.params.id);
  if (!sale) {
    Logger.warn('sale not found');
    res.status(404).send({ msg: 'sale not found' });
    return;
  }
  const check = sale.VerifySchema(newsale);
  if (!check.success) {
    Logger.warn('sale data is not valid');
    res.status(400).send({ msg: 'sale data is not valid', err: check.error });
    return;
  }
  sale.state.handledBy = newsale.state.handledBy ? newsale.state.handledBy : '';
  if (sale.state.handledBy !== '') {
    const handledBy = await EmployeesModel.findById(sale.state.handledBy);
    if (!handledBy) {
      Logger.warn('handledBy not found');
      res.status(404).send({ msg: 'handledBy not found' });
      return;
    }
  } else {
    Logger.warn('handledBy not found');
    res.status(404).send({ msg: 'handledBy not found' });
    return;
  }

  sale.state.status = newsale.state.status;
  sale.destination.clients = newsale.destination?.clients;
  if (sale.destination.clients && sale.destination.clients.length > 0) {
    const clients = await Promise.all(sale.destination.clients.map((client) => ClientsModel.findById(client)));
    if (clients.some((client) => !client)) {
      Logger.warn('client not found');
      res.status(404).send({ msg: 'client not found', err: clients.find((client) => !client) });
      return;
    }
  }
  if (newsale.state.status === 'approved') {
    sale.state.updated = new Date();
  }

  await sale.save();
};

