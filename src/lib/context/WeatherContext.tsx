import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Location } from '@/types/weather';

interface ThemeConfig {
  name: string;
  colors: {
    background: string;
    backgroundSecondary: string;
    foreground: string;
    foregroundSecondary: string;
    accent: string;
    accentSecondary: string;
  };
  darkMode: boolean;
}

interface SavedLocation extends Location {
  id: string;
  lastUpdated: number;
}

interface WeatherState {
  favorites: SavedLocation[];
  currentTheme: ThemeConfig;
  selectedLocation: Location | null;
  recentSearches: Location[];
}

type WeatherAction =
  | { type: 'ADD_FAVORITE'; payload: Location }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_THEME'; payload: ThemeConfig }
  | { type: 'SET_LOCATION'; payload: Location }
  | { type: 'ADD_RECENT_SEARCH'; payload: Location };

const initialThemes: ThemeConfig[] = [
  {
    name: 'Classic',
    colors: {
      background: 'hsl(0 0% 100%)',
      backgroundSecondary: 'hsl(0 0% 96%)',
      foreground: 'hsl(0 0% 0%)',
      foregroundSecondary: 'hsl(0 0% 40%)',
      accent: 'hsl(217 91% 60%)',
      accentSecondary: 'hsl(217 91% 67%)'
    },
    darkMode: false
  },
  {
    name: 'Ocean',
    colors: {
      background: 'hsl(200 65% 98%)',
      backgroundSecondary: 'hsl(200 65% 94%)',
      foreground: 'hsl(200 65% 10%)',
      foregroundSecondary: 'hsl(200 65% 35%)',
      accent: 'hsl(200 65% 45%)',
      accentSecondary: 'hsl(200 65% 55%)'
    },
    darkMode: false
  },
  {
    name: 'Forest',
    colors: {
      background: 'hsl(150 40% 98%)',
      backgroundSecondary: 'hsl(150 40% 94%)',
      foreground: 'hsl(150 40% 10%)',
      foregroundSecondary: 'hsl(150 40% 35%)',
      accent: 'hsl(150 40% 45%)',
      accentSecondary: 'hsl(150 40% 55%)'
    },
    darkMode: false
  }
];

const initialState: WeatherState = {
  favorites: [],
  currentTheme: initialThemes[0],
  selectedLocation: null,
  recentSearches: []
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'ADD_FAVORITE':
      const newFavorite: SavedLocation = {
        ...action.payload,
        id: `${action.payload.lat}-${action.payload.lon}`,
        lastUpdated: Date.now()
      };
      return {
        ...state,
        favorites: [...state.favorites, newFavorite]
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload)
      };

    case 'SET_THEME':
      return {
        ...state,
        currentTheme: action.payload
      };

    case 'SET_LOCATION':
      return {
        ...state,
        selectedLocation: action.payload
      };

    case 'ADD_RECENT_SEARCH':
      const recentSearches = [
        action.payload,
        ...state.recentSearches.filter(
          loc => loc.lat !== action.payload.lat || loc.lon !== action.payload.lon
        )
      ].slice(0, 5);
      return {
        ...state,
        recentSearches
      };

    default:
      return state;
  }
}

const WeatherContext = createContext<{
  state: WeatherState;
  dispatch: React.Dispatch<WeatherAction>;
} | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
} 