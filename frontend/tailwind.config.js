/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "custom-width": { min: "1020px", max: "1340px" },
      },
      colors: {
        primary: "#21a38e",
        background: "#0F0F0F",
        formBackground: "#18191a",
        borderColor: "#6b7280",
        "gradient-start": "#5591f1",
        "gradient-end": "#0dbfa1",
      },
      fontFamily: {
        sans: ["sans-serif"],
        custom: ["Playfair Display"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
