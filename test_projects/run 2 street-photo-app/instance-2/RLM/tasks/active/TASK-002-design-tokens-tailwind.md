# TASK-002: Configure Design Tokens in Tailwind

**Feature**: Design System
**Priority**: P0
**Estimated Time**: 20 minutes
**Dependencies**: TASK-001

## Description
Configure Tailwind CSS 4 with custom design tokens from `design-system.md`, including colors, typography, spacing, and brutalist shadows.

## Acceptance Criteria
- [ ] All color tokens defined in `tailwind.config.ts`
- [ ] Custom fonts configured (display, mono, body)
- [ ] Brutalist box shadows defined
- [ ] Custom animation durations and easing
- [ ] Tokens match `RLM/specs/design/tokens/tokens.json`

## Implementation

### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: '#0A0A0A',
        charcoal: '#1C1C1E',
        ash: '#2C2C2E',
        smoke: '#48484A',
        fog: '#8E8E93',
        silver: '#C7C7CC',
        paper: '#F2F2F7',
        amber: '#FF9F0A',
        crimson: '#FF453A',
        electric: '#FFD60A',
        cyan: '#64D2FF',
        'hcb-blue': '#3A5A7F',
        'maier-violet': '#6B4E71',
        'winogrand-amber': '#8B5A3C',
        'arbus-crimson': '#8B2635',
        'erwitt-sage': '#5A7D5F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'Arial Black', 'sans-serif'],
        mono: ['Courier Prime', 'Courier New', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1.125rem', // 18px mobile-optimized
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        '4xl': '4rem',
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0 0 #0A0A0A',
        'brutal-md': '4px 4px 0 0 #0A0A0A',
        'brutal-lg': '8px 8px 0 0 #0A0A0A',
        'brutal-amber': '4px 4px 0 0 #FF9F0A',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '600ms',
      },
    },
  },
  plugins: [],
};

export default config;
```

### src/styles/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-display: 'Impact', 'Arial Black', sans-serif;
  }

  body {
    @apply bg-midnight text-silver font-body text-base antialiased;
  }

  /* Film grain overlay */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url('data:image/svg+xml,...');
    opacity: 0.03;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
}

@layer utilities {
  .text-shadow-brutal {
    text-shadow: 4px 4px 0 theme('colors.charcoal');
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing
- [ ] Apply Tailwind classes and verify colors render correctly
- [ ] Test `bg-midnight text-silver` on a div
- [ ] Test brutalist shadows: `shadow-brutal-md`
- [ ] Verify font families load

## Files Modified
- `tailwind.config.ts`
- `src/styles/globals.css`

---

**Status**: Active
**Assigned**: Auto
