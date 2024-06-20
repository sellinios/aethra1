import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MountainDailyPanel from '../components/Weather/MountainDailyPanel';
import CurrentPanel from '../components/Weather/CurrentPanel';
import HourlyPanel from '../components/Weather/HourlyPanel';
import { Container, Alert, Spinner } from 'react-bootstrap';
import './MountainWeatherPage.css';
import { Forecast, DailyForecast } from '../types';

interface RouteParams extends Record<string, string | undefined> {
  mountain: string;
}

const aggregateDailyData = (hourlyData: Forecast[]): DailyForecast[] => {
  const dailyDataMap: Record<string, DailyForecast> = {};

  hourlyData.forEach((data) => {
    const date = data.date;
    if (!dailyDataMap[date]) {
      dailyDataMap[date] = {
        date,
        generalText: 'General Text',
        maxTemp: data.temperature_celsius,
        minTemp: data.temperature_celsius,
        hourlyForecasts: [],
      };
    }

    dailyDataMap[date].maxTemp = Math.max(dailyDataMap[date].maxTemp, data.temperature_celsius);
    dailyDataMap[date].minTemp = Math.min(dailyDataMap[date].minTemp, data.temperature_celsius);
    dailyDataMap[date].hourlyForecasts.push(data);
  });

  return Object.values(dailyDataMap);
};

const filterAndSortForecasts = (hourlyData: Forecast[]): Forecast[] => {
  const latestCycleMap: Record<string, Forecast> = {};

  hourlyData.forEach((forecast) => {
    const key = `${forecast.date}-${forecast.hour}`;
    if (!latestCycleMap[key] || new Date(forecast.timestamp) > new Date(latestCycleMap[key].timestamp)) {
      latestCycleMap[key] = forecast;
    }
  });

  const filteredData = Object.values(latestCycleMap);

  return filteredData.sort((a, b) => {
    if (a.date === b.date) {
      return a.hour - b.hour;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const MountainWeatherPage: React.FC = () => {
  const { mountain } = useParams<RouteParams>();
  const [hourlyWeatherData, setHourlyWeatherData] = useState<Forecast[]>([]);
  const [dailyWeatherData, setDailyWeatherData] = useState<DailyForecast[]>([]);
  const [currentWeatherData, setCurrentWeatherData] = useState<Forecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/weather/mountains/${mountain}/`);
        const hourlyData: Forecast[] = response.data;
        const currentDate = new Date();

        const filteredData = filterAndSortForecasts(hourlyData).filter(forecast => {
          const forecastDateTime = new Date(`${forecast.date}T${String(forecast.hour).padStart(2, '0')}:00:00`);
          return forecastDateTime >= currentDate || forecast.date > currentDate.toISOString().split('T')[0];
        });

        console.log('Filtered Data:', filteredData);

        const aggregatedData = aggregateDailyData(filteredData);
        setHourlyWeatherData(filteredData);
        setDailyWeatherData(aggregatedData);
        setCurrentWeatherData(filteredData[0]);
        setError(null);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError('No weather data available for this location.');
        } else {
          setError('Error fetching weather data: ' + (err.response?.status || 'Unknown error'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [mountain]);

  return (
    <Container>
      <h1 className="text-center my-4">Weather for {capitalizeFirstLetter(mountain || '')}</h1>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {currentWeatherData && <CurrentPanel forecast={currentWeatherData} />}
      {dailyWeatherData.length > 0 && <MountainDailyPanel forecasts={dailyWeatherData} mountain={mountain || 'Unknown'} showHeaders={false} />}
    </Container>
  );
};

export default MountainWeatherPage;
