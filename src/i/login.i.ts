import {z} from "zod"
export const loginZod= z.object({
    email: z.string().email(),
    passw: z.string().min(8),
 // provider is an enum of the providers we support
    provider: z.enum(["local", "google", "facebook", "github"]),
    lastLogin: z.date().optional(),
    meta: z.any().optional()    
});
export type ILogin = z.infer<typeof loginZod>;