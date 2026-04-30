/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',
        'primary-dark': '#0f172a',
        'primary-light': '#1e293b',
        'primary-hover': '#2563eb',
        'secondary': '#F0F2F5',
        'silver': '#C0C0C0',
        'silver-light': '#D3D3D3',
        'silver-dark': '#A9A9A9',
        'text-light': '#ffffff',
        'text-dark': '#94A3B8',
        'accent-blue': '#4f46e5',
        'accent-purple': '#8b5cf6',
        'border-color': '#334155',
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
      boxShadow: {
        'card-glow': '0 0px 20px rgba(79, 70, 229, 0.2)',
      },
    },
  },
  plugins: [],
}
