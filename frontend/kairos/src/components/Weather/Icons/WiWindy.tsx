// src/components/Weather/Icons/WiWindy.tsx
import React from 'react';
import './WiWindy.css';

interface WiWindyProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WiWindy: React.FC<WiWindyProps> = ({ width = 100, height = 100, color = 'lightblue', className }) => {
  return (
    <svg
      className={`rotate ${className}`}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="14" />
    </svg>
  );
};

export default WiWindy;
