/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        'landing': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      colors: {
        cream: { 50:'#fffaf5', 100:'#fff1e6', 200:'#fde3d0' },
        peach: { 300:'#f9c3a8', 400:'#f4a584', 500:'#ea8a68' },
        plum: { 950:'#2a0e22', 900:'#3b1230', 800:'#54224a', 600:'#7d4472', 400:'#a77a9d' },
        studio: {
          950: '#090a0f',
          900: '#12141c',
          850: '#171924',
          800: '#1d2130',
          700: '#2c3247',
          600: '#404968',
        },
        brand: {
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      }
    },
  },
  plugins: [],
}
