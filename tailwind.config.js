import { createRequire } from 'module';

const require = createRequire(import.meta.url);


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#030508',
        panelBg: '#090D1A',
        accentEmerald: '#10B981',
        accentCyan: '#06B6D4',
        accentPurple: '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
