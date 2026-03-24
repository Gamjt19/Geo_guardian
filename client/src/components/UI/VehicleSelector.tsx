import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Car, Truck, Ambulance, Bike, Footprints } from 'lucide-react';

const VehicleSelector: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const vehicleTypes = [
        { id: 'car', label: 'Car', icon: Car },
        { id: 'heavy', label: 'Heavy Vehicle', icon: Truck },
        { id: 'emergency', label: 'Emergency', icon: Ambulance },
        { id: 'two-wheeler', label: 'Two Wheeler', icon: Bike },
        { id: 'walk', label: 'Walk', icon: Footprints },
    ] as const;

    const currentVehicle = vehicleTypes.find(v => v.id === user.vehicleType) || vehicleTypes[0];

    return (
        <div className="relative group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 flex items-center justify-center bg-[#111827]/90 backdrop-blur-[12px] rounded-full shadow-lg border border-white/[0.08] pointer-events-auto hover:bg-[#00d4ff]/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:border-[#00d4ff]/50 transition-all text-[#00d4ff] group"
                title="Select Vehicle Type"
            >
                <currentVehicle.icon size={24} className="group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all" />
            </button>

            {/* Dropdown / Tooltip-like selection */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 bg-[#111827]/90 backdrop-blur-[12px] border border-white/[0.08] p-2 rounded-[12px] shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col gap-1 min-w-[160px] animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 border-b border-white/[0.08] pb-2">
                        Vehicle Mode
                    </div>
                    {vehicleTypes.map((v) => (
                        <button
                            key={v.id}
                            onClick={() => {
                                updateUser({ vehicleType: v.id });
                                setIsOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${user.vehicleType === v.id
                                ? 'bg-[#00d4ff]/20 text-[#00d4ff]'
                                : 'text-slate-300 hover:bg-[#1f2937] hover:text-white'
                                }`}
                        >
                            <v.icon size={16} />
                            <span>{v.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VehicleSelector;
