import mongoose from "mongoose";
import UserSchema from "@pschemas/user.schemas";
import { IUser } from "@interfaces/user.i";
const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
