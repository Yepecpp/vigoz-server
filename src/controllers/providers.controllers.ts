import { Response } from 'express';
import { PrivReq as Request } from '@utils/middleware';
import ProvidersModel from '@models/providers.models';
import Logger from '@libs/logger';
import { ToQuery } from '@utils/mongooseUtils';
export const getProviders = async (req: Request, res: Response) => {
  const query = ToQuery(req.query);
  const providers = await ProvidersModel.find(query);
  res.status(200).send({ msg: 'providers', providers: providers.map((provider) => provider.ToClient()) });
};

export const postProvider = async (req: Request, res: Response) => {
  if (req.auth?.role === undefined || req.auth.role > 1) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }
  const newprovider = req.body.provider;
  const provider = new ProvidersModel(newprovider);
  const check = provider.VerifySchema(newprovider);
  if (!check.success) {
    Logger.warn('provider data is not valid');
    res.status(400).send({ msg: 'provider data is not valid', err: check.error });
    return;
  }
  await provider.save();
  res.status(201).send({ msg: 'provider added', provider: provider.ToClient() });
};

export const putProvider = async (req: Request, res: Response) => {
  if (req.auth?.role === undefined || req.auth.role > 1) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }
  const newprovider = req.body.provider;
  const provider = await ProvidersModel.findOne({ _id: newprovider.id });
  if (!provider) {
    Logger.warn('provider not found');
    res.status(404).send({ msg: 'provider not found' });
    return;
  }
  const check = provider.VerifySchema(newprovider);
  if (!check.success) {
    Logger.warn('provider data is not valid');
    res.status(400).send({ msg: 'provider data is not valid', err: check.error });
    return;
  }
  provider.set(newprovider);
  await provider.save();
  res.status(200).send({ msg: 'provider updated', provider: provider.ToClient() });
};

