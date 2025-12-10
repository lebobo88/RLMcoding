# StreetMuse Project Constitution

## Project Standards & Technical Guidelines

**Version**: 1.0
**Last Updated**: 2025-12-02
**Project**: StreetMuse
**Instance**: instance-3

---

## Core Principles

### 1. Photography-First Design
Every design decision must honor the spirit of street photography:
- **Simplicity over Complexity**: Street photographers work with minimal gear; our UI should be minimal too
- **Authenticity over Polish**: Embrace imperfection, asymmetry, and raw beauty
- **Observation over Action**: Design for contemplation, not constant interaction
- **History as Foundation**: Reference photography masters in design language and philosophy

### 2. Mobile-First, Always
- Primary development target: Mobile viewports (390x844, 360x800)
- Desktop is enhancement, not requirement
- Touch interactions are primary input method
- Performance optimized for mobile networks

### 3. Accessibility is Non-Negotiable
- WCAG 2.1 AA minimum compliance
- Every feature must work with keyboard navigation
- Every feature must work with screen readers
- Motion must respect `prefers-reduced-motion`
- Color contrast ratios must meet or exceed standards

### 4. Creative Boldness
- Break conventional patterns when it serves the user
- Asymmetry and unconventional layouts are encouraged
- Typography is art, not just communication
- Animation should feel cinematic, not gratuitous

---

## Technical Stack

### Frontend Framework
- **Next.js 16** (App Router)
  - Use Server Components by default
  - Client Components only when needed (interactivity, hooks)
  - File-based routing in `app/` directory
  - Server Actions for mutations

- **React 19**
  - Use hooks for state management
  - Prefer composition over inheritance
  - Keep components small and focused (<200 lines)
  - Use TypeScript for all components

### Language & Type Safety
- **TypeScript 5** (strict mode enabled)
  - No `any` types (use `unknown` if necessary)
  - Interface for object shapes, Type for unions/intersections
  - Proper return types for all functions
  - Use Zod for runtime validation when needed

### Styling
- **Tailwind CSS 4**
  - Utility-first approach
  - Custom theme in `tailwind.config.ts`
  - No inline styles (use Tailwind classes)
  - Use `@apply` sparingly, only for complex repeated patterns
  - CSS Modules for scoped styles when Tailwind limitations hit

### Animation
- **GSAP (GreenSock Animation Platform)**
  - Use ScrollTrigger for scroll-based animations
  - Use Timeline for complex multi-step animations
  - Always provide `prefers-reduced-motion` fallback
  - Target 60fps performance (use `will-change` strategically)
  - Lazy load GSAP plugins to reduce bundle size

### State Management
- **Zustand** for global state
  - Keep stores small and focused
  - Use slices for organization
  - Persist critical state to localStorage
  - No Redux (Zustand is simpler, smaller)

### Data Fetching
- **TanStack Query (React Query)**
  - All API calls use Query hooks
  - Cache frequently accessed data
  - Use optimistic updates for better UX
  - Stale-while-revalidate pattern

### UI Components
- **Radix UI** for accessible primitives
  - Use Radix for complex components (Dialog, Dropdown, Tabs, etc.)
  - Build custom components on top of Radix primitives
  - Never sacrifice accessibility for aesthetics
  - Always test with keyboard navigation

### Icons & Graphics
- **Lucide React** for icons
  - Consistent icon set throughout app
  - Use `size` prop for responsive icons
  - Prefer stroke icons over filled for photography aesthetic

### Fonts
- **Next.js Font Optimization**
  - Self-host fonts (no Google Fonts CDN)
  - Use `next/font` for automatic optimization
  - Font stack: Serif (quotes), Sans (UI), Mono (technical)

---

## Code Quality Standards

### Testing
- **Jest** for unit tests
  - Test all utility functions
  - Test complex component logic
  - Aim for 70%+ coverage on critical paths
  - Mock external dependencies

- **Playwright** for E2E tests (Phase 8)
  - Test critical user flows
  - Test accessibility with axe-core
  - Visual regression tests for design consistency

### TypeScript Standards
```typescript
// GOOD: Explicit types, clear naming
interface MuseCard {
  id: string;
  photographer: string;
  quote: string;
  category: CardCategory;
  imageUrl: string;
  createdAt: Date;
}

// BAD: Any types, unclear naming
interface Card {
  id: any;
  data: any;
  info: string;
}

// GOOD: Return types specified
function filterCardsByCategory(
  cards: MuseCard[],
  category: CardCategory
): MuseCard[] {
  return cards.filter(card => card.category === category);
}

// BAD: No return type
function filterCards(cards, category) {
  return cards.filter(card => card.category === category);
}
```

### React Component Standards
```typescript
// GOOD: Functional, typed, documented
import { FC } from 'react';

interface MuseCardProps {
  card: MuseCard;
  onExpand: (id: string) => void;
  isExpanded?: boolean;
}

/**
 * Displays a single Muse Feed card with photographer quote and image.
 * Supports tap-to-expand for deeper context.
 */
export const MuseCard: FC<MuseCardProps> = ({
  card,
  onExpand,
  isExpanded = false
}) => {
  return (
    <article className="muse-card">
      {/* Component implementation */}
    </article>
  );
};

// BAD: No types, unclear purpose, too large
export function Card({ data }) {
  // 300 lines of mixed concerns
}
```

### File & Folder Structure
```
streetmuse/
├── app/                          # Next.js App Router
│   ├── (root)/                   # Root layout group
│   │   ├── page.tsx              # Home page (Infinite Feed)
│   │   └── layout.tsx            # Root layout
│   ├── assignments/              # Today's Assignment feature
│   │   └── page.tsx
│   ├── library/                  # Street Philosophy Library
│   │   ├── page.tsx              # Library grid
│   │   └── [slug]/               # Article pages
│   │       └── page.tsx
│   ├── trainer/                  # Decisive Moment Trainer
│   │   └── page.tsx
│   ├── meter/                    # Pocket Light Meter
│   │   └── page.tsx
│   └── api/                      # API routes
│       └── cards/
│           └── route.ts
├── components/
│   ├── ui/                       # Base UI components (Radix wrappers)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── feed/                     # Muse Feed specific
│   │   ├── MuseCard.tsx
│   │   ├── FeedContainer.tsx
│   │   └── CardExpanded.tsx
│   ├── whispers/                 # Whispers system
│   │   ├── WhisperIcon.tsx
│   │   └── WhisperOverlay.tsx
│   ├── assignments/              # Assignment components
│   │   ├── AssignmentCard.tsx
│   │   └── CountdownTimer.tsx
│   ├── library/                  # Library components
│   │   ├── BentoGrid.tsx
│   │   └── ArticleReader.tsx
│   └── shared/                   # Shared across features
│       ├── Navigation.tsx
│       └── PhotoFrame.tsx
├── lib/
│   ├── stores/                   # Zustand stores
│   │   ├── feed-store.ts
│   │   └── user-preferences-store.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── use-muse-feed.ts
│   │   └── use-gsap-animation.ts
│   ├── utils/                    # Utility functions
│   │   ├── date.ts
│   │   └── string.ts
│   ├── api/                      # API client functions
│   │   └── cards.ts
│   └── constants/                # Constants
│       ├── photographers.ts
│       └── categories.ts
├── public/
│   ├── images/
│   │   ├── photographers/        # Public domain photos
│   │   └── ui/                   # UI graphics
│   └── fonts/                    # Self-hosted fonts
├── styles/
│   ├── globals.css               # Global styles
│   └── animations.css            # GSAP animation classes
├── types/
│   └── index.ts                  # Shared TypeScript types
├── tailwind.config.ts            # Tailwind configuration
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

### Naming Conventions
- **Files**: kebab-case (`muse-card.tsx`, `use-gsap-animation.ts`)
- **Components**: PascalCase (`MuseCard`, `WhisperIcon`)
- **Functions**: camelCase (`filterCardsByCategory`, `formatDate`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_CARDS_PER_PAGE`, `DEFAULT_CATEGORY`)
- **Types/Interfaces**: PascalCase (`MuseCard`, `CardCategory`)
- **CSS Classes**: kebab-case (`muse-card`, `whisper-overlay`)

---

## Design System Standards

### Color Palette Philosophy
Based on black & white photography with strategic accent colors:
- **Primary**: High-contrast black & white (90/10 split in dark mode)
- **Accent**: Single bold color (film canister yellow, darkroom red, or vintage camera teal)
- **Grays**: 10-step grayscale for depth and texture
- **Photography Textures**: Subtle film grain, light leaks (CSS noise filters)

### Typography Scale
Three font families for distinct purposes:
1. **Editorial Serif** (Quotes, Philosophy): e.g., Fraunces, Crimson Pro
2. **Grotesque Sans** (UI, Navigation): e.g., Inter, Public Sans
3. **Monospace** (Technical, Camera Settings): e.g., JetBrains Mono, IBM Plex Mono

### Spacing System
Based on 4px grid, with generous breathing room:
- **Base**: 4px
- **Scale**: 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64
- **Mobile padding**: Minimum 16px (4 units) from screen edge
- **Desktop max-width**: 1280px (center content, avoid full-bleed text)

### Component States (All 8 Required)
Every interactive component must implement:
1. **Default** - Resting state
2. **Hover** - Mouse over (desktop only, never on mobile)
3. **Focus** - Keyboard focus (visible ring, high contrast)
4. **Active** - Being clicked/pressed
5. **Disabled** - Non-interactive (reduced opacity, no hover)
6. **Loading** - Async operation (spinner, skeleton, film advance)
7. **Error** - Validation/operation failed (red accent, clear message)
8. **Empty** - No content/data (placeholder, onboarding prompt)

### Animation Guidelines (RICH Tier)
- **Duration**: 800-1200ms for contemplative feel (slower than typical apps)
- **Easing**: Custom easing functions inspired by film photography
  - `ease-film-advance`: `cubic-bezier(0.4, 0.0, 0.2, 1)` (mechanical, deliberate)
  - `ease-photo-develop`: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (gradual reveal)
  - `ease-shutter-click`: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (quick bounce)
- **Performance**: Use `transform` and `opacity` for GPU acceleration
- **Reduced Motion**: Always provide instant fallback
  ```typescript
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = prefersReducedMotion ? 0 : 1.2;
  ```

---

## Accessibility Standards

### WCAG 2.1 AA Requirements
- **Color Contrast**:
  - 4.5:1 for body text (minimum 16px)
  - 3:1 for large text (24px+)
  - 3:1 for UI elements (buttons, inputs)
  - 7:1 for AAA compliance (aim for this where possible)

- **Focus Management**:
  - Visible focus indicators on all interactive elements
  - Focus trap in modals/dialogs
  - Logical tab order (follows visual hierarchy)
  - Skip links for keyboard users

- **Screen Reader Support**:
  - Semantic HTML (`<article>`, `<nav>`, `<main>`, `<section>`)
  - ARIA labels for icon-only buttons
  - `alt` text for all images (describe photo content)
  - Live regions for dynamic content (whispers, feed updates)

- **Touch Targets**:
  - Minimum 44×44px for all interactive elements
  - Adequate spacing between targets (8px minimum)
  - Swipe gestures have alternative tap actions

- **Motion Sensitivity**:
  - Respect `prefers-reduced-motion`
  - Disable parallax, scale, and complex animations
  - Instant transitions as fallback
  - Option in settings to disable motion entirely

### Testing Checklist
- [ ] Test with keyboard only (Tab, Enter, Esc)
- [ ] Test with screen reader (NVDA, VoiceOver)
- [ ] Test with 200% font scaling
- [ ] Test with high contrast mode
- [ ] Test with `prefers-reduced-motion`
- [ ] Run axe DevTools audit (0 violations)
- [ ] Run Lighthouse accessibility audit (100 score)

---

## Performance Standards

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **INP (Interaction to Next Paint)**: < 200ms

### Optimization Strategies
- **Images**:
  - Use Next.js `<Image>` component always
  - WebP format with fallback
  - Lazy load below-the-fold images
  - Blur placeholders for smoother loading
  - Optimize public domain photos (resize, compress)

- **Fonts**:
  - Self-host with `next/font`
  - Subset fonts to used characters
  - Preload critical fonts
  - Use `font-display: swap`

- **JavaScript**:
  - Code split by route
  - Lazy load GSAP plugins
  - Dynamic imports for heavy components
  - Tree-shake unused dependencies

- **GSAP Animations**:
  - Use `will-change` strategically (add before animation, remove after)
  - Limit concurrent animations (max 3-4 at once)
  - Use `requestAnimationFrame` for custom animations
  - Profile with Chrome DevTools Performance tab

---

## Version Control & Git Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

Implements: FTR-XXX
Task: TASK-XXX
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, styling (no code change)
- `refactor`: Code restructuring (no behavior change)
- `perf`: Performance improvement
- `test`: Add/update tests
- `chore`: Build, dependencies, tooling

**Examples**:
```
feat(feed): add parallax scroll animation to Muse cards

Implemented GSAP ScrollTrigger for smooth parallax effect.
Photos move at 0.5x speed relative to scroll.
Includes prefers-reduced-motion fallback.

Implements: FTR-001
Task: TASK-003
```

```
fix(whispers): correct positioning on mobile devices

Floating icon was cut off on iPhone SE.
Changed from fixed positioning to sticky.

Implements: FTR-002
Task: TASK-012
```

### Branch Naming
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/FTR-XXX-short-description` - Feature branches
- `fix/TASK-XXX-short-description` - Bug fixes
- `docs/update-readme` - Documentation updates

---

## Security Standards

### Data Handling
- **No Sensitive Data Storage**: No user passwords, payment info (out of scope for V1)
- **LocalStorage**: Only for non-sensitive preferences (theme, last viewed card)
- **Sanitize User Input**: Use DOMPurify for any user-generated content (future)
- **API Security**: Use environment variables for API keys, never commit secrets

### Dependencies
- **Regular Updates**: Run `npm audit` weekly, update dependencies monthly
- **Vulnerability Scanning**: CI/CD pipeline checks for known vulnerabilities
- **Minimal Dependencies**: Question every new package (bundle size, maintenance)

---

## Documentation Standards

### Code Comments
- **Why, not What**: Explain reasoning, not mechanics
- **JSDoc for Public APIs**: Document all exported functions/components
- **Inline for Complexity**: Comment complex algorithms, non-obvious logic
- **No Dead Code**: Remove commented-out code (use Git history)

**Example**:
```typescript
/**
 * Filters Muse cards by category and photographer preference.
 *
 * Uses client-side filtering for instant feedback. In future versions,
 * this will be replaced with server-side filtering for larger datasets.
 *
 * @param cards - All available Muse cards
 * @param filters - User-selected filters
 * @returns Filtered array of cards matching criteria
 */
export function filterMuseCards(
  cards: MuseCard[],
  filters: CardFilters
): MuseCard[] {
  // Implementation
}
```

### README Files
- **Root README**: Project overview, setup instructions, tech stack
- **Component README**: Complex components get dedicated docs
- **API Documentation**: Autogenerate with TypeDoc (future)

---

## Deployment & DevOps

### Environment Configuration
- **Development**: `npm run dev` (port 3005)
- **Staging**: Vercel preview deployments
- **Production**: Vercel production (future)

### Environment Variables
```
# Development (.env.local)
NEXT_PUBLIC_APP_URL=http://localhost:3005
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Production (.env.production)
NEXT_PUBLIC_APP_URL=https://streetmuse.app
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Build Checks
- TypeScript compilation must pass (no errors)
- ESLint must pass (no errors, warnings allowed)
- Tests must pass (unit tests minimum)
- Bundle size must be < 500KB (first load JS)

---

## Content Guidelines

### Photography Content
- **Public Domain Only (V1)**: Use photos from pre-1928 or Creative Commons
- **Attribution**: Always credit photographer, even if public domain
- **Quality**: Minimum 1200px wide, optimized for web
- **Diversity**: Represent global street photography, not just Western

### Written Content
- **Tone**: Inspiring, educational, conversational (not academic)
- **Length**:
  - Feed cards: 50-150 words
  - Assignments: 200-400 words
  - Library articles: 800-1500 words
- **Voice**: Second person ("you"), present tense, active voice
- **Quotes**: Verified, cited, properly attributed

### Master Photographer Quotes
- **Accuracy**: Only use verified quotes (cite source)
- **Context**: Provide historical context when needed
- **Diversity**: Feature female photographers, photographers of color
- **Respect**: Honor legacy, avoid sensationalism

---

## Anti-Patterns to Avoid

### Code Anti-Patterns
- ❌ God Components (>300 lines, multiple concerns)
- ❌ Prop Drilling (use Context or Zustand instead)
- ❌ Inline Styles (use Tailwind or CSS Modules)
- ❌ Any Types (defeats TypeScript purpose)
- ❌ Premature Optimization (profile first, optimize second)
- ❌ Copy-Paste Code (DRY principle)

### Design Anti-Patterns
- ❌ Cluttered UI (embrace white space)
- ❌ Low Contrast Text (accessibility failure)
- ❌ Tiny Touch Targets (frustrating on mobile)
- ❌ Unnecessary Animations (motion should have purpose)
- ❌ Inconsistent Spacing (use spacing system)
- ❌ Generic Stock Photography (use master's authentic work)

### UX Anti-Patterns
- ❌ Auto-Playing Videos/Sounds (user controls media)
- ❌ Infinite Scroll Without Escape (provide landmarks, pagination)
- ❌ Modal Overload (use modals sparingly)
- ❌ Unclear CTAs (buttons should be obvious)
- ❌ Hidden Navigation (make wayfinding easy)

---

## Success Criteria

### Technical Success
- [ ] Lighthouse scores: Performance 90+, Accessibility 100, Best Practices 90+
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] 70%+ test coverage on critical paths
- [ ] Bundle size < 500KB first load
- [ ] All animations 60fps

### Design Success
- [ ] Passes WCAG 2.1 AA audit (axe DevTools)
- [ ] All 8 component states implemented
- [ ] Mobile-first responsive on iPhone SE to iPad Pro
- [ ] Dark mode as default, light mode available
- [ ] Photography aesthetic consistently applied

### User Experience Success
- [ ] App loads in < 3s on 3G connection
- [ ] Smooth scroll at 60fps
- [ ] Intuitive navigation (users find features without help)
- [ ] Emotional response (users describe as "beautiful", "inspiring")
- [ ] Daily habit formation (users return daily)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-02 | Initial constitution for StreetMuse | Claude (RLM Agent) |

---

**This document is the source of truth for all technical and design decisions in the StreetMuse project. All team members must adhere to these standards. Exceptions require documented justification.**
