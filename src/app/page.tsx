'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { ThreeHourForecast } from '@/components/weather/HourlyForecast';
import { SearchLocation } from '@/components/ui/SearchLocation';
import { AtmosphericInsights } from '@/components/weather/AtmosphericInsights';
import { getWeatherData, getUserLocation } from '@/lib/api/weather';
import type { WeatherData, Location } from '@/types/weather';
import { WeatherAlert } from '@/components/weather/WeatherAlert';

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);

  // Theme initialization and system preference listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    
    const updateTheme = (dark: boolean) => {
      console.log('Updating theme:', dark ? 'dark' : 'light');
      setIsDarkMode(dark);
      
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        root.style.setProperty('color-scheme', dark ? 'dark' : 'light');
        if (dark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        localStorage.setItem('theme', dark ? 'dark' : 'light');
      });
    };

    // Initialize theme based on stored preference or system preference
    if (storedTheme) {
      console.log('Using stored theme:', storedTheme);
      updateTheme(storedTheme === 'dark');
    } else {
      console.log('Using system preference:', prefersDark.matches ? 'dark' : 'light');
      updateTheme(prefersDark.matches);
    }

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        console.log('System theme changed:', e.matches ? 'dark' : 'light');
        updateTheme(e.matches);
      }
    };

    prefersDark.addEventListener('change', handleSystemThemeChange);
    return () => prefersDark.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    setIsDarkMode((prev) => {
      const newValue = !prev;
      console.log('Toggling theme to:', newValue ? 'dark' : 'light');
      
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        root.style.setProperty('color-scheme', newValue ? 'dark' : 'light');
        if (newValue) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        localStorage.setItem('theme', newValue ? 'dark' : 'light');
      });
      return newValue;
    });
  }, []);

  const loadWeatherData = useCallback(async (loc: Location) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(loc.lat, loc.lon);
      setWeatherData(data);
      setLocation(loc);
      setLastLocation(loc);
      localStorage.setItem('lastLocation', JSON.stringify(loc));
    } catch (err) {
      setError('Failed to load weather data. Please try again later.');
      console.error('Error loading weather data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedLocation = localStorage.getItem('lastLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLastLocation(parsedLocation);
      } catch (e) {
        console.error('Error parsing saved location:', e);
      }
    }
  }, []);

  // Initialize weather data function
  const initializeWeatherData = useCallback(async () => {
    try {
      if (lastLocation) {
        await loadWeatherData(lastLocation);
      } else {
        const userLocation = await getUserLocation();
        await loadWeatherData(userLocation);
      }
    } catch (err) {
      setError('Failed to load weather data. Please try again later.');
      console.error('Error loading weather data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lastLocation, loadWeatherData]);

  // Effect to initialize weather data
  useEffect(() => {
    initializeWeatherData();
  }, [initializeWeatherData]);

  // Handle header title click
  const handleTitleClick = useCallback(() => {
    if (lastLocation) {
      loadWeatherData(lastLocation);
    } else {
      initializeWeatherData();
    }
  }, [lastLocation, loadWeatherData, initializeWeatherData]);

  const handleLocationSelect = useCallback((newLocation: Location) => {
    loadWeatherData(newLocation);
  }, [loadWeatherData]);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary transition-all duration-300">
      <header className="sticky top-0 z-50 border-b border-background-secondary/20 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <motion.button
            onClick={handleTitleClick}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            title="Click to show default location"
          >
            Weather Dashboard
            {location && (
              <span className="block text-sm text-foreground-secondary">
                {location.name}, {location.country}
              </span>
            )}
          </motion.button>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={toggleTheme}
              className="rounded-full p-2 text-2xl transition-all duration-300 hover:bg-background-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? '🌙' : '☀️'}
            </motion.button>
            <SearchLocation
              onLocationSelect={handleLocationSelect}
              onError={handleError}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-4 p-4">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div key="error" className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-500">
              <p>{error}</p>
            </motion.div>
          ) : isLoading ? (
            <motion.div key="loading" className="flex min-h-[50vh] items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-foreground/20" />
            </motion.div>
          ) : weatherData && location ? (
            <motion.div key="content" className="space-y-4">
              <CurrentWeather
                current={weatherData.current}
                location={location}
              />

              <AtmosphericInsights
                current={weatherData.current}
                isExpanded={isInsightsExpanded}
                onToggle={() => setIsInsightsExpanded(!isInsightsExpanded)}
              />

              <ThreeHourForecast hourly={weatherData.hourly} />

              <section className="space-y-4">
                <motion.h2 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
                  5-Day Forecast
                </motion.h2>
                <div className="bento-grid">
                  <AnimatePresence>
                    {weatherData.daily.slice(0, 5).map((day, index) => (
                      <WeatherCard
                        key={day.dt}
                        forecast={day}
                        isExpanded={expandedCard === index}
                        onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              <WeatherAlert alerts={weatherData.alerts || []} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
} 