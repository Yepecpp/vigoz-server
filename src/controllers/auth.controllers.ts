import UserModel from '@models/users.models';
import Encrypt from '@utils/encyrpt';
import jwt from '@libs/jwt';
import { Response } from 'express';
import Logger from '@libs/logger';
import { PrivReq as Request } from '@utils/middleware';
import employeesModel from '@models/employees.models';
// Fuction of the route: POST /api/auth/login
export const Login = async (req: Request, res: Response) => {
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
    $or: [{ 'login.username': data.username }, { 'login.email': data.username }],
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
  const employee = user.is_employee ? (await employeesModel.findOne({ user: user._id }).populate('department'))?.ToClient() : null;

  res.status(200).send({ msg: 'user logged in', token: token, employee, user: user.ToClient(), is_employee: user.is_employee });
};

// Fuction of the route: GET /api/auth
export const GetAuth = async (req: Request, res: Response) => {
  // this is where we get the user data
  // we get the token from the request header
  // we verify the token
  // if it is valid, we send back the user data
  if (!req.auth) {
    Logger.warn('no token provided on auth routes');
    res.status(401).send({ msg: 'no token provided or token is invalid' });
    return;
  }
  res.status(200).send({
    msg: 'user found',
    token: req.auth.bearer,
    user: req.auth.user.ToClient(),
    is_employee: req.auth.user.is_employee,
    employee: req.auth.employee?.ToClient(),
  });
};
export const ChangePassword = async (req: Request, res: Response) => {
  // this is where we change the password
  // we get the token from the request header
  // we verify the token
  // if it is valid, we change the password
  if (!req.auth) {
    Logger.warn('no token provided on auth routes');
    res.status(401).send({ msg: 'no token provided or token is invalid' });
    return;
  }
  const data = req.body.password;
  if (!data.old || !data.new) {
    Logger.warn('old or new password not provided');
    res.status(400).send({ msg: 'old or new password not provided' });
    return;
  }
  const check = await Encrypt.compare(data.old, req.auth.user.login.passw);
  if (!check) {
    Logger.warn('old password incorrect');
    res.status(400).send({ msg: 'old password incorrect' });
    return;
  }
  req.auth.user.login.passw = await Encrypt.hash(data.new);
  await req.auth.user.save();
  res.status(200).send({ msg: 'password changed' });
};
