/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Indigo/Purple accent
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b', // Card background
          900: '#0f172a', // Main background
        },
        success: {
          50: '#052e16',
          100: '#064e3b',
          200: '#065f46',
          300: '#047857',
          400: '#059669',
          500: '#10b981', // Neon green
          600: '#34d399',
          700: '#6ee7b7',
          800: '#a7f3d0',
          900: '#d1fae5',
        },
        warning: {
          50: '#451a03',
          100: '#78350f',
          200: '#92400e',
          300: '#b45309',
          400: '#d97706',
          500: '#f59e0b', // Vibrant amber
          600: '#fbbf24',
          700: '#fcd34d',
          800: '#fde68a',
          900: '#fef3c7',
        },
        danger: {
          50: '#450a0a',
          100: '#7f1d1d',
          200: '#991b1b',
          300: '#b91c1c',
          400: '#dc2626',
          500: '#ef4444', // Red
          600: '#f87171',
          700: '#fca5a5',
          800: '#fecaca',
          900: '#fee2e2',
        },
        dark: {
          bg: '#0a0a0c',
          card: 'rgba(25, 25, 28, 0.7)',
          cardSolid: '#19191c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
