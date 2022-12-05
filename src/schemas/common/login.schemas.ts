import mongoose from "mongoose";
import { ILogin, loginZod } from "@vigoz-intefaces/login.interfaces";
export let LoginSchema = new mongoose.Schema<ILogin>({
    email: {type: String, required: true, unique: true},
    passw: {type: String, required: true},
    provider: {type: String, required: true},
    lastLogin: {type: Date, required: false},
    meta: {type: Object, required: false}
});
LoginSchema.methods.VerifySchema= ()=> {
    return loginZod.safeParse(this).success;
}

