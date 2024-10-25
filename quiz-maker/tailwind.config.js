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
      },
      animation: {
        loading: 'loading 3s infinite',
      },
    },
  },
  plugins: [],
}