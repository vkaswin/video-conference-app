/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      outlineColor: {
        "dark-blue": "#0b57d0",
      },
      gridTemplateColumns: {
        preview: "0.6fr 0.4fr",
      },
    },
  },
  plugins: [],
};
