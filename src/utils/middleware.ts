import { Request, Response, NextFunction } from 'express';
import jwt from '@libs/jwt';
import { IUser } from '@interfaces/primary/user.i';
import Logger from '@libs/logger';
import UserModel from '@models/users.models';
export interface PrivReq extends Request {
  auth: {
    bearer: string | null;
    user: IUser;
  } | null;
}

export interface Err {
  status: number;
  msg?: string;
}
const Middleware = {
  NotFound: (req: Request, _: any, next: NextFunction) => {
    const err: Err = { msg: `Not Found - ${req.originalUrl}`, status: 404 };
    next(err);
  },
  ErrorHandler: (
    err: Err,
    __: PrivReq,
    res: Response<Err>,
    _: NextFunction
  ) => {
    err = err as Err;
    res.status(err.status || 500).send(err);
    return;
  },
  VerifyToken: async (req: PrivReq, _: Response, next: NextFunction) => {
    //remove Bearer from token
    const token = (
      req.headers.authorization ? (req.headers.authorization as string) : null
    )?.split(' ')[1];
    console.log(token);
    if (!token) {
      Logger.warn('no token provided on middle');
      req.auth = null;
      next();
      return;
    }

    const decoded: any = jwt.verify(token);
    if (decoded.status.isExpired === true) {
      Logger.warn('token expirado en middle');
      req.auth = null;
      next();
      return;
    }
    if (decoded.status.isValid !== true) {
      Logger.warn('token alterado en middle');
      req.auth = null;
      next();
      return;
    }
    const user = await UserModel.findById(decoded.data.id);
    if (!user) {
      const err: Err = { msg: 'user not found', status: 401 };
      next(err);
      return;
    }
    req.auth = {
      bearer: token,
      user: user.ToClient(),
    };
    next();
    return;
  },
};
export default Middleware;
