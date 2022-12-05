import mongoose from "mongoose";
import {UserSchema} from "@pschemas/user.schemas";
const UserModel=mongoose.model("User", UserSchema);
export default UserModel;


