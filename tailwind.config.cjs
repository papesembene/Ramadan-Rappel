/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        nightBlue: "#0D1B2A",
        deepBlue: "#1B263B",
        gold: "#FFD166",
        softWhite: "#F5F5F5",
        mutedGold: "#E6C068",
        darkGray: "#415A77",
        lightGray: "#778DA9"
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        arabic: ["'Amiri'", "serif"]
      },
      boxShadow: {
        soft: "0 10px 40px rgba(13, 27, 42, 0.4)",
        glow: "0 0 20px rgba(255, 209, 102, 0.15)",
        'glow-strong': "0 0 30px rgba(255, 209, 102, 0.25), 0 0 60px rgba(255, 209, 102, 0.1)",
        'card': "0 4px 24px rgba(0, 0, 0, 0.12), 0 0 1px rgba(255, 209, 102, 0.08)",
        'card-hover': "0 8px 32px rgba(0, 0, 0, 0.16), 0 0 2px rgba(255, 209, 102, 0.12)"
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'count-up': 'countUp 0.3s ease-out',
        'progress': 'progress 0.5s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 209, 102, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 209, 102, 0.25), 0 0 60px rgba(255, 209, 102, 0.1)' }
        },
        countUp: {
          '0%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' }
        }
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
  },
  plugins: []
};
