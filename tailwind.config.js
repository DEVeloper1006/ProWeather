/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        powderBlue: "#98C1D9",
        lightCyan:"#E0FBFC",
        greyBlue: "#3D5A80"
      },
      fontFamily: {
        body: 'Poppins'
      }
    },
  },
  plugins: [],
}

