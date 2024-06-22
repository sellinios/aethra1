// src/components/Weather/Icons/WiNightClear.tsx
import React from 'react';
import './WiNightClear.css';

interface WiNightClearProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WiNightClear: React.FC<WiNightClearProps> = ({ width = 100, height = 100, color = 'darkblue', className }) => {
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
    </svg>
  );
};

export default WiNightClear;
