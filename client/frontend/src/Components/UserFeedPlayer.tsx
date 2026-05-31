import { useEffect, useRef, useState } from "react";

interface UserFeedPlayerProps {
    stream?: MediaStream;
    muted?: boolean;
    name?: string;
    isLocal?: boolean;
}

const UserFeedPlayer: React.FC<UserFeedPlayerProps> = ({ stream, muted = false, name = "Participant", isLocal = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoActive, setVideoActive] = useState(true);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Periodically check if video tracks are enabled/active
    useEffect(() => {
        if (!stream) {
            setVideoActive(false);
            return;
        }

        const checkTracks = () => {
            const videoTrack = stream.getVideoTracks()[0];
            setVideoActive(videoTrack ? videoTrack.enabled && videoTrack.readyState === "live" : false);
        };

        checkTracks();
        
        // Listen to events on video track if available
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            const handleTrackEvent = () => checkTracks();
            videoTrack.addEventListener("mute", handleTrackEvent);
            videoTrack.addEventListener("unmute", handleTrackEvent);
            videoTrack.addEventListener("ended", handleTrackEvent);
            
            // Set up a short interval check as backup since track events don't always fire on program track.enabled change locally
            const interval = setInterval(checkTracks, 500);

            return () => {
                videoTrack.removeEventListener("mute", handleTrackEvent);
                videoTrack.removeEventListener("unmute", handleTrackEvent);
                videoTrack.removeEventListener("ended", handleTrackEvent);
                clearInterval(interval);
            };
        }
    }, [stream]);

    return (
        <div className="relative w-full aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl transition-all duration-300 hover:border-violet-500/50 group">
            {/* Video Feed */}
            <video
                ref={videoRef}
                className={`w-full h-full object-cover transition-opacity duration-500 ${videoActive ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}
                muted={muted}
                autoPlay
                playsInline
            />

            {/* Video Off Placeholder Avatar */}
            {!videoActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-950 to-neutral-900 transition-all duration-500">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg animate-pulse ring-4 ring-violet-500/30">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <span className="mt-3 text-sm text-neutral-400 font-medium">Camera is off</span>
                </div>
            )}

            {/* Bottom Overlay Label */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                <div className={`w-2 h-2 rounded-full ${videoActive ? 'bg-green-500 animate-ping' : 'bg-neutral-500'}`} />
                <span className="text-xs font-semibold text-white tracking-wide">
                    {name} {isLocal && <span className="text-violet-400 font-normal">(You)</span>}
                </span>
            </div>

            {/* Audio Mute Indicator Overlay (top right) */}
            {muted && (
                <div className="absolute top-3 right-3 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-400 p-2 rounded-xl transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default UserFeedPlayer;