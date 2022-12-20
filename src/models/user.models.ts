import {model} from "mongoose";
import UserSchema from "@pschemas/user.schemas";
import { userDocument } from "@interfaces/user.i";
const UserModel = model<userDocument>("User", UserSchema);
export default UserModel;
