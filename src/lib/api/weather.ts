import { WeatherData, Location } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Fetches current weather and forecast data using OpenWeather's free tier APIs
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Promise with weather data
 */
export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error('Weather API key is not configured');
  }

  try {
    // Get current weather
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    // Get 5 day forecast with 3-hour intervals
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!currentResponse.ok || !forecastResponse.ok) {
      const errorData = await currentResponse.json();
      console.error('Weather API Error:', errorData);
      throw new Error(`Failed to fetch weather data: ${errorData.message || currentResponse.statusText}`);
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Get the next 24 hours of forecast data (8 entries, as each is 3 hours apart)
    const next24Hours = forecastData.list.slice(0, 8).map((item: any) => ({
      dt: item.dt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed,
      wind_deg: item.wind.deg,
      weather: item.weather,
      pop: item.pop || 0,
      rain: item.rain
    }));

    // Transform the data to match our WeatherData interface
    return {
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        wind_deg: currentData.wind.deg,
        weather: currentData.weather,
        uvi: currentData.uvi || 0,
        pressure: currentData.main.pressure,
        visibility: currentData.visibility,
        clouds: currentData.clouds.all,
        dew_point: currentData.main.temp - ((100 - currentData.main.humidity) / 5), // Approximate dew point calculation
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset
      },
      hourly: next24Hours,
      daily: forecastData.list
        .filter((item: any, index: number) => index % 8 === 0) // Get one reading per day (every 8th item is 24 hours apart)
        .map((item: any) => ({
          dt: item.dt,
          temp: {
            day: item.main.temp,
            min: item.main.temp_min,
            max: item.main.temp_max,
            night: item.main.temp,
            eve: item.main.temp,
            morn: item.main.temp
          },
          feels_like: {
            day: item.main.feels_like,
            night: item.main.feels_like,
            eve: item.main.feels_like,
            morn: item.main.feels_like
          },
          pressure: item.main.pressure,
          humidity: item.main.humidity,
          weather: item.weather,
          wind_speed: item.wind.speed,
          wind_deg: item.wind.deg,
          clouds: item.clouds.all,
          pop: item.pop || 0,
          rain: item.rain ? item.rain['3h'] : undefined,
          uvi: 0 // UV index not available in free tier forecast
        })),
      timezone: 'UTC', // Timezone string not available in free tier
      timezone_offset: 0
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Fetches location coordinates based on city name using OpenWeather's Geocoding API
 * @param city - City name
 * @returns Promise with location data
 */
export async function getLocationByCity(city: string): Promise<Location> {
  if (!API_KEY) {
    throw new Error('Weather API key is not configured');
  }

  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Geocoding API Error:', errorData);
      throw new Error(`Failed to fetch location: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    if (!data.length) {
      throw new Error('City not found');
    }

    const location = data[0];
    return {
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
}

/**
 * Default locations to fall back to if user location fails
 */
const DEFAULT_LOCATIONS = [
  {
    name: 'Sheffield',
    country: 'GB',
    lat: 53.3811,
    lon: -1.4701
  },
  {
    name: 'London',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278
  }
];

/**
 * Fetches user's location based on IP address and returns coordinates
 * Falls back to Sheffield, then London if location services are disabled
 * @returns Promise with location coordinates
 */
export async function getUserLocation(): Promise<Location> {
  try {
    // Try getting user's location from IP
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch location from IP');
    }

    const data = await response.json();
    return {
      name: data.city,
      country: data.country,
      lat: data.latitude,
      lon: data.longitude
    };
  } catch (error) {
    console.error('Error fetching user location:', error);
    
    // Try Sheffield first
    try {
      const sheffieldData = await getWeatherData(DEFAULT_LOCATIONS[0].lat, DEFAULT_LOCATIONS[0].lon);
      return DEFAULT_LOCATIONS[0];
    } catch (sheffieldError) {
      console.error('Error fetching Sheffield weather:', sheffieldError);
      
      // Finally, try London
      try {
        const londonData = await getWeatherData(DEFAULT_LOCATIONS[1].lat, DEFAULT_LOCATIONS[1].lon);
        return DEFAULT_LOCATIONS[1];
      } catch (londonError) {
        console.error('Error fetching London weather:', londonError);
        throw new Error('Unable to fetch weather data for any default location');
      }
    }
  }
} 