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
        // background: "#1b1b1e",
        background: "#0F0F0F",
        formBackground: "#18191a",
      },
      fontFamily: {
        sans: ["sans-serif"],
        custom: ["Playfair Display"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
