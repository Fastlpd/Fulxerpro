/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6', // blue-500
        'primary-hover': '#2563eb', // blue-600
        'secondary': '#F0F2F5',
        'silver': '#C0C0C0',
        'silver-light': '#D3D3D3',
        'silver-dark': '#A9A9A9',
        'blue-gray': {
          '50': '#F8FAFC',
          '100': '#F1F5F9',
          '200': '#E2E8F0',
          '300': '#CBD5E1',
          '400': '#94A3B8',
          '500': '#64748B',
          '600': '#475569',
          '700': '#334155',
          '800': '#1E293B',
          '900': '#0F172A',
        },
      },
    },
  },
  plugins: [],
}
