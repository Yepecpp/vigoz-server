import { Response, Request, Router } from "express";
import UserModel from "@models/user.models";
import { IUser } from "@interfaces/user.i";
const router = Router();
router.get("/", (_req: Request, res: Response<IUser>) => {
  UserModel.find({}, (err: any) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).send({}as IUser);
  });
});
router.get("/:id", (req: Request, res: Response<IUser>) => {
  UserModel.findById(req.params.id, (err: any, user: IUser) => {
    if (err) {
      res.status(500).send();
      return;
    }
    res.status(200).json(user);
  });
});
router.post("/", (req: Request, res: Response<IUser>) => {
  const user = new UserModel(req.body);
  const {success, error} = user.VerifySchema();
  if(!success){
    res.status(400).send(error);
    return;
  }
  //use the schema to validate the data before saving
  user.save((err: any, user: any) => {
    user = user.ToCLient();
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(201).json(user);
  });
});
export default router;
