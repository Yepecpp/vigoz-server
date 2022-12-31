import { userZod, userDocument, IUser } from '@interfaces/primary/user.i';
import { z } from 'zod';
import Logger from '@libs/logger';
import mongoose from 'mongoose';
// create a mongoose schema
let UsersSchema = new mongoose.Schema<userDocument>({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  login: { type: Object, required: true },
  //make createdat inmutable
  createdAt: { type: Date, required: false, immutable: true },
  updatedAt: { type: Date, required: false, default: Date.now },
  status: { type: String, required: true },
  meta: { type: Object, required: false },
  info: { type: Object, required: false },
});
UsersSchema.pre('save', function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date(Date.now());
  }
  this.updatedAt = new Date(Date.now());
  Logger.info('UserSchema.pre save');
  next();
});

UsersSchema.methods.ToClient = function (): IUser {
  const curr = this as userDocument;
  const user = {
    id: curr._id.toString(),
    name: curr.name,
    last_name: curr.last_name,
    login: {
      email: curr.login.email,
      provider: curr.login.provider,
    },
    createdAt: curr.createdAt,
    updatedAt: curr.updatedAt,
    status: curr.status,
    info: curr.info ? curr.info : null,
  } as IUser;
  return user;
};

UsersSchema.methods.VerifySchema = function (): {
  success: boolean;
  error?: z.ZodError<IUser>;
  data?: IUser;
} {
  let parse = userZod.safeParse(this);
  if (!parse.success) {
    return { success: false, error: parse.error };
  }
  return { success: true, data: parse.data };
};
// export the schema
export default UsersSchema;