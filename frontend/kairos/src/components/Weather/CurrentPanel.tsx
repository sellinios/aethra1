import React from 'react';
import { Card } from 'react-bootstrap';
import { Forecast } from '../../types'; // Adjust the path if necessary

interface CurrentPanelProps {
  forecast: Forecast;
}

const CurrentPanel: React.FC<CurrentPanelProps> = ({ forecast }) => {
  const modelCycleDate = new Date(`${forecast.date}T${String(forecast.hour).padStart(2, '0')}:00:00Z`);

  const formattedModelCycleDate = `${modelCycleDate.getUTCDate()}/${modelCycleDate.getUTCMonth() + 1}/${modelCycleDate.getUTCFullYear()} ${String(modelCycleDate.getUTCHours()).padStart(2, '0')}:${String(modelCycleDate.getUTCMinutes()).padStart(2, '0')} UTC`;

  return (
    <Card className="mb-3">
      <Card.Header>Current Weather</Card.Header>
      <Card.Body>
        <Card.Title>{Math.round(forecast.temperature_celsius)}°C</Card.Title>
        <Card.Text>Wind: {forecast.wind_speed !== null ? `${forecast.wind_speed} km/h` : 'N/A'}</Card.Text>
        <Card.Text>Model Cycle: {formattedModelCycleDate}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CurrentPanel;
