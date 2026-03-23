import React, { useEffect } from 'react';
import { useMapContext } from '../../../context/MapContext';
import { AlertTriangle, X } from 'lucide-react';

export const HazardAlert: React.FC = () => {
    const { activeHazardAlert, setActiveHazardAlert } = useMapContext();

    useEffect(() => {
        if (activeHazardAlert) {
            const timer = setTimeout(() => {
                setActiveHazardAlert(null);
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [activeHazardAlert, setActiveHazardAlert]);

    if (!activeHazardAlert) return null;

    return (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[5000] w-[90%] max-w-md animate-in fade-in zoom-in slide-in-from-top-4 duration-500">
            <div className="bg-slate-900/90 backdrop-blur-md border-2 border-orange-500 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
                <div className="bg-orange-500/20 p-3 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-orange-500 animate-pulse" />
                </div>
                <div className="flex-1">
                    <p className="text-orange-500 font-orbitron font-bold text-xs uppercase tracking-widest mb-1">Hazard Warning</p>
                    <p className="text-white font-bold text-lg leading-tight">{activeHazardAlert.name}</p>
                    {activeHazardAlert.description && (
                        <p className="text-slate-400 text-sm mt-1 border-t border-slate-800 pt-1 italic">{activeHazardAlert.description}</p>
                    )}
                </div>
                <button 
                    onClick={() => setActiveHazardAlert(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-white/50" />
                </button>
            </div>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 animate-[progress_5s_linear_forwards]" />
            </div>
            
            <style>{`
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};
