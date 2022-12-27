//imports
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import ApiRouter from "@api/api.routes";
import Middleware from "@utils/middleware";
//consts for express
dotenv.config();
const app = express();
//middleware
app.use(cors({ origin: "*" }));
app.use(express.static(__dirname + "../public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});
app.use(Middleware.VerifyToken);
app.use("/api/v1", ApiRouter);
//error handling
app.use(Middleware.NotFound);
app.use(Middleware.ErrorHandler);
export default app;
