import { LoginSchema } from "@cschemas/login.schemas";
import { userZod, userDocument, IUser } from "@interfaces/user.i";
import { z } from "zod";
import Logger from "@libs/logger";
import mongoose from "mongoose";
// create a mongoose schema
let UserSchema = new mongoose.Schema<userDocument>({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  login: { type: LoginSchema, required: true },
  //make createdat inmutable
  createdAt: { type: Date, required: false, immutable: true },
  updatedAt: { type: Date, required: false, default: Date.now },
  status: { type: String, required: true },
  roles: { type: String, required: true },
  meta: { type: Object, required: false },
  info: { type: Object, required: false },
});
UserSchema.pre("save", function (next) {
  this.updatedAt = new Date(Date.now());
  Logger.info("UserSchema.pre save");
  next();
});

UserSchema.methods.ToClient = function (): IUser {
  let user = this as any;
  user.login.passw = undefined;
  user.login._id = undefined;
  user.meta= undefined;
  user.createdAt = undefined;
  user.updatedAt = undefined;
  user.id = user._id;
  user._id = undefined;
  user.__v = undefined;
  
  return user as IUser;
};

UserSchema.methods.VerifySchema = function (): {success: boolean, error?: z.ZodError<IUser>, data?: IUser}{
  let parse = userZod.safeParse(this);
  if (!parse.success) {
    return{ success: false, error: parse.error };
  }
  return { success: true, data: parse.data };
}
// export the schema
export default UserSchema;
