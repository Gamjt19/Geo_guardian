import React from 'react';
import { Polyline, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';

interface RouteData {
    totalDistanceKm: string;
    totalDurationMin: number;
    hasVehicleRestrictionViolations: boolean;
    warning: string | null;
    segments: {
        coordinates: [number, number][];
        isRestricted: boolean;
    }[];
}

interface RoutingLayerProps {
    routes: RouteData[];
    selectedIndex: number;
    onRouteSelect: (index: number) => void;
    currentRouteIndex?: number;
}

const RoutingLayer: React.FC<RoutingLayerProps> = ({ routes, selectedIndex, onRouteSelect, currentRouteIndex = 0 }) => {
    if (!routes || routes.length === 0) return null;

    // Use the primary (first) route for markers
    const primaryRoute = routes[0];
    const startPoint = primaryRoute.segments[0].coordinates[0];
    const endPoint = primaryRoute.segments[primaryRoute.segments.length - 1].coordinates[primaryRoute.segments[primaryRoute.segments.length - 1].coordinates.length - 1];

    return (
        <>
            {/* Start Marker */}
            <Marker position={startPoint} icon={new L.DivIcon({
                html: `<svg viewBox="0 0 24 24" fill="#00d4ff" stroke="#fff" stroke-width="2" width="30" height="30" style="filter: drop-shadow(0px 4px 6px rgba(0, 212, 255, 0.4));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5" fill="#111827"/></svg>`,
                className: 'custom-teardrop',
                iconSize: [30, 30], iconAnchor: [15, 30]
            })}>
                <Popup className="dark-popup">Start</Popup>
            </Marker>

            {/* End Marker */}
            <Marker position={endPoint} icon={new L.DivIcon({
                html: `<svg viewBox="0 0 24 24" fill="#ef4444" stroke="#fff" stroke-width="2" width="30" height="30" style="filter: drop-shadow(0px 4px 6px rgba(239, 68, 68, 0.4));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5" fill="#111827"/></svg>`,
                className: 'custom-teardrop',
                iconSize: [30, 30], iconAnchor: [15, 30]
            })}>
                <Popup className="dark-popup">Destination</Popup>
            </Marker>

            {/* Render all routes. Inactive routes first, active route last to ensure it's on top */}
            {[...routes]
                .map((r, i) => ({ ...r, originalIndex: i }))
                .sort((a, b) => (a.originalIndex === selectedIndex ? 1 : b.originalIndex === selectedIndex ? -1 : 0))
                .map((route) => {
                    const isSelected = route.originalIndex === selectedIndex;
                    const weight = isSelected ? 5 : 4;
                    const opacity = isSelected ? 1 : 0.6;

                    // If it's the selected route and we have simulation progress, split it
                    if (isSelected && currentRouteIndex > 0) {
                        const allCoords = route.segments.flatMap(s => s.coordinates);
                        const coveredCoords = allCoords.slice(0, currentRouteIndex + 1);
                        const remainingCoords = allCoords.slice(currentRouteIndex);

                        return (
                            <React.Fragment key={route.originalIndex}>
                                <Polyline
                                    positions={coveredCoords}
                                    pathOptions={{
                                        color: '#9ec5ff',
                                        weight: weight,
                                        opacity: 0.8,
                                        lineJoin: 'round'
                                    }}
                                />
                                <Polyline
                                    positions={remainingCoords}
                                    pathOptions={{
                                        color: '#1a73e8',
                                        weight: weight,
                                        opacity: 1,
                                        lineJoin: 'round'
                                    }}
                                />
                            </React.Fragment>
                        );
                    }


                    return (
                        <React.Fragment key={route.originalIndex}>
                            {/* Halo effect for active route */}
                            {isSelected && route.segments.map((seg, segIdx) => (
                                <Polyline
                                    key={`halo-${route.originalIndex}-${segIdx}`}
                                    positions={seg.coordinates}
                                    pathOptions={{
                                        color: '#00d4ff',
                                        weight: weight + 8,
                                        opacity: 0.3,
                                        lineJoin: 'round'
                                    }}
                                />
                            ))}

                            {route.segments.map((seg, segIdx) => (
                                <Polyline
                                    key={`${route.originalIndex}-${segIdx}`}
                                    positions={seg.coordinates}
                                    eventHandlers={{
                                        click: (e) => {
                                            L.DomEvent.stopPropagation(e);
                                            onRouteSelect(route.originalIndex);
                                        }
                                    }}
                                    pathOptions={{
                                        color: route.hasVehicleRestrictionViolations ? '#ef4444' : (isSelected ? '#00d4ff' : '#f59e0b'),
                                        dashArray: seg.isRestricted ? '10, 10' : undefined,
                                        weight: weight,
                                        opacity: opacity,
                                        lineJoin: 'round',
                                        interactive: true
                                    }}
                                >
                                    <Popup className="dark-popup">
                                        <div className="font-sans min-w-[120px] bg-[#111827] text-white p-2 rounded-lg -m-3">
                                            <p className="font-bold text-[#00d4ff]">{route.totalDurationMin} min</p>
                                            <p className="text-sm text-slate-300">{route.totalDistanceKm} km</p>
                                            {!isSelected && <p className="text-xs text-orange-400 mt-1 font-medium">Click to use this route</p>}
                                            {seg.isRestricted && <p className="text-xs text-[#ef4444] mt-1 uppercase font-bold">Restriction Detected</p>}
                                        </div>
                                    </Popup>
                                </Polyline>
                            ))}
                        </React.Fragment>
                    );
                })}
        </>
    );
};

export default RoutingLayer;
