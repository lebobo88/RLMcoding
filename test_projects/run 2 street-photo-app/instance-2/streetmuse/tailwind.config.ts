import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Darkroom Palette
        midnight: '#0A0A0A',
        charcoal: '#1C1C1E',
        ash: '#2C2C2E',
        smoke: '#48484A',
        fog: '#8E8E93',
        silver: '#C7C7CC',
        paper: '#F2F2F7',
        // Accent Colors
        amber: '#FF9F0A',
        crimson: '#FF453A',
        electric: '#FFD60A',
        cyan: '#64D2FF',
        // Mentor Colors
        'hcb-blue': '#3A5A7F',
        'maier-violet': '#6B4E71',
        'winogrand-amber': '#8B5A3C',
        'arbus-crimson': '#8B2635',
        'erwitt-sage': '#5A7D5F',
        // Light Mode
        'noon-white': '#FAFAFA',
        graphite: '#1C1C1E',
        'ash-light': '#E5E5EA',
      },
      fontFamily: {
        display: ['Druk Wide', 'Impact', 'Arial Black', 'sans-serif'],
        mono: ['Courier Prime', 'Courier New', 'Courier', 'monospace'],
        body: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1.125rem', // 18px (mobile-optimized)
        lg: '1.25rem',    // 20px
        xl: '1.5rem',     // 24px
        '2xl': '2rem',    // 32px
        '3xl': '3rem',    // 48px
        '4xl': '4rem',    // 64px
      },
      spacing: {
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
        '24': '6rem',     // 96px
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0 0 #0A0A0A',
        'brutal-md': '4px 4px 0 0 #0A0A0A',
        'brutal-lg': '8px 8px 0 0 #0A0A0A',
        'brutal-amber': '4px 4px 0 0 #FF9F0A',
      },
      borderRadius: {
        none: '0px',
        sm: '0.125rem',  // 2px
        md: '0.25rem',   // 4px
        full: '9999px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
