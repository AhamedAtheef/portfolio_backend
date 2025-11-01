import express from "express";
import {adminvalidation, checkAuth, login, signup } from "../controllers/usercontrol.js";
import { isAuthenticated } from "../middleware/authenticate.js";

const userRouter = express.Router();

userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.get("/verify",isAuthenticated, checkAuth)
userRouter.get("/admin",isAuthenticated, adminvalidation)

export default userRouter