import {Response, Router } from "express";
import userRoutes from "./user.routes";
const router = Router();
router.get("/", (_,res: Response) => {
    res.send("Hello World from api v1!");
});
router.use("/users", userRoutes);
export default router;