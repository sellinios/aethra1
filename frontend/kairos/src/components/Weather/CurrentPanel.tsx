import React from 'react';
import { Card } from 'react-bootstrap';
import { Forecast } from '../../types';
import './CurrentPanel.css';
import HourlyPanel from './HourlyPanel'; // Import the HourlyPanel component
import { roundToNearestWhole, getWindDirection } from '../../utils/weatherUtils'; // Import utility functions

interface CurrentPanelProps {
  forecast: Forecast;
  nextForecasts: Forecast[]; // Update prop to accept multiple forecasts
}

// Function to convert wind speed in km/h to Beaufort scale
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

// Function to validate and format the UTC cycle time
const validateAndFormatCycleTime = (utcCycleTime: string): string => {
  const validCycleTimes = ['00', '06', '12', '18'];
  return validCycleTimes.includes(utcCycleTime) ? utcCycleTime : '00';
};

const CurrentPanel: React.FC<CurrentPanelProps> = ({ forecast, nextForecasts }) => {
  const roundedWindSpeed = Math.round(forecast.wind_speed || 0);
  const beaufortScale = windSpeedToBeaufort(roundedWindSpeed);
  const validatedUtcCycleTime = validateAndFormatCycleTime(forecast.utc_cycle_time);

  // Extract date part from imported_at and combine with validatedUtcCycleTime
  const importedDate = new Date(forecast.imported_at);
  const modelCycleDate = `${importedDate.getUTCFullYear()}-${String(importedDate.getUTCMonth() + 1).padStart(2, '0')}-${String(importedDate.getUTCDate()).padStart(2, '0')} ${validatedUtcCycleTime}:00 UTC`;

  return (
    <Card className="mb-3 current-panel">
      <Card.Header className="current-panel-header">Current Weather</Card.Header>
      <Card.Body>
        <Card.Title className="current-panel-title">{Math.round(forecast.temperature_celsius)}°C</Card.Title>
        <Card.Text>Wind: {roundedWindSpeed} km/h (Beaufort: {beaufortScale})</Card.Text>
        <Card.Text>Model Cycle: {modelCycleDate}</Card.Text>
        <HourlyPanel forecasts={nextForecasts} />
      </Card.Body>
    </Card>
  );
};

export default CurrentPanel;
