import { transform } from 'typescript';
const withMT = require("@material-tailwind/react/utils/withMT");
 
  // content: [],
  // theme: {
  //   extend: {},
  // },
  // plugins: [],
// });

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
// export default {
  content: [
    "./index.html",
    "./src/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': '#00FF00',
        'gray':'#B4B4B3',
        'purple-sh-2': '#201E2D',
        'purple-sh-1': '#302C42',
        'purple-sh-0': '#48435E',

        'purple': '#8176AF',
        'purple-tone-1': '#C0B7E8' ,
        'purple-tone-2': '#DFDAF6' ,
        'impure-white': '#EDE9FB' ,
        'rose':'#f0abfc',
        'yellow':'#F8E559',
        'yellow2':'#F6D776',
        'sky':'#31bacd',
        'violet':'#800080',
        'purple-start': '#9c27b0',
        'purple-end': '#7b1fa2',
        'team':'8785A2'
      },
      height: {
        'l-card-h': '26rem',
        '13': '13px'
      },
      width: {
        'l-card-w': '20rem',
        '13': '13px'
      },
      keyframes:{
        'trans-right':{ 
          '0%,100%' :{transform: 'translateX(10px)'},
        '50%':{transform: 'translateX(0)'}
      }
      },
      animation:{
          'trans-right':'trans-right 0.8s ease-in-out infinite'
      },
    },
  },
  plugins: [ require('tailwind-scrollbar'),],
// }
});
