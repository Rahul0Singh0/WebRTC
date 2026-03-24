import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import type IRoomParams from "../interfaces/IRoomParams";

// the below map stores for a room what all peers have joined
/**
 * {1: [u1, u2, u3], 2: [u4, u5]}
 */
const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        const roomId = uuidv4(); // this will be our unique room ID in which multiple connection will exchange data
        socket.join(roomId); // we will make the socket connection enter a new room

        rooms[roomId] = []; // create a new entry for the room

        socket.emit("room-created", { roomId }); // we will emit an event from server side that socket connection has been added to a room
        console.log(`New room created with ID: ${roomId}`);
    };

    /**
     *
     * The below function is executed everytime a user (creator or joinee) joins a new room
     */
    const joinRoom = ({ roomId, peerId }: IRoomParams) => {
        if (rooms[roomId]) {
            // if the given roomId exist in the in memory db
            console.log("New user has joined room ", roomId, " with peer ID as ", peerId);
            // the moment new user joins, add the peerId to the room
            rooms[roomId].push(peerId);
            socket.join(roomId); // make the user join the socket room

            // below event is for logging purpose
            socket.emit("get-users", {roomId, participants: rooms[roomId]});
        }
        console.log("New user has joined room", roomId, "with peer ID", peerId);
        console.log("Added peer to room ", rooms);
    };

    // When to call the above functions

    // We will call the above two functions when the client will emit events top create room and join room
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};

export default roomHandler;