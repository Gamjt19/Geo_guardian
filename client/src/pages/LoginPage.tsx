import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, Truck, Siren, Car } from 'lucide-react';
import FuturisticCard from '../components/UI/FuturisticCard';
import NeonButton from '../components/UI/NeonButton';
import GlobeBackground from '../components/UI/GlobeBackground';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [vehicleType, setVehicleType] = useState('car');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const API_URL = 'http://localhost:5000/api/auth';

        try {
            if (isRegister) {
                const res = await axios.post(`${API_URL}/register`, {
                    name, email, password, vehicleType
                });
                login(res.data.user);
            } else {
                const res = await axios.post(`${API_URL}/login`, {
                    email, password
                });
                login(res.data.user);
            }
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <GlobeBackground />

            {/* Overlay gradient to help text readability if needed */}
            <div className="absolute inset-0 bg-transparent" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-lg p-4 z-10"
            >
                <FuturisticCard title={isRegister ? "INIT REGISTRATION" : "ACCESS CONTROL"} className="w-full">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                            <Shield className="w-12 h-12 text-cyan-400" />
                        </div>
                        <h2 className="text-3xl font-orbitron font-bold text-white mb-2 text-glow">
                            GEOGUARDIAN
                        </h2>
                        <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">
                            {isRegister ? 'JOIN THE SECURE GRID' : 'SECURE NAVIGATION SYSTEM'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-mono flex items-center justify-center gap-2"
                            >
                                <span className="font-bold">⚠</span> {error}
                            </motion.div>
                        )}

                        {isRegister && (
                            <div className="group">
                                <label className="block text-xs font-orbitron text-cyan-400 mb-1 ml-1">FULL DESIGNATION</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                                        placeholder="JOHN DOE"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="group">
                            <label className="block text-xs font-orbitron text-cyan-400 mb-1 ml-1">DIGITAL ID</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                                    placeholder="USER@DOMAIN.COM"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-orbitron text-cyan-400 mb-1 ml-1">ACCESS CODE</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {isRegister && (
                            <div className="group">
                                <label className="block text-xs font-orbitron text-cyan-400 mb-1 ml-1">VEHICLE CLASS</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {vehicleType === 'car' && <Car className="h-5 w-5 text-slate-500" />}
                                        {vehicleType === 'heavy' && <Truck className="h-5 w-5 text-slate-500" />}
                                        {vehicleType === 'emergency' && <Siren className="h-5 w-5 text-slate-500" />}
                                    </div>
                                    <select
                                        value={vehicleType}
                                        onChange={(e) => setVehicleType(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono appearance-none"
                                    >
                                        <option value="car">STANDARD PROTOCOL (CAR)</option>
                                        <option value="heavy">HEAVY TRANSPORT (RESTRICTED)</option>
                                        <option value="emergency">EMERGENCY PRIORITY</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <NeonButton type="submit" className="w-full">
                            {isRegister ? 'INITIALIZE SYSTEM' : 'ESTABLISH LINK'}
                        </NeonButton>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-slate-700/50">
                        <p className="text-xs text-slate-400 font-mono">
                            {isRegister ? 'ALREADY DESIGNATED?' : "NEED CLEARANCE?"} {' '}
                            <button
                                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors ml-1 uppercase hover:shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                                onClick={() => setIsRegister(!isRegister)}
                            >
                                {isRegister ? 'ACCESS LOGIN' : 'REQUEST ACCESS'}
                            </button>
                        </p>
                    </div>
                </FuturisticCard>
            </motion.div>
        </div>
    );
};

export default LoginPage;
