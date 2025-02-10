import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, fromUnixTime } from 'date-fns';

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a temperature value with the appropriate unit
 */
export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

/**
 * Formats a Unix timestamp to a human-readable date
 */
export function formatDate(timestamp: number, formatStr: string = 'EEE, MMM d'): string {
  try {
    return format(fromUnixTime(timestamp), formatStr);
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Formats wind speed with the appropriate unit
 */
export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed * 3.6)} km/h`; // Convert m/s to km/h
}

/**
 * Returns appropriate weather icon based on OpenWeather icon code
 */
export function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    '01d': '☀️', // Clear sky day
    '01n': '🌙', // Clear sky night
    '02d': '🌤️', // Few clouds day
    '02n': '☁️', // Few clouds night
    '03d': '☁️', // Scattered clouds
    '03n': '☁️', // Scattered clouds
    '04d': '☁️', // Broken clouds
    '04n': '☁️', // Broken clouds
    '09d': '🌧️', // Shower rain
    '09n': '🌧️', // Shower rain
    '10d': '🌦️', // Rain day
    '10n': '🌧️', // Rain night
    '11d': '⛈️', // Thunderstorm
    '11n': '⛈️', // Thunderstorm
    '13d': '🌨️', // Snow
    '13n': '🌨️', // Snow
    '50d': '🌫️', // Mist
    '50n': '🌫️', // Mist
  };

  return iconMap[iconCode] || '❓';
}

/**
 * Formats UV index with description
 */
export function formatUVIndex(uvi: number): { value: number; description: string } {
  let description = 'Low';
  if (uvi >= 3 && uvi < 6) description = 'Moderate';
  else if (uvi >= 6 && uvi < 8) description = 'High';
  else if (uvi >= 8 && uvi < 11) description = 'Very High';
  else if (uvi >= 11) description = 'Extreme';

  return { value: Math.round(uvi), description };
}

/**
 * Formats precipitation probability as a percentage
 */
export function formatPrecipitation(pop: number): string {
  return `${Math.round(pop * 100)}%`;
} 