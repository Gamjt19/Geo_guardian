import React from 'react';
import { Layers } from 'lucide-react';
import { useMapStore } from '../../../store/mapStore';
import type { MapLayer } from '../../../store/mapStore';

export const LayerToggle: React.FC = () => {
    const { activeLayer, setActiveLayer } = useMapStore();
    const [isOpen, setIsOpen] = React.useState(false);

    const layers: MapLayer[] = ['Standard', 'Satellite', 'Terrain', 'Traffic'];

    return (
        <div className="absolute top-4 right-4 z-[1000]">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    title="Map Layers"
                >
                    <Layers className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                </button>

                {isOpen && (
                    <div className="absolute top-14 right-0 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-2 w-40">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-2 uppercase tracking-wider">
                            Map Details
                        </div>
                        {layers.map((layer) => (
                            <button
                                key={layer}
                                onClick={() => {
                                    setActiveLayer(layer);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeLayer === layer
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {layer}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
