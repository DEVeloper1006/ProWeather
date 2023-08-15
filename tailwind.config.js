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
      'xs': '400px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px'
    }
  },
  plugins: [],
  darkMode: 'media'
}

