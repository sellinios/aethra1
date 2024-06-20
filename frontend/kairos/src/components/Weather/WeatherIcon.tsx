import React from 'react';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiFog, WiLightning, WiNightClear, WiDayCloudy } from 'react-icons/wi';
import { WeatherState } from '../../types';

interface WeatherIconProps {
  state: WeatherState;
  width: number;
  height: number;
  className?: string; // Add this line
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ state, width, height, className }) => {
  const getIcon = (state: WeatherState) => {
    switch (state) {
      case 'sunny':
        return <WiDaySunny size={width} className={className} />;
      case 'cloudy':
        return <WiCloud size={width} className={className} />;
      case 'rainy':
        return <WiRain size={width} className={className} />;
      case 'snowy':
        return <WiSnow size={width} className={className} />;
      case 'fog':
        return <WiFog size={width} className={className} />;
      case 'lightning':
        return <WiLightning size={width} className={className} />;
      case 'clear-night':
        return <WiNightClear size={width} className={className} />;
      case 'partlycloudy':
        return <WiDayCloudy size={width} className={className} />;
      default:
        return <WiCloud size={width} className={className} />;
    }
  };

  return <>{getIcon(state)}</>;
};

export default WeatherIcon;
