import React, { useState } from 'react';
import WeatherIcon from './WeatherIcon';
import HourlyPanel from './HourlyPanel';
import { DailyForecast, WeatherState } from '../../types';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './MountainDailyPanel.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Utility function imports (import these from your utility file if they exist there)
import { roundToNearestWhole, getCardinalDirection, formatDate, calculateTotalPrecipitation, getWeatherIconState } from '../../utils/Utils'; // Adjust the import path accordingly

interface MountainDailyPanelProps {
  forecasts: DailyForecast[];
  mountain: string;
  showHeaders: boolean;
}

const MountainDailyPanel: React.FC<MountainDailyPanelProps> = ({ forecasts, mountain, showHeaders }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  const toggleExpanded = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const toggleShowAll = () => {
    setShowAll(prevShowAll => !prevShowAll);
  };

  const getAlertMessage = (maxTemp: number, date: string) => {
    if (maxTemp < -10) {
      return (
        <div className="alert-zone alert-cold-wave d-flex align-items-center justify-content-between w-100">
          <span className="d-flex align-items-center">
            <FaExclamationTriangle color="blue" /> Cold Wave
          </span>
          <a href="#" onClick={() => toggleExpanded(date)} className="btn btn-primary btn-sm ml-3">
            Hourly
          </a>
        </div>
      );
    } else if (maxTemp < 0) {
      return (
        <div className="alert-zone alert-freeze d-flex align-items-center justify-content-between w-100">
          <span className="d-flex align-items-center">
            <FaExclamationTriangle color="cyan" /> Freezing
          </span>
          <a href="#" onClick={() => toggleExpanded(date)} className="btn btn-primary btn-sm ml-3">
            Hourly
          </a>
        </div>
      );
    } else {
      return (
        <div className="alert-zone alert-no-alert d-flex align-items-center justify-content-between w-100">
          <span className="d-flex align-items-center">
            <FaCheckCircle color="green" /> No Alerts
          </span>
          <a href="#" onClick={() => toggleExpanded(date)} className="btn btn-primary btn-sm ml-3">
            Hourly
          </a>
        </div>
      );
    }
  };

  const currentDate = new Date();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  const visibleForecasts = showAll ? forecasts : forecasts.slice(0, 7);
  const filteredForecasts = visibleForecasts.filter(({ date }) => new Date(date) >= startOfDay);

  const forecastComponents = filteredForecasts.map(({ date, generalText, maxTemp, minTemp, hourlyForecasts }) => {
    const totalPrecipitation = calculateTotalPrecipitation({ date, generalText, maxTemp, minTemp, hourlyForecasts });
    const generalIconState = getWeatherIconState(
      generalText,
      hourlyForecasts[0]?.forecast_data.high_cloud_cover_level_0_highCloudLayer || 0,
      hourlyForecasts[0]?.forecast_data.precipitation_rate_level_0_surface || 0
    );

    const alertMessage = getAlertMessage(maxTemp, date);

    return (
      <div key={date} className="row mb-3 forecast-row">
        <div className="col-12">
          <div className="d-flex flex-wrap align-items-center forecast-details">
            <div className="col-md-2 col-sm-6 panel-date">{formatDate(date)}</div>
            <div className="col-md-1 col-sm-6 d-flex align-items-center justify-content-center">
              <WeatherIcon state={generalIconState} width={60} height={60} />
            </div>
            <div className="col-md-2 col-sm-6 temperature">
              <span className={maxTemp > 32 ? 'text-danger' : ''}>{roundToNearestWhole(maxTemp)}°C</span> / <span>{roundToNearestWhole(minTemp)}°C</span>
            </div>
            <div className="col-md-2 col-sm-6 wind-direction">
              {hourlyForecasts[0] && hourlyForecasts[0].wind_direction !== null && hourlyForecasts[0].wind_speed !== null && (
                <>
                  <span style={{ transform: `rotate(${hourlyForecasts[0].wind_direction}deg)` }}>↑</span>
                  {getCardinalDirection(hourlyForecasts[0].wind_direction)} {hourlyForecasts[0].wind_speed.toFixed(1)} m/s
                </>
              )}
            </div>
            <div className="col-md-2 col-sm-6 precipitation">
              Precipitation: {totalPrecipitation.toFixed(2)} mm
            </div>
          </div>
          <div className="alert-line w-100 mt-2">{alertMessage}</div>
          {expandedDate === date && (
            <div className="expanded-section">
              <HourlyPanel forecasts={hourlyForecasts} />
            </div>
          )}
          <hr />
        </div>
      </div>
    );
  });

  return (
    <div className="mountain-daily-panel container">
      {showHeaders && <h2 className="text-center my-4">Daily Weather Forecast for {mountain}</h2>}
      {forecastComponents}
      {forecasts.length > 7 && (
        <div className="text-center mt-3">
          <button className="btn btn-secondary" onClick={toggleShowAll}>
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MountainDailyPanel;
