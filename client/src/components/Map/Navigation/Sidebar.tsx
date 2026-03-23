import React, { useState } from 'react';
import { Menu, History, Bookmark, X } from 'lucide-react';
import { useMapStore } from '../../../store/mapStore';

export const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { markers } = useMapStore();

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-4 left-4 z-[1001] bg-white dark:bg-slate-900 p-2.5 rounded-l-full sm:hidden shadow-lg border-y border-l border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
            >
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[1002] transition-opacity md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-[1003] transform transition-transform duration-300 ease-in-out border-r border-slate-200 dark:border-slate-700 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white font-orbitron text-glow">GeoGuardian Map</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto h-full space-y-6">

                    {/* Recent section */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Searches</h3>
                        <div className="space-y-2">
                            <button className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left text-sm text-slate-700 dark:text-slate-300">
                                <History className="w-4 h-4 text-slate-400" />
                                <span>City Center Mall</span>
                            </button>
                        </div>
                    </div>

                    {/* Saved section */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Saved Locations</h3>
                        <div className="space-y-2">
                            {markers.length === 0 ? (
                                <p className="text-sm text-slate-400 px-2">No saved locations</p>
                            ) : (
                                markers.map((marker) => (
                                    <button key={marker.id} className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left text-sm text-slate-700 dark:text-slate-300">
                                        <Bookmark className="w-4 h-4 text-blue-500" />
                                        <span>{marker.name}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};
