import {Response, Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
const router = Router();
router.get("/", (_,res: Response) => {
    res.send("Hello World from api v1!");
});
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
export default router;