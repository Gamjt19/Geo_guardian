import React from 'react';
import { useMapContext } from '../../context/MapContext';

const LocateButton: React.FC = () => {
    const { triggerRecenter } = useMapContext();

    return (
        <button
            onClick={triggerRecenter}
            className="w-12 h-12 rounded-full bg-[#111827]/90 backdrop-blur-[12px] border border-white/[0.08] shadow-lg pointer-events-auto hover:bg-[#00d4ff]/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:border-[#00d4ff]/50 transition-all flex items-center justify-center text-[#00d4ff] group"
            title="Locate Me"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00d4ff] group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all">
                <line x1="12" y1="2" x2="12" y2="5"></line>
                <line x1="12" y1="19" x2="12" y2="22"></line>
                <line x1="2" y1="12" x2="5" y2="12"></line>
                <line x1="19" y1="12" x2="22" y2="12"></line>
                <circle cx="12" cy="12" r="7"></circle>
                <circle cx="12" cy="12" r="2"></circle>
            </svg>
        </button>
    );
};

export default LocateButton;
