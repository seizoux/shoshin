/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.{html,js,css,ts,jsx,tsx}", 
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'off-white': '#FAF9F6',
        'night-dark': "#36454F",
        'night-dark-alt': "#253037"
      },
    },
  },
  plugins: [],
}

