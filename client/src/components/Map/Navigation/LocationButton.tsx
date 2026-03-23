import React from 'react';
import { Navigation } from 'lucide-react';
import { useMapStore } from '../../../store/mapStore';
import { useLocation } from '../../../hooks/useLocation';

export const LocationButton: React.FC = () => {
    const { isTrackingLocation, setIsTrackingLocation } = useMapStore();
    const { locateMe } = useLocation();

    const handleLocate = () => {
        setIsTrackingLocation(true);
        locateMe();
    };

    return (
        <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
            <button
                onClick={handleLocate}
                className={`p-3 rounded-full shadow-lg border transition-colors ${isTrackingLocation
                    ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                title="Locate me"
            >
                <Navigation className={`w-5 h-5 ${isTrackingLocation ? 'fill-current' : ''}`} />
            </button>
        </div>
    );
};
