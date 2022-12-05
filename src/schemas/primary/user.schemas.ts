import {z} from "zod"
import {loginSchema, LoginSchema} from "@cschemas/login.schemas"
import mongoose from "mongoose"
// create an object schema
export const userSchema = z.object({
    name : z.string(),
    login: loginSchema,
    createdAt: z.date().optional(),
    updatedAt: z.date().default(() => new Date()),
    status: z.enum(["active", "inactive", "deleted"]).default("active"),
    roles: z.array(z.string()).min(1),
    meta: z.any().optional(),
    info: z.any().optional()
});
export type IUser = z.infer<typeof userSchema>;
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
    return userSchema.safeParse(this).success;
}


