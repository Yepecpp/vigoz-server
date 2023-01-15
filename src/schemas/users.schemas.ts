import { userZod, userDocument, IUser } from '@interfaces/primary/user.i';
import zoderr from '@utils/zoderr';
import mongoose from 'mongoose';
// create a mongoose schema
let UsersSchema = new mongoose.Schema<userDocument>({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  login: {
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passw: { type: String, required: true },
    provider: {
      type: String,
      required: true,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    lastLogin: { type: Date, required: true, default: Date.now },
  },
  phone: { type: String, required: false },
  createdAt: {
    type: Date,
    required: true,
    immutable: true,
    default: Date.now,
  },
  updatedAt: { type: Date, required: false, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'deleted'], required: true },
  meta: { type: Object, required: false },
  info: { type: Object, required: false },
  is_employee: { type: Boolean, default: false, required: false },
  is_verified: { type: Boolean, default: false, required: false },
});
/*UsersSchema.pre('save', function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date(Date.now());
  }
  this.updatedAt = new Date(Date.now());
  Logger.info('UserSchema.pre save');
  next();
});*/

UsersSchema.methods.ToClient = function (): IUser {
  const curr = this as userDocument;
  const user = {
    id: curr._id.toString(),
    name: curr.name,
    last_name: curr.last_name,
    login: {
      username: curr.login.username,
      email: curr.login.email,
      provider: curr.login.provider,
      lastLogin: curr.login.lastLogin ? curr.login.lastLogin : null,
    },
    is_verified: curr.is_verified,
    is_employee: curr.is_employee,
    phone: curr?.phone,
    createdAt: curr.createdAt,
    updatedAt: curr.updatedAt,
    status: curr.status,
    info: curr.info ? curr.info : null,
  } as IUser;
  return user;
};

UsersSchema.methods.VerifySchema = function (Udata?: IUser | userDocument): {
  success: boolean;
  err?: ReturnType<typeof zoderr>;
  data?: IUser;
} {
  if (!Udata) {
    Udata = this;
  }
  let parse = userZod.safeParse(Udata);
  if (!parse.success) {
    return { success: false, err: zoderr(parse.error) };
  }
  return { success: true, data: parse.data };
};
export default UsersSchema;
