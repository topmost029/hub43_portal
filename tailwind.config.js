/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C8372D",
          blue: "#1E3A8A",
          orange: "#E07B2A",
          darkBlue: "#152C6B",
          lightBlue: "#EEF2FF",
          lightOrange: "#FFF4EA",
          lightRed: "#FFF0EF",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
