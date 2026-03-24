import React from 'react';

interface AlertBannerProps {
    message: string;
    type: 'warning' | 'info';
    onClose: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message, type, onClose }) => {
    if (!message) return null;

    return (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[3000] bg-[#111827]/95 backdrop-blur-[12px] border ${type === 'warning' ? 'border-[#ef4444]/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-[#00d4ff]/50 shadow-[0_0_20px_rgba(0,212,255,0.2)]'} text-white p-4 rounded-[12px] flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300 w-[calc(100%-32px)] md:max-w-md`}>
            <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${type === 'warning' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#00d4ff]/20 text-[#00d4ff]'}`}>
                {type === 'warning' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                )}
            </div>
            <span className="flex-1 font-medium text-sm leading-snug tracking-wide">{message}</span>
            <button onClick={onClose} className="shrink-0 text-slate-400 hover:text-white transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    );
};

export default AlertBanner;
