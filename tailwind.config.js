/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9fa',
          100: '#d9f1f3',
          200: '#b7e4e8',
          300: '#85d0d8',
          400: '#4cb3c0',
          500: '#21808D',
          600: '#1d7481',
          700: '#1a686b',
          800: '#195459',
          900: '#18464c',
          950: '#0a2c33',
        },
        accent: {
          50: '#fef5ee',
          100: '#fde8d7',
          200: '#fbcdae',
          300: '#f8ab7a',
          400: '#f47d44',
          500: '#f15a20',
          600: '#e24016',
          700: '#bb2e14',
          800: '#952618',
          900: '#792216',
          950: '#410d09',
        },
        cream: {
          50: '#FCFCF9',
          100: '#FFFFFE',
        },
        slate: {
          500: '#626C71',
          900: '#13343B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}