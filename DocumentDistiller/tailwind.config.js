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
        'dashboard': 'auto auto auto',
      },
      width: {
        'screen-no-sidebar': 'calc(100vw - 230px)',
        'sidebar': '230px',
      },
      maxWidth: {
        'screen-no-sidebar': 'calc(100vw - 230px)',
      },
      margin: {
        'sidebar': '230px',
      },
      colors : {
        'background': '#F7F6F3',
        'background-card': '#FFFFFF',
        'background-sidebar': '#EFEDE7',
        'primary': '#7B7F77',
        'primary-light': '#9B9C92',
        'text': '#1E1E1E',
        'text-light': '#FFFFFF',
        'button': '#020D13',
      }
    },
  },
  plugins: [],
}

