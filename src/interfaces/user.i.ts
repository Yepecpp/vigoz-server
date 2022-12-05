import {z} from "zod"
import { loginZod } from "./login.i";
export const userZod = z.object({
    _id : z.string(),
    name : z.string(),
    login: loginZod,
    createdAt: z.date().optional(),
    updatedAt: z.date().default(() => new Date()),
    status: z.enum(["active", "inactive", "deleted"]).default("active"),
    roles: z.array(z.string()).min(1),
    meta: z.any().optional(),
    info: z.any().optional()
});
export type IUser = z.infer<typeof userZod>;