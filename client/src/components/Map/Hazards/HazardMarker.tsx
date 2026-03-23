import React from 'react';

interface HazardMarkerProps {
  hazard: any;
  onClick?: () => void;
}

const SEVERITY_COLORS = {
  low: '#fbbf24', // yellow
  medium: '#f97316', // orange
  high: '#ef4444' // red
};

const HAZARD_ICONS = {
  pothole: '🕳️',
  flooding: '🌊',
  accident: '💥',
  construction: '🚧',
  debris: '🗑️',
  signal_out: '🚥',
  other: '⚠️'
};

export const HazardMarker: React.FC<HazardMarkerProps> = ({ hazard, onClick }) => {
  const isApproved = hazard.status === 'admin_approved';
  // If not approved yet, make it semi-transparent
  const opacity = isApproved ? 1 : 0.6;
  const color = SEVERITY_COLORS[hazard.severity as keyof typeof SEVERITY_COLORS] || '#gray';
  const icon = HAZARD_ICONS[hazard.hazardType as keyof typeof HAZARD_ICONS] || '⚠️';

  return (
    <div 
      onClick={onClick}
      style={{
        width: '32px',
        height: '32px',
        backgroundColor: color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        opacity,
        cursor: 'pointer',
        boxShadow: isApproved ? '0 0 8px rgba(0,0,0,0.5)' : 'none',
        border: '2px solid white',
        transform: 'translate(-50%, -50%)',
        position: 'absolute' // Assuming it will be absolutely positioned by map container
      }}
      title={`${hazard.hazardType} (${hazard.severity})`}
    >
      {icon}
    </div>
  );
};
