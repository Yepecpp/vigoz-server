import { Response, Request, Router } from "express";
import UserModel from "@models/user.models";
import Logger from "@libs/logger";
import Encrypt from "@libs/encyrpt";
const router = Router();
router.get("/", async (_req: Request, res: Response) => {
  //this is where we get all the users; 
  const users = await UserModel.find();
  res.status(200).send({ msg: "users", users: users.map((user) => user.ToClient()) });
});

router.post("/", async (req: Request, res: Response) => {
  //this is where we register a new user
  const user = new UserModel(req.body.user);
  const check = user.VerifySchema();
  if (!check.success) {
    Logger.warn("user model not valid");
    Logger.warn(check.error);
    res.status(400).send(check.error);
    return;
  }
  //check if the user name or the email alr exists
  //if it does, return an error
  const checkEmail = UserModel.findOne({ "login.email": user.login.email });
  const checkUsername = UserModel.findOne({
    "login.username": user.login.username,
  });
  const [email, username] = await Promise.all([checkEmail, checkUsername]);
  if (email || username) {
    Logger.warn("user already exists");
    res.status(402).send({
      msg: "user already exists",
      err: {
        email: email ? "email already exists" : undefined,
        username: username ? "username already exists" : undefined,
      },
    });
    return;
  }
  if (!user.createdAt) {user.createdAt = new Date(Date.now())
    user.status = "active";
    user.login.passw = await Encrypt.hash( user.login.passw);
    };
  await user.save();
  res.status(200).send({ msg: "user created", user: user.ToClient() });

});
export default router;
