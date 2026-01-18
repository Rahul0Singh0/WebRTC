import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import SERVER_CONFIG from "./config/serverConfig.js";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`New User connected: ${socket.id}`); 
    
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(SERVER_CONFIG.PORT, () => {
    console.log(`Server is running on port ${SERVER_CONFIG.PORT}`);
});