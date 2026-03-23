import React, { useState, useEffect } from 'react';
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Trash2, Save, X } from 'lucide-react';
import MapComponent from '../components/Map/MapComponent';
import HazardLayers from '../components/Map/HazardLayers';
import AdminSearchBar from '../components/Map/Admin/AdminSearchBar';
import 'leaflet/dist/leaflet.css';

// Inline simple Modal for prototype speed
const HazardFormModal: React.FC<{
    lat: number;
    lng: number;
    onClose: () => void;
    onSave: (data: any) => void;
}> = ({ lat, lng, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('school_zone');
    const [radius, setRadius] = useState(100);
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            type,
            radiusMeters: radius,
            description,
            location: { coordinates: [lng, lat] } // Backend expects [lng, lat]
        });
    };

    return (
        <div className="absolute top-20 left-4 z-[2000] w-80">
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-2xl animate-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-orbitron text-white">New Hazard</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Name</label>
                        <input className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
                            value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Sharp Turn" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Type</label>
                        <select className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
                            value={type} onChange={e => setType(e.target.value)}>
                            <option value="school_zone">School Zone</option>
                            <option value="hospital_zone">Hospital Zone</option>
                            <option value="speed_breaker">Speed Breaker</option>
                            <option value="sharp_turn">Sharp Turn</option>
                            <option value="bad_road">Poor Road Condition</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Description</label>
                        <textarea className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none resize-none h-20"
                            value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Large potholes after the bridge" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Radius (meters)</label>
                        <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
                            value={radius} onChange={e => setRadius(Number(e.target.value))} />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded flex items-center justify-center gap-2 mt-4 ring-1 ring-cyan-400/50 shadow-[0_0_15px_rgba(8,145,178,0.3)] transition-all">
                        <Save size={16} /> Save Hazard
                    </button>
                </form>
            </div>
        </div>
    );
};

const MapEvents: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const redSelectionIcon = L.divIcon({
    className: '', 
    html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 30px; height: 42px; z-index: 9999;">
            <div style="position: absolute; width: 40px; height: 40px; background: rgba(239, 68, 68, 0.4); border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; background: #dc2626; padding: 8px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px rgba(220, 38, 38, 0.5); display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="#dc2626" stroke-width="1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style="position: absolute; bottom: -4px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 10px solid #dc2626;"></div>
        </div>
        <style>
            @keyframes ping {
                75%, 100% { transform: scale(2.5); opacity: 0; }
            }
        </style>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
});

const AdminHazardMap: React.FC = () => {
    const [hazards, setHazards] = useState<any[]>([]);
    const [selectedPos, setSelectedPos] = useState<{ lat: number, lng: number } | null>(null);

    const fetchHazards = () => {
        axios.get('http://localhost:5000/api/hazards')
            .then(res => setHazards(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchHazards();
    }, []);

    const handleSave = async (data: any) => {
        try {
            await axios.post('http://localhost:5000/api/hazards', data);
            fetchHazards();
            setSelectedPos(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/hazards/${id}`);
            fetchHazards();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="relative h-full w-full flex flex-col rounded-xl overflow-hidden border border-slate-700">
            <MapComponent activeStyle="standard">
                <AdminSearchBar onSelectLocation={(lat, lng) => setSelectedPos({ lat, lng })} />
                <MapEvents onMapClick={(lat, lng) => setSelectedPos({ lat, lng })} />
                <HazardLayers hazards={hazards} visibleTypes={{ school_zone: true, hospital_zone: true, speed_breaker: true, sharp_turn: true, bad_road: true }} />
                
                {selectedPos && (
                    <Marker 
                        position={[selectedPos.lat, selectedPos.lng]} 
                        draggable={true}
                        icon={redSelectionIcon}
                        eventHandlers={{
                            dragend: (e) => {
                                const marker = e.target;
                                const position = marker.getLatLng();
                                setSelectedPos({ lat: position.lat, lng: position.lng });
                            },
                        }}
                    >
                        <Popup className="futuristic-popup">
                            <div className="text-xs font-mono font-bold text-cyan-400">EXACT POINT SELECTED</div>
                            <div className="text-[10px] text-slate-400 mt-1">Drag marker for better precision</div>
                        </Popup>
                    </Marker>
                )}
            </MapComponent>

            {selectedPos && (
                <HazardFormModal
                    lat={selectedPos.lat}
                    lng={selectedPos.lng}
                    onClose={() => setSelectedPos(null)}
                    onSave={handleSave}
                />
            )}

            {/* Simple list overlay for deletion */}
            <div className="absolute top-4 right-4 z-[500] bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 max-h-[400px] overflow-y-auto w-64 shadow-2xl">
                <h4 className="text-white font-orbitron mb-3 text-sm">Manage Hazards ({hazards.length})</h4>
                <div className="space-y-2">
                    {hazards.map(h => (
                        <div key={h._id} className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-700/50">
                            <div>
                                <p className="text-white text-xs font-bold">{h.name}</p>
                                <p className="text-[10px] text-slate-500">{(h.type || 'unknown').replace('_', ' ')}</p>
                                {h.description && <p className="text-[10px] text-slate-400 italic line-clamp-1">{h.description}</p>}
                            </div>
                            <button onClick={() => handleDelete(h._id)} className="text-red-400 hover:text-red-300 p-1">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminHazardMap;
