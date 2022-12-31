import { Response, Router } from 'express';
import UserModel from '@models/users.models';
import Logger from '@libs/logger';
import Encrypt from '@utils/encyrpt';
import jwt from '@libs/jwt';
import { PrivReq as Request } from '@utils/middleware';
const router = Router();
router.post('/login', async (req: Request, res: Response) => {
  // this is where we login a user
  // we get the username and password from the request body
  // we check if the user exists
  // if it does, we check if the password is correct
  // if it is, we send back a token
  const data = req.body.login;
  if (!data) {
    Logger.warn('no login data');
    res.status(400).send({ msg: 'no login data' });
    return;
  } else if (!data.username || !data.password) {
    Logger.warn('username or password not provided');
    res.status(400).send({ msg: 'username or password not provided' });
    return;
  }
  // data.username could be an email or a username
  const user = await UserModel.findOne({
    $or: [
      { 'login.username': data.username },
      { 'login.email': data.username },
    ],
  });
  if (!user) {
    Logger.warn('user not found');
    res.status(404).send({ msg: 'user not found' });
    return;
  }
  if (user.status !== 'active') {
    Logger.warn('user not active');
    res.status(401).send({ msg: 'user not active' });
    return;
  }
  const check = await Encrypt.compare(data.password, user.login.passw);
  if (!check) {
    Logger.warn('password incorrect');
    res.status(400).send({ msg: 'password incorrect' });
    return;
  }
  const token = jwt.sign({ id: user._id });
  user.login.lastLogin = new Date(Date.now());
  await user.save();
  res
    .status(200)
    .send({ msg: 'user logged in', token: token, user: user.ToClient() });
});
router.get('/', async (req: Request, res: Response) => {
  // this is where we get the user data
  // we get the token from the request header
  // we verify the token
  // if it is valid, we send back the user data
  if (!req.auth) {
    Logger.warn('no token provided on auth routes');
    res.status(400).send({ msg: 'no token provided' });
    return;
  }
  const { bearer, user } = req.auth;
  if (user.status !== 'active') {
    Logger.warn('user not active');
    res.status(401).send({ msg: 'user not active' });
    return;
  }
  res
    .status(200)
    .send({ msg: 'user found', token: bearer, user: user.ToClient() });
});
export default router;
