/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#005cb8",
        secondary: "#FF712C",
        subtle: "#00b3d6",
        tertiary: "#03045e",
        label: "#2A2A2A",
      },
    },
  },
  plugins: [],
};
