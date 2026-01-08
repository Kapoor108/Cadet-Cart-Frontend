/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f6ed',
          100: '#e6ebd6',
          200: '#cfd9b2',
          300: '#b1c185',
          400: '#96ab5f',
          500: '#4A5D23',
          600: '#3d4d1d',
          700: '#323f18',
          800: '#293315',
          900: '#222a12'
        },
        secondary: {
          50: '#fffef0',
          100: '#fffacc',
          200: '#fff599',
          300: '#ffed66',
          400: '#ffe033',
          500: '#FFD700',
          600: '#ccac00',
          700: '#998100',
          800: '#665600',
          900: '#332b00'
        }
      }
    }
  },
  plugins: []
};
