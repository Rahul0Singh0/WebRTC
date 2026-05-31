import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import type { MediaConnection } from "peerjs";
import { v4 as UUIDv4 } from "uuid";
import { peerReducer, RESET } from "../Reducers/peerReducer";
import { addPeerAction, removePeerAction } from "../Actions/peerAction";

const WS_Server = import.meta.env.VITE_WS_SERVER || "http://localhost:3000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server, {
    withCredentials: false,
    transports: ['polling', 'websocket'],
});

interface Props {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate(); // will help to programmatically handle navigation

    // state varible to store the userId
    const [user, setUser] = useState<Peer>(); // new peer user
    const [stream, setStream] = useState<MediaStream>();
    const streamRef = useRef<MediaStream | null>(null);
    const [peers, dispatch] = useReducer(peerReducer, {}); // peers->state
    const [socketId, setSocketId] = useState<string>("");

    useEffect(() => {
        const handleConnect = () => {
            setSocketId(socket.id || "");
        };

        if (socket.connected) {
            setSocketId(socket.id || "");
        }

        socket.on("connect", handleConnect);
        return () => {
            socket.off("connect", handleConnect);
        };
    }, []);

    // Mute and Camera states
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(prev => !prev);
        }
    };

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsCameraOff(prev => !prev);
        }
    };

    const fetchParticipantList = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
        console.log("Fetched room participants");
        console.log(roomId, participants);
    }

    const startUserFeed = useCallback(async () => {
        if (streamRef.current) {
            return;
        }
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = mediaStream;
            setStream(mediaStream);
            setIsMuted(false);
            setIsCameraOff(false);
        } catch (error) {
            console.error("Error accessing user media devices:", error);
        }
    }, []);

    useEffect(() => {
        const userId = UUIDv4(); // generating a unique user id using uuid
        let peerInstance: Peer | null = null;

        const initializePeer = (useLocal: boolean) => {
            const config = useLocal 
                ? { host: "localhost", port: 9000, path: "/myapp" }
                : undefined; // Default config falls back to PeerJS Cloud Server
            
            console.log(`Initializing PeerJS (${useLocal ? 'local' : 'cloud'} server)...`);
            const peer = new Peer(userId, config);

            peer.on("open", (id) => {
                console.log("PeerJS connection opened successfully with ID:", id);
                setUser(peer);
            });

            peer.on("error", (err) => {
                console.error("PeerJS connection error:", err);
                
                // If local server is not running and we haven't tried cloud fallback yet, trigger it
                if (useLocal && (err.type === "server-error" || err.message.includes("Lost connection") || err.message.includes("Could not connect") || err.message.includes("connection error"))) {
                    console.warn("Local PeerJS server is unavailable. Falling back to PeerJS Cloud Server...");
                    peer.destroy();
                    initializePeer(false);
                }
            });

            peerInstance = peer;
        };

        initializePeer(true); // Try local first

        const enterRoom = ({ roomId }: { roomId: String }) => {
            navigate(`/room/${roomId}`);
        }

        // we will transfer the user to the room when we collect an event of "room-created" from server
        socket.on("room-created", enterRoom);
        socket.on("get-users", fetchParticipantList);

        return () => {
            socket.off("room-created", enterRoom);
            socket.off("get-users", fetchParticipantList);
            if (peerInstance) {
                (peerInstance as Peer).destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (!user || !stream) {
            return;
        }

        const handleUserJoined = ({ peerId }: { peerId: string }) => {
            console.log("Calling the new peer", peerId);
            const call = user.call(peerId, stream);
            call.on("stream", (remoteStream: MediaStream) => {
                dispatch(addPeerAction(peerId, remoteStream));
            });
        };

        const handleCall = (call: MediaConnection) => {
            console.log("receiving a call from peer:", call.peer);
            call.answer(stream);
            call.on("stream", (remoteStream: MediaStream) => {
                dispatch(addPeerAction(call.peer, remoteStream));
            });
        };

        const handleUserDisconnected = ({ peerId }: { peerId: string }) => {
            console.log("Peer disconnected:", peerId);
            dispatch(removePeerAction(peerId));
        };

        socket.on("user-joined", handleUserJoined);
        socket.on("user-disconnected", handleUserDisconnected);
        user.on("call", handleCall);

        socket.emit("ready");

        return () => {
            socket.off("user-joined", handleUserJoined);
            socket.off("user-disconnected", handleUserDisconnected);
            user.off("call", handleCall);
        };
    }, [user, stream]);

    const leaveRoom = useCallback(() => {
        socket.emit("leave-room");

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log(`Stopped track: ${track.kind}`);
            });
            streamRef.current = null;
        }
        setStream(undefined);

        dispatch({ type: RESET });
        setIsMuted(false);
        setIsCameraOff(false);
    }, []);

    return (
        <SocketContext.Provider value={{ 
            socket, 
            socketId,
            user, 
            stream, 
            peers, 
            isMuted, 
            isCameraOff, 
            toggleMute, 
            toggleCamera,
            startUserFeed,
            leaveRoom
        }}>
            {children}
        </SocketContext.Provider>
    );
}
