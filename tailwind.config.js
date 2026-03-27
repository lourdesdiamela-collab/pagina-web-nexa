/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nexa-dark': '#0D0E15',
        'nexa-mid': '#1A1C29',
        'nexa-card': '#12141D',
        'nexa-primary': '#B89BFF',
        'nexa-lima': '#D2F23A',
        'nexa-rosa': '#EAA1FB',
        'nexa-pink': '#FE8FD9',
      },
    },
  },
  plugins: [],
}
