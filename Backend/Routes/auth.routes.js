import { Router } from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../Controllers/auth.controller.js";
import authMiddleware from "../Middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/user", authMiddleware, getUser);

export default authRouter;
