import { motion, AnimatePresence } from 'framer-motion';
import { formatTemperature, formatDate, getWeatherIcon, formatPrecipitation, formatWindSpeed } from '@/lib/utils';
import type { ForecastDay } from '@/types/weather';

interface WeatherCardProps {
  forecast: ForecastDay;
  isExpanded?: boolean;
  onClick?: () => void;
}

export function WeatherCard({ forecast, isExpanded = false, onClick }: WeatherCardProps) {
  const { dt, temp, weather, humidity, wind_speed, wind_deg, pop, pressure } = forecast;

  return (
    <motion.button
      layout
      onClick={onClick}
      className="weather-card group relative w-full overflow-hidden rounded-xl border border-background-secondary/20 bg-background/60 p-6 text-left backdrop-blur-md transition-colors hover:bg-background-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      aria-expanded={isExpanded}
      role="button"
      tabIndex={0}
    >
      <motion.div layout className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <motion.span 
            layout="position"
            className="weather-card-text text-lg font-medium"
          >
            {formatDate(dt)}
          </motion.span>
          <motion.span 
            layout="position"
            className="text-4xl transition-transform group-hover:scale-110"
          >
            {getWeatherIcon(weather[0].icon)}
          </motion.span>
        </div>
        
        <motion.div layout className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="weather-card-text text-2xl font-bold">
              {formatTemperature(temp.max)}
            </span>
            <span className="weather-card-text text-sm text-foreground-secondary">
              {formatTemperature(temp.min)}
            </span>
          </div>
          <p className="weather-card-text text-sm text-foreground-secondary capitalize">
            {weather[0].description}
          </p>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4 border-t border-background-secondary/20 pt-4"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="weather-card-text text-foreground-secondary">Rain Chance</span>
                  <span className="weather-card-text font-medium">{formatPrecipitation(pop)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="weather-card-text text-foreground-secondary">Humidity</span>
                  <span className="weather-card-text font-medium">{humidity}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="weather-card-text text-foreground-secondary">Wind</span>
                  <span className="weather-card-text font-medium">{formatWindSpeed(wind_speed)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="weather-card-text text-foreground-secondary">Direction</span>
                  <span className="weather-card-text font-medium">{wind_deg}°</span>
                </div>

                <div className="col-span-2 flex items-center justify-between">
                  <span className="weather-card-text text-foreground-secondary">Pressure</span>
                  <span className="weather-card-text font-medium">{pressure} hPa</span>
                </div>

                <div className="col-span-2 space-y-2">
                  <span className="weather-card-text block text-foreground-secondary">Temperature Range</span>
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex flex-col items-center gap-1">
                      <span className="weather-card-text text-foreground-secondary">Morning</span>
                      <span className="weather-card-text font-medium">{formatTemperature(temp.morn)}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="weather-card-text text-foreground-secondary">Evening</span>
                      <span className="weather-card-text font-medium">{formatTemperature(temp.eve)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div
        className={`absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 ${
          isExpanded ? 'group-hover:opacity-20' : 'group-hover:opacity-10'
        }`}
      />
    </motion.button>
  );
} 