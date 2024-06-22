// src/components/Weather/WeatherIcon.tsx
import React from 'react';
import {
  RseClearDay,
  RseClearNight,
  RseCloudy,
  RseFog,
  RseHail,
  RsePartlyCloudyDay,
  RsePartlyCloudyNight,
  RseRain,
  RseRainSnow,
  RseRainSnowShowersDay,
  RseRainSnowShowersNight,
  RseShowersDay,
  RseShowersNight,
  RseSleet,
  RseSnow,
  RseSnowShowersDay,
  RseSnowShowersNight,
  RseThunder,
  RseThunderRain,
  RseThunderShowersDay,
  RseThunderShowersNight,
  RseWind,
} from 'react-skycons-extended';

interface WeatherIconProps {
  state: string;
  width: number;
  height: number;
  color?: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ state, width, height, color = 'black', className }) => {
  const getIconComponent = (state: string): React.FC<any> => {
    switch (state) {
      case 'sunny':
        return RseClearDay;
      case 'cloudy':
        return RseCloudy;
      case 'rainy':
        return RseRain;
      case 'snowy':
        return RseSnow;
      case 'fog':
        return RseFog;
      case 'lightning':
        return RseThunder;
      case 'clear-night':
        return RseClearNight;
      case 'partlycloudy':
        return RsePartlyCloudyDay;
      case 'windy':
        return RseWind;
      default:
        return RseCloudy;
    }
  };

  const IconComponent = getIconComponent(state);

  return (
    <div className={`weather-icon ${className}`}>
      <IconComponent
        color={color}
        width={width}
        height={height}
        autoplay={true}
      />
    </div>
  );
};

export default WeatherIcon;
