import {Document} from "mongoose";
import {z} from "zod"
import { loginZod } from "./login.i";
export const userZod = z.object({
    id : z.string().optional(),
    name : z.string(),
    last_name : z.string(),
    login: loginZod,
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    status: z.enum(["active", "inactive", "deleted"]).default("active"),
    roles: z.enum(["admin", "user", "guare"]).default("guare"),
    meta: z.any().nullish(),
    info: z.any().nullish()
});   
//export type IUser = z.infer<typeof userZod>;
export type IUser = z.infer<typeof userZod>;
export type userDocument = Document & IUser & {
    VerifySchema(): {success: boolean, error?: z.ZodError<IUser>, data?: IUser};
    ToClient(): IUser;
};

/* test
const data = {
    name: "John",
    last_name: "Doe",
    login: {
        email: "yepe@yepe.me",
        username: "yepe",
        passw: "12345678",
        provider: "local"
    },
    roles: "admin",
} as any 
console.log(userZod.safeParse(data));
*/

