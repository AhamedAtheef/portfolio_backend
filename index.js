import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./middleware/socket.js";
import userRouter from "./routes/userroute.js";
import messageRouter from "./routes/message.js";

dotenv.config();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "https://ahamedatheef.netlify.app",
            "https://ahamedatheef.netlify.app/",
            "http://localhost:8080"
        ],
        credentials: true,
    })
);


// Routes
app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);

// MongoDB + Server
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        server.listen(process.env.PORT || 5000, () => {
            console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => console.log("❌ MongoDB connection error:", err));
