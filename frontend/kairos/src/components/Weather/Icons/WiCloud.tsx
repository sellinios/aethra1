// src/components/Weather/Icons/WiCloud.tsx
import React from 'react';
import './WiCloud.css';

interface WiCloudProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WiCloud: React.FC<WiCloudProps> = ({ width = 100, height = 100, color = 'gray', className }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20,35.1c0-5.2,4.2-9.5,9.5-9.5c1.4,0,2.8,0.3,4,0.8c1.3-3.7,4.7-6.3,8.7-6.3c5.2,0,9.5,4.2,9.5,9.5c0,0.3,0,0.7-0.1,1.1c3.2,0.4,5.7,3.1,5.7,6.4c0,3.6-3,6.5-6.7,6.5H26.5C22.2,43.6,20,39.8,20,35.1z"/>
    </svg>
  );
};

export default WiCloud;
