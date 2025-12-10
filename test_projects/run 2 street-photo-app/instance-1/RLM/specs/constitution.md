# StreetMuse Project Constitution

**Version**: 1.0.0
**Established**: 2025-12-02
**Status**: Active

This document defines the technical standards, coding practices, architectural principles, and quality requirements for the StreetMuse project. All code, designs, and decisions must align with these constitutional principles.

---

## 1. Core Values

### 1.1 User-First Design
- **Mobile-native experience**: Every feature must work flawlessly on smartphones (primary device)
- **Accessible by default**: WCAG 2.1 AA compliance is non-negotiable
- **Performance matters**: 60fps animations on modern devices, graceful degradation on older ones
- **Privacy-respecting**: Minimal data collection, no tracking beyond essential analytics

### 1.2 Educational Integrity
- **Accuracy**: All historical content must be fact-checked and properly attributed
- **Respectful**: Honor the legacy of master photographers with proper context
- **Non-commercial purity**: Educational content never mixed with ads (free tier may have ads, but separate from learning content)
- **Credit always**: Every photo, quote, or insight attributed to its source

### 1.3 Technical Excellence
- **TypeScript strict mode**: No `any` types without explicit justification
- **Test coverage**: Minimum 80% coverage for business logic
- **Code reviews**: All PRs require review before merge
- **Documentation**: Public APIs and complex logic must be documented

---

## 2. Technology Stack

### 2.1 Frontend Core

| Technology | Version | Justification |
|------------|---------|---------------|
| **Next.js** | 16.x | App Router for modern React patterns, Server Components, optimal Vercel deployment |
| **React** | 19.x | Latest features (Suspense, Transitions), excellent performance |
| **TypeScript** | 5.x | Type safety, better DX, fewer runtime errors |
| **Tailwind CSS** | 4.x | Utility-first, customizable, optimal for rapid design iteration |
| **GSAP** | 3.x | Industry-standard animation library, performance, rich effects |
| **Framer Motion** | Latest | Simple UI transitions (complements GSAP for micro-interactions) |

### 2.2 State & Data Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | Latest | Lightweight client state (user preferences, UI state) |
| **TanStack Query** | 5.x | Server state caching, automatic refetching, optimistic updates |
| **Dexie.js** | Latest | IndexedDB wrapper for offline content caching |

### 2.3 Backend & Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | Latest | PostgreSQL database, authentication, storage, real-time |
| **Vercel** | Latest | Hosting, Edge Functions, optimal Next.js performance |
| **Plausible** | Latest | Privacy-friendly analytics (GDPR-compliant) |
| **Capacitor** | Latest | Native features (notifications, haptics, sensors) for PWA |

### 2.4 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Linting with Next.js, TypeScript, React rules |
| **Prettier** | Code formatting (auto-format on save) |
| **Husky** | Git hooks for pre-commit linting |
| **Jest** | Unit testing |
| **Playwright** | E2E testing |
| **Storybook** | Component development and documentation |

---

## 3. Coding Standards

### 3.1 TypeScript Guidelines

**Strict Mode Enabled**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Type Conventions**:
- Use `interface` for object shapes (extensible)
- Use `type` for unions, intersections, or mapped types
- Prefix interfaces with `I` only if name collision occurs (e.g., `Window`)
- Export types from `types/` directory for shared types

**Avoid**:
```typescript
// BAD: Using 'any'
const fetchData = (id: any) => { ... }

// GOOD: Proper typing
const fetchData = (id: string): Promise<InsightCard> => { ... }
```

### 3.2 React Component Standards

**Component Structure**:
```typescript
// 1. Imports (grouped: external → internal → types → styles)
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { InsightCard } from '@/types';

// 2. Type definitions
interface InsightCardProps {
  card: InsightCard;
  onSave: (id: string) => void;
  className?: string;
}

// 3. Component (prefer named exports for pages, named or default for components)
export function InsightCardComponent({ card, onSave, className }: InsightCardProps) {
  // 4. Hooks (state, effects, custom hooks)
  const [isSaved, setIsSaved] = useState(false);

  // 5. Event handlers
  const handleSave = () => {
    setIsSaved(true);
    onSave(card.id);
  };

  // 6. Render
  return (
    <div className={className}>
      {/* JSX */}
    </div>
  );
}
```

**Naming Conventions**:
- Components: `PascalCase` (e.g., `InsightCard.tsx`)
- Hooks: `useCamelCase` (e.g., `useInfiniteScroll.ts`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_CACHE_SIZE`)

**Component Size**:
- Max 200 lines per component (split into smaller components if exceeding)
- Max 50 lines per function (extract into helper if exceeding)
- One component per file (exceptions: tightly coupled sub-components)

### 3.3 File Organization

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route groups
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/
│   │   ├── stream/               # Wisdom Stream page
│   │   ├── masters/              # Master profiles
│   │   │   └── [id]/
│   │   ├── library/              # Personal Library
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── insights/
│   │   └── masters/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                       # Base UI components (Button, Card, Input, etc.)
│   ├── insights/                 # Insight card variants
│   ├── masters/                  # Master profile components
│   ├── navigation/               # Nav, tabs, etc.
│   └── shared/                   # Shared components
├── lib/
│   ├── db/                       # Database client, queries
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Helper functions
│   ├── animations/               # GSAP animation utilities
│   └── constants.ts
├── types/
│   ├── insights.ts
│   ├── masters.ts
│   └── index.ts
├── store/                        # Zustand stores
│   ├── userStore.ts
│   └── uiStore.ts
└── styles/
    └── animations.css            # Custom animation keyframes
```

### 3.4 CSS/Tailwind Standards

**Tailwind Usage**:
- Prefer Tailwind utilities over custom CSS (95% of styles)
- Use `@apply` sparingly—only for repeated patterns (3+ occurrences)
- Custom values in `tailwind.config.ts`, not inline (e.g., `bg-darkroom` not `bg-[#1a1a1a]`)

**Responsive Design**:
```typescript
// Mobile-first: default styles are mobile, add breakpoints for larger screens
<div className="
  p-4             // Mobile: 16px padding
  md:p-6          // Tablet: 24px padding
  lg:p-8          // Desktop: 32px padding
">
```

**Dark Mode** (if future addition):
- Use `dark:` prefix for dark mode styles
- Define colors in semantic tokens (e.g., `bg-background`, `text-foreground`)

**Avoid**:
```typescript
// BAD: Inline style objects
<div style={{ backgroundColor: '#1a1a1a', padding: '16px' }}>

// GOOD: Tailwind utilities
<div className="bg-darkroom p-4">
```

### 3.5 Animation Standards

**GSAP Guidelines**:
- Use `gsap.context()` for cleanup in React components
- Scope animations to component lifecycle (useEffect cleanup)
- Respect `prefers-reduced-motion` media query

```typescript
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation logic here
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: 'power3.out'
      });
    }, cardRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return <div ref={cardRef}>Content</div>;
}
```

**Performance Budget**:
- Max 1 GSAP timeline per screen
- Max 3 simultaneous animations on screen
- Disable animations if battery < 20% (via Battery API)

---

## 4. Design System

### 4.1 Color Palette

**Primary Colors** (Film Stock Inspired):
```typescript
// tailwind.config.ts
export const colors = {
  darkroom: {
    DEFAULT: '#0D0D0D',  // Deep black (background)
    100: '#1A1A1A',      // Lighter black (cards)
    200: '#262626',      // Subtle gray (borders)
  },
  kodachrome: {
    DEFAULT: '#E86E3A',  // Warm orange (primary accent)
    light: '#FF8C61',
    dark: '#C65429',
  },
  trix: {
    DEFAULT: '#B8B8B8',  // Silver gray (secondary accent)
    light: '#D4D4D4',
    dark: '#8C8C8C',
  },
  portra: {
    DEFAULT: '#A3C7D6',  // Soft blue (tertiary accent)
    light: '#C1DDE9',
    dark: '#7FA9B8',
  },
  paper: '#F5F5F0',      // Off-white (text on dark)
  red: '#DC2626',         // Error state
  green: '#16A34A',       // Success state
  yellow: '#F59E0B',      // Warning state
};
```

**Semantic Tokens**:
```typescript
background: 'darkroom.DEFAULT',
foreground: 'paper',
primary: 'kodachrome.DEFAULT',
secondary: 'trix.DEFAULT',
accent: 'portra.DEFAULT',
muted: 'darkroom.200',
border: 'darkroom.200',
error: 'red',
success: 'green',
warning: 'yellow',
```

**Color Contrast Requirements**:
- Text on `darkroom`: Use `paper` (contrast ratio 13.5:1 ✅)
- Interactive elements: `kodachrome` or `portra` (contrast ratio 4.5:1+ ✅)
- Test all combinations with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 4.2 Typography

**Font Families**:
- **Primary (Body)**: Inter Variable (clean, readable, optimized for screens)
- **Display (Headings)**: Playfair Display (editorial, photographic magazine aesthetic)
- **Monospace (Code/Technical)**: JetBrains Mono (for any code snippets or technical details)

**Type Scale** (1.250 — Major Third):
```typescript
// tailwind.config.ts
fontSize: {
  xs: ['0.75rem', { lineHeight: '1.5' }],    // 12px
  sm: ['0.875rem', { lineHeight: '1.5' }],   // 14px
  base: ['1rem', { lineHeight: '1.6' }],      // 16px (body default)
  lg: ['1.25rem', { lineHeight: '1.6' }],     // 20px
  xl: ['1.563rem', { lineHeight: '1.4' }],    // 25px
  '2xl': ['1.953rem', { lineHeight: '1.3' }], // 31px
  '3xl': ['2.441rem', { lineHeight: '1.2' }], // 39px
  '4xl': ['3.052rem', { lineHeight: '1.1' }], // 49px (page titles)
}
```

**Font Weights**:
- Regular: 400 (body text)
- Medium: 500 (emphasis)
- Semibold: 600 (subheadings)
- Bold: 700 (headings)

**Usage Guidelines**:
- Body text: `text-base font-normal text-paper`
- Headings: `font-display font-bold text-2xl md:text-3xl lg:text-4xl`
- Labels: `text-sm font-medium text-trix`
- Quotes: `font-display text-xl md:text-2xl italic`

### 4.3 Spacing System

**Base Unit**: 4px (0.25rem)

```typescript
// tailwind.config.ts
spacing: {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}
```

**Layout Guidelines**:
- Container padding: `p-4` (mobile), `md:p-6` (tablet), `lg:p-8` (desktop)
- Card spacing: `space-y-4` (internal), `gap-6` (between cards)
- Section spacing: `mt-12` or `mt-16` (between major sections)

### 4.4 Shadows & Depth

**Shadow Scale** (6 levels):
```typescript
boxShadow: {
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',           // Subtle elevation
  'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',   // Card default
  'md': '0 8px 16px -2px rgba(0, 0, 0, 0.5)',       // Hover state
  'lg': '0 16px 32px -4px rgba(0, 0, 0, 0.6)',      // Modal, popovers
  'xl': '0 24px 48px -8px rgba(0, 0, 0, 0.7)',      // Dramatic emphasis
  'none': 'none',
}
```

**Depth Hierarchy**:
- Base layer: `shadow-none` (background)
- Content cards: `shadow` (default state) → `shadow-md` (hover)
- Modals/Overlays: `shadow-lg`
- Hero elements: `shadow-xl`

### 4.5 Component States

**All interactive components MUST implement 8 states**:

1. **Default**: Resting appearance
2. **Hover**: `hover:bg-darkroom-200 hover:shadow-md` (desktop only)
3. **Focus**: `focus:ring-2 focus:ring-kodachrome focus:outline-none` (visible ring)
4. **Active**: `active:scale-95` (being clicked/pressed)
5. **Disabled**: `disabled:opacity-50 disabled:cursor-not-allowed`
6. **Loading**: Spinner or skeleton, `cursor-wait`
7. **Error**: Red border/background, `border-red focus:ring-red`
8. **Empty**: Placeholder state, muted colors

**Example Button**:
```typescript
<button
  className="
    px-4 py-2 rounded-lg
    bg-kodachrome text-paper font-medium
    shadow transition-all duration-200
    hover:bg-kodachrome-dark hover:shadow-md
    focus:ring-2 focus:ring-kodachrome focus:outline-none
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  "
  disabled={isLoading}
>
  {isLoading ? <Spinner /> : 'Save Insight'}
</button>
```

---

## 5. Accessibility Standards

### 5.1 WCAG 2.1 AA Compliance

**Color Contrast**:
- Normal text (< 18pt): 4.5:1 minimum
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 minimum
- UI components/graphical objects: 3:1 minimum

**Touch Targets**:
- Minimum size: 44×44px (iOS), 48×48px (Android)
- Spacing: 8px minimum between adjacent targets

**Keyboard Navigation**:
- All interactive elements tabbable (native focus order)
- Visible focus indicators (2px ring, high contrast)
- Skip links for repetitive navigation
- Modal traps focus (Escape to close)

**Screen Readers**:
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<button>`
- ARIA labels: `aria-label`, `aria-labelledby`, `aria-describedby`
- Alt text: All images have descriptive `alt` attributes
- Live regions: `aria-live="polite"` for dynamic content updates

**Motion & Animation**:
- Respect `prefers-reduced-motion: reduce`
- Disable GSAP animations if user prefers reduced motion
- Provide alternative static experience (fade-in only, no parallax/scroll effects)

### 5.2 Accessibility Testing

**Manual Checks** (every PR):
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Escape)
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast passes (use browser DevTools)
- [ ] Screen reader announces meaningful content (use VoiceOver/NVDA)

**Automated Tools**:
- **Axe DevTools**: Run on every page before PR
- **Lighthouse**: Accessibility score 95+ required
- **WAVE**: Zero errors allowed

---

## 6. Performance Standards

### 6.1 Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Time until main content visible |
| **FID** (First Input Delay) | < 100ms | Responsiveness to first interaction |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability (no layout jumps) |
| **FCP** (First Contentful Paint) | < 1.8s | Time until first content renders |
| **TTI** (Time to Interactive) | < 3.5s | Time until fully interactive |

### 6.2 Bundle Size Limits

| Asset | Max Size | Notes |
|-------|----------|-------|
| **Initial JS** | 200 KB (gzipped) | Critical path JavaScript |
| **Total JS** | 500 KB (gzipped) | All JavaScript after code splitting |
| **CSS** | 50 KB (gzipped) | Tailwind purged CSS |
| **Images** | 100 KB each | WebP format, lazy loaded |

**Optimization Techniques**:
- Code splitting: Dynamic imports for non-critical routes
- Tree shaking: Ensure unused code is removed
- Image optimization: Next.js `<Image>` component (auto WebP, lazy load)
- Font optimization: Variable fonts, `font-display: swap`

### 6.3 Animation Performance

**60fps Target**:
- Use `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (triggers layout)
- Use `will-change` sparingly (on hover, before animation)

**Testing**:
- Chrome DevTools Performance tab: No dropped frames during animations
- Lighthouse Performance score: 90+

---

## 7. Testing Standards

### 7.1 Test Coverage Requirements

| Type | Minimum Coverage | Tools |
|------|------------------|-------|
| **Unit Tests** | 80% | Jest, React Testing Library |
| **Integration Tests** | 60% | Jest, MSW (Mock Service Worker) |
| **E2E Tests** | Critical paths only | Playwright |

### 7.2 Unit Testing Guidelines

**What to Test**:
- Business logic (data transformations, calculations)
- Utility functions (pure functions)
- Custom hooks (state management, side effects)
- Component behavior (not implementation details)

**What NOT to Test**:
- Third-party libraries (trust they're tested)
- Trivial functions (e.g., `add(a, b) { return a + b }`)
- Styling (use visual regression tests instead)

**Example Unit Test**:
```typescript
// lib/utils/formatDate.test.ts
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats ISO date to human-readable string', () => {
    const date = '2025-12-02T10:30:00Z';
    expect(formatDate(date)).toBe('December 2, 2025');
  });

  it('handles invalid dates gracefully', () => {
    expect(formatDate('invalid')).toBe('Invalid date');
  });
});
```

### 7.3 E2E Testing Guidelines

**Critical User Paths**:
1. Open app → Scroll Wisdom Stream → Save insight → View in Library
2. Tap master name → View profile → Explore gallery
3. Receive Daily Muse notification → Tap → View insight in app
4. Enable Situational Guidance → Select context → View tips

**Playwright Configuration**:
- Test on Chrome, Safari, Firefox (cross-browser)
- Mobile viewports: iPhone 12 Pro (390×844), Pixel 5 (393×851)
- Desktop: 1920×1080

---

## 8. Security Standards

### 8.1 Authentication & Authorization

- Use Supabase Auth (OAuth, Magic Links, Email/Password)
- Never store passwords in plain text (Supabase handles hashing)
- Implement Row-Level Security (RLS) policies in Supabase
- JWT tokens expire after 1 hour (refresh token lasts 30 days)

### 8.2 Data Privacy

- **GDPR Compliance**:
  - Data minimization: Only collect essential data (email, preferences)
  - Right to deletion: Provide "Delete Account" in settings
  - Right to export: Provide "Download My Data" (JSON export)
- **Analytics**:
  - Use Plausible (privacy-friendly, no cookies, no PII)
  - Never track sensitive user actions (saved insights content)

### 8.3 Input Validation

- Validate all user inputs on client AND server
- Sanitize HTML (use DOMPurify for any user-generated content)
- Use prepared statements (Supabase handles SQL injection prevention)

---

## 9. Git Workflow

### 9.1 Branch Strategy

- **Main branch**: `main` (production-ready code only)
- **Feature branches**: `feature/FTR-XXX-short-description`
- **Bug fixes**: `fix/bug-description`
- **Hotfixes**: `hotfix/critical-issue`

### 9.2 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code refactoring (no behavior change)
- `test`: Adding or updating tests
- `chore`: Build process, dependencies

**Example**:
```
feat(FTR-001): implement infinite scroll for Wisdom Stream

- Add GSAP ScrollTrigger for momentum-based scrolling
- Implement card pre-loading (10 ahead, 20 in memory)
- Add loading skeleton for smooth UX

Closes TASK-003
```

### 9.3 Pull Request Requirements

**Before submitting PR**:
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`tsc --noEmit`)
- [ ] Accessibility audit (Axe DevTools)
- [ ] Self-review code diff

**PR Template**:
```markdown
## Description
Brief summary of changes

## Related Issues
Closes TASK-XXX

## Changes Made
- [ ] Change 1
- [ ] Change 2

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added (if applicable)
- [ ] Manual testing completed

## Screenshots (if UI changes)
[Attach screenshots]

## Accessibility
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Color contrast verified
```

---

## 10. Documentation Standards

### 10.1 Code Comments

**When to Comment**:
- Complex algorithms or business logic
- Non-obvious workarounds or hacks
- "Why" not "what" (code should be self-explanatory)

**Bad Comment**:
```typescript
// Increment count by 1
setCount(count + 1);
```

**Good Comment**:
```typescript
// Force re-render to update GSAP scroll positions after dynamic content load
setCount(count + 1);
```

### 10.2 Component Documentation

Use JSDoc for public components:

```typescript
/**
 * InsightCard component displays a single insight from a street photography master.
 *
 * @param card - The insight card data (content, master, type)
 * @param onSave - Callback when user saves the card to their library
 * @param className - Optional additional CSS classes
 *
 * @example
 * ```tsx
 * <InsightCard
 *   card={insightData}
 *   onSave={(id) => console.log('Saved:', id)}
 *   className="mb-6"
 * />
 * ```
 */
export function InsightCard({ card, onSave, className }: InsightCardProps) {
  // ...
}
```

### 10.3 README Files

Every feature directory should have a `README.md`:

```markdown
# Feature: Infinite Wisdom Stream (FTR-001)

## Overview
Brief description of the feature

## Components
- `WisdomStream.tsx`: Main container
- `InsightCard.tsx`: Individual card component
- `CardSkeleton.tsx`: Loading state

## State Management
- Uses TanStack Query for server state
- Zustand store for scroll position persistence

## Key Decisions
- Why we chose GSAP over Framer Motion for scroll
- How infinite scroll caching works
```

---

## 11. Deployment & CI/CD

### 11.1 Deployment Strategy

- **Production**: `main` branch → Vercel (auto-deploy)
- **Staging**: `develop` branch → Vercel preview deployment
- **Preview**: Every PR → Unique Vercel preview URL

### 11.2 Environment Variables

**Required Variables**:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Server-side only

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_AI_ANALYZER=false
```

**Never commit**:
- `.env.local` (local development secrets)
- Add to `.gitignore`

### 11.3 CI/CD Pipeline (GitHub Actions)

**On every PR**:
1. Lint (`npm run lint`)
2. Type check (`tsc --noEmit`)
3. Unit tests (`npm test`)
4. Build verification (`npm run build`)
5. Accessibility audit (Lighthouse CI)

**On merge to main**:
1. Run full test suite (unit + E2E)
2. Build production bundle
3. Deploy to Vercel
4. Run smoke tests on production

---

## 12. Content Management

### 12.1 Content Ownership

- **Content team**: Responsible for insight cards, master profiles (1 FT researcher)
- **Engineering team**: Responsible for content structure, data models
- **Legal team**: Responsible for image licensing, copyright clearance

### 12.2 Content Review Process

**New Insight Card**:
1. Researcher writes card content (Markdown)
2. Fact-checking (verify quotes, dates, techniques)
3. Legal review (image licensing, attribution)
4. Upload to Supabase CMS
5. Engineering review (data structure, rendering)
6. QA testing (display correctly on mobile/desktop)
7. Publish (goes live in Wisdom Stream)

### 12.3 Content Quality Standards

- **Accuracy**: All facts verified against primary sources (books, museum archives)
- **Attribution**: Every photo/quote attributed with source and date
- **Clarity**: Written in plain language (Flesch Reading Ease > 60)
- **Brevity**: Insight cards max 150 words (mobile-friendly)
- **Diversity**: Equal representation across masters (20 cards per master)

---

## 13. Maintenance & Support

### 13.1 Bug Triage Process

**Severity Levels**:
- **P0 (Critical)**: App crashes, data loss, security breach → Fix within 24 hours
- **P1 (High)**: Core feature broken, major UX issue → Fix within 1 week
- **P2 (Medium)**: Minor feature broken, cosmetic issue → Fix within 1 month
- **P3 (Low)**: Edge case, nice-to-have → Backlog

### 13.2 On-Call Rotation

- 1 engineer on-call per week (rotating)
- Monitor Vercel errors, Sentry alerts, user support emails
- Respond to P0 bugs within 4 hours

### 13.3 Technical Debt Management

- Dedicate 20% of sprint capacity to tech debt
- Track debt in GitHub Issues with `tech-debt` label
- Prioritize debt that impacts performance or maintainability

---

## 14. Architectural Principles

### 14.1 Separation of Concerns

- **Presentation Layer**: React components (pure, no business logic)
- **Business Logic**: Custom hooks, utility functions (testable, reusable)
- **Data Layer**: TanStack Query, Supabase client (centralized data fetching)

### 14.2 DRY (Don't Repeat Yourself)

- Extract repeated JSX into components (3+ occurrences)
- Extract repeated logic into hooks or utilities (2+ occurrences)
- Use composition over duplication

### 14.3 KISS (Keep It Simple, Stupid)

- Prefer simple solutions over clever ones
- Avoid premature optimization
- Refactor when complexity becomes evident (not before)

### 14.4 YAGNI (You Aren't Gonna Need It)

- Don't build features "just in case"
- Wait for actual requirement before adding abstraction
- Remove unused code aggressively

---

## 15. Appendix

### 15.1 Approved Third-Party Libraries

| Library | Purpose | Why Approved |
|---------|---------|--------------|
| **clsx** | Conditional classNames | Tiny, standard in React community |
| **date-fns** | Date formatting | Smaller than Moment.js, tree-shakeable |
| **zod** | Schema validation | Type-safe, great DX |
| **react-hot-toast** | Toast notifications | Lightweight, customizable |
| **lucide-react** | Icons | Modern, consistent, optimized |

**Before adding a new library**:
1. Check if native solution exists (don't add library for trivial tasks)
2. Verify bundle size impact (< 20 KB gzipped)
3. Check maintenance status (last commit < 6 months ago)
4. Discuss with team (async approval in Slack)

### 15.2 Prohibited Practices

**Never**:
- Use `any` type without explicit `// @ts-expect-error` comment explaining why
- Commit commented-out code (use git history instead)
- Disable ESLint rules without team discussion
- Hard-code secrets (use environment variables)
- Use `!important` in CSS (fix specificity issue properly)
- Mutate props or state directly (always immutable updates)

### 15.3 Decision-Making Framework

When faced with technical decisions:

1. **Does it align with core values?** (User-first, educational integrity, technical excellence)
2. **Does it improve user experience?** (Performance, accessibility, usability)
3. **Does it simplify or complicate?** (Prefer simplicity)
4. **Is it maintainable long-term?** (Consider future developers)
5. **Does it follow existing patterns?** (Consistency > cleverness)

If unsure, discuss with team in Slack/PR before implementation.

---

**Constitution Status**: Active
**Next Review**: Post-Beta Launch (Month 3)
**Amendments**: Require team consensus (75% approval)
