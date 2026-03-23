import { useEffect, useRef, useState } from 'react';
import { useMapContext } from '../context/MapContext';
import { useMapStore } from '../store/mapStore';
import { calculateDistance, pointToPolylineDistance } from '../utils/distance';
import { speak } from '../utils/voice';

interface Hazard {
    _id: string;
    type: string;
    name: string;
    location: {
        coordinates: [number, number]; // [lng, lat]
    };
}

const useHazardAlerts = (hazards: Hazard[]) => {
    const { userLocation, currentRouteIndex, isNavigating, setActiveHazardAlert, setRouteHazards } = useMapContext();
    const { activeRoute } = useMapStore();
    const alertedHazards = useRef<Set<string>>(new Set());
    
    // Hazards mapped to their nearest point on the route for alert triggering
    const [routeHazardsWithIndex, setRouteHazardsWithIndex] = useState<{ hazard: Hazard, index: number }[]>([]);

    // 1. When route changes, find which hazards are on the route
    useEffect(() => {
        if (!activeRoute?.geometry?.coordinates) {
            setRouteHazards([]);
            return;
        }

        const routeCoords = activeRoute.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
        
        const onRoute = hazards.map(h => {
            const [hLng, hLat] = h.location.coordinates;
            const nearest = pointToPolylineDistance(hLat, hLng, routeCoords);
            
            // If hazard is within 30m of the polyline, consider it "on route"
            if (nearest.distance < 30) {
                return { hazard: h, index: nearest.index };
            }
            return null;
        }).filter(Boolean) as { hazard: Hazard, index: number }[];

        setRouteHazards(onRoute.map(rh => rh.hazard));
        setRouteHazardsWithIndex(onRoute);
    }, [activeRoute, hazards, setRouteHazards]);

    // 2. Continuous check during navigation
    useEffect(() => {
        if (!isNavigating || !userLocation || routeHazardsWithIndex.length === 0) return;

        routeHazardsWithIndex.forEach(({ hazard, index }) => {
            // Already alerted?
            if (alertedHazards.current.has(hazard._id)) return;

            // Is it ahead of us on the route?
            if (index < currentRouteIndex) return;

            // Is it close enough? (within 400m for earlier warning)
            const [hLng, hLat] = hazard.location.coordinates;
            const dist = calculateDistance(userLocation.lat, userLocation.lng, hLat, hLng);

            if (dist < 400) {
                // Trigger Visual Alert
                setActiveHazardAlert({ 
                    name: hazard.name, 
                    description: (hazard as any).description || `Watch out for ${(hazard.type || 'hazard').replace('_', ' ')}`
                });
                
                // Trigger Voice Alert
                const desc = (hazard as any).description ? `. ${ (hazard as any).description }` : '';
                speak(`Caution: ${(hazard.type || 'hazard').replace('_', ' ')} ahead ${desc}`);
                
                alertedHazards.current.add(hazard._id);
            }
        });
    }, [userLocation, currentRouteIndex, isNavigating, routeHazardsWithIndex, setActiveHazardAlert]);

    // Reset alert tracking when navigation stops or route changes
    useEffect(() => {
        if (!isNavigating) {
            alertedHazards.current.clear();
        }
    }, [isNavigating, activeRoute]);
};

export default useHazardAlerts;
