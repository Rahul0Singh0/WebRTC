import { useContext } from "react";
import { SocketContext } from "../Context/SocketContext";

const CreateRoom: React.FC = () => {
    const { socket } = useContext(SocketContext);

    const initRoom = () => {
        console.log("Initializing a request to create a room");
        socket.emit("create-room");
    }

    return (
        <div className="card bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 shadow-2xl p-6 rounded-2xl transition-all duration-300 hover:border-violet-500/30">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="p-2 bg-violet-600/15 text-violet-400 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </span>
                New Meeting
            </h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                Create a secure video conference instantly. Get a shareable link that you can send to other participants.
            </p>
            <button 
                onClick={initRoom}
                className="btn w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold border-0 shadow-lg shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 py-3 rounded-xl flex items-center justify-center gap-2"    
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Room
            </button>
        </div>
    );
}

export default CreateRoom;