import React from 'react';
import { Navigation as NavIcon } from 'lucide-react';
import { useMapStore } from '../../../store/mapStore';

export const RouteInfo: React.FC = () => {
    const { activeRoute, setIsNavigating } = useMapStore();

    if (!activeRoute) return null;

    const formatDistance = (meters: number) => {
        if (meters < 1000) return `${Math.round(meters)} m`;
        return `${(meters / 1000).toFixed(1)} km`;
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.round(seconds / 60);
        if (mins < 60) return `${mins} min`;
        const hrs = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hrs} hr ${remainingMins} min`;
    };

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                        {formatDuration(activeRoute.duration)}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {formatDistance(activeRoute.distance)} • Fast route
                    </div>
                </div>

                <button
                    onClick={() => setIsNavigating(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
                >
                    <NavIcon className="w-5 h-5 fill-current" />
                    Start
                </button>
            </div>
        </div>
    );
};
