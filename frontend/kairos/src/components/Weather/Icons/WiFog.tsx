// src/components/Weather/Icons/WiFog.tsx
import React from 'react';
import './WiFog.css';

interface WiFogProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WiFog: React.FC<WiFogProps> = ({ width = 100, height = 100, color = 'lightgray', className }) => {
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
      <line x1="10" y1="24" x2="54" y2="24" stroke={color} strokeWidth="2" />
      <line x1="10" y1="32" x2="54" y2="32" stroke={color} strokeWidth="2" />
      <line x1="10" y1="40" x2="54" y2="40" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export default WiFog;
