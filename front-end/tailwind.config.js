/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': '#00FF00',
        'purple-sh-2': '#201E2D',
        'purple-sh-1': '#302C42',
        'purple': '#8176AF',
        'purple-tone-1': '#C0B7E8' ,
        'purple-tone-2': '#DFDAF6' ,
        'impure-white': '#EDE9FB' ,
      },
      height: {
        'l-card-h': '26rem',
      },
      width: {
        'l-card-w': '20rem',
      }
    },
  },
  plugins: [],
}
