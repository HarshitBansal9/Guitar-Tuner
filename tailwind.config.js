/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#1A1A1C",
        'container': "#222125",
        "containershadow": "#80DD9A"
      }
    },
  },
  plugins: [],
}

