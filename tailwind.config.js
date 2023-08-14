/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        body: 'Poppins'
      }
    },
    screens: {
      'md-lg': "915px",
      'xs': '400px'
    }
  },
  plugins: [],
  darkMode: 'media'
}

