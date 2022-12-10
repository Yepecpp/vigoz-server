import mongoose from "mongoose";
import { ILogin, loginZod } from "@interfaces/login.i";
export let LoginSchema = new mongoose.Schema<ILogin>({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    passw: {type: String, required: true},
    provider: {type: String, required: true},
    lastLogin: {type: Date, required: false},
});
LoginSchema.methods.VerifySchema= ()=> {
    return loginZod.safeParse(this).success;
}

