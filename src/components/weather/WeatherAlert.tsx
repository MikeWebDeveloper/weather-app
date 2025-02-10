import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';

interface WeatherAlert {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  start: number;
  end: number;
}

interface WeatherAlertProps {
  alerts: WeatherAlert[];
}

const severityColors = {
  low: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  medium: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  high: 'bg-red-500/10 text-red-700 dark:text-red-400'
};

export function WeatherAlert({ alerts }: WeatherAlertProps) {
  if (!alerts?.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-background-secondary/60 p-6 backdrop-blur-md"
    >
      <h2 className="mb-4 text-lg font-semibold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
        Weather Alerts
      </h2>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert, index) => (
            <motion.div
              key={`${alert.type}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-xl p-4 ${severityColors[alert.severity]}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{alert.type}</h3>
                <span className="text-sm capitalize">{alert.severity}</span>
              </div>
              <p className="mt-2 text-sm">{alert.description}</p>
              <div className="mt-2 flex gap-4 text-xs opacity-80">
                <span>From: {formatDate(alert.start, 'MMM d, h:mm a')}</span>
                <span>Until: {formatDate(alert.end, 'MMM d, h:mm a')}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
} 