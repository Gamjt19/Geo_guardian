import React, { useEffect } from 'react';
import { ScrollyCanvas } from './ScrollyCanvas';
import { FeatureSection } from './FeatureSection';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#0B0F1A';
    document.body.style.margin = '0';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="bg-[#0B0F1A] min-h-screen text-white" style={{ fontFamily: '"Inter", sans-serif' }}>
      <ScrollyCanvas />
      <FeatureSection />
      
      <footer className="py-8 text-center border-t border-white/10 text-gray-500 text-sm tracking-widest relative z-10 bg-[#0B0F1A]">
        <p>GEOGUARDIAN © 2026</p>
      </footer>
    </div>
  );
};
