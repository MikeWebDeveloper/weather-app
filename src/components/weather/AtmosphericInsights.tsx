import { motion, AnimatePresence } from 'framer-motion';
import { formatTemperature, formatWindSpeed } from '@/lib/utils';
import type { CurrentWeather } from '@/types/weather';

interface AtmosphericInsightsProps {
  current: CurrentWeather;
  isExpanded: boolean;
  onToggle: () => void;
}

export function AtmosphericInsights({ current, isExpanded, onToggle }: AtmosphericInsightsProps) {
  const {
    temp,
    feels_like,
    humidity,
    wind_speed,
    wind_deg,
    weather,
    uvi,
    pressure,
    visibility,
    clouds,
    dew_point,
    sunrise,
    sunset
  } = current;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatVisibility = (meters: number) => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)} km`;
  };

  return (
    <motion.section
      layout
      className="overflow-hidden rounded-3xl bg-background-secondary/60 backdrop-blur-md"
    >
      <motion.button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-6 text-left hover:bg-background-secondary/40"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌡️</span>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
              Atmospheric Insights
            </h2>
            <p className="text-sm text-foreground-secondary">
              Detailed weather metrics and conditions
            </p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl text-foreground-secondary"
        >
          ↓
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-6 p-6 pt-0 md:grid-cols-2">
              <div className="space-y-4 rounded-2xl bg-background/40 p-4">
                <h3 className="font-medium text-foreground-secondary">Temperature & Comfort</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-foreground-secondary">Temperature</p>
                    <p className="font-medium">{formatTemperature(temp)}</p>
                  </div>
                  <div>
                    <p className="text-foreground-secondary">Feels Like</p>
                    <p className="font-medium">{formatTemperature(feels_like)}</p>
                  </div>
                  <div>
                    <p className="text-foreground-secondary">Dew Point</p>
                    <p className="font-medium">{formatTemperature(dew_point)}</p>
                  </div>
                  <div>
                    <p className="text-foreground-secondary">Humidity</p>
                    <p className="font-medium">{humidity}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl bg-background/40 p-4">
                <h3 className="font-medium text-foreground-secondary">Wind & Pressure</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-foreground-secondary">Wind Speed</p>
                    <p className="font-medium">{formatWindSpeed(wind_speed)}</p>
                  </div>
                  <div>
                    <p className="text-foreground-secondary">Wind Direction</p>
                    <p className="font-medium">{wind_deg}°</p>
                  </div>
                  <div>
                    <p className="text-foreground-secondary">Pressure</p>
                    <p className="font-medium">{pressure} hPa</p>
                  </div>
                  <div>
                    <p className="text-foreground-secondary">Cloudiness</p>
                    <p className="font-medium">{clouds}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl bg-background/40 p-4">
                <h3 className="font-medium text-foreground-secondary">Sun & Visibility</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-foreground-secondary">Sunrise</p>
                    <p className="font-medium">{formatTime(sunrise)}</p>
                  </div>
                  <div>
                    <p className="text-foreground-secondary">Sunset</p>
                    <p className="font-medium">{formatTime(sunset)}</p>
                  </div>
                  <div>
                    <p className="text-foreground-secondary">UV Index</p>
                    <p className="font-medium">{uvi} of 10</p>
                  </div>
                  <div>
                    <p className="text-foreground-secondary">Visibility</p>
                    <p className="font-medium">{formatVisibility(visibility)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl bg-background/40 p-4">
                <h3 className="font-medium text-foreground-secondary">Current Conditions</h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{weather[0].icon}</span>
                    <div>
                      <p className="font-medium capitalize">{weather[0].description}</p>
                      <p className="text-foreground-secondary">{weather[0].main}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
} 