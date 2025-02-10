export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyData[];
  daily: ForecastDay[];
  timezone: string;
  timezone_offset: number;
  alerts?: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    start: number;
    end: number;
  }[];
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
  uvi: number;
  pressure: number;
  visibility: number;
  clouds: number;
  dew_point: number;
  sunrise: number;
  sunset: number;
}

export interface HourlyData {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
  pop: number;
  rain?: {
    '1h': number;
  };
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ForecastDay {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  weather: WeatherCondition[];
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  pop: number;
  rain?: number;
  uvi: number;
}

export interface Location {
  name: string;
  country: string;
  lat: number;
  lon: number;
} 