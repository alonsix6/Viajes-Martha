/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06B6D4',
        turquesa: {
          50: '#f0fdff',
          100: '#ccfbff',
          200: '#99f6ff',
          300: '#4de9ff',
          400: '#06d6f0',
          500: '#06B6D4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        danger: {
          400: '#f87171',
          500: '#EF4444',
          600: '#dc2626',
        },
        // Negro puro para OLED
        dark: {
          bg: '#000000',
          card: '#0a0a0a',
          elevated: '#141414',
          border: '#1f1f1f',
        }
      },
      fontSize: {
        'huge': ['4.5rem', { lineHeight: '1', fontWeight: '800' }],
        'display': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
        'heading': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'title': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'large': ['1.375rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'elevated': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-turquesa': 'linear-gradient(135deg, #06B6D4 0%, #0891b2 50%, #0e7490 100%)',
        'gradient-danger': 'linear-gradient(135deg, #f87171 0%, #EF4444 50%, #dc2626 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
      }
    },
  },
  plugins: [],
}
