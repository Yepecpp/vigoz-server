import {model} from "mongoose";
import UserSchema from "@pschemas/user.schemas";
import { userDocument } from "@interfaces/user.i";
import Encrypt from "@libs/encyrpt";
import Logger from "@libs/logger";
const UserModel = model<userDocument>("User", UserSchema);
const SetUp= async ()=> {
    const Admin = await UserModel.findOne({roles: "admin"});
    if(!Admin){
        const admin = new UserModel({
           login:{
            username: "admin",
            passw: await Encrypt.hash("admin"),
            email: "admin@admin.com",
            provider: "email"
           },
            roles: "admin",
            name: "admin",
            last_name: "admin",
            phone: "0000000000",
            address: "admin",
            status: "active",
        });
        await admin.save();
        Logger.info("Admin created");
    }

}
SetUp();
export default UserModel;
