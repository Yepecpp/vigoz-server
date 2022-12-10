import {z} from "zod"
import { loginZod } from "./login.i";
export const userZod = z.object({
    _id : z.string(),
    name : z.string(),
    login: loginZod,
    createdAt: z.date().optional(),
    updatedAt: z.date().default(() => new Date()),
    status: z.enum(["active", "inactive", "deleted"]).default("active"),
    roles: z.enum(["admin", "user"]).default("user"),
    meta: z.any().optional(),
    info: z.any().optional()
});   
//export type IUser = z.infer<typeof userZod>;
export interface IUser extends z.infer<typeof userZod>{
    VerifySchema: ()=>{success:boolean, error:z.ZodError[]}
    ToClient: ()=>z.infer<typeof userZod>;
}

