import React from 'react';

interface GuideBadgeProps {
  level: number;
}

const LEVEL_COLORS = {
  1: '#808080', // gray
  2: '#22c55e', // green
  3: '#3b82f6', // blue
  4: '#a855f7', // purple
  5: '#eab308', // gold
  6: '#06b6d4', // diamond
  7: '#10b981'  // emerald
};

const TIER_NAMES = {
  1: 'Novice Guide',
  2: 'Apprentice Guide',
  3: 'Contributor',
  4: 'Local Expert',
  5: 'Master Guide',
  6: 'Grandmaster Guide',
  7: 'Legendary Guide'
};

export const GuideBadge: React.FC<GuideBadgeProps> = ({ level }) => {
  const safeLevel = Math.max(1, Math.min(7, level || 1));
  const color = LEVEL_COLORS[safeLevel as keyof typeof LEVEL_COLORS];
  const name = TIER_NAMES[safeLevel as keyof typeof TIER_NAMES];

  return (
    <div 
      title={`Level ${safeLevel} — ${name}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color,
        color: 'white',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold',
        marginLeft: '6px',
        cursor: 'help',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      <span style={{ marginRight: '4px' }}>🛡️</span> {safeLevel}
    </div>
  );
};
