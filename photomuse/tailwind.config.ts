import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        copper: {
          primary: '#D4957A',
          light: '#E6B89C',
          dark: '#B8735E',
        },
        gold: {
          gallery: '#C9A96E',
        },
        charcoal: {
          950: '#0A0A0B',
          900: '#1A1A1D',
          800: '#2A2A2E',
          700: '#3A3A40',
          600: '#4A4A52',
        },
        slate: {
          400: '#94949F',
          300: '#B4B4BF',
          100: '#E4E4E9',
        },
        semantic: {
          success: '#6EBF8B',
          warning: '#E8B86D',
          error: '#E07B7B',
          info: '#7BA9E0',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', fontWeight: '400' }],
        'display-l': ['3.5rem', { lineHeight: '1.15', fontWeight: '400' }],
        'display-m': ['2.5rem', { lineHeight: '1.2', fontWeight: '500' }],
        'heading-l': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-m': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-s': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-l': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-m': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-s': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      boxShadow: {
        'elevation-1': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'elevation-2': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'elevation-3': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'elevation-4': '0 16px 48px rgba(0, 0, 0, 0.5)',
        'copper-glow': '0 0 32px rgba(212, 149, 122, 0.3)',
      },
      transitionDuration: {
        'instant': '100ms',
        'fast': '200ms',
        'normal': '400ms',
        'slow': '600ms',
        'glacial': '1000ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'dramatic': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        'bounce': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
        'reveal': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      screens: {
        'mobile': '768px',
        'tablet': '1024px',
        'laptop': '1280px',
        'desktop': '1440px',
        'desktop-xl': '1920px',
      },
      maxWidth: {
        'container': '1680px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
