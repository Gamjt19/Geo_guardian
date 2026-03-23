import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { useGeocoding } from '../../../hooks/useGeocoding';
import { useMap } from 'react-leaflet';

interface AdminSearchBarProps {
    onSelectLocation: (lat: number, lng: number) => void;
}

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({ onSelectLocation }) => {
    const [query, setQuery] = useState('');
    const { searchPlaces, loading } = useGeocoding();
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 3) {
                const results = await searchPlaces(query);
                setSearchResults(results);
                setShowResults(true);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (place: any) => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        
        map.flyTo([lat, lon], 18, {
            duration: 1.5,
            easeLinearity: 0.25
        });

        onSelectLocation(lat, lon);
        setQuery(place.display_name);
        setShowResults(false);
    };

    return (
        <div className="absolute top-4 left-4 z-[1000] w-[300px] md:w-[350px]">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl flex items-center p-2">
                {loading ? (
                    <Loader2 className="w-5 h-5 ml-2 text-cyan-400 animate-spin" />
                ) : (
                    <Search className="w-5 h-5 ml-2 text-slate-500" />
                )}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search locations to mark..."
                    className="flex-1 bg-transparent border-none outline-none px-3 text-white placeholder-slate-500 text-sm font-mono"
                    onFocus={() => setShowResults(true)}
                />
                {query && (
                    <button onClick={() => { setQuery(''); setSearchResults([]); }} className="p-1 hover:text-white text-slate-500">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {showResults && searchResults.length > 0 && (
                <div className="mt-2 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700 overflow-hidden max-h-[40vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {searchResults.map((place: any) => (
                        <button
                            key={place.place_id}
                            onClick={() => handleSelect(place)}
                            className="w-full text-left p-3 hover:bg-slate-800 border-b border-slate-800 last:border-0 flex items-start gap-3 transition-colors group"
                        >
                            <MapPin className="w-4 h-4 text-slate-500 mt-1 group-hover:text-cyan-400 transition-colors shrink-0" />
                            <div>
                                <div className="font-bold text-white text-xs line-clamp-1">
                                    {place.name || place.display_name.split(',')[0]}
                                </div>
                                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
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

export default AdminSearchBar;
