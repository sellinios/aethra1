import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert } from 'react-bootstrap';
import CitiesWeatherRow from './CitiesWeatherRow';
import { DailyForecast } from '../types';
import './CitiesWeather.css';
import { filterAndSortForecasts, aggregateDailyData } from '../utils/weatherUtils';

interface CityWeather {
  city: string;
  forecasts: DailyForecast[];
}

const roundToNearestWhole = (num: number): number => {
  return Math.round(num);
};

const getVisibleDays = (width: number, dates: string[]) => {
  if (width >= 1200) {
    return dates.slice(0, 7); // Show 7 days on large screens
  } else if (width >= 992) {
    return dates.slice(0, 5); // Show 5 days on medium screens
  } else if (width >= 768) {
    return dates.slice(0, 3); // Show 3 days on small screens
  } else {
    return dates.slice(0, 2); // Show 2 days on extra small screens
  }
};

const CitiesWeather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleDays, setVisibleDays] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const sortedDates = Array.from(new Set(weatherData.flatMap(cityWeather => cityWeather.forecasts.map(forecast => forecast.date))))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .filter(date => date >= currentDate);
      setVisibleDays(getVisibleDays(window.innerWidth, sortedDates));
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, [weatherData]);

  useEffect(() => {
    const langCode = 'en'; // Change this dynamically based on the user's language preference
    const cities = ['athens', 'thessaloniki', 'patra']; // Update city slugs here
    const fetchWeatherData = async () => {
      try {
        const cityWeatherPromises = cities.map(async (city) => {
          const response = await axios.get(`/api/${langCode}/weather/cities/?cities=${city}`);
          const hourlyData = response.data[0]?.forecasts || [];

          // Filter and sort the forecasts
          const filteredData = filterAndSortForecasts(hourlyData);
          const aggregatedData = aggregateDailyData(filteredData);

          return { city: response.data[0]?.city || city, forecasts: aggregatedData };
        });

        const cityWeatherData = await Promise.all(cityWeatherPromises);
        setWeatherData(cityWeatherData);
        setError(null);
      } catch (err) {
        setError('Error fetching weather data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const currentDate = new Date().toISOString().split('T')[0];
  const sortedDates = Array.from(new Set(weatherData.flatMap(cityWeather => cityWeather.forecasts.map(forecast => forecast.date))))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .filter(date => date >= currentDate);

  return (
    <div className="container">
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>City</th>
              {visibleDays.map((date, index) => (
                <th key={index}>{new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weatherData.map((cityWeather, index) => (
              <CitiesWeatherRow key={index} city={cityWeather.city} forecasts={cityWeather.forecasts} sortedDates={visibleDays} />
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CitiesWeather;
