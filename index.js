import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiChat from "./routes/aiChat.js";

dotenv.config();

const app = express();

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
app.use(express.json());

app.use("/api/ai", aiChat);

app.listen(process.env.PORT ||5000, () => {
  console.log("Server running on port 5000");
});