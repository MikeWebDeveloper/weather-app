import { motion } from 'framer-motion';
import { formatTemperature, formatWindSpeed, formatUVIndex, getWeatherIcon } from '@/lib/utils';
import type { CurrentWeather as CurrentWeatherType, Location } from '@/types/weather';

interface CurrentWeatherProps {
  current: CurrentWeatherType;
  location: Location;
}

export function CurrentWeather({ current, location }: CurrentWeatherProps) {
  const uvIndex = formatUVIndex(current.uvi);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-background-secondary p-6 shadow-lg"
    >
      <div className="relative z-10 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold">{location.name}</h1>
            <p className="text-sm text-foreground-secondary">{location.country}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-6xl">{getWeatherIcon(current.weather[0].icon)}</span>
            <div>
              <span className="text-5xl font-bold">
                {formatTemperature(current.temp)}
              </span>
              <p className="mt-1 text-foreground-secondary">
                Feels like {formatTemperature(current.feels_like)}
              </p>
            </div>
          </div>

          <p className="text-lg">{current.weather[0].description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-foreground-secondary">Wind Speed</p>
            <p className="text-lg font-medium">{formatWindSpeed(current.wind_speed)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-foreground-secondary">Wind Direction</p>
            <p className="text-lg font-medium">{current.wind_deg}°</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-foreground-secondary">Humidity</p>
            <p className="text-lg font-medium">{current.humidity}%</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-foreground-secondary">UV Index</p>
            <p className="text-lg font-medium">
              {uvIndex.value} <span className="text-sm">({uvIndex.description})</span>
            </p>
          </div>
        </div>
      </div>

      <div className="blur-backdrop opacity-0 transition-opacity duration-300 hover:opacity-5" />
    </motion.section>
  );
} 