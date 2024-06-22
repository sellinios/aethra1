import React, { useEffect, useRef } from 'react';
import './WiDaySunny.css';

interface WiDaySunnyProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WiDaySunny: React.FC<WiDaySunnyProps> = ({ width = 100, height = 100, color = 'orange', className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationFrameId: number;

    const draw = (time: number) => {
      if (!ctx || !canvas) return;

      const w = canvas.width ?? 0;
      const h = canvas.height ?? 0;
      const s = Math.min(w, h);
      const cx = w / 2;
      const cy = h / 2;
      const stroke = s * 0.08;
      const t = time / 120000;

      ctx.clearRect(0, 0, w, h);

      // Draw sun
      const a = s * 0.25 - stroke / 2;
      const b = s * 0.32 + stroke / 2;
      const c = s * 0.50 - stroke / 2;

      ctx.strokeStyle = color;
      ctx.lineWidth = stroke;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.arc(cx, cy, a, 0, 2 * Math.PI, false);
      ctx.stroke();

      for (let i = 8; i--; ) {
        const p = (t + i / 8) * 2 * Math.PI;
        const cos = Math.cos(p);
        const sin = Math.sin(p);
        ctx.beginPath();
        ctx.moveTo(cx + cos * b, cy + sin * b);
        ctx.lineTo(cx + cos * c, cy + sin * c);
        ctx.stroke();
      }

      // Draw clouds
      const cloudX = cx - s / 4;
      const cloudY = cy + s / 4;
      const cloudWidth = s / 2;
      const cloudHeight = s / 4;

      ctx.fillStyle = '#cccccc';
      ctx.beginPath();
      ctx.ellipse(cloudX, cloudY, cloudWidth, cloudHeight, 0, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#b3b3b3';
      ctx.beginPath();
      ctx.ellipse(cloudX + s / 6, cloudY - s / 10, cloudWidth, cloudHeight, 0, 0, 2 * Math.PI);
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [color]);

  return (
    <canvas
      className={`sunny-icon ${className}`}
      ref={canvasRef}
      width={width}
      height={height}
    ></canvas>
  );
};

export default WiDaySunny;
