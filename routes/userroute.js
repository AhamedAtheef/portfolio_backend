import express from "express";
import {adminvalidation, checkAuth, getUserById, login, signup } from "../controllers/usercontrol.js";
import { isAuthenticated } from "../middleware/authenticate.js";

const userRouter = express.Router();

userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.get("/verify",isAuthenticated, checkAuth)
userRouter.get("/admin",isAuthenticated, adminvalidation)
userRouter.get("/:id", getUserById)

export default userRouter