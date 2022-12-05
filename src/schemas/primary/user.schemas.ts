import {LoginSchema} from "@cschemas/login.schemas"
import {userZod, IUser} from "@i/../"
import mongoose from "mongoose"
// create a mongoose schema
export let UserSchema = new mongoose.Schema<IUser>({
    name: {type: String, required: true},
    login: {type: LoginSchema, required: true},
    createdAt: {type: Date, required: false},
    updatedAt: {type: Date, required: true},
    status: {type: String, required: true},
    roles: {type: [String], required: true},
    meta: {type: Object, required: false},
    info: {type: Object, required: false}
});
// create a method to verify the schema
UserSchema.methods.VerifySchema= ():boolean =>{
    return userZod.safeParse(this).success;
}


