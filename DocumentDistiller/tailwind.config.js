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
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))',
      },
      gridTemplateRows: {
        'dashboard': 'auto 1fr 1fr',
      }
    },
    colors : {
      'background': '#F7F6F3',
      'background-card': '#FFFFFF',
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

