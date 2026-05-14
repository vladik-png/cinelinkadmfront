/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3699ff',
          purple: '#8950fc',
          green: '#1bc5bd',
          red: '#f64e60',
          orange: '#ffa800',
        },
        dark: {
          bg: '#151521',
          card: '#1e1e2d',
          text: '#a2a5b9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}