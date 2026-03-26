import React from 'react';

const NexaLogo = ({ size = 32, color = '#12141D' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="20" y="20" width="60" height="60" rx="8" stroke={color} strokeWidth="5" />
      <circle cx="20" cy="20" r="7" fill={color} />
      <circle cx="80" cy="20" r="7" fill={color} />
      <circle cx="20" cy="80" r="7" fill={color} />
      <circle cx="80" cy="80" r="7" fill={color} />
      <path d="M35 70V30L65 70V30" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.05em', color }}>NEXA</span>
  </div>
);

export default NexaLogo;
