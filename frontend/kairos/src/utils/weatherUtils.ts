import { Forecast, DailyForecast } from '../types';

export const filterAndSortForecasts = (hourlyData: Forecast[]): Forecast[] => {
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

export const aggregateDailyData = (hourlyData: Forecast[]): DailyForecast[] => {
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
