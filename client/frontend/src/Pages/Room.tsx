import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [copiedId, setCopiedId] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    const { 
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
    } = useContext(SocketContext);

    useEffect(() => {
        startUserFeed();
    }, [startUserFeed]);

    useEffect(() => {
        // emitting this event so that either creator of room or joinee in the room
        // anyone is added the server knows that new people have been added to this room
        if (user && stream) {
            console.log("New user with id: ", user.id, ", has joined room: ", id);
            socket.emit("join-room", { roomId: id, peerId: user.id });
        }
    }, [id, user, socket, stream]);

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyId = () => {
        if (id) {
            navigator.clipboard.writeText(id);
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        }
    };

    const handleLeave = () => {
        leaveRoom();
        navigate("/");
    };

    const peerCount = Object.keys(peers).length;
    const totalParticipants = peerCount + 1;

    // Calculate grid classes dynamically
    const getGridClass = () => {
        if (totalParticipants === 1) return "grid-cols-1 max-w-3xl mx-auto";
        if (totalParticipants === 2) return "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto";
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto";
    };

    return (
        <div className="min-h-screen bg-[#0d0f14] text-neutral-100 flex flex-col justify-between overflow-hidden font-sans">
            {/* Top Bar */}
            <header className="border-b border-neutral-900 bg-neutral-950/40 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div 
                        onClick={handleCopyId}
                        className="cursor-pointer group flex flex-col"
                        title="Click to copy full Room ID"
                    >
                        <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1 group-hover:text-violet-400 transition-colors">
                            OrbitRoom
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2" />
                            </svg>
                        </h2>
                        <p className="text-[10px] text-neutral-500 font-semibold group-hover:text-neutral-400 transition-colors">
                            {copiedId ? "ID Copied!" : `${id?.slice(0, 18)}...`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Copy Link Button */}
                    <button
                        onClick={handleCopyLink}
                        className={`btn btn-sm border-0 gap-2 font-bold transition-all duration-200 py-1.5 px-3 rounded-lg text-xs ${
                            copied 
                            ? "bg-green-600 hover:bg-green-500 text-white" 
                            : "bg-neutral-800 hover:bg-neutral-750 text-neutral-200"
                        }`}
                    >
                        {copied ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Copy Invite Link
                            </>
                        )}
                    </button>

                    {/* Sidebar Toggle */}
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className={`btn btn-sm border-0 p-2 rounded-lg ${showSidebar ? "bg-violet-600/20 text-violet-400" : "bg-neutral-800 text-neutral-300"}`}
                        title="Toggle Sidebar Info"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="flex flex-grow w-full overflow-hidden relative">
                {/* Video Area */}
                <main className="flex-grow p-6 overflow-y-auto flex flex-col justify-center">
                    <div className={`grid gap-6 w-full ${getGridClass()}`}>
                        {/* Local Stream */}
                        <UserFeedPlayer stream={stream} muted={isMuted} name="You" isLocal={true} />

                        {/* Remote Streams */}
                        {Object.keys(peers).map((peerId) => (
                            <UserFeedPlayer 
                                key={peerId} 
                                stream={peers[peerId].stream} 
                                name={`User ${peerId.slice(0, 5)}`} 
                            />
                        ))}
                    </div>
                </main>

                {/* Collapsible Info Sidebar */}
                {showSidebar && (
                    <aside className="w-80 border-l border-neutral-900 bg-neutral-950/30 backdrop-blur-md p-6 flex flex-col justify-between overflow-y-auto hidden md:flex">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Room Diagnostics</h3>
                                <div className="space-y-2 text-xs font-semibold text-neutral-400">
                                    <div className="flex flex-col gap-1 bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-850">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span>Room Code (ID)</span>
                                            <button 
                                                onClick={handleCopyId}
                                                className="text-[10px] text-violet-400 hover:text-violet-300 cursor-pointer transition-colors"
                                            >
                                                {copiedId ? "Copied!" : "Copy"}
                                            </button>
                                        </div>
                                        <span className="font-mono text-[9px] text-neutral-355 break-all select-all">{id}</span>
                                    </div>
                                    <div className="flex justify-between bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-850">
                                        <span>Connection</span>
                                        <span className="text-green-500">Connected</span>
                                    </div>
                                    <div className="flex justify-between bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-850">
                                        <span>Active Peers</span>
                                        <span className="text-violet-400">{peerCount} connected</span>
                                    </div>
                                    <div className="flex justify-between bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-850">
                                        <span>Your Peer ID</span>
                                        <span className="font-mono text-[10px] text-neutral-300">{user?.id?.slice(0, 8)}...</span>
                                    </div>
                                    <div className="flex justify-between bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-850">
                                        <span>Socket ID</span>
                                        <span className="font-mono text-[10px] text-neutral-300">{socketId ? `${socketId.slice(0, 8)}...` : "Connecting..."}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Meeting Actions</h3>
                                <ul className="space-y-3 text-xs text-neutral-400">
                                    <li className="flex gap-2">
                                        <span className="text-violet-400">✔</span>
                                        <span>Toggle audio/video using buttons below</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-violet-400">✔</span>
                                        <span>Hover video feed for details & overlay tags</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-violet-400">✔</span>
                                        <span>Copy invitation link to bring in friends</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-neutral-900 pt-4 mt-6 text-[10px] text-neutral-500 text-center leading-relaxed">
                            Secured peer-to-peer transmission. Streams do not traverse servers.
                        </div>
                    </aside>
                )}
            </div>

            {/* Bottom Action Bar */}
            <footer className="border-t border-neutral-900 bg-neutral-950/40 backdrop-blur-md py-4 px-6 flex items-center justify-center gap-4 z-10">
                {/* Audio Toggle */}
                <button
                    onClick={toggleMute}
                    className={`btn p-3 rounded-xl border-0 shadow-lg transition-all duration-200 ${
                        isMuted 
                        ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/10" 
                        : "bg-neutral-800 hover:bg-neutral-750 text-white"
                    }`}
                    title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    )}
                </button>

                {/* Video Toggle */}
                <button
                    onClick={toggleCamera}
                    className={`btn p-3 rounded-xl border-0 shadow-lg transition-all duration-200 ${
                        isCameraOff 
                        ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/10" 
                        : "bg-neutral-800 hover:bg-neutral-750 text-white"
                    }`}
                    title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                    {isCameraOff ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>

                {/* Disconnect/Leave Button */}
                <button
                    onClick={handleLeave}
                    className="btn bg-rose-600 hover:bg-rose-500 hover:scale-105 active:scale-95 text-white font-bold border-0 px-6 py-3 rounded-xl shadow-lg shadow-rose-600/10 flex items-center gap-2 transition-all duration-200"
                    title="Leave Meeting"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Leave Meeting
                </button>
            </footer>
        </div>
    );
};

export default Room;