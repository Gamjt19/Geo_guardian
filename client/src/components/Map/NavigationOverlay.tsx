import React from 'react';
import { formatDuration } from '../../utils/formatters';

interface NavigationOverlayProps {
    distanceKm: number;
    durationMin: number;
    destinationName?: string;
    onExit: () => void;
    onStop: () => void;
}

const NavigationOverlay: React.FC<NavigationOverlayProps> = ({ distanceKm, durationMin, destinationName, onExit, onStop }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0d1117]/95 backdrop-blur-[12px] border-t border-white/[0.08] shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-[2000] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex justify-between items-center transition-transform animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#22c55e]">{formatDuration(durationMin)}</span>
                    <span className="text-lg text-slate-400">({distanceKm.toFixed(1)} km)</span>
                </div>
                {destinationName && (
                    <span className="text-sm text-slate-300 truncate max-w-[200px] md:max-w-md">
                        to {destinationName}
                    </span>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onExit}
                    className="border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/10 font-bold py-2 px-6 rounded-lg transition-colors backdrop-blur-[12px]"
                >
                    Exit
                </button>
                <button
                    onClick={onStop}
                    className="bg-[#ef4444] hover:bg-[#ef4444]/80 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-colors backdrop-blur-[12px]"
                >
                    Stop
                </button>
            </div>
        </div>
    );
};

export default NavigationOverlay;
