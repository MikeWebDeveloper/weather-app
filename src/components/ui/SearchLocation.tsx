import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocationByCity } from '@/lib/api/weather';
import type { Location } from '@/types/weather';

interface SearchLocationProps {
  onLocationSelect: (location: Location) => void;
  onError: (error: string) => void;
}

const DEFAULT_LOCATION: Location = {
  name: 'Sheffield',
  country: 'GB',
  lat: 53.3811,
  lon: -1.4701
};

export function SearchLocation({ onLocationSelect, onError }: SearchLocationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const location = await getLocationByCity(searchQuery.trim());
      onLocationSelect(location);
      setIsOpen(false);
      setSearchQuery('');
    } catch (error) {
      onError('Location not found. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, onLocationSelect, onError]);

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by your browser');
      // Fallback to Sheffield after 3 seconds
      setTimeout(() => {
        onLocationSelect(DEFAULT_LOCATION);
      }, 3000);
      return;
    }

    setIsLoading(true);
    
    // Set up timeout for geolocation
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      onError('Unable to get your location. Please enable location services.');
      // Fallback to Sheffield after showing the error
      setTimeout(() => {
        onLocationSelect(DEFAULT_LOCATION);
      }, 3000);
    }, 10000); // 10 second timeout for geolocation itself

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId); // Clear the timeout if we get a position
        try {
          const location: Location = {
            name: 'Current Location',
            country: '',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          onLocationSelect(location);
          setIsOpen(false);
        } catch (error) {
          onError('Failed to get weather data for your location');
          // Fallback to Sheffield after 3 seconds
          setTimeout(() => {
            onLocationSelect(DEFAULT_LOCATION);
          }, 3000);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        clearTimeout(timeoutId); // Clear the timeout on error
        setIsLoading(false);
        onError('Unable to get your location. Please enable location services.');
        // Fallback to Sheffield after 3 seconds
        setTimeout(() => {
          onLocationSelect(DEFAULT_LOCATION);
        }, 3000);
      },
      { timeout: 10000 } // 10 second timeout for getting position
    );
  }, [onLocationSelect, onError]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 rounded-lg bg-background-secondary px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-background-secondary/80 focus:outline-none focus:ring-2 focus:ring-accent/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Search location
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-4 right-4 top-20 z-50 mx-auto max-w-sm overflow-hidden rounded-xl bg-background-secondary/95 shadow-lg backdrop-blur-sm md:absolute md:left-auto md:right-0 md:top-full md:mt-2 md:w-96 md:max-w-none"
          >
            <form onSubmit={handleSearch} className="p-6">
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter city name..."
                  className="flex-1 rounded-lg bg-background px-4 py-2.5 text-sm outline-none ring-accent/20 transition-shadow placeholder:text-foreground-secondary/50 focus:ring-2"
                  aria-label="Search for a city"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-secondary disabled:opacity-50 md:px-4"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>

              <div className="mt-6 flex items-center gap-4 border-t border-background/10 pt-4">
                <button
                  type="button"
                  onClick={handleGeolocation}
                  disabled={isLoading}
                  className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground-secondary transition-colors hover:bg-background/40 hover:text-foreground disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10" />
                    <path d="M12 12h9" />
                    <path d="M12 2v10" />
                  </svg>
                  Use my location
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 