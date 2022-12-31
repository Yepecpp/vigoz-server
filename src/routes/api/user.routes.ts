import { Response, Router } from 'express';
import UsersModel from '@models/users.models';
import Logger from '@libs/logger';
import Encrypt from '@utils/encyrpt';
import { PrivReq as Request } from '@utils/middleware';
//import { Roles } from "@interfaces/primary/employee.i";
const router = Router();
router.get('/', async (req: Request, res: Response) => {
  //this is where we get all the users;
  if (!req.auth) {
    Logger.warn('no token provided on auth routes');
    res.status(401).send({ msg: 'no token provided' });
    return;
  }
  const users = await UsersModel.find();
  res
    .status(200)
    .send({ msg: 'users', users: users.map((user) => user.ToClient()) });
});

router.post('/', async (req: Request, res: Response) => {
  //const creator = req.auth? req.auth.user: null;
  //this is where we register a new user
  const user = new UsersModel(req.body.user);
  const check = user.VerifySchema();
  if (!check.success) {
    Logger.warn('user data is not valid');
    Logger.warn(check.error);
    res.status(400).send({ err: check.error, msg: 'user data is not valid' });
    return;
  }
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
router.put('/', async (req: Request, res: Response) => {
  const user = await UsersModel.findById(req.body.user.id);
  if (!user) {
    Logger.warn("cant update this user beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant update this user beacuse it doesn't exists",
    });
    return;
  }
  const newdata = req.body.user;
  if (req.body.ChangePass === true) {
    newdata.login.passw = await Encrypt.hash(newdata.login.passw);
  } else {
    newdata.login.passw = user.login.passw;
  }
  const check = user.VerifySchema(newdata);
  if (!check.success) {
    Logger.warn('Data is not well formated');
    res
      .status(400)
      .send({ err: check.error, msg: 'Data is not well formated' });
  }
  user.login = newdata.login;
  user.name = newdata.name;
  user.last_name = newdata.last_name;
  user.phone = newdata.phone;
  user.status = newdata.status;
  user.images = newdata.images;
  user.info = newdata.info;
  user.save();
  res.status(200).send({ msg: 'user updated', user: user.ToClient() });
});
export default router;
