// src/components/Weather/Icons/WiSnowy.tsx
import React from 'react';
import './WiSnowy.css';

interface WiSnowyProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WiSnowy: React.FC<WiSnowyProps> = ({ width = 100, height = 100, color = 'white', className }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="14" fill={color} />
      <line x1="32" y1="18" x2="32" y2="46" stroke={color} strokeWidth="2" />
      <line x1="18" y1="32" x2="46" y2="32" stroke={color} strokeWidth="2" />
      <line x1="22.6" y1="22.6" x2="41.4" y2="41.4" stroke={color} strokeWidth="2" />
      <line x1="22.6" y1="41.4" x2="41.4" y2="22.6" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export default WiSnowy;
