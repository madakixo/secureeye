/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'metallic-gray': {
          50: '#f9f9f9',
          100: '#e1e1e1',
          200: '#cfcfcf',
          300: '#b1b1b1',
          400: '#9e9e9e',
          500: '#8e8e8e',
          600: '#7e7e7e',
          700: '#6e6e6e',
          800: '#5e5e5e',
          900: '#2e2e2e',
        },
        'dark-black': '#0a0a0a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
