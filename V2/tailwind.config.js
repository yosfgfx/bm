/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a7951',
        secondary: '#2b435a',
      },
      fontFamily: {
        'arabic-bold': ['SSTArabic-Bold', 'sans-serif'],
        'arabic': ['SSTArabic-Roman', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
