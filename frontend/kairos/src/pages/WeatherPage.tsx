import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DailyPanel from '../components/Weather/DailyPanel'; // Adjust path if necessary
import CurrentPanel from '../components/Weather/CurrentPanel'; // Import the CurrentPanel component
import HourlyPanel from '../components/Weather/HourlyPanel'; // Import the HourlyPanel component
import { Container, Alert, Spinner } from 'react-bootstrap';
import './WeatherPage.css'; // Import your custom CSS
import '../components/Weather/HourlyPanel.css'; // Import custom CSS for HourlyPanel
import '../components/Weather/DailyPanel.css'; // Import custom CSS for DailyPanel
import { Forecast, DailyForecast } from '../types'; // Adjust the path if necessary

interface RouteParams extends Record<string, string | undefined> {
  continent: string;
  country: string;
  region: string;
  subregion: string;
  city: string;
}

const aggregateDailyData = (hourlyData: Forecast[]): DailyForecast[] => {
  const dailyDataMap: Record<string, DailyForecast> = {};

  hourlyData.forEach((data) => {
    const date = data.date;
    if (!dailyDataMap[date]) {
      dailyDataMap[date] = {
        date,
        generalText: 'General Text', // Replace this with actual generalText if available
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

const WeatherPage: React.FC = () => {
  const { continent, country, region, subregion, city } = useParams<RouteParams>();
  const [hourlyWeatherData, setHourlyWeatherData] = useState<Forecast[]>([]);
  const [dailyWeatherData, setDailyWeatherData] = useState<DailyForecast[]>([]);
  const [currentWeatherData, setCurrentWeatherData] = useState<Forecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/weather/${continent}/${country}/${region}/${subregion}/${city}/`);
        const hourlyData: Forecast[] = response.data;
        const currentDate = new Date();

        // Filter out past hours for the current day, but include the current day
        const filteredData = filterAndSortForecasts(hourlyData).filter(forecast => {
          const forecastDateTime = new Date(`${forecast.date}T${String(forecast.hour).padStart(2, '0')}:00:00`);
          return forecastDateTime >= currentDate || forecast.date > currentDate.toISOString().split('T')[0];
        });

        console.log('Filtered Data:', filteredData); // Debug log to see filtered data

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
  }, [continent, country, region, subregion, city]);

  return (
    <Container>
      <h1 className="text-center my-4">Weather for {capitalizeFirstLetter(city || '')}</h1>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {currentWeatherData && <CurrentPanel forecast={currentWeatherData} />}
      {dailyWeatherData.length > 0 && <DailyPanel forecasts={dailyWeatherData} country={city || 'Unknown'} showHeaders={false} />}
    </Container>
  );
};

export default WeatherPage;
