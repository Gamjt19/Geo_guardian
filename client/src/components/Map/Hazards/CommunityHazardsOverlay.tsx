import React, { useEffect, useState, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { HazardMarker } from './HazardMarker';
import { HazardDetailCard } from './HazardDetailCard';
import { HazardConfirmPrompt } from './HazardConfirmPrompt';
import { useMapContext } from '../../../context/MapContext';

export const CommunityHazardsOverlay: React.FC = () => {
    const { userLocation } = useMapContext();
    const [hazards, setHazards] = useState<any[]>([]);
    const [selectedHazard, setSelectedHazard] = useState<any>(null);
    const map = useMap();
    const lastPromptTime = useRef<number>(0);

    // Mock currentUser (should come from useAuth in real app, hardcoded here for testing if not passed)
    // Actually, let's use a mock user with role local_guide
    const currentUser = { _id: 'mock_guide_id', role: 'local_guide', name: 'Admin Guide' };

    useEffect(() => {
        if (!userLocation) return;
        
        const fetchHazards = async () => {
            try {
                // Fetch nearby hazards (within 2000m)
                const res = await fetch(`http://localhost:5000/api/hazards/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=2000`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setHazards(data);

                    // Prompt user if very close (100m)
                    data.forEach((h: any) => {
                        const hlat = h.location.coordinates[1];
                        const hlng = h.location.coordinates[0];
                        const dist = map.distance([userLocation.lat, userLocation.lng], [hlat, hlng]);

                        if (dist < 100) {
                            const now = Date.now();
                            if (now - lastPromptTime.current > 5000) {
                                lastPromptTime.current = now;
                                HazardConfirmPrompt.show(h._id, h.hazardType, currentUser);
                            }
                        }
                        // Alert banner check logic in routing handles 500m banners
                    });
                }
            } catch (err) {
                console.error('Failed to fetch nearby hazards', err);
            }
        };

        fetchHazards();
        const interval = setInterval(fetchHazards, 10000);
        return () => clearInterval(interval);
    }, [userLocation, map]);

    return (
        <>
            {hazards.map((h) => {
                const iconHtml = renderToStaticMarkup(<HazardMarker hazard={h} />);
                const divIcon = L.divIcon({
                    html: iconHtml,
                    className: 'bg-transparent border-none',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                });

                return (
                    <Marker 
                        key={h._id} 
                        position={[h.location.coordinates[1], h.location.coordinates[0]]} 
                        icon={divIcon}
                        eventHandlers={{ click: () => setSelectedHazard(h) }}
                    />
                );
            })}
            
            {/* Using a single manual popup rendering the detail card instead of Popup children for better styling control */}
            {selectedHazard && (
                <Popup
                    position={[selectedHazard.location.coordinates[1], selectedHazard.location.coordinates[0]]}
                    eventHandlers={{ remove: () => setSelectedHazard(null) }}
                    closeButton={false}
                    className="custom-hazard-popup"
                >
                    <HazardDetailCard 
                        hazard={selectedHazard} 
                        currentUser={currentUser} 
                        onClose={() => setSelectedHazard(null)}
                        onFeedbackComplete={() => {}}
                    />
                </Popup>
            )}
        </>
    );
};
