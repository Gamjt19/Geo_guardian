import React, { useState } from 'react';
import axios from 'axios';

interface SearchBoxProps {
    onDestinationSelect: (location: any) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onDestinationSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = async (val: string) => {
        if (!val || val.length < 3) {
            setResults([]);
            return;
        }

        try {
            // Use backend proxy to avoid CORS and add User-Agent
            const res = await axios.get(`http://localhost:5000/api/search?q=${encodeURIComponent(val)}`);
            setResults(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Debounce search effect
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.length >= 3) {
                handleSearch(query);
            } else {
                setResults([]);
            }
        }, 800); // 800ms debounce to be kind to Nominatim API

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Manual submit handler
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    };

    return (
        <div className="bg-[#111827]/90 backdrop-blur-[12px] p-2 rounded-[12px] border border-white/[0.08] shadow-lg w-full pointer-events-auto transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] hover:border-white/[0.15]">
            <form onSubmit={onSubmit} className="flex gap-2 relative">
                <div className={`relative flex-1 transition-all duration-300 rounded-lg ${isFocused ? 'ring-1 ring-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.2)]' : ''}`}>
                    <input
                        type="text"
                        placeholder="Enter Destination..."
                        className="w-full bg-[#1f2937] border border-transparent rounded-[8px] px-4 py-2.5 text-white text-sm focus:outline-none transition-colors placeholder:text-white/60 font-medium tracking-wide"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-gradient-to-r from-[#00b4d8] to-[#00d4ff] text-white text-sm px-6 py-2 rounded-[8px] font-bold tracking-wider shadow-[0_0_10px_rgba(0,212,255,0.3)] hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] uppercase transform hover:scale-105 active:scale-95 transition-all"
                >
                    Search
                </button>
            </form>

            {results.length > 0 && (
                <ul className="mt-2 text-sm max-h-60 overflow-y-auto bg-[#111827]/95 backdrop-blur-[12px] border border-white/[0.08] rounded-[12px] shadow-[0_0_20px_rgba(0,0,0,0.5)] scrollbar-thin scrollbar-thumb-[#00d4ff]/50 scrollbar-track-transparent divide-y divide-white/[0.05]">
                    {results.map((r, idx) => (
                        <li
                            key={idx}
                            className="p-3 hover:bg-[#00d4ff]/10 cursor-pointer text-slate-300 hover:text-white transition-all duration-200 border-l-2 border-transparent hover:border-[#00d4ff] flex items-center gap-3 group"
                            onClick={() => {
                                onDestinationSelect(r);
                                setResults([]);
                                setQuery(r.display_name.split(',')[0]);
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-[#00d4ff] transition-colors shadow-none group-hover:shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                            <span className="font-medium truncate">{r.display_name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBox;
