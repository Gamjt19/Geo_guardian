import React, { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useGeocoding } from '../../../hooks/useGeocoding';
import { useMapStore } from '../../../store/mapStore';

export const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const { searchPlaces, loading } = useGeocoding();
    const { setSearchResults, searchResults, setUserLocation } = useMapStore();
    const [showResults, setShowResults] = useState(false);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 3) {
                const results = await searchPlaces(query);
                setSearchResults(results);
                setShowResults(true);
            } else {
                setSearchResults([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (place: any) => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        setUserLocation([lat, lon]);
        setQuery(place.display_name);
        setShowResults(false);
    };

    return (
        <div className="absolute top-4 left-4 z-[1000] w-[340px] md:w-[400px]">
            <div className="bg-white dark:bg-slate-900 rounded-full shadow-lg flex items-center p-2 border border-slate-200 dark:border-slate-700">
                <Search className="w-5 h-5 ml-2 text-slate-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Google Maps"
                    className="flex-1 bg-transparent border-none outline-none px-3 text-slate-800 dark:text-slate-200 placeholder-slate-400"
                    onFocus={() => setShowResults(true)}
                />
                {query && (
                    <button onClick={() => { setQuery(''); setSearchResults([]); }} className="p-1">
                        <X className="w-5 h-5 text-slate-500 hover:text-slate-800" />
                    </button>
                )}
            </div>

            {showResults && searchResults.length > 0 && (
                <div className="mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[60vh] overflow-y-auto">
                    {loading && <div className="p-3 text-sm text-slate-500 text-center">Loading...</div>}
                    {!loading && searchResults.map((place: any) => (
                        <button
                            key={place.place_id}
                            onClick={() => handleSelect(place)}
                            className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex items-start gap-3 transition-colors last:border-0"
                        >
                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <div className="font-medium text-slate-800 dark:text-slate-200 text-sm line-clamp-1">
                                    {place.name || place.display_name.split(',')[0]}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                    {place.display_name}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
