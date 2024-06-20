import React from 'react';
import './RainyIcon.css'; // Ensure this file exists in the same directory

interface RainyIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const RainyIcon: React.FC<RainyIconProps> = ({ width = 100, height = 100, color = 'blue', className }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="20" />
    </svg>
  );
};

export default RainyIcon;
