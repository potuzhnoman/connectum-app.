/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'slow-spin': 'slow-spin 20s linear infinite',
        'orbit-1': 'orbit-1 20s linear infinite',
        'orbit-2': 'orbit-2 25s linear infinite',
        'orbit-3': 'orbit-3 18s linear infinite',
        'counter-spin': 'counter-spin 20s linear infinite',
        'scale-in': 'scale-in 0.2s ease-out forwards',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in': 'slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slow-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'orbit-1': {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        'orbit-2': {
          '0%': { transform: 'rotate(120deg) translateX(150px) rotate(-120deg)' },
          '100%': { transform: 'rotate(480deg) translateX(150px) rotate(-480deg)' },
        },
        'orbit-3': {
          '0%': { transform: 'rotate(240deg) translateX(100px) rotate(-240deg)' },
          '100%': { transform: 'rotate(600deg) translateX(100px) rotate(-600deg)' },
        },
        'counter-spin': {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'translate(-50%, 100%)', opacity: '0' },
          '60%': { transform: 'translate(-50%, -10%)', opacity: '1' },
          '80%': { transform: 'translate(-50%, 5%)' },
          '100%': { transform: 'translate(-50%, 0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-top': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}