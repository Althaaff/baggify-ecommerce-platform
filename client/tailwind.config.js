/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        // This means "apply styles when screen is <= 960px"
        "max-960": { max: "960px" },
      },
      boxShadow: {
        custom: "0 3px 8px rgba(0, 0, 0, 0.24)",
      },
    },
  },
  plugins: [],
};
