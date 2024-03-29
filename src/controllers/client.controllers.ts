import { Response } from 'express';
import ClientsModel from '@models/clients.models';
import { PrivReq as Request } from '@utils/middleware';
import Logger from '@libs/logger';
import { ToQuery } from '@utils/mongooseUtils';
// Fuction of the route: GET /api/v1/clients
export const getClient = async (req: Request, res: Response) => {
  const query = ToQuery(req.query);
  const clients = await ClientsModel.find(query);
  if (!clients) {
    Logger.warn('no clients found');
    res.status(404).send({ msg: 'no clients found' });
    return;
  }
  res.status(200).send({ msg: 'clients', clients: clients.map((client) => client.ToClient()) });
};

// Fuction of the route: POST /api/v1/clients
export const postClient = async (req: Request, res: Response) => {
  const newclient = req.body.client;
  if (!newclient) {
    Logger.warn('no client data provided');
    res.status(400).send({ msg: 'no client data provided' });
    return;
  }
  const client = new ClientsModel(newclient);
  const check = client.VerifySchema(newclient);
  if (!check.success) {
    Logger.warn('client data is not valid');
    res.status(400).send({ msg: 'client data is not valid', err: check.err });
    return;
  }

  await client.save();
  res.status(201).send({ msg: 'client added', client: client.ToClient() });
};

// Fuction of the route: PUT /api/v1/clients
export const putClient = async (req: Request, res: Response) => {
  const client = await ClientsModel.findById(req.body.client.id);

  if (!client) {
    Logger.warn("cant update this client beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant update this client beacuse it doesn't exists",
    });
    return;
  }

  const newdata = req.body.client;
  const check = client.VerifySchema(newdata);

  if (!check.success) {
    Logger.warn('client data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'client data is not valid' });
    return;
  }

  client.name = newdata.name;
  client.address = newdata.address;
  client.user = newdata.user;
  client.identity = newdata.identity;
  client.rnc = newdata.rnc;
  client.phone = newdata.phone;
  client.createdAt = newdata.createdAt;
  client.updatedAt = newdata.updatedAt;

  await client.save();
  res.status(200).send({ msg: 'client updated', client: client.ToClient() });
};
