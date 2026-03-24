import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, MapPin, Brain, Zap } from 'lucide-react';

const FEATURE_CARDS = [
  {
    title: "Smart Hazard Alerts",
    description: "Receive instant notifications for sudden roadblocks, accidents, or environmental hazards ahead.",
    icon: <ShieldAlert size={36} className="text-red-400" />
  },
  {
    title: "Real-Time Route Optimization",
    description: "Our adaptive engine reroutes you instantly to ensure the fastest, safest journey possible.",
    icon: <MapPin size={36} className="text-blue-400" />
  },
  {
    title: "AI-Based Context Awareness",
    description: "Predictive threat modeling taking time of day, weather, and historical data into account.",
    icon: <Brain size={36} className="text-purple-400" />
  },
  {
    title: "Lightweight & Fast",
    description: "Designed for minimal battery consumption and flawless performance on any device.",
    icon: <Zap size={36} className="text-yellow-400" />
  }
];

export const FeatureSection: React.FC = () => {
  return (
    <section className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-[#0B0F1A] text-white overflow-hidden">
      
      {/* Background ambient particles/glows for premium feel */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-lg mb-6">
            Beyond Standard Navigation
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the next generation of smart routing, where your safety is proactively managed every step of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {FEATURE_CARDS.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.2)"
              }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="bg-white/5 inline-flex p-4 rounded-2xl mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{feature.title}</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
