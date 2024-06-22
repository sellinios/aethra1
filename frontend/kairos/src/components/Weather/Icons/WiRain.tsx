import React from 'react';
import './WiRain.css';

interface WiRainProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WiRain: React.FC<WiRainProps> = ({ width = 100, height = 100, color = 'blue', className }) => {
  return (
    <svg
      className={`rain-icon ${className}`}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="clouds">
        <ellipse cx="32" cy="20" rx="14" ry="9" fill="#d3d3d3" />
        <ellipse cx="24" cy="22" rx="12" ry="8" fill="#c0c0c0" />
        <ellipse cx="40" cy="22" rx="12" ry="8" fill="#c0c0c0" />
        <ellipse cx="32" cy="24" rx="20" ry="12" fill="#a9a9a9" />
        <ellipse cx="36" cy="20" rx="14" ry="8" fill="#d9d9d9" />
        <ellipse cx="30" cy="22" rx="18" ry="10" fill="#e6e6e6" />
        <ellipse cx="34" cy="18" rx="12" ry="6" fill="#f2f2f2" />
        <ellipse cx="28" cy="26" rx="20" ry="14" fill="#e0e0e0" />
      </g>
      <g className="raindrops">
        <path d="M20 35C21 36 21 38 20 40C19 42 19 44 20 46" stroke={color} strokeWidth="2" />
        <path d="M28 38C29 39 29 41 28 43C27 45 27 47 28 49" stroke={color} strokeWidth="2" />
        <path d="M36 35C37 36 37 38 36 40C35 42 35 44 36 46" stroke={color} strokeWidth="2" />
        <path d="M44 38C45 39 45 41 44 43C43 45 43 47 44 49" stroke={color} strokeWidth="2" />
        <path d="M52 35C53 36 53 38 52 40C51 42 51 44 52 46" stroke={color} strokeWidth="2" />
      </g>
    </svg>
  );
};

export default WiRain;
