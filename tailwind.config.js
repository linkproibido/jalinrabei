/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
      },
      screens: {
        'xs': '475px',
      },
      animation: {
        'gradient': 'gradient 4s linear infinite',
      },
      transitionProperty: {
        'scale': 'transform',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};