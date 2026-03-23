import React from 'react';
import { useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

interface HazardPinPickerProps {
    mapMode: 'normal' | 'pin_placement';
    pendingCoords: { lat: number, lng: number, address: string } | null;
    setPendingCoords: (coords: { lat: number, lng: number, address: string } | null) => void;
}

export const HazardPinPicker: React.FC<HazardPinPickerProps> = ({ mapMode, pendingCoords, setPendingCoords }) => {
    const map = useMapEvents({
        click(e) {
            if (mapMode !== 'pin_placement') return;
            handleCoordinateChange(e.latlng);
        }
    });

    React.useEffect(() => {
        const container = map.getContainer();
        if (container) {
            if (mapMode === 'pin_placement') {
                container.style.cursor = 'crosshair';
            } else {
                container.style.cursor = '';
            }
        }
    }, [mapMode, map]);

    const handleCoordinateChange = async (latlng: L.LatLng) => {
        try {
            // Using OSM Nominatim for reverse geocoding
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`, {
                headers: {
                    'Accept-Language': 'en'
                }
            });
            const address = res.data.display_name || 'Selected Location';
            // To make the address shorter, let's take just the first two parts of it
            const shortAddress = address.split(',').slice(0, 2).join(',').trim();
            setPendingCoords({ lat: latlng.lat, lng: latlng.lng, address: shortAddress || address });
        } catch (err) {
            console.error(err);
            setPendingCoords({ lat: latlng.lat, lng: latlng.lng, address: 'Unknown Location' });
        }
    };

    if (mapMode !== 'pin_placement' || !pendingCoords) return null;

    // Use a custom icon so it stands out as the pending pin
    const pinIcon = L.divIcon({
        html: `<div style="font-size: 32px; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5)); transform: translate(-50%, -100%); line-height: 1;">📍</div>`,
        className: 'custom-pin-icon',
        iconSize: [32, 32],
        iconAnchor: [0, 0] // we handled anchor in transform manually
    });

    return (
        <Marker 
            position={[pendingCoords.lat, pendingCoords.lng]} 
            draggable={true}
            icon={pinIcon}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    handleCoordinateChange(position);
                }
            }}
        />
    );
};
