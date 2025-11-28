# UI Framework Reference

Quick reference for implementing RLM design tokens across popular UI frameworks.

---

## Supported Frameworks

| Framework | Type | Best For | Token Export |
|-----------|------|----------|--------------|
| Tailwind CSS | Utility-first | Modern web apps | `tailwind.config.js` |
| Material UI | Component library | Google Design Language | `mui-theme.ts` |
| Chakra UI | Component library | Accessibility focus | `chakra-theme.ts` |
| Bootstrap | Component library | Rapid prototyping | `bootstrap-variables.scss` |
| Ant Design | Component library | Enterprise apps | `antd-theme.ts` |
| CSS Variables | Native CSS | Framework-agnostic | `css-variables.css` |

---

## Tailwind CSS

### Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Main primary
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Uses default Tailwind spacing scale
      },
      borderRadius: {
        'sm': '0.25rem',  // 4px
        'md': '0.5rem',   // 8px
        'lg': '0.75rem',  // 12px
        'xl': '1rem',     // 16px
      },
    },
  },
  plugins: [],
}
```

### Usage Patterns

```jsx
// Colors
<div className="bg-primary-500 text-white">Primary Button</div>
<div className="text-error">Error message</div>

// Typography
<h1 className="text-4xl font-bold">Heading</h1>
<p className="text-base text-gray-600">Body text</p>

// Spacing
<div className="p-4 m-2 gap-4">Padded content</div>

// Component States
<button className="
  bg-primary-500
  hover:bg-primary-600
  focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
  active:bg-primary-700
  disabled:bg-gray-300 disabled:cursor-not-allowed
">
  Button
</button>

// Responsive
<div className="px-4 md:px-6 lg:px-8">Responsive padding</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">Responsive grid</div>

// Focus Indicators (REQUIRED)
<button className="focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
  Accessible Button
</button>
```

### Tailwind + shadcn/ui

```jsx
// Button component with variants
import { Button } from "@/components/ui/button"

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button disabled>Disabled</Button>
<Button isLoading>Loading...</Button>
```

---

## Material UI

### Theme Configuration

```typescript
// mui-theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4338ca',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#10b981',
    },
    info: {
      main: '#3b82f6',
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.25rem', fontWeight: 700 },
    h2: { fontSize: '1.875rem', fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // Base spacing unit (8px)
});
```

### Usage Patterns

```tsx
import { ThemeProvider } from '@mui/material/styles';
import { Button, Typography, Box, TextField } from '@mui/material';
import { theme } from './mui-theme';

// Wrap app
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>

// Components
<Button variant="contained" color="primary">Primary</Button>
<Button variant="outlined" color="secondary">Secondary</Button>
<Button variant="contained" disabled>Disabled</Button>
<Button variant="contained" loading>Loading</Button>

// Typography
<Typography variant="h1">Heading 1</Typography>
<Typography variant="body1" color="text.secondary">Body text</Typography>

// Spacing with sx prop
<Box sx={{ p: 2, m: 1, gap: 2 }}>Content</Box>

// Responsive
<Box sx={{
  px: { xs: 2, md: 3, lg: 4 },
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
}}>
  Responsive content
</Box>
```

---

## Chakra UI

### Theme Configuration

```typescript
// chakra-theme.ts
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: { bg: 'brand.600' },
          _active: { bg: 'brand.700' },
          _focus: { boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)' },
        },
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        color: 'gray.800',
        lineHeight: 'tall',
      },
    },
  },
});
```

### Usage Patterns

```tsx
import { ChakraProvider, Button, Text, Box, VStack } from '@chakra-ui/react';
import { theme } from './chakra-theme';

// Wrap app
<ChakraProvider theme={theme}>
  <App />
</ChakraProvider>

// Components
<Button colorScheme="brand">Primary</Button>
<Button colorScheme="brand" variant="outline">Outline</Button>
<Button isDisabled>Disabled</Button>
<Button isLoading loadingText="Loading">Submit</Button>

// Typography
<Text fontSize="xl" fontWeight="bold">Large bold text</Text>
<Text color="gray.600">Secondary text</Text>

// Spacing
<Box p={4} m={2}>Padded content</Box>
<VStack spacing={4}>Stacked with gaps</VStack>

// Responsive
<Box px={{ base: 4, md: 6, lg: 8 }}>Responsive padding</Box>
```

---

## Bootstrap

### Variables Configuration

```scss
// bootstrap-variables.scss
$primary: #3b82f6;
$secondary: #6366f1;
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$info: #3b82f6;

$font-family-base: 'Inter', system-ui, sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

$border-radius: 0.5rem;
$border-radius-sm: 0.25rem;
$border-radius-lg: 0.75rem;

$spacer: 1rem;
$spacers: (
  0: 0,
  1: $spacer * 0.25,  // 4px
  2: $spacer * 0.5,   // 8px
  3: $spacer,         // 16px
  4: $spacer * 1.5,   // 24px
  5: $spacer * 2,     // 32px
  6: $spacer * 3,     // 48px
);

// Focus ring
$focus-ring-width: 2px;
$focus-ring-opacity: 0.5;
$focus-ring-color: rgba($primary, $focus-ring-opacity);

@import "bootstrap/scss/bootstrap";
```

### Usage Patterns

```html
<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline-secondary">Secondary</button>
<button class="btn btn-primary" disabled>Disabled</button>
<button class="btn btn-primary">
  <span class="spinner-border spinner-border-sm" role="status"></span>
  Loading...
</button>

<!-- Typography -->
<h1 class="display-4">Display Heading</h1>
<p class="text-secondary">Secondary text</p>

<!-- Spacing -->
<div class="p-3 m-2">Padded content</div>
<div class="d-flex gap-3">Items with gap</div>

<!-- Responsive -->
<div class="px-3 px-md-4 px-lg-5">Responsive padding</div>
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">Responsive grid</div>
</div>
```

---

## Ant Design

### Theme Configuration

```typescript
// antd-theme.ts
import { ConfigProvider } from 'antd';

const theme = {
  token: {
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    colorTextBase: '#1f2937',
    colorBgBase: '#ffffff',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    borderRadius: 8,
    controlHeight: 40,
  },
  components: {
    Button: {
      primaryShadow: '0 2px 0 rgba(59, 130, 246, 0.1)',
    },
  },
};

// Wrap app
<ConfigProvider theme={theme}>
  <App />
</ConfigProvider>
```

### Usage Patterns

```tsx
import { Button, Typography, Space } from 'antd';

const { Title, Text } = Typography;

// Buttons
<Button type="primary">Primary</Button>
<Button type="default">Default</Button>
<Button type="primary" danger>Danger</Button>
<Button type="primary" disabled>Disabled</Button>
<Button type="primary" loading>Loading</Button>

// Typography
<Title level={1}>Heading 1</Title>
<Text type="secondary">Secondary text</Text>

// Spacing
<Space size="middle" direction="vertical">
  <div>Item 1</div>
  <div>Item 2</div>
</Space>

// Responsive (using Grid)
import { Row, Col } from 'antd';

<Row gutter={[16, 16]}>
  <Col xs={24} md={12} lg={8}>Column</Col>
</Row>
```

---

## CSS Variables (Framework-Agnostic)

### Root Variables

```css
/* css-variables.css */
:root {
  /* Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-background: #ffffff;
  --color-surface: #f9fafb;

  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #f9fafb;
    --color-text-secondary: #9ca3af;
    --color-background: #111827;
    --color-surface: #1f2937;
  }
}
```

### Usage Patterns

```css
/* Using variables in CSS */
.button {
  background-color: var(--color-primary-500);
  color: white;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  transition: background-color var(--duration-normal) var(--easing-default);
}

.button:hover {
  background-color: var(--color-primary-600);
}

.button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.button:active {
  background-color: var(--color-primary-700);
}

.button:disabled {
  background-color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}
```

---

## Animation Implementation by Tier

### MINIMAL Tier (CSS Only)

```css
/* Simple transitions */
.button {
  transition: background-color 150ms ease-out;
}

.fade-in {
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### MODERATE Tier (Framer Motion)

```tsx
import { motion, AnimatePresence } from 'framer-motion';

// Page transitions
<AnimatePresence mode="wait">
  <motion.div
    key={router.pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
</AnimatePresence>

// Micro-interactions
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Click me
</motion.button>

// List animations
<motion.ul>
  {items.map((item, i) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### RICH Tier (GSAP)

```tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Loading animation
function LoadingAnimation() {
  const logoRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(logoRef.current, {
      scale: 0,
      rotation: -180,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    });
  }, []);

  return <div ref={logoRef}>Logo</div>;
}

// Scroll animation
function ScrollReveal({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 100,
      duration: 0.8,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}

// Parallax effect
function ParallaxSection() {
  const bgRef = useRef(null);

  useEffect(() => {
    gsap.to(bgRef.current, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: bgRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }, []);

  return <div ref={bgRef} className="parallax-bg" />;
}

// ALWAYS respect reduced motion
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    gsap.globalTimeline.timeScale(100); // Instant animations
  }
}, []);
```

---

## Accessibility Quick Reference

### Focus Indicators (Required)

```css
/* Every framework MUST have visible focus */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Remove default outline only if replacing */
:focus {
  outline: none;
}
:focus-visible {
  box-shadow: 0 0 0 2px var(--color-background),
              0 0 0 4px var(--color-primary-500);
}
```

### Touch Targets (44×44px Minimum)

```css
/* Buttons and interactive elements */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Icon buttons */
.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Reduced Motion Support (Required)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Quick Decision Matrix

| Need | Use | Framework |
|------|-----|-----------|
| Maximum flexibility | Tailwind CSS | utility-first |
| Google Design Language | Material UI | component library |
| Accessibility priority | Chakra UI | component library |
| Team knows Bootstrap | Bootstrap 5 | component library |
| Enterprise/Asian market | Ant Design | component library |
| Framework-agnostic | CSS Variables | native CSS |
