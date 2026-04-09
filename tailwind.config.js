/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pg-navy': '#0A1628',
        'pg-gold': '#C9A84C',
        'pg-cream': '#F5F0E8',
        'pg-slate': '#2D3F55',
        'pg-light': '#E8E0D0',
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'body': ['Palatino Linotype', 'Palatino', 'serif'],
        'sans': ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
