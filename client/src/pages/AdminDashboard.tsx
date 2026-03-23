import React, { useState, useEffect } from 'react';
import FuturisticCard from '../components/UI/FuturisticCard';
import NeonButton from '../components/UI/NeonButton';
import { AlertTriangle, Users, Activity, ShieldCheck, Plus, Search } from 'lucide-react';
import AdminHazardMap from './AdminHazardMap';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
    const [hazardCount, setHazardCount] = useState<number | string>('...');
    const [userCount, setUserCount] = useState<number | string>('...');
    const [showAddTip, setShowAddTip] = useState(false);

    useEffect(() => {
        // Fetch Hazards
        axios.get('http://localhost:5000/api/hazards')
            .then(res => setHazardCount(res.data.length))
            .catch(err => {
                console.error(err);
                setHazardCount('ERR');
            });

        // Fetch Users
        axios.get('http://localhost:5000/api/auth/count')
            .then(res => setUserCount(res.data.count))
            .catch(err => {
                console.error(err);
                setUserCount('ERR');
            });
    }, []);

    const stats = [
        { label: 'Active Users', value: userCount.toString(), icon: Users, color: 'text-cyan-400', border: 'border-cyan-500/50' },
        { label: 'Active Hazards', value: hazardCount.toString(), icon: AlertTriangle, color: 'text-orange-400', border: 'border-orange-500/50' },
        { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-green-400', border: 'border-green-500/50' },
        { label: 'Verified Reports', value: '856', icon: ShieldCheck, color: 'text-purple-400', border: 'border-purple-500/50' },
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-widest text-glow">
                        ADMIN CONSOLE
                    </h1>
                    <p className="text-slate-400 font-mono text-sm mt-2">SYSTEM OVERVIEW // HAZARD MANAGEMENT</p>
                </div>
                <div className="flex gap-3">
                    <NeonButton variant="secondary" className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        SEARCH LOGS
                    </NeonButton>
                    <div className="relative">
                        <NeonButton 
                            variant="primary" 
                            className="flex items-center gap-2"
                            onClick={() => {
                                setShowAddTip(true);
                                setTimeout(() => setShowAddTip(false), 3000);
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            NEW HAZARD
                        </NeonButton>
                        {showAddTip && (
                            <div className="absolute top-full right-0 mt-2 bg-cyan-600 text-white text-[10px] px-2 py-1 rounded font-mono whitespace-nowrap z-50 animate-bounce">
                                CLICK ANYWHERE ON THE MAP TO ADD
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <FuturisticCard key={index} className="flex items-center justify-between group">
                        <div className="flex-1">
                            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-2xl font-orbitron font-bold mt-1 ${stat.color} text-glow-sm`}>{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-slate-900/50 border ${stat.border} group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </FuturisticCard>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Hazard Map */}
                <FuturisticCard 
                    className="lg:col-span-3 flex flex-col" 
                    contentClassName="p-0 flex-1 flex flex-col h-full"
                    title="Live Hazard Management"
                >
                    <div className="flex-1 min-h-[500px] rounded-xl overflow-hidden relative">
                         <AdminHazardMap />
                    </div>
                </FuturisticCard>
            </div>
        </div>
    );
};

export default AdminDashboard;

