/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brew: {
          50:  '#fdf8f0',
          100: '#faefd8',
          200: '#f4dba8',
          300: '#ecc270',
          400: '#e3a340',
          500: '#d4881f',
          600: '#b86d17',
          700: '#965416',
          800: '#7a4318',
          900: '#653819',
          950: '#391c09',
        },
        cream: {
          50:  '#fefcf7',
          100: '#fdf5e4',
          200: '#faeac4',
          300: '#f5d896',
          400: '#efc05f',
          500: '#e8a83a',
          600: '#d4882a',
          700: '#b06a24',
          800: '#8e5225',
          900: '#744423',
          950: '#3f2110',
        },
        espresso: '#2c1a0e',
        mocha: '#4a2c17',
        latte: '#c4956a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lato"', 'sans-serif'],
        accent: ['"Dancing Script"', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
