import { useState } from 'react';
import type { RouteInfo, RouteStep } from '../store/mapStore';
import { useMapStore } from '../store/mapStore';

export const useRouting = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setActiveRoute } = useMapStore();

    const getRoute = async (start: [number, number], end: [number, number]) => {
        setLoading(true);
        setError(null);

        try {
            // OSRM expects [lon, lat]
            const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch route');
            }

            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                throw new Error('No route found');
            }

            const route = data.routes[0];

            const steps: RouteStep[] = route.legs[0].steps.map((step: any) => ({
                instruction: step.maneuver.instruction,
                distance: step.distance,
                duration: step.duration,
                location: [step.maneuver.location[1], step.maneuver.location[0]], // [lat, lon]
            }));

            const routeInfo: RouteInfo = {
                distance: route.distance,
                duration: route.duration,
                geometry: route.geometry,
                steps: steps,
            };

            setActiveRoute(routeInfo);
            return routeInfo;
        } catch (err: any) {
            setError(err.message || 'Error fetching route');
            setActiveRoute(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getRoute, loading, error };
};
