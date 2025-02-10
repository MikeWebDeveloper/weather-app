import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        'background-secondary': 'hsl(var(--background-secondary))',
        foreground: 'hsl(var(--foreground))',
        'foreground-secondary': 'hsl(var(--foreground-secondary))',
        accent: 'hsl(var(--accent))',
        'accent-secondary': 'hsl(var(--accent-secondary))',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-jetbrains-mono)']
      },
      animation: {
        'blur-in': 'blurIn 0.5s ease-out forwards',
        'blur-out': 'blurOut 0.5s ease-in forwards'
      },
      keyframes: {
        blurIn: {
          '0%': { filter: 'blur(8px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' }
        },
        blurOut: {
          '0%': { filter: 'blur(0)', opacity: '1' },
          '100%': { filter: 'blur(8px)', opacity: '0' }
        }
      },
      gridTemplateColumns: {
        'bento': 'repeat(auto-fit, minmax(250px, 1fr))'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};

export default config; 