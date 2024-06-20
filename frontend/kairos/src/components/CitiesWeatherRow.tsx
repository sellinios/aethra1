import React from 'react';
import { DailyForecast, WeatherState } from '../types';
import WeatherIcon from '../components/Weather/WeatherIcon';

interface CitiesWeatherRowProps {
  city: string;
  forecasts: DailyForecast[];
  sortedDates: string[];
}

const CitiesWeatherRow: React.FC<CitiesWeatherRowProps> = ({ city, forecasts, sortedDates }) => {
  const cityLink = {
    athens: 'http://kairos.gr/weather/europe/greece/attica/municipality-of-athens/athens/',
    patra: 'http://kairos.gr/weather/europe/greece/peloponnese/municipality-of-patras/patra/',
    thessaloniki: 'http://kairos.gr/weather/europe/greece/central-macedonia/municipality-of-thessaloniki/thessaloniki/'
  }[city.toLowerCase()];

  const forecastMap = forecasts.reduce((map, forecast) => {
    map[forecast.date] = forecast;
    return map;
  }, {} as Record<string, DailyForecast>);

  return (
    <tr>
      <td>
        <a href={cityLink} target="_blank" rel="noopener noreferrer">
          {city}
        </a>
      </td>
      {sortedDates.map((date, index) => {
        const forecast = forecastMap[date];
        return forecast ? (
          <td key={index} className="text-center">
            {`${Math.round(forecast.maxTemp)}°C / ${Math.round(forecast.minTemp)}°C`}
            <br />
            <WeatherIcon state={forecast.generalText as WeatherState} width={24} height={24} />
          </td>
        ) : (
          <td key={index} className="text-center">N/A</td>
        );
      })}
    </tr>
  );
};

export default CitiesWeatherRow;
