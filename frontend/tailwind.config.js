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
        // Custom color palette
        primary: '#06B6D4', // Alias for turquesa
        turquesa: {
          50: '#f0fdff',
          100: '#ccfbff',
          200: '#99f6ff',
          300: '#4de9ff',
          400: '#06d6f0',
          500: '#06B6D4', // Primary turquesa
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        danger: {
          500: '#EF4444', // Red for expenses
          600: '#dc2626',
        }
      },
      fontSize: {
        // Large text sizes for seniors
        'huge': ['3.75rem', { lineHeight: '1', fontWeight: '700' }], // 60px for balance
        'display': ['4rem', { lineHeight: '1.1', fontWeight: '700' }], // 64px
        'heading': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }], // 40px
        'title': ['2rem', { lineHeight: '1.3', fontWeight: '600' }], // 32px
        'large': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }], // 24px
        'body': ['1.25rem', { lineHeight: '1.5', fontWeight: '400' }], // 20px
        'small': ['1rem', { lineHeight: '1.5', fontWeight: '400' }], // 16px
      },
      spacing: {
        // Additional spacing for touch targets
        '18': '4.5rem',
        '22': '5.5rem',
      },
      minHeight: {
        'touch': '44px', // Minimum touch target size
      },
      minWidth: {
        'touch': '44px',
      }
    },
  },
  plugins: [],
}
