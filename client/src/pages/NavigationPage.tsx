import React, { useEffect } from 'react';
import { useMapStore } from '../store/mapStore';
import { MapView } from '../components/Map/Navigation/MapView';
import { SearchBar } from '../components/Map/Navigation/SearchBar';
import { Sidebar } from '../components/Map/Navigation/Sidebar';
import { NavigationPanel } from '../components/Map/Navigation/NavigationPanel';
import { RouteInfo } from '../components/Map/Navigation/RouteInfo';
import { speak } from '../utils/voice';
import { HazardAlert } from '../components/Map/Navigation/HazardAlert';
import useHazardAlerts from '../hooks/useHazardAlerts';
import { useMapContext } from '../context/MapContext';

export const NavigationPage: React.FC = () => {
    const { isNavigating, activeRoute } = useMapStore();
    const { hazards } = useMapContext();

    // Hazard alerts hook
    useHazardAlerts(hazards);

    // Voice guidance logic
    useEffect(() => {
        if (isNavigating && activeRoute && activeRoute.steps.length > 0) {
            const nextStep = activeRoute.steps[0];
            speak(nextStep.instruction);
        }
    }, [isNavigating, activeRoute]);

    // 3D Navigation Overlay class managed via MapView component internals normally
    useEffect(() => {
        const mapContainer = document.querySelector('.leaflet-container');
        if (isNavigating) {
            mapContainer?.classList.add('map-navigation-3d');
        } else {
            mapContainer?.classList.remove('map-navigation-3d');
        }

        return () => {
            mapContainer?.classList.remove('map-navigation-3d');
        };
    }, [isNavigating]);

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col">
            <HazardAlert />
            {/* Search and Navigation UI Overlay */}
            {!isNavigating && <SearchBar />}
            {!isNavigating && <Sidebar />}

            {isNavigating && <NavigationPanel />}

            {!isNavigating && activeRoute && <RouteInfo />}

            {/* Full Screen Map */}
            <div className={`w-full flex-1 transition-all duration-700 ${isNavigating ? 'pt-24 md:pt-0' : ''}`}>
                <MapView />
            </div>
        </div>
    );
};
