import {z} from "zod"
import mongoose from "mongoose";
export const loginSchema = z.object({
    email: z.string().email(),
    passw: z.string().min(8),
 // provider is an enum of the providers we support
    provider: z.enum(["local", "google", "facebook", "github"]),
    lastLogin: z.date().optional(),
    meta: z.any().optional()    
});
export type ILogin = z.infer<typeof loginSchema>;
export let LoginSchema = new mongoose.Schema<ILogin>({
    email: {type: String, required: true, unique: true},
    passw: {type: String, required: true},
    provider: {type: String, required: true},
    lastLogin: {type: Date, required: false},
    meta: {type: Object, required: false}
});
LoginSchema.methods.VerifySchema= ()=> {
    return loginSchema.safeParse(this).success;
}

