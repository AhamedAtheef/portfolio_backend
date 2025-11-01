import express from "express";
import { isAuthenticated } from "../middleware/authenticate.js";
import { deleteMessage, getallUsersForsidebar, getMessages, getUsersForsidebar, sendMessage } from "../controllers/msgcontrol.js";

const messageRouter = express.Router();

messageRouter.get("/users", isAuthenticated, getUsersForsidebar)
messageRouter.get("/allusers", isAuthenticated, getallUsersForsidebar)
messageRouter.get("/:id", isAuthenticated, getMessages)
messageRouter.post("/send/:id", isAuthenticated, sendMessage)
messageRouter.delete("/delete/:id", isAuthenticated, deleteMessage);

export default messageRouter