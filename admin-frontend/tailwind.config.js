/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aws: {
          dark: '#1a2332',
          green: '#1ba373',
          red: '#d92b4b',
          bg: '#f8f9fb',
        }
      }
    },
  },
  plugins: [],
}