/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7f2',
          100: '#e9ede3',
          200: '#dce4d1',
          300: '#bccba6',
          400: '#94a60f',
          500: '#4f5902',
          600: '#4f5902',
          700: '#4f5902',
          800: '#4f5902',
          900: '#4f5902',
        },
        accent: {
          50: '#faf8f7',
          100: '#f5f0ee',
          200: '#ebe2de',
          300: '#bfa995',
          400: '#bfa995',
          500: '#bfa995',
          600: '#bfa995',
          700: '#bfa995',
          800: '#bfa995',
          900: '#bfa995',
        },
        background: '#dce6f2'
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}