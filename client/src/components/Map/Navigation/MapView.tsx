import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '../../../store/mapStore';
import { useMapContext } from '../../../context/MapContext';
import { LayerToggle } from './LayerToggle';
import { LocationButton } from './LocationButton';
import { MarkerPopup } from './MarkerPopup';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import HazardLayers from '../HazardLayers';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom blue dot for user location
const UserLocationIcon = L.divIcon({
    className: 'custom-user-location-marker',
    html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const MapEvents = () => {
    const { addMarker } = useMapStore();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            const id = Date.now().toString();
            addMarker({
                id,
                name: `Dropped Pin`,
                coordinates: [lat, lng],
            });
        },
    });
    return null;
};

const MapUpdater = () => {
    const map = useMap();
    const { userLocation, followMode } = useMapContext();
    const { activeRoute } = useMapStore();

    useEffect(() => {
        if (userLocation && followMode) {
            map.flyTo(userLocation, 16, { animate: true, duration: 1.5 });
        }
    }, [userLocation, followMode, map]);

    useEffect(() => {
        if (activeRoute && activeRoute.geometry) {
            try {
                // Convert geojson coordinates to leaflet format [lat, lng]
                const coords = activeRoute.geometry.coordinates;
                if (coords && coords.length > 0) {
                    const bounds = L.latLngBounds(coords.map((c: any) => [c[1], c[0]]));
                    map.fitBounds(bounds, { padding: [100, 100] });
                }
            } catch (e) {
                console.error("Error setting route bounds", e);
            }
        }
    }, [activeRoute, map])

    return null;
};

export const MapView: React.FC = () => {
    const { activeLayer, userLocation, markers, activeRoute } = useMapStore();
    const { currentRouteIndex, hazards } = useMapContext();
    const mapRef = useRef<L.Map>(null);

    const getTileUrl = () => {
        switch (activeLayer) {
            case 'Satellite':
                return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
            case 'Terrain':
                return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
            case 'Standard':
            case 'Traffic':
            default:
                return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }
    };

    const polylinePositions = activeRoute?.geometry?.coordinates?.map((c: number[]) => [c[1], c[0]] as [number, number]) || [];

    return (
        <div className="relative w-full h-full flex-grow">
            <LayerToggle />

            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                ref={mapRef}
                className="w-full h-full z-0"
                zoomControl={false}
            >
                <TileLayer
                    url={getTileUrl()}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <HazardLayers hazards={hazards} visibleTypes={{ school_zone: true, hospital_zone: true, speed_breaker: true, sharp_turn: true, bad_road: true }} />

                <MapEvents />

                {userLocation && (
                    <Marker position={userLocation} icon={UserLocationIcon}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {markers.map((marker) => (
                    <Marker key={marker.id} position={marker.coordinates}>
                        <Popup>
                            <MarkerPopup
                                name={marker.name}
                                coordinates={marker.coordinates}
                                onClose={() => {
                                    // Popups close automatically usually
                                }}
                            />
                        </Popup>
                    </Marker>
                ))}

                {activeRoute && polylinePositions.length > 0 && (
                    <>
                        {/* Covered Route */}
                        <Polyline
                            positions={polylinePositions.slice(0, currentRouteIndex + 1)}
                            color="#9ec5ff"
                            weight={6}
                            opacity={0.8}
                            lineCap="round"
                            lineJoin="round"
                        />
                        {/* Remaining Route */}
                        <Polyline
                            positions={polylinePositions.slice(currentRouteIndex)}
                            color="#1a73e8"
                            weight={6}
                            opacity={1.0}
                            lineCap="round"
                            lineJoin="round"
                        />
                    </>
                )}

                <MapUpdater />
            </MapContainer>

            <LocationButton />
        </div>
    );
};
