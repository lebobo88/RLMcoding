# StreetMuse Project Constitution

## Project Identity

**Name**: StreetMuse
**Tagline**: "Wisdom from the streets, learning that never sleeps"
**Version**: 1.0.0
**Last Updated**: 2025-12-02

## Core Principles

### 1. Learning Over Editing
StreetMuse is NOT a photo editing app. We focus on **pre-shoot coaching** and **creative inspiration**. We help photographers see and capture moments, not fix them afterward.

### 2. Context Over Content
We deliver **the right wisdom at the right moment**—location-aware, time-aware, skill-aware. Generic tips are the enemy. Every piece of content should feel personally relevant.

### 3. Unconventional Over Safe
We break photography app conventions. Our UI is bold, unexpected, and memorable. We choose creative risk over comfortable familiarity.

### 4. Infinite Over Finite
Learning never ends. Our infinite scroll embodies the endless journey of mastering street photography. No courses, no completion rates—just perpetual growth.

### 5. Masters Over Trends
We honor photography history. We learn from Cartier-Bresson, Maier, Winogrand—not Instagram influencers. Timeless techniques over viral gimmicks.

## Technical Standards

### Development Stack

**Core Technologies**:
- **Framework**: Next.js 16.1+ (App Router)
- **UI Library**: React 19+ (with Server Components)
- **Language**: TypeScript 5.3+ (strict mode)
- **Styling**: Tailwind CSS 4.0+ (with custom design tokens)
- **Animations**: GSAP 3.12+ (primary), Framer Motion 11+ (fallback)
- **State Management**: Zustand 4.5+
- **Data Fetching**: TanStack Query 5+
- **Testing**: Jest 29+ (unit), Playwright 1.40+ (E2E)
- **Linting**: ESLint 9+, Prettier 3+

**Database & Backend**:
- **Content CMS**: Local JSON files (phase 1), Contentful (phase 2)
- **AI Integration**: OpenAI GPT-4 API
- **Geolocation**: Browser Geolocation API + IP-based fallback
- **Analytics**: PostHog (privacy-focused)

**Deployment**:
- **Hosting**: Vercel (Next.js optimized)
- **CDN**: Cloudflare Images
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (error tracking), Vercel Analytics (performance)

### Code Quality Standards

#### TypeScript Rules
```typescript
// ✅ GOOD: Explicit types, no any
interface FeedItem {
  id: string;
  type: 'quote' | 'technique' | 'challenge';
  content: string;
  photographer: Photographer;
  metadata: FeedItemMetadata;
}

// ❌ BAD: Implicit any, loose types
function processFeedItem(item: any) { ... }
```

**Requirements**:
- **No implicit `any`** - All parameters and returns must be typed
- **Strict null checks** enabled
- **No unused variables** (enforced by ESLint)
- **Interfaces over types** for object shapes
- **Enums for string literals** when 3+ options exist

#### Component Architecture

**File Structure**:
```
components/
├── ui/                 # Radix UI primitives (Button, Card, Input)
├── feed/               # Feed-specific components (FeedItem, InfiniteScroll)
├── mentors/            # Mentor system components (MentorCard, ChatInterface)
├── challenges/         # Challenge system components (ChallengeCard, Submission)
└── shared/             # Shared components (Layout, Header, Navigation)
```

**Naming Conventions**:
- Components: `PascalCase` (e.g., `FeedItem.tsx`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_FEED_ITEMS`)
- CSS classes: Tailwind utilities (no custom classes unless necessary)

**Component Rules**:
```tsx
// ✅ GOOD: Single responsibility, typed props, exported interface
interface FeedItemProps {
  item: FeedItem;
  onSave: (id: string) => void;
  priority?: 'high' | 'normal';
}

export function FeedItem({ item, onSave, priority = 'normal' }: FeedItemProps) {
  // Max 50 lines per component
  // Extract complex logic to hooks
  return (...)
}

// ❌ BAD: Multiple responsibilities, inline types
export function FeedItem({ item, onSave }: { item: any; onSave: any }) {
  // 200 lines of mixed logic
}
```

**Component State Requirements**:
All interactive components MUST implement **8 states**:
1. **Default** - Resting appearance
2. **Hover** - Mouse over (desktop only, use `@media (hover: hover)`)
3. **Focus** - Keyboard focus (visible focus ring, 2px outline)
4. **Active** - Being clicked/pressed
5. **Disabled** - Non-interactive (opacity 0.5, cursor not-allowed)
6. **Loading** - Async operation (spinner, skeleton, progress bar)
7. **Error** - Validation/operation failure (red border, error message)
8. **Empty** - No content/data (empty state illustration + message)

#### Testing Requirements

**Unit Tests** (Jest + React Testing Library):
- **Coverage Target**: 80%+ for all new code
- **Test File Location**: Co-located with components (`FeedItem.test.tsx`)
- **What to Test**:
  - User interactions (clicks, keyboard)
  - Conditional rendering
  - Edge cases (empty, loading, error)
  - Accessibility (aria labels, keyboard nav)

**E2E Tests** (Playwright):
- **Coverage Target**: All critical user flows
- **Test File Location**: `tests/e2e/`
- **Critical Flows**:
  - Feed scrolling and content loading
  - Mentor chat interaction
  - Challenge submission
  - Saving and unsaving tips

**Accessibility Tests**:
- **Tool**: Axe-core (integrated in Playwright)
- **Standard**: WCAG 2.1 AA
- **Required Checks**: Color contrast, keyboard nav, ARIA labels, focus management

### Design System Standards

#### Color Tokens
```javascript
// Design Philosophy: Dark, cinematic, unconventional
colors: {
  // Primary Palette - Darkroom aesthetic
  'midnight': '#0A0A0A',      // Deep black (primary background)
  'charcoal': '#1C1C1E',      // Elevated surfaces
  'ash': '#2C2C2E',           // Borders, dividers
  'smoke': '#48484A',         // Disabled states
  'fog': '#8E8E93',           // Secondary text
  'silver': '#C7C7CC',        // Primary text
  'paper': '#F2F2F7',         // Inverted text (light mode)

  // Accent Colors - Film photography inspired
  'amber': '#FF9F0A',         // Warning, highlights
  'crimson': '#FF453A',       // Error, urgent actions
  'electric': '#FFD60A',      // Success, achievements
  'cyan': '#64D2FF',          // Links, info

  // Photographer-Specific (Mentor avatars)
  'cartier-bresson': '#3A5A7F', // Classic blue
  'maier': '#6B4E71',           // Vintage purple
  'winogrand': '#8B5A3C',       // Warm brown
  'arbus': '#8B2635',           // Deep red
  'erwitt': '#5A7D5F',          // Muted green
}
```

#### Typography Scale
```javascript
fontFamily: {
  'display': ['Druk Wide', 'Impact', 'sans-serif'],      // Headlines - bold, aggressive
  'mono': ['Courier Prime', 'Courier', 'monospace'],     // Quotes - typewriter feel
  'body': ['Inter', 'system-ui', 'sans-serif'],          // Body text - readable
}

fontSize: {
  'xs': '0.75rem',    // 12px - Metadata, timestamps
  'sm': '0.875rem',   // 14px - Secondary text
  'base': '1.125rem', // 18px - Body (mobile-optimized)
  'lg': '1.25rem',    // 20px - Subheadings
  'xl': '1.5rem',     // 24px - Small headlines
  '2xl': '2rem',      // 32px - Section headlines
  '3xl': '3rem',      // 48px - Hero headlines
  '4xl': '4rem',      // 64px - Landing page only
}
```

#### Spacing System
```javascript
// Based on 4px grid (Tailwind default)
spacing: {
  '1': '0.25rem',   // 4px
  '2': '0.5rem',    // 8px
  '3': '0.75rem',   // 12px
  '4': '1rem',      // 16px - Base unit
  '6': '1.5rem',    // 24px
  '8': '2rem',      // 32px
  '12': '3rem',     // 48px
  '16': '4rem',     // 64px
  '24': '6rem',     // 96px
}
```

#### Animation Guidelines

**GSAP Animations** (RICH tier):
```javascript
// Scroll-triggered reveals
gsap.from('.feed-item', {
  scrollTrigger: {
    trigger: '.feed-item',
    start: 'top 80%',
  },
  opacity: 0,
  y: 50,
  duration: 0.6,
  ease: 'power2.out',
});

// Loading sequence
gsap.timeline()
  .from('.logo', { scale: 0, duration: 0.4 })
  .from('.tagline', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2');
```

**Timing Standards**:
- **Micro-interactions**: 150-250ms (button hovers, focus rings)
- **UI transitions**: 300-400ms (modal open, drawer slide)
- **Page transitions**: 500-700ms (route changes)
- **Scroll animations**: 600-800ms (parallax, reveals)

**Easing Functions**:
- Fast-in, slow-out: `cubic-bezier(0.4, 0, 0.2, 1)` (default)
- Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (playful interactions)
- Smooth: `cubic-bezier(0.25, 0.1, 0.25, 1)` (page transitions)

**Reduced Motion**:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Accessibility Requirements

#### WCAG 2.1 AA Compliance

**Color Contrast**:
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px): 3:1 minimum
- UI components: 3:1 minimum
- Tool: Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Keyboard Navigation**:
- All interactive elements focusable via Tab
- Logical focus order (top-to-bottom, left-to-right)
- Visible focus indicators (2px outline, high contrast)
- Skip links for main content
- No keyboard traps

**Screen Reader Support**:
- Semantic HTML (`<article>`, `<nav>`, `<main>`)
- ARIA labels on all icon buttons
- ARIA live regions for dynamic content (feed updates)
- Alt text on all images (descriptive, not generic)
- Hidden decorative images (`aria-hidden="true"`)

**Touch Targets**:
- Minimum size: 48x48px (mobile)
- Spacing: 8px between targets
- Thumb-friendly zones (bottom 40% of screen)

**Forms**:
- Label on every input (`<label>` or `aria-label`)
- Error messages linked via `aria-describedby`
- Required fields indicated (`aria-required="true"`)
- Real-time validation with debounce (300ms)

### Performance Standards

#### Core Web Vitals

| Metric | Target | Maximum |
|--------|--------|---------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 4.0s |
| **FID** (First Input Delay) | < 100ms | 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.25 |
| **FCP** (First Contentful Paint) | < 1.8s | 3.0s |
| **TTI** (Time to Interactive) | < 3.5s | 7.0s |

#### Bundle Size Targets

- **Initial JS**: < 150KB (gzipped)
- **Initial CSS**: < 50KB (gzipped)
- **Total Initial Load**: < 200KB
- **Code Splitting**: Load non-critical code lazily
- **Tree Shaking**: Remove unused Tailwind classes

#### Image Optimization

- **Format**: WebP (primary), JPEG (fallback)
- **Responsive**: `srcset` with 3-5 sizes
- **Lazy Loading**: `loading="lazy"` on all below-fold images
- **Blur Placeholders**: LQIP (Low Quality Image Placeholder)
- **CDN**: Cloudflare Images for automatic optimization

#### Caching Strategy

```javascript
// Service Worker (PWA)
cache: {
  static: '1 year',          // CSS, JS, fonts
  images: '1 month',         // Feed images
  api: '5 minutes',          // Feed content API
  mentor_chat: 'no-cache',   // Real-time AI responses
}
```

### Security & Privacy

#### Data Collection Policy

**What We Collect**:
- Location (opt-in, rounded to ~500m radius)
- Usage analytics (anonymized, PostHog)
- Saved tips and challenges
- Chat history with mentors

**What We DON'T Collect**:
- Photos taken by user (never uploaded)
- Precise GPS coordinates
- Personal identifiable information (unless account created)
- Third-party tracking cookies

#### Security Requirements

- **HTTPS Only**: Enforce SSL/TLS
- **API Keys**: Store in `.env.local`, never commit
- **Content Security Policy**: Restrict script sources
- **Input Sanitization**: Escape all user inputs
- **Rate Limiting**: 100 req/min per user (mentor chat)

### Git & Deployment Standards

#### Branch Strategy

```
main              # Production-ready code
├── develop       # Integration branch
├── feature/*     # Feature branches (e.g., feature/FTR-001-infinite-feed)
├── fix/*         # Bug fixes (e.g., fix/scroll-jank-ios)
└── release/*     # Release candidates (e.g., release/v1.0.0)
```

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

Implements: FTR-XXX
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(feed): add infinite scroll with GSAP animations

Implemented virtualized infinite scroll with scroll-triggered
GSAP animations for feed items. Achieves 60fps on iPhone 12.

Implements: FTR-001
```

```
fix(mentor): resolve chat input keyboard overlap on iOS

Fixed issue where iOS keyboard overlapped chat input by
adding viewport-height adjustment and scroll-to-bottom.

Fixes: BUG-042
```

#### Deployment Pipeline

```
Push to feature/*
  ↓
GitHub Actions: Lint + Test
  ↓
PR to develop
  ↓
Vercel Preview Deploy
  ↓
Review + Approve
  ↓
Merge to develop
  ↓
Staging Deploy (staging.streetmuse.app)
  ↓
QA Testing
  ↓
Merge to main
  ↓
Production Deploy (streetmuse.app)
```

## Content Guidelines

### Feed Content Principles

**Quality Over Quantity**:
- 1 exceptional tip > 10 mediocre ones
- Every feed item must teach OR inspire (ideally both)
- No filler content—every word earns its place

**Tone & Voice**:
- **Confident but not arrogant** - "Here's what works" vs "You're doing it wrong"
- **Conversational but not casual** - Accessible without being dumbed down
- **Reverent but not stuffy** - Honor masters without academic stuffiness
- **Actionable** - Always include "what to do next"

**Content Mix** (Feed Ratio):
- 40% Techniques (how-to, composition, settings)
- 30% Inspiration (quotes, stories, photo breakdowns)
- 20% Challenges (daily missions, prompts)
- 10% Community (user submissions, discussions)

### Photographer Mentor Voices

**Henri Cartier-Bresson** - Geometry, precision, patience
- "Wait for the geometry to align."
- "There is nothing in this world that does not have a decisive moment."
- Strict, compositional, anti-cropping

**Vivian Maier** - Observation, candidness, invisibility
- "Become part of the scene. They shouldn't notice you're there."
- "The best portraits happen when they forget the camera exists."
- Quiet, empathetic, detail-oriented

**Garry Winogrand** - Energy, chaos, volume
- "Shoot more. Think less. Trust the chaos."
- "You don't capture a moment. You stumble into it."
- Frenetic, bold, experimental

**Diane Arbus** - Emotion, outsiders, unconventional
- "Photograph what makes you uncomfortable."
- "Everyone has a secret. Find it."
- Provocative, introspective, empathetic

**Elliott Erwitt** - Wit, humor, timing
- "Photography is about finding irony in the mundane."
- "If you can make someone smile with a photo, you've won."
- Playful, observant, witty

## Documentation Standards

### Code Documentation

**When to Comment**:
- Complex algorithms (explain "why," not "what")
- Non-obvious design decisions
- Workarounds for browser bugs
- Public API functions (JSDoc)

**When NOT to Comment**:
- Self-explanatory code
- Obvious variable names
- Restating the code in English

**JSDoc Example**:
```typescript
/**
 * Generates a personalized feed based on user context
 * @param userId - User identifier
 * @param context - Current context (location, time, weather)
 * @param options - Feed generation options
 * @returns Paginated feed items
 */
async function generateFeed(
  userId: string,
  context: UserContext,
  options?: FeedOptions
): Promise<PaginatedFeed> { ... }
```

### Feature Documentation

Every feature spec in `RLM/specs/features/FTR-XXX/` must include:
1. **Overview** - What problem does it solve?
2. **User Stories** - As a [role], I want [goal] so that [benefit]
3. **Acceptance Criteria** - Bullet list of must-haves
4. **UI/UX Design** - Wireframes or design spec reference
5. **Technical Approach** - High-level implementation plan
6. **Dependencies** - What needs to exist first?
7. **Success Metrics** - How do we measure success?

## Anti-Patterns to Avoid

### Design Anti-Patterns
❌ Generic photography app blues/whites
❌ Stock photo backgrounds
❌ Skeuomorphic camera controls
❌ Overwhelming feature menus
❌ Modal overload (popups everywhere)

### Code Anti-Patterns
❌ Prop drilling (use context or state management)
❌ God components (> 200 lines, multiple responsibilities)
❌ Magic numbers (use named constants)
❌ Premature optimization
❌ Copy-paste code (DRY principle)

### Content Anti-Patterns
❌ Vague advice ("Be creative!")
❌ Equipment obsession (gear talk)
❌ Gatekeeping ("Real photographers don't...")
❌ Clickbait ("This ONE trick...")
❌ Outdated memes or slang

## Success Criteria

This project is successful when:
1. ✅ Users spend 10+ minutes/day in the feed
2. ✅ 70%+ users return the next day (D1 retention)
3. ✅ 4.5+ star rating on App Store
4. ✅ Users describe UI as "unlike any photography app I've used"
5. ✅ Photographers credit StreetMuse for skill improvement
6. ✅ Zero critical accessibility issues (Axe audit)
7. ✅ 80%+ test coverage maintained
8. ✅ All Core Web Vitals in "Good" range

---

**Constitution Version**: 1.0
**Last Reviewed**: 2025-12-02
**Next Review**: 2025-03-02 (Quarterly)
