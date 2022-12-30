import { Response, Router } from 'express';
import UsersModel from '@models/users.models';
import Logger from '@libs/logger';
import Encrypt from '@utils/encyrpt';
import { PrivReq as Request } from '@utils/middleware';
//import { Roles } from "@interfaces/primary/employee.i";
const router = Router();
router.get('/', async (_req: Request, res: Response) => {
  //this is where we get all the users;
  const users = await UsersModel.find();
  res
    .status(200)
    .send({ msg: 'users', users: users.map((user) => user.ToClient()) });
});

router.get('/', async (req: Request, res: Response) => {
  //const creator = req.auth? req.auth.user: null;
  //this is where we register a new user
  const user = new UsersModel(req.body.user);
  const check = user.VerifySchema();
  if (!check.success) {
    Logger.warn('user model not valid');
    Logger.warn(check.error);
    res.status(400).send(check.error);
    return;
  }
  //convert the creator role to a number
  /*const creatorRole = creator ? Roles[creator.roles] : Roles.user;
  if (creatorRole!==Roles.admin && creatorRole>= Roles[user.roles]) {
    Logger.warn("role not authorized");
    res.status(401).send({ msg: "role not authorized" });
    return;
  }*/
  //check if the user name or the email alr exists
  //if it does, return an error
  const checkEmail = UsersModel.findOne({ 'login.email': user.login.email });
  const checkUsername = UsersModel.findOne({
    'login.username': user.login.username,
  });
  const [email, username] = await Promise.all([checkEmail, checkUsername]);
  if (email || username) {
    Logger.warn('user already exists');
    res.status(402).send({
      msg: 'user already exists',
      err: {
        email: email ? 'email already exists' : undefined,
        username: username ? 'username already exists' : undefined,
      },
    });
    return;
  }
  if (!user.createdAt) {
    user.createdAt = new Date(Date.now());
    user.status = 'active';
    user.login.passw = await Encrypt.hash(user.login.passw);
  }
  await user.save();
  res.status(200).send({ msg: 'user created', user: user.ToClient() });
});
export default router;
