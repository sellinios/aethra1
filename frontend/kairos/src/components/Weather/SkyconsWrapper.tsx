// src/components/Weather/SkyconsWrapper.tsx
import React, { useEffect, useRef } from 'react';
import Skycons from 'skycons';

interface SkyconsWrapperProps {
  type: string;
  color?: string;
  width?: number;
  height?: number;
}

const SkyconsWrapper: React.FC<SkyconsWrapperProps> = ({ type, color = 'black', width = 128, height = 128 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const skycons = new Skycons({ color });
    skycons.add(canvasRef.current!, type);
    skycons.play();

    return () => {
      skycons.remove(canvasRef.current!);
      skycons.pause();
    };
  }, [type, color]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};

export default SkyconsWrapper;
