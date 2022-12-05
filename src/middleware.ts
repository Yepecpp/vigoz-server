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
  ErrorHandler: (err: Err, req: Request, res: Response, next: NextFunction) => {
    err = err as Err;
    console.log("hey");
    res.status(err.status || 500);
    res.send({
      message: err.msg,
    });
  },
};
export default Middleware;
