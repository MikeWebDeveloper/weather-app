import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '@/lib/context/WeatherContext';
import { formatDate } from '@/lib/utils';

export function FavoriteLocations() {
  const { state, dispatch } = useWeather();

  const handleLocationSelect = (location: { lat: number; lon: number; name: string; country: string }) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
  };

  const handleRemoveFavorite = (id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-background-secondary/60 p-6 backdrop-blur-md"
    >
      <h2 className="mb-4 text-lg font-semibold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
        Favorite Locations
      </h2>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {state.favorites.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-foreground-secondary"
            >
              No favorite locations yet. Add some by clicking the star icon!
            </motion.p>
          ) : (
            state.favorites.map((location) => (
              <motion.div
                key={location.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between rounded-xl bg-background/40 p-4 transition-colors hover:bg-background/60"
              >
                <button
                  onClick={() => handleLocationSelect(location)}
                  className="flex flex-1 items-start gap-3 text-left"
                >
                  <span className="text-2xl">📍</span>
                  <div>
                    <h3 className="font-medium">{location.name}</h3>
                    <p className="text-sm text-foreground-secondary">{location.country}</p>
                    <p className="mt-1 text-xs text-foreground-secondary">
                      Last updated: {formatDate(location.lastUpdated / 1000, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleRemoveFavorite(location.id)}
                  className="ml-4 rounded-full p-2 text-xl transition-colors hover:bg-background-secondary/40"
                  aria-label="Remove from favorites"
                >
                  ⭐️
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
} 