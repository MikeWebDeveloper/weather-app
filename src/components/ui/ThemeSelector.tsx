import { motion } from 'framer-motion';
import { useWeather } from '@/lib/context/WeatherContext';

export function ThemeSelector() {
  const { state, dispatch } = useWeather();

  const themes = [
    {
      name: 'Classic',
      icon: '🌈',
      preview: 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800'
    },
    {
      name: 'Ocean',
      icon: '🌊',
      preview: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800'
    },
    {
      name: 'Forest',
      icon: '🌲',
      preview: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-background-secondary/60 p-6 backdrop-blur-md"
    >
      <h2 className="mb-4 text-lg font-semibold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
        Theme Selection
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {themes.map((theme) => (
          <motion.button
            key={theme.name}
            onClick={() => {
              // Find the matching theme config and dispatch it
              const themeConfig = state.currentTheme.name === theme.name
                ? { ...state.currentTheme, darkMode: !state.currentTheme.darkMode }
                : { ...state.currentTheme, name: theme.name };
              dispatch({ type: 'SET_THEME', payload: themeConfig });
            }}
            className={`group relative flex flex-col items-center rounded-xl p-4 transition-all ${theme.preview} ${
              state.currentTheme.name === theme.name
                ? 'ring-2 ring-accent'
                : 'hover:ring-2 hover:ring-accent/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl transition-transform group-hover:scale-110">
              {theme.icon}
            </span>
            <span className="mt-2 text-sm font-medium text-foreground">
              {theme.name}
            </span>
            {state.currentTheme.name === theme.name && (
              <motion.div
                layoutId="theme-selection"
                className="absolute inset-0 rounded-xl ring-2 ring-accent"
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-background/40 p-4">
        <span className="text-sm text-foreground-secondary">Dark Mode</span>
        <button
          onClick={() => {
            dispatch({
              type: 'SET_THEME',
              payload: { ...state.currentTheme, darkMode: !state.currentTheme.darkMode }
            });
          }}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            state.currentTheme.darkMode ? 'bg-accent' : 'bg-foreground-secondary/20'
          }`}
        >
          <motion.div
            className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white"
            animate={{ x: state.currentTheme.darkMode ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
    </motion.div>
  );
} 