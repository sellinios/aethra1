// src/components/Weather/Icons/WiDayCloudy.tsx
import React from 'react';
import './WiDayCloudy.css';

interface WiDayCloudyProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WiDayCloudy: React.FC<WiDayCloudyProps> = ({ width = 100, height = 100, color = 'gray', className }) => {
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

export default WiDayCloudy;
