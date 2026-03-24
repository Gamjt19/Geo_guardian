import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Route } from 'lucide-react';

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export const Overlay: React.FC<OverlayProps> = ({ scrollYProgress }) => {
  const navigate = useNavigate();

  // Mapped Opacities and Translations for Cinematic feel
  // 1: Center
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const shiftY1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const scale1 = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);

  // 2: Left
  const opacity2 = useTransform(scrollYProgress, [0.15, 0.25, 0.35], [0, 1, 0]);
  const shiftY2 = useTransform(scrollYProgress, [0.15, 0.25, 0.35], [50, 0, -50]);

  // 3: Right
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
  const shiftY3 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [50, 0, -50]);

  // 4: Center Ending
  const opacity4 = useTransform(scrollYProgress, [0.65, 0.75, 1], [0, 1, 1]);
  const shiftY4 = useTransform(scrollYProgress, [0.65, 0.75], [50, 0]);

  return (
    <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-10 overflow-hidden">
      
      {/* SECTION 1: Intro (0% scroll) */}
      <motion.div 
        style={{ opacity: opacity1, y: shiftY1, scale: scale1 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
          GeoGuardian
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-gray-300 font-medium tracking-wide">
          Navigate Smarter. Stay Safer.
        </p>
      </motion.div>

      {/* SECTION 2: Hazard Detection (25% scroll) */}
      <motion.div 
        style={{ opacity: opacity2, y: shiftY2 }}
        className="absolute inset-y-0 left-0 w-full md:w-1/2 flex flex-col items-start justify-center pl-8 md:pl-24 pr-4"
      >
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 bg-red-500/20 rounded-full text-red-400"
            >
              <AlertTriangle size={32} />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">Real-Time Hazard Detection</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Our context-aware AI constantly scans for danger zones, extreme weather, and urban risks to keep you safe on the move.
          </p>
        </div>
      </motion.div>

      {/* SECTION 3: Routing (50% scroll) */}
      <motion.div 
        style={{ opacity: opacity3, y: shiftY3 }}
        className="absolute inset-y-0 right-0 w-full md:w-1/2 flex flex-col items-end justify-center pr-8 md:pr-24 pl-4"
      >
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl text-right">
          <div className="flex items-center justify-end gap-4 mb-4">
            <h2 className="text-3xl font-bold text-white">Context-Aware Routing</h2>
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
              <Route size={32} />
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Dynamic path selection avoiding known hazards. Get to your destination through the safest possible corridor, optimized instantly.
          </p>
        </div>
      </motion.div>

      {/* SECTION 4: CTA (75% scroll) */}
      <motion.div 
        style={{ opacity: opacity4, y: shiftY4 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Built for the Future of Navigation
        </h2>
        
        <div className="pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(34, 197, 94, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-400 text-white text-lg font-semibold rounded-full overflow-hidden transition-colors"
          >
            Try GeoGuardian 
            <motion.span 
              className="inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              &rarr;
            </motion.span>
          </motion.button>
        </div>
      </motion.div>

    </div>
  );
};
