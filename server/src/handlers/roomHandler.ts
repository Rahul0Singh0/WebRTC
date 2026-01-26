import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidv4(); // this will be our unique room ID in which multiple connection will exchange data
        socket.join(roomId); // we will make the socket connection enter a new room
        socket.emit("room-created", { roomId }); // we will emit an event from server side that socket connection has been added to a room
        console.log(`New room created with ID: ${roomId}`);
    };

    const joinRoom = ({ roomId }: { roomId: string }) => {
        console.log("New user has joined room", roomId);
    };

    // When to call the above functions

    // We will call the above two functions when the client will emit events top create room and join room
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};

export default roomHandler;