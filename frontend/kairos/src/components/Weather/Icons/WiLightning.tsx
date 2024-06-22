// src/components/Weather/Icons/WiLightning.tsx
import React from 'react';
import './WiLightning.css';

interface WiLightningProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WiLightning: React.FC<WiLightningProps> = ({ width = 100, height = 100, color = 'yellow', className }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="30,2 34,22 44,22 28,62 34,38 24,38" fill={color} />
    </svg>
  );
};

export default WiLightning;
