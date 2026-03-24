import React from 'react';

interface LayerTogglesProps {
    toggles: Record<string, boolean>;
    onToggleConfig: (key: string) => void;
}

const LayerToggles: React.FC<LayerTogglesProps> = ({ toggles, onToggleConfig }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Close when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.layer-toggles-container')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const labels: Record<string, string> = {
        school_zone: 'Schools',
        hospital_zone: 'Hospitals',
        speed_breaker: 'Speed Breakers',
        sharp_turn: 'Sharp Turns',
        restrictions: 'Road Restrictions',
        traffic: 'Live Traffic'
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="layer-toggles-container w-12 h-12 flex items-center justify-center bg-[#111827]/90 backdrop-blur-[12px] rounded-full shadow-lg border border-white/[0.08] pointer-events-auto hover:bg-[#00d4ff]/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:border-[#00d4ff]/50 transition-all group"
                title="Toggle Layers"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00d4ff] group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
            </button>
        );
    }

    return (
        <div className="layer-toggles-container bg-[#111827]/90 backdrop-blur-[12px] p-4 rounded-[12px] shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/[0.08] pointer-events-auto min-w-[200px] animate-in fade-in zoom-in duration-200 origin-bottom-right">
            <div className="flex justify-between items-center mb-3 border-b border-white/[0.08] pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Layers</span>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div className="space-y-2">
                {Object.keys(toggles).map(key => (
                    <label key={key} className="flex items-center space-x-3 text-sm cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={toggles[key]}
                                onChange={() => onToggleConfig(key)}
                                className="peer h-4 w-4 rounded border-slate-600 bg-slate-800 text-[#00d4ff] focus:ring-[#00d4ff]/20 focus:ring-offset-0 transition-all"
                            />
                        </div>
                        <span className="text-slate-300 group-hover:text-white transition-colors">{labels[key] || key}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default LayerToggles;
