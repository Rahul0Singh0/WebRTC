import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import ServerConfig from "./config/serverConfig.js";
import roomHandler from "./handlers/roomHandler.js";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*",
    },
});

// connection event
io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);
    roomHandler(socket); // pass the socket conn to the room handler for room creation and joining
    // disconnection event
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(ServerConfig.PORT, () => {
    console.log(`Server is running on port ${ServerConfig.PORT}`);
});