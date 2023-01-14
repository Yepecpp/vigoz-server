import { Response } from 'express';
import CompanyModel from '@models/companies.models';
import { PrivReq as Request } from '@utils/middleware';
import Logger from '@libs/logger';

// Fuction of the route: GET /api/v1/companies
export const getCompany = async (_req: Request, res: Response) => {
  const companies = await CompanyModel.find();

  if (!companies) {
    Logger.warn('no companies found');
    res.status(404).send({ msg: 'no companies found' });
    return;
  }
  res
    .status(200)
    .send({ msg: 'companies', companies: companies.map((company) => company.ToClient()) });
};

// Fuction of the route: POST /api/v1/companies
export const postCompany = async (req: Request, res: Response) => {
  const company = new CompanyModel(req.body.company);
  const check = company.VerifySchema();

  if (!check.success) {
    Logger.warn('company data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ msg: 'company data is not valid', err: check.err });
    return;
  }

  await company.save();
  res.status(201).send({ msg: 'company added', company: company.ToClient() });
};

// Fuction of the route: PUT /api/v1/companies
export const putCompany = async (req: Request, res: Response) => {
  const company = await CompanyModel.findById(req.body.company._id);

  if (!company) {
    Logger.warn("cant update this company beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant update this company beacuse it doesn't exists",
    });
    return;
  }

  const newdata = req.body.company;
  const check = company.VerifySchema(newdata);

  if (!check.success) {
    Logger.warn('company data is not valid');
    Logger.warn(check.err);
    res.status(400).send({ err: check.err, msg: 'company data is not valid' });
    return;
  }

  company.name = newdata.name;
  company.address = newdata.address;
  company.phone = newdata.phone;
  company.email = newdata.email;
  company.website = newdata.website;
  company.logo = newdata.logo;
  company.description = newdata.description;
  company.status = newdata.status;
  company.currencies = newdata.currencies;

  await company.save();
  res.status(200).send({ msg: 'company updated', company: company.ToClient() });
};
