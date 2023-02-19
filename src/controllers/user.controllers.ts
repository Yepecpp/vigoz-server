import { Response } from 'express';
import UsersModel from '@models/users.models';
import Logger from '@libs/logger';
import Encrypt from '@utils/encyrpt';
import { PrivReq as Request } from '@utils/middleware';
import { ToQuery } from '@utils/mongooseUtils';
import { IUser } from '@interfaces/primary/user.i';
// import Middleware from '@utils/middleware';

// Fuction of the route: GET /api/v1/users
export const getUsers = async (req: Request, res: Response) => {
  if (req.auth?.role === undefined || req.auth.role > 1) {
    Logger.warn('no permission to access this route');
    res.status(401).send({ msg: 'no permission to access this route' });
    return;
  }
  let query = req.query as any;
  if (query?.login?.passw) delete query.login.passw;
  query = ToQuery(query);

  const users = await UsersModel.find(query ? query : {});
  res.status(200).send({ msg: 'users', users: users.map((user) => user.ToClient()) });
};

// Fuction of the route: POST /api/v1/users
export const postUsers = async (req: Request, res: Response) => {
  //const creator = req.auth? req.auth.user: null;
  //this is where we register a new user
  if (req.files) {
    let images = { ...req.body.user.images };
    if (Array.isArray(req.files)) {
      const avatar = req.files.filter((file) => file.fieldname === 'avatar');
      if (avatar.length > 0) images = { ...images, avatar: 'uploads/' + avatar[0]?.filename };
    } else {
      if (req.files.avatar) images = { ...images, avatar: 'uploads/' + req.files.avatar[0]?.filename };
    }
    req.body.user.images = images;
  }
  let newuser = { ...req.body.user, is_employee: false, is_verified: false } as IUser;
  const user = new UsersModel(newuser);
  const check = user.VerifySchema(newuser);
  if (!check.success) {
    Logger.warn('user data is not valid', req.logData);
    console.log(check.err);
    res.status(400).send({ err: check.err, msg: 'user data is not valid' });
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
    res.status(409).send({
      msg: 'user already exists',
      err: {
        email: email ? 'email already exists' : undefined,
        username: username ? 'username already exists' : undefined,
      },
    });
    return;
  }
  if (user.isNew) {
    user.createdAt = new Date(Date.now());
    user.status = 'active';
    user.login.passw = await Encrypt.hash(user.login.passw);
  }
  await user.save();
  res.status(200).send({ msg: 'user created', user: user.ToClient() });
};

// Fuction of the route: PUT /api/v1/users
export const putUsers = async (req: Request, res: Response) => {
  if (!req.body.user.id) {
    Logger.warn('no id provided');
    res.status(400).send({ msg: 'no id provided' });
    return;
  }
  if (req.auth?.user._id.toString() !== req.body.user.id) {
    if (req.auth?.role === undefined || req.auth.role !== 0) {
      Logger.warn('you are not allowed to update this user');
      res.status(401).send({ msg: 'you are not allowed to update this user' });
      return;
    }
  }
  const user = await UsersModel.findById(req.body.user.id);
  if (!user) {
    Logger.warn("cant update this user beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant update this user beacuse it doesn't exists",
    });
    return;
  }
  if (req.files) {
    let images = { ...user.images };
    if (Array.isArray(req.files)) {
      const avatar = req.files.filter((file) => file.fieldname === 'avatar');
      if (avatar.length > 0) images = { ...images, avatar: 'uploads/' + avatar[0]?.filename };
    } else {
      if (req.files.avatar) images = { ...images, avatar: 'uploads/' + req.files.avatar[0]?.filename };
    }
    req.body.user.images = images;
  }
  let newdata = { ...req.body.user, updatedAt: new Date(), is_employee: user.is_employee, is_verified: user.is_verified } as IUser;
  newdata.login.passw = user.login.passw;
  const check = user.VerifySchema(newdata);
  if (!check.success) {
    Logger.warn('Data is not well formated');
    res.status(400).send({ err: check.err, msg: 'Data is not well formated' });
    return;
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
};

// Fuction of the route: DELETE /api/v1/users
export const deleteUsers = async (req: Request, res: Response) => {
  if (!req.body.user.id) {
    Logger.warn('no id provided');
    res.status(400).send({ msg: 'no id provided' });
    return;
  }
  if (!req.auth) {
    Logger.warn('you need to sign in to modify this user');
    res.status(401).send({ msg: 'you need to sign in to modify this user ' + req.body.user.id });
    return;
  }
  if (req.auth.user._id.toString() !== req.body.user.id || req.auth.role !== 0) {
    Logger.warn('you are not allowed to delete this user');
    res.status(401).send({ msg: 'you are not allowed to delete this user' });
    return;
  }
  const user = await UsersModel.findById(req.body.user.id);
  if (!user) {
    Logger.warn("cant delete this user beacuse it doesn't exists");
    res.status(404).send({
      msg: "cant delete this user beacuse it doesn't exists",
    });
    return;
  }
  user.status = 'deleted';
  user.save();
  res.status(200).send({ msg: 'user deleted', user: user.ToClient() });
  return;
};
