/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      gridTemplateColumns: {
        'dashboard': '4fr 1fr',
      },
      gridTemplateRows: {
        'dashboard': 'auto 1fr 1fr',
      },
      width: {
        'screen-no-sidebar': 'calc(100vw - 192px)',
      }
    },
    colors : {
      'background': '#F7F6F3',
      'background-card': '#FFFFFF',
      'background-sidebar': '#EFEDE7',
      'primary': '#7B7F77',
      'primary-light': '#9B9C92',
      'text': '#1E1E1E',
      'text-light': '#7B7F77',

    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

