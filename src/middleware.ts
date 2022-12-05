import { Request, Response, NextFunction } from "express";
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
    __: Request,
    res: Response<Err>,
    _: NextFunction
  ) => {
    err = err as Err;
    res.status(err.status || 500).send(err);
  },
};
export default Middleware;
