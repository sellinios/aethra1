import React from 'react';
import { WiDaySunny } from 'react-icons/wi';
import './HourlyPanel.css'; // Import your custom CSS
import { Forecast } from '../../types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

interface HourlyPanelProps {
  forecasts: Forecast[];
}

const roundToNearestWhole = (num: number): number => {
  return Math.round(num);
};

const getWindDirection = (angle: number | null): string => {
  if (angle === null) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.floor((angle / 22.5) + 0.5) % 16;
  return directions[index];
};

const HourlyPanel: React.FC<HourlyPanelProps> = ({ forecasts }) => {
  const currentDateTime = new Date();

  const filteredForecasts = forecasts.filter(forecast => {
    const forecastDateTime = new Date(`${forecast.date}T${String(forecast.hour).padStart(2, '0')}:00:00`);
    return forecastDateTime >= currentDateTime;
  });

  return (
    <div className="hourly-panel container">
      <div className="row mb-3">
        <div className="col-12 d-flex flex-wrap align-items-center justify-content-between p-3 forecast-card">
          <div className="hour-title me-3">Hour</div>
          <div className="temperature-title me-3">Temperature</div>
          <div className="precipitation-title me-3">Precipitation</div>
          <div className="wind-title me-3">Wind</div>
          <div className="cloud-title">Cloudiness</div>
        </div>
      </div>
      {filteredForecasts.map((forecast) => (
        <div key={forecast.id} className="row mb-3">
          <div className="col-12 d-flex flex-wrap align-items-center justify-content-between p-3 forecast-card">
            <div className="hour me-3">{String(forecast.hour).padStart(2, '0')}:00</div>
            <div className="d-flex align-items-center me-3">
              <WiDaySunny className="me-2 weather-icon" /> {forecast.temperature_celsius !== null ? roundToNearestWhole(forecast.temperature_celsius) : 'N/A'} °C
            </div>
            <div className="d-flex align-items-center me-3">
              {forecast.forecast_data.precipitation_rate_level_0_surface !== null ? roundToNearestWhole(forecast.forecast_data.precipitation_rate_level_0_surface) : 'N/A'} mm/h
            </div>
            <div className="d-flex align-items-center me-3">
              {forecast.wind_speed !== null ? `${getWindDirection(forecast.wind_direction)} ${roundToNearestWhole(forecast.wind_speed)} m/s` : 'N/A'}
            </div>
            <div className="d-flex align-items-center">
              {forecast.forecast_data.high_cloud_cover_level_0_highCloudLayer !== null ? `${roundToNearestWhole(forecast.forecast_data.high_cloud_cover_level_0_highCloudLayer)} %` : 'N/A'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HourlyPanel;
