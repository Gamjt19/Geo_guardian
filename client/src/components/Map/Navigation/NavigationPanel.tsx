import React from 'react';
import { Navigation as NavIcon, X } from 'lucide-react';
import { useMapStore } from '../../../store/mapStore';

export const NavigationPanel: React.FC = () => {
    const { isNavigating, activeRoute, setIsNavigating, setIsTrackingLocation } = useMapStore();

    if (!isNavigating || !activeRoute) return null;

    const currentStep = activeRoute.steps[0]; // Simplified for now

    const handleExit = () => {
        setIsNavigating(false);
        setIsTrackingLocation(false);
    };

    return (
        <div className="fixed inset-x-0 top-0 z-[2000] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl md:top-4 md:left-4 md:right-auto md:w-[400px] md:rounded-2xl md:border">
            <div className="bg-green-600 p-4 text-white flex items-center gap-4 transition-colors">
                <div className="bg-white/20 p-3 rounded-lg">
                    <NavIcon className="w-8 h-8 rotate-45 fill-white" />
                </div>
                <div className="flex-1">
                    <div className="text-2xl font-bold leading-tight uppercase">
                        {currentStep?.instruction || "Head towards destination"}
                    </div>
                    <div className="text-lg opacity-90">
                        Next in {Math.round(activeRoute.steps[1]?.distance || 0)} m
                    </div>
                </div>
                <button onClick={handleExit} className="p-2 hover:bg-black/10 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="hidden md:block p-4 max-h-[400px] overflow-y-auto">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Directions</h3>
                <div className="space-y-6">
                    {activeRoute.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                            </div>
                            <div className="flex-1 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <div className="text-slate-800 dark:text-slate-200 font-medium">{step.instruction}</div>
                                <div className="text-sm text-slate-500 mt-1">{Math.round(step.distance)} m</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
