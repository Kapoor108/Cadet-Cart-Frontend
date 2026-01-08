/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
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
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      }
    }
  },
  plugins: []
};
