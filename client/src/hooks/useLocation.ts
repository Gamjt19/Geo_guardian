import { useCallback, useEffect } from 'react';
import { useMapStore } from '../store/mapStore';

export const useLocation = () => {
    const { setUserLocation, isTrackingLocation, setIsTrackingLocation } = useMapStore();

    const handleSuccess = useCallback((position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
    }, [setUserLocation]);

    const handleError = useCallback((error: GeolocationPositionError) => {
        console.error('Error getting location:', error);
        setIsTrackingLocation(false);
    }, [setIsTrackingLocation]);

    const locateMe = useCallback(() => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });
    }, [handleSuccess, handleError]);

    useEffect(() => {
        let watchId: number;

        if (isTrackingLocation) {
            if (!navigator.geolocation) {
                setIsTrackingLocation(false);
                return;
            }

            watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            });
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [isTrackingLocation, handleSuccess, handleError, setIsTrackingLocation]);

    return { locateMe };
};
