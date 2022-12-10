import { LoginSchema } from "@cschemas/login.schemas";
import { userZod, IUser } from "@interfaces/user.i";
import mongoose from "mongoose";
// create a mongoose schema
 let UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  login: { type: LoginSchema, required: true },
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: true },
  status: { type: String, required: true },
  roles: { type: String, required: true },
  meta: { type: Object, required: false },
  info: { type: Object, required: false },
});

// create a method to verify the schema
UserSchema.methods.VerifySchema = function () {
  return userZod.safeParse(this);
};
// create a method to get the client version of the schema
 UserSchema.methods.ToCLient = function () {
  this.login.passw = undefined;
  return {
    name: this.name,
    login: this.login,
    status: this.status,
    roles: this.roles,
    info: this.info,
  } as IUser;
};


// export the schema
export default UserSchema;
