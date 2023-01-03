import { Request, Response, NextFunction } from 'express';
import jwt from '@libs/jwt';
import { userDocument } from '@interfaces/primary/user.i';
import { employeeDocument } from '@interfaces/primary/employee.i';
import Logger from '@libs/logger';
import UserModel from '@models/users.models';
import employeesModel from '@models/employees.models';
import { Roles } from '@interfaces/primary/employee.i';
export interface PrivReq extends Request {
  auth: {
    bearer: string;
    employee?: employeeDocument;
    role?: Roles;
    user: userDocument;
  } | null;
  logData: {
    ip: string | string[] | undefined;
    url: string;
  };
}

export interface Err {
  status: number;
  msg?: string;
  err?: any;
}
const Middleware = {
  NotFound: (req: Request, _: any, next: NextFunction) => {
    const err: Err = { msg: `Not Found - ${req.originalUrl}`, status: 404 };
    next(err);
  },
  ErrorHandler: (err: Err, __: PrivReq, res: Response<Err>, _: NextFunction) => {
    err = err as Err;
    res.status(err.status || 500).send(err);
    return;
  },
  VerifyToken: async (req: PrivReq, _: Response, next: NextFunction) => {
    //remove Bearer from token
    const token = (req.headers.authorization ? (req.headers.authorization as string) : null)?.split(
      ' ',
    )[1];
    // set the log data to the request
    req.logData = {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      url: req.originalUrl,
    };
    if (!token) {
      Logger.warn('no token provided on middle', req.logData);
      req.auth = null;
      next();
      return;
    }

    const decoded: any = jwt.verify(token);
    if (decoded.status.isExpired === true) {
      Logger.warn('token expirado en middle', req.logData);
      req.auth = null;
      next();
      return;
    }
    if (decoded.status.isValid !== true) {
      Logger.warn('token alterado en middle', req.logData);
      req.auth = null;
      next();
      return;
    }
    const user = await UserModel.findById(decoded.data.id);
    if (!user) {
      const err: Err = { msg: 'user not found', status: 401 };
      req.auth = null;
      next(err);
      return;
    }
    if (user.status !== 'active') {
      Logger.warn('user not active');
      const err: Err = { msg: 'user not active', status: 401 };
      req.auth = null;
      next(err);
      return;
    }
    if (user.is_employee) {
      const employee = await employeesModel.findOne({ user: user._id }).populate('department');
      if (!employee) {
        const err: Err = { msg: 'employee not found', status: 401 };
        req.auth = null;
        next(err);
        return;
      }
      req.auth = {
        bearer: token,
        user,
        employee,
        role: Roles[employee.role],
      };
    } else
      req.auth = {
        bearer: token,
        user,
      };
    next();
    return;
  },
};
export default Middleware;
