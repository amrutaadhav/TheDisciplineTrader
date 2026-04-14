/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#121212',
        darkCard: '#1E1E1E',
        primary: '#4F46E5', // indigo
        secondary: '#10B981', // emerald
      }
    },
  },
  plugins: [],
}
