/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',   // For older Next.js versions or if using pages folder
    './app/**/*.{js,ts,jsx,tsx}',      // For Next.js 13+ (App directory)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
