/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"]
  ,
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Inter", "sans-serif"],
      },
      colors: {
        glass: "rgba(255, 255, 255, 0.6)",
      },
      boxShadow: {
        glass: "0 12px 40px rgba(31, 41, 55, 0.12)",
      },
    },
  },
  plugins: [],
};
