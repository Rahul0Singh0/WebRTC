import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import type IRoomParams from "../interfaces/IRoomParams";

// the below map stores for a room what all peers have joined
/**
 * {1: [u1, u2, u3], 2: [u4, u5]}
 */
const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {
    let joinedRoomId: string | null = null;
    let joinedPeerId: string | null = null;

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
            joinedRoomId = roomId;
            joinedPeerId = peerId;

            // if the given roomId exist in the in memory db
            console.log("New user has joined room ", roomId, " with peer ID as ", peerId);

            // avoid duplicate entries
            if (!rooms[roomId].includes(peerId)) {
                rooms[roomId].push(peerId);
            }

            console.log("added peer to room", rooms);
            socket.join(roomId); // make the user join the socket room

            // below event is for logging purpose
            socket.emit("get-users", { roomId, participants: rooms[roomId] });
        } else {
            console.log(`Attempt to join non-existent room: ${roomId} by peer ID: ${peerId}`);
        }
    };

    const leaveRoom = () => {
        if (joinedRoomId && joinedPeerId) {
            const roomParticipants = rooms[joinedRoomId];
            if (roomParticipants) {
                // Remove the peer from the room list
                const updatedParticipants = roomParticipants.filter((id) => id !== joinedPeerId);
                rooms[joinedRoomId] = updatedParticipants;

                // Notify other peers in the room that this user has left
                socket.to(joinedRoomId).emit("user-disconnected", { peerId: joinedPeerId });

                console.log(`User ${joinedPeerId} left room ${joinedRoomId}`);

                // If room is empty, delete it to prevent memory leak
                if (updatedParticipants.length === 0) {
                    delete rooms[joinedRoomId];
                    console.log(`Room ${joinedRoomId} is now empty and has been deleted.`);
                }
            }

            joinedRoomId = null;
            joinedPeerId = null;
        }
    };

    // When to call the above functions

    // We will call the above two functions when the client will emit events top create room and join room
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("ready", () => {
        if (joinedRoomId && joinedPeerId) {
            // from our server we will emit an event to all the clients conn that a new peer has added
            socket.to(joinedRoomId).emit("user-joined", { peerId: joinedPeerId });
        }
    });
    socket.on("leave-room", leaveRoom);
    socket.on("disconnect", leaveRoom);
};

export default roomHandler;