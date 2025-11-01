// socket.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Store online users in memory
const userSocketMap = {}; // { userId: socketId }

const io = new Server(server, {
    cors: {
        origin: [
            "https://ahamedatheef.netlify.app",
            "https://ahamedatheef.netlify.app/",
            "http://localhost:8080"
        ],
        credentials: true,
    },
});


//  Helper to get receiver socket id by userId
export function getReceiver(userId) {
    return userSocketMap[userId];
}

//  Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    const userId = socket.handshake.query?.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    // Broadcast list of online users to all clients
    io.emit("Online Users", Object.keys(userSocketMap));

    //  Listen for new messages from clients
    socket.on("newMessage", (messageData) => {
        console.log("📩 New message received:", messageData);

        const receiverSocketId = getReceiver(messageData.receiverId);

        if (receiverSocketId) {
            //  Send message only to the receiver
            io.to(receiverSocketId).emit("newMessage", messageData);
            console.log(`📤 Sent to receiver ${receiverSocketId}`);
        } else {
            console.log("⚠️ Receiver not online");
        }

        // ✅ Also emit back to sender so message appears instantly
        socket.emit("newMessage", messageData);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            io.emit("Online Users", Object.keys(userSocketMap));
        }
    });
});

export { io, app, server };
