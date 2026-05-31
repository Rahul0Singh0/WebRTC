import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoom from "../Components/CreateRoom";

const Home: React.FC = () => {
    const [joinRoomId, setJoinRoomId] = useState("");
    const navigate = useNavigate();

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinRoomId.trim()) {
            navigate(`/room/${joinRoomId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0f14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/25 via-neutral-950 to-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-violet-500/30 selection:text-violet-200">
            {/* Header */}
            <header className="border-b border-neutral-900 bg-neutral-950/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">OrbitMeet</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 bg-neutral-900/60 border border-neutral-800 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Signalling Server Active
                </div>
            </header>

            {/* Main Section */}
            <main className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-20 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Left Side: Info */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-violet-600/10 text-violet-400 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-violet-500/15">
                            ✨ Next-Gen Video Meetings
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
                            Instant, secure <br className="hidden sm:inline" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400">P2P video conferences.</span>
                        </h1>
                        <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed">
                            OrbitMeet leverages WebRTC technology for direct peer-to-peer streaming with ultra-low latency, right in your browser. No signups, no downloads.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-violet-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Direct P2P Audio & Video</h4>
                                <p className="text-xs text-neutral-400 leading-relaxed">Media streams directly between browsers, eliminating server bottlenecks for HD quality.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-indigo-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Secure Signalling</h4>
                                <p className="text-xs text-neutral-400 leading-relaxed">Encrypted handshakes via Socket.io ensure only participants you invite can enter.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-cyan-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l-1.99 4.3a1 1 0 00.9 1.418h11.583a1 1 0 00.894-1.447l-1.992-3.985M12 8V3m0 0l3 3m-3-3L9 6" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">No Installations</h4>
                                <p className="text-xs text-neutral-400 leading-relaxed">No software client, plugin, or account creation required. Works immediately on mobile & desktop.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-rose-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Visual Track Toggles</h4>
                                <p className="text-xs text-neutral-400 leading-relaxed">Toggle video and audio devices at will with smart overlay icons indicating other peers' statuses.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Action Panel */}
                <div className="lg:col-span-5 grid grid-cols-1 gap-6 w-full max-w-md mx-auto">
                    <CreateRoom />

                    {/* Join Room Card */}
                    <div className="card bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 shadow-2xl p-6 rounded-2xl transition-all duration-300 hover:border-violet-500/30">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="p-2 bg-indigo-600/15 text-indigo-400 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </span>
                            Join Meeting
                        </h3>
                        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                            Enter an existing room code or meet ID below to join a call.
                        </p>
                        <form onSubmit={handleJoinRoom} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Room Code (e.g. 6900d795-...)"
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-all duration-200"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!joinRoomId.trim()}
                                className="btn w-full bg-neutral-800 hover:bg-neutral-750 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:border-neutral-900 text-white font-semibold border-0 shadow-lg py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                                Join Room
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-900 bg-neutral-950/20 px-6 py-6 text-center text-xs text-neutral-500">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>© 2026 OrbitMeet.</p>
                    <p className="flex items-center gap-4 justify-center">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">GitHub</a>
                        <span>•</span>
                        <a href="https://webrtc.org" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">WebRTC Spec</a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;