import React from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { useMapStore } from '../../../store/mapStore';
import { useRouting } from '../../../hooks/useRouting';

interface MarkerPopupProps {
    name: string;
    coordinates: [number, number];
    onClose: () => void;
}

export const MarkerPopup: React.FC<MarkerPopupProps> = ({ name, coordinates, onClose }) => {
    const { userLocation, setDestination } = useMapStore();
    const { getRoute } = useRouting();

    const handleStartRoute = async () => {
        if (userLocation) {
            await getRoute(userLocation, coordinates);
            setDestination(coordinates);
            onClose();
        } else {
            alert("Please enable your location to start routing.");
        }
    };

    return (
        <div className="p-2 min-w-[200px]">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 dark:text-white leading-tight pr-4">{name}</h3>
            </div>

            <div className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {coordinates[0].toFixed(5)}, {coordinates[1].toFixed(5)}
            </div>

            <button
                onClick={handleStartRoute}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-md"
            >
                <Navigation className="w-4 h-4 fill-current" />
                Directions
            </button>
        </div>
    );
};
