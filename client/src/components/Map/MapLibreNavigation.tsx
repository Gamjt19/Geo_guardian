import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapContext } from '../../context/MapContext';
import { useAuth } from '../../context/AuthContext';
import carIcon from '../../assets/car1.png';
import bikeIcon from '../../assets/bike1.png';
import walkingIcon from '../../assets/walking1.png';
import heavyIcon from '../../assets/heavy1.svg';
import emergencyIcon from '../../assets/emergency1.svg';
import { useSpeedLimit } from '../../hooks/useSpeedLimit';

interface MapLibreNavigationProps {
    routeSegments: any[];
    theme: 'light' | 'dark';
    viewMode: '2d' | '3d' | 'satellite';
}

const MapLibreNavigation: React.FC<MapLibreNavigationProps> = ({ routeSegments, theme, viewMode }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const { userLocation, followMode, setFollowMode, isSimulating, currentRouteIndex, routeHazards } = useMapContext();
    const { user } = useAuth();
    const [mapLoaded, setMapLoaded] = useState(false);

    // Speed Tracking
    const { status } = useSpeedLimit(userLocation, user?.vehicleType || 'car');
    const isOverspeed = status === 'overspeed';

    // 1. Initialize MapLibre
    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/liberty', // Default
            center: userLocation ? [userLocation.lng, userLocation.lat] : [-0.09, 51.505],
            zoom: 17,
            pitch: viewMode === '2d' ? 0 : 60,
            bearing: userLocation?.heading || 0
        });

        map.current.on('dragstart', () => setFollowMode(false));
        map.current.on('pitchstart', () => setFollowMode(false));

        map.current.on('load', () => {
            setMapLoaded(true);
            updateMapStyle(map.current!, theme, viewMode);
        });

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // 2. Handle Style & Theme Updates
    useEffect(() => {
        if (!map.current || !mapLoaded) return;
        updateMapStyle(map.current, theme, viewMode);
    }, [theme, viewMode, mapLoaded]);

    const updateMapStyle = (mapInstance: maplibregl.Map, currentTheme: string, currentView: string) => {
        const style = mapInstance.getStyle();
        if (!style || !style.layers) return;

        const isDark = currentTheme === 'dark';

        style.layers.forEach((layer) => {
            if (layer.type === 'background') {
                mapInstance.setPaintProperty(layer.id, 'background-color', isDark ? '#0f172a' : '#f8fafc');
            }
            if (layer.type === 'fill') {
                mapInstance.setPaintProperty(layer.id, 'fill-color', isDark ? '#1e293b' : '#e2e8f0');
            }
            if (layer.type === 'line') {
                if (layer.id.includes('road') || layer.id.includes('highway') || layer.id.includes('transportation')) {
                    mapInstance.setPaintProperty(layer.id, 'line-color', isDark ? '#64748b' : '#ffffff');
                }
            }
            if (layer.type === 'symbol') {
                mapInstance.setPaintProperty(layer.id, 'text-color', isDark ? '#e2e8f0' : '#1e293b');
                mapInstance.setPaintProperty(layer.id, 'text-halo-color', isDark ? '#0f172a' : '#ffffff');
            }
            if (layer.type === 'fill-extrusion') {
                mapInstance.setPaintProperty(layer.id, 'fill-extrusion-color', isDark ? '#334155' : '#cbd5e1');
                mapInstance.setPaintProperty(layer.id, 'fill-extrusion-opacity', currentView === '2d' ? 0 : 0.9);
            }
        });
    };

    // 3. Update Camera & Marker
    useEffect(() => {
        if (!map.current || !mapLoaded || !userLocation) return;

        const { lat, lng, heading } = userLocation;

        if (followMode) {
            map.current.easeTo({
                center: [lng, lat],
                zoom: 18,
                pitch: viewMode === '2d' ? 0 : 60,
                bearing: heading || 0,
                duration: isSimulating ? 0 : 1000,
                easing: (t) => t,
                offset: [0, 150]
            });
        }

        // Determine Icon and Rotation
        const vehicleType = user?.vehicleType || 'car';
        let iconSrc = carIcon;
        let rotationOffset = 0;
        let size = 50; // Default size

        switch (vehicleType) {
            case 'heavy':
                iconSrc = heavyIcon;
                rotationOffset = 180;
                size = 64;
                break;
            case 'emergency':
                iconSrc = emergencyIcon;
                rotationOffset = 180;
                size = 60;
                break;
            case 'two-wheeler':
                iconSrc = bikeIcon;
                rotationOffset = 90;
                size = 42;
                break;
            case 'walk':
                iconSrc = walkingIcon;
                rotationOffset = 180;
                size = 48;
                break;
            default:
                iconSrc = carIcon;
                rotationOffset = 180; // Fix car orientation
                size = 50;
                break;
        }

        if (!markerRef.current) {
            const el = document.createElement('div');
            el.className = 'vehicle-marker-3d relative flex items-center justify-center';
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;

            // Background Pulsing for 3D marker
            const pulse = document.createElement('div');
            pulse.className = `absolute inset-0 rounded-full opacity-20 animate-ping ${isOverspeed ? 'bg-red-500/80' : 'bg-emerald-500/50'}`;
            pulse.style.transform = 'scale(0.8)';
            pulse.id = 'vehicle-pulse';
            el.appendChild(pulse);

            const imgContainer = document.createElement('div');
            imgContainer.className = 'relative z-10 transition-transform duration-300 ease-linear w-full h-full';
            imgContainer.id = 'vehicle-img-container';

            imgContainer.style.backgroundImage = `url(${iconSrc})`;
            imgContainer.style.backgroundSize = 'contain';
            imgContainer.style.backgroundRepeat = 'no-repeat';
            imgContainer.style.backgroundPosition = 'center';
            imgContainer.style.transform = `rotate(${rotationOffset}deg)`;

            el.appendChild(imgContainer);

            markerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([lng, lat])
                .addTo(map.current);
        } else {
            markerRef.current.setLngLat([lng, lat]);
            const imgContainer = markerRef.current.getElement().querySelector('#vehicle-img-container') as HTMLElement;

            if (imgContainer) {
                // Ensure URL formatting doesn't falsely trigger a replace by stripping quotes if present
                const currentBg = imgContainer.style.backgroundImage.replace(/['"]/g, '');
                const expectedBg = `url(${iconSrc})`.replace(/['"]/g, '');
                if (currentBg !== expectedBg) {
                    imgContainer.style.backgroundImage = `url(${iconSrc})`;
                }
                imgContainer.style.transform = `rotate(${rotationOffset}deg)`;
            }

            // Update pulse color
            const pulse = markerRef.current.getElement().querySelector('#vehicle-pulse');
            if (pulse) {
                pulse.className = `absolute inset-0 rounded-full opacity-20 animate-ping ${isOverspeed ? 'bg-red-500/80' : 'bg-emerald-500/50'}`;
            }

            // Update size if changed
            const el = markerRef.current.getElement();
            if (el) {
                el.style.width = `${size}px`;
                el.style.height = `${size}px`;
            }
        }
    }, [userLocation, mapLoaded, followMode, user?.vehicleType, viewMode, isOverspeed]);

    // 4. Render Route
    useEffect(() => {
        if (!map.current || !mapLoaded || routeSegments.length === 0) return;

        const allCoordinates = routeSegments.flatMap(seg => seg.coordinates.map((c: number[]) => [c[1], c[0]]));
        const coveredCoords = allCoordinates.slice(0, currentRouteIndex + 1);
        const remainingCoords = allCoordinates.slice(currentRouteIndex);

        if (map.current.getSource('route-remaining')) {
            (map.current.getSource('route-remaining') as maplibregl.GeoJSONSource).setData({
                type: 'Feature',
                properties: {},
                geometry: { type: 'LineString', coordinates: remainingCoords }
            });
        } else {
            map.current.addSource('route-remaining', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': { type: 'LineString', coordinates: remainingCoords }
                }
            });
            map.current.addLayer({
                'id': 'route-remaining',
                'type': 'line',
                'source': 'route-remaining',
                'layout': { 'line-join': 'round', 'line-cap': 'round' },
                'paint': {
                    'line-color': '#1a73e8',
                    'line-width': 8,
                    'line-opacity': 1.0
                }
            });
        }

        if (map.current.getSource('route-covered')) {
            (map.current.getSource('route-covered') as maplibregl.GeoJSONSource).setData({
                type: 'Feature',
                properties: {},
                geometry: { type: 'LineString', coordinates: coveredCoords }
            });
        } else {
            map.current.addSource('route-covered', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': { type: 'LineString', coordinates: coveredCoords }
                }
            });
            map.current.addLayer({
                'id': 'route-covered',
                'type': 'line',
                'source': 'route-covered',
                'layout': { 'line-join': 'round', 'line-cap': 'round' },
                'paint': {
                    'line-color': '#9ec5ff',
                    'line-width': 8,
                    'line-opacity': 0.8
                }
            });
        }

        if (map.current.getLayer('route')) {
            map.current.removeLayer('route');
            map.current.removeSource('route');
        }
    }, [routeSegments, mapLoaded, currentRouteIndex]);

    // 5. Render Hazards
    useEffect(() => {
        if (!map.current || !mapLoaded || !routeHazards || routeHazards.length === 0) return;

        console.log("Rendering hazards in 3D navigation:", routeHazards.length);

        const hazardGeoJSON: any = {
            type: 'FeatureCollection',
            features: routeHazards
                .filter(h => h.location && h.location.coordinates)
                .map(h => ({
                    type: 'Feature',
                    properties: { type: h.type, name: h.name },
                    geometry: h.location
                }))
        };

        if (map.current.getSource('hazards')) {
            (map.current.getSource('hazards') as maplibregl.GeoJSONSource).setData(hazardGeoJSON);
        } else {
            map.current.addSource('hazards', {
                type: 'geojson',
                data: hazardGeoJSON
            });

            map.current.addLayer({
                id: 'hazard-glow',
                type: 'circle',
                source: 'hazards',
                paint: {
                    'circle-radius': 15,
                    'circle-color': [
                        'match', ['get', 'type'],
                        'school_zone', '#60a5fa',
                        'hospital_zone', '#ef4444',
                        'speed_breaker', '#f97316',
                        'sharp_turn', '#facc15',
                        'bad_road', '#d97706',
                        '#ffffff'
                    ],
                    'circle-opacity': 0.2,
                    'circle-blur': 1
                }
            });

            map.current.addLayer({
                id: 'hazard-points',
                type: 'circle',
                source: 'hazards',
                paint: {
                    'circle-radius': 8,
                    'circle-color': [
                        'match', ['get', 'type'],
                        'school_zone', '#3b82f6',
                        'hospital_zone', '#dc2626',
                        'speed_breaker', '#ea580c',
                        'sharp_turn', '#eab308',
                        'bad_road', '#92400e',
                        '#ffffff'
                    ],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });
        }
    }, [mapLoaded, routeHazards]);

    return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapLibreNavigation;
