/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0A0A2A', // Dark background for overall theme
        'primary-light': '#1A1A4A', // Slightly lighter for cards/sections
        'accent-blue': '#4F46E5', // Vibrant blue for highlights
        'accent-purple': '#7C3AED', // Vibrant purple for gradients
        'text-light': '#E5E7EB', // Light gray for primary text
        'text-dark': '#A1A1AA', // Darker gray for secondary text
        'border-color': 'rgba(255, 255, 255, 0.15)', // Subtle border
        'gradient-start': '#4F46E5', // For hero gradient
        'gradient-end': '#7C3AED', // For hero gradient
      },
      boxShadow: {
        'card-glow': '0 0px 30px rgba(79, 70, 229, 0.25)', // Subtle glow for cards
      },
      textShadow: {
        'glow': '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(255,255,255,0.4)',
      },
      animation: {
        'gradient-x': 'gradient-x 5s ease infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            textShadow: '0 0 4px rgba(255,255,255,0.7), 0 0 8px rgba(79,70,229,0.5), 0 0 12px rgba(124,58,237,0.3)',
          },
          '50%': {
            opacity: '0.8',
            textShadow: '0 0 2px rgba(255,255,255,0.5), 0 0 6px rgba(79,70,229,0.3), 0 0 10px rgba(124,58,237,0.2)',
          },
        },
      },
    },
  },
  plugins: [],
}