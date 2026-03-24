import React, { useState } from 'react';
import { Map, Satellite, Box, Sun, Moon } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface MapStyleSwitcherProps {
    currentViewMode: '2d' | '3d' | 'satellite';
    onViewModeChange: (mode: '2d' | '3d' | 'satellite') => void;
}

const styles = [
    { id: '2d', label: '2D Map', icon: Map },
    { id: '3d', label: '3D View', icon: Box },
    { id: 'satellite', label: 'Satellite', icon: Satellite },
] as const;

const MapStyleSwitcher: React.FC<MapStyleSwitcherProps> = ({ currentViewMode, onViewModeChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="relative group p-2 flex flex-col gap-2 pointer-events-auto">
            {/* Main Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 flex items-center justify-center bg-[#111827]/90 backdrop-blur-[12px] rounded-full shadow-lg border border-white/[0.08] pointer-events-auto hover:bg-[#00d4ff]/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:border-[#00d4ff]/50 transition-all text-[#00d4ff] z-20 group"
                title="Map Settings"
            >
                {currentViewMode === 'satellite' ? <Satellite className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" /> : <Map className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        className="absolute bottom-16 left-0 bg-[#111827]/90 backdrop-blur-[12px] border border-white/[0.08] p-3 rounded-[12px] shadow-[0_0_20px_rgba(0,0,0,0.5)] w-56 z-10 flex flex-col gap-3"
                    >
                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between px-2 pb-2 border-b border-white/[0.08]">
                            <span className="text-slate-300 text-sm font-medium">Theme</span>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-2 bg-slate-800 rounded-full p-1 pl-3 pr-1 border border-slate-600 transition-all hover:bg-slate-700"
                            >
                                <span className="text-xs text-slate-400 font-medium">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                                <div className={clsx(
                                    "p-1.5 rounded-full transition-colors",
                                    theme === 'dark' ? "bg-indigo-500 text-white" : "bg-amber-400 text-slate-900"
                                )}>
                                    {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                                </div>
                            </button>
                        </div>

                        {/* Map Styles */}
                        <div className="space-y-1">
                            <span className="text-xs text-slate-500 px-2 uppercase tracking-wider font-bold">View Mode</span>
                            {styles.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => {
                                        onViewModeChange(style.id);
                                        // Optional: close on selection
                                        // setIsOpen(false); 
                                    }}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all font-orbitron tracking-wide",
                                        currentViewMode === style.id
                                            ? "bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 shadow-[0_0_10px_rgba(0,212,255,0.2)]"
                                            : "text-slate-400 hover:bg-[#1f2937] hover:text-white"
                                    )}
                                >
                                    <style.icon className="w-4 h-4" />
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MapStyleSwitcher;
