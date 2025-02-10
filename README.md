# Minimalist Weather Dashboard

A modern, minimalist weather dashboard built with Next.js, featuring progressive blur effects and a bento grid layout. The application provides current weather conditions and a 3-day forecast with smooth transitions and animations.

## Features

- 🌤️ Real-time weather data from WeatherAPI
- 🎨 Dark mode minimalist design
- 📱 Fully responsive layout
- 🎭 Progressive blur effects and smooth transitions
- 📍 Automatic location detection
- 🔄 Dynamic data updates
- ⌨️ Keyboard accessible
- 📦 TypeScript support

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- WeatherAPI API key ([Get one here](https://www.weatherapi.com/))

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weather-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your WeatherAPI key:
   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   NEXT_PUBLIC_WEATHER_API_BASE_URL=http://api.weatherapi.com/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── weather/       # Weather-specific components
├── lib/               # Utility functions and API clients
├── styles/            # Global styles and Tailwind config
└── types/             # TypeScript type definitions
```

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [WeatherAPI](https://www.weatherapi.com/) - Weather data provider

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 