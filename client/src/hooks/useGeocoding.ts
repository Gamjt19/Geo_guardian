import { useState } from 'react';

export const useGeocoding = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchPlaces = async (query: string) => {
        if (!query || query.trim().length < 3) return [];

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    query
                )}&format=json&limit=5&addressdetails=1`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch places');
            }

            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message || 'Error fetching places');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const reverseGeocode = async (lat: number, lon: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );

            if (!response.ok) {
                throw new Error('Failed to reverse geocode');
            }

            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message || 'Error reverse geocoding');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { searchPlaces, reverseGeocode, loading, error };
};
