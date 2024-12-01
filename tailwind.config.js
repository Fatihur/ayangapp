/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.1' },
          '50%': { transform: 'translateY(40vh) rotate(180deg)', opacity: '0.3' },
          '100%': { transform: 'translateY(80vh) rotate(360deg)', opacity: '0.1' }
        }
      },
      animation: {
        'float': 'float 15s linear infinite'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
