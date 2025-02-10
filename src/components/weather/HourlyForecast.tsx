import { motion } from 'framer-motion';
import { formatTemperature, formatDate, getWeatherIcon } from '@/lib/utils';
import type { HourlyData } from '@/types/weather';

interface ThreeHourForecastProps {
  hourly: HourlyData[];
}

export function ThreeHourForecast({ hourly }: ThreeHourForecastProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-background-secondary/60 p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
          3-Hour Forecast
        </h2>
        <span className="text-xs text-foreground-secondary">
          Next 24 hours, 3-hour intervals
        </span>
      </div>

      <div className="relative">
        {/* Gradient fade effect for scroll indicators */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background-secondary/60 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background-secondary/60 to-transparent" />

        <div className="scrollbar-none flex gap-4 overflow-x-auto pb-4 md:justify-center">
          {hourly.map((hour, index) => (
            <motion.div
              key={hour.dt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group flex min-w-[100px] flex-col items-center rounded-2xl bg-background/40 p-4 transition-all duration-300 hover:bg-background/60 hover:shadow-lg"
              title={`Forecast for ${formatDate(hour.dt, 'h:mm a')}`}
            >
              <span className="text-sm font-medium text-foreground-secondary">
                {formatDate(hour.dt, 'h:mm a')}
              </span>
              
              <motion.div
                className="my-3 text-3xl transition-transform duration-300 group-hover:scale-110"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {getWeatherIcon(hour.weather[0].icon)}
              </motion.div>

              <span className="text-lg font-semibold">
                {formatTemperature(hour.temp)}
              </span>

              <div className="mt-2 flex flex-col items-center gap-1 text-xs text-foreground-secondary">
                <div className="flex items-center gap-1">
                  <span title="Humidity">💧</span>
                  <span>{hour.humidity}%</span>
                </div>
                {hour.pop > 0 && (
                  <div className="flex items-center gap-1">
                    <span title="Chance of Rain">🌧️</span>
                    <span>{Math.round(hour.pop * 100)}%</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  );
} 