/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'shamba-green': '#2E7D32', // Primary green from Shamba Records
        'shamba-light': '#E8F5E9', // Light green background
      },
    },
  },
  plugins: [],
};