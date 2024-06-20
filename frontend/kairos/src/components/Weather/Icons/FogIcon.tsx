import React from 'react';
import './FogIcon.css';

interface FogIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const FogIcon: React.FC<FogIconProps> = ({ width = 100, height = 100, color = 'lightgray', className }) => {
  return (
    <svg
      className={`rotate ${className}`}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Add SVG elements to represent fog */}
      <circle cx="32" cy="32" r="14" />
      {/* Other elements */}
    </svg>
  );
};

export default FogIcon;
