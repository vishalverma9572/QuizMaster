/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        flux: ["Flux", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        loading: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'color-change': {
          '0%': { filter: 'invert(0%)' },
          '25%': { filter: 'invert(50%)' },
          '50%': { filter: 'invert(100%)' },
          '75%': { filter: 'invert(50%)' },
          '100%': { filter: 'invert(0%)' },
        },
        'fade-in-text': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'loading': 'loading 3s infinite',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'color-change': 'color-change 4s infinite',
        'fade-in-text': 'fade-in-text 0.5s ease-in-out',
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}