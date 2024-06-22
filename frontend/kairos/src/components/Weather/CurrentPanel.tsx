import React from 'react';
import { Card } from 'react-bootstrap';
import { Forecast } from '../../types';
import './CurrentPanel.css';
import WeatherIcon from './WeatherIcon';
import { roundToNearestWhole, getWindDirection } from '../../utils/weatherUtils';

interface CurrentPanelProps {
  forecast: Forecast;
  nextForecasts: Forecast[];
}

const windSpeedToBeaufort = (speed: number) => {
  if (speed < 1) return 0;
  else if (speed <= 5) return 1;
  else if (speed <= 11) return 2;
  else if (speed <= 19) return 3;
  else if (speed <= 28) return 4;
  else if (speed <= 38) return 5;
  else if (speed <= 49) return 6;
  else if (speed <= 61) return 7;
  else if (speed <= 74) return 8;
  else if (speed <= 88) return 9;
  else if (speed <= 102) return 10;
  else if (speed <= 117) return 11;
  else return 12;
};

const validateAndFormatCycleTime = (utcCycleTime: string): string => {
  const validCycleTimes = ['00', '06', '12', '18'];
  return validCycleTimes.includes(utcCycleTime) ? utcCycleTime : '00';
};

const CurrentPanel: React.FC<CurrentPanelProps> = ({ forecast, nextForecasts }) => {
  const roundedWindSpeed = Math.round(forecast.wind_speed || 0);
  const beaufortScale = windSpeedToBeaufort(roundedWindSpeed);
  const validatedUtcCycleTime = validateAndFormatCycleTime(forecast.utc_cycle_time);

  const importedDate = new Date(forecast.imported_at);
  const modelCycleDate = `${importedDate.getUTCFullYear()}-${String(importedDate.getUTCMonth() + 1).padStart(2, '0')}-${String(importedDate.getUTCDate()).padStart(2, '0')} ${validatedUtcCycleTime}:00 UTC`;

  return (
    <Card className="mb-3 current-panel">
      <Card.Header className="current-panel-header">Current Weather</Card.Header>
      <Card.Body className="vertical-layout">
        <WeatherIcon state={forecast.state} width={100} height={100} className="weather-icon" />
        <Card.Title className="current-panel-title">{Math.round(forecast.temperature_celsius)}°C</Card.Title>
        <Card.Text>Wind: {roundedWindSpeed} km/h (Beaufort: {beaufortScale})</Card.Text>
        <Card.Text>Model Cycle: {modelCycleDate}</Card.Text>
      </Card.Body>
      <Card.Body className="horizontal-layout">
        {nextForecasts.map((forecast) => (
          <div key={forecast.id} className="hourly-forecast">
            <div>{String(forecast.hour).padStart(2, '0')}:00</div>
            <WeatherIcon state={forecast.state} width={30} height={30} />
            <div>{Math.round(forecast.temperature_celsius)}°C</div>
            <div>{forecast.wind_speed ? `${getWindDirection(forecast.wind_direction)} ${Math.round(forecast.wind_speed)} m/s` : 'N/A'}</div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default CurrentPanel;
