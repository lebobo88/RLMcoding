# PhotoMuse - Project Constitution

## Instance Configuration
- **Development Port:** 3002
- **Instance ID:** instance-3

## 1. Project Identity

| Attribute | Value |
|-----------|-------|
| Name | PhotoMuse |
| Description | Fine Art Photography Ideas Generator |
| Version | 1.0.0 |
| License | MIT |
| Dev Port | 3002 |

### Core Values
1. **Simplicity** - Minimal complexity, maximum utility
2. **Accessibility** - Works for everyone, everywhere
3. **Inspiration** - Every interaction should spark creativity
4. **Performance** - Instant responses, no loading states

---

## 2. Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |

### Development

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| pnpm | 8+ | Package manager |
| ESLint | 8.x | Linting |
| Prettier | 3.x | Formatting |

### Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| Jest | 29.x | Unit testing |
| React Testing Library | 14.x | Component testing |
| Playwright | 1.x | E2E testing |

---

## 3. Coding Standards

### Principles
1. Write tests before implementation (TDD)
2. Keep functions under 30 lines
3. Prefer composition over inheritance
4. Use meaningful, descriptive names
5. Avoid premature optimization

### TypeScript Rules
```typescript
// Always use explicit types for function parameters and returns
function generateIdea(filter: LocationType): PhotoIdea { ... }

// Use interfaces for objects
interface PhotoIdea {
  id: string;
  subject: string;
  composition: string;
  lighting: string;
  technique: string;
  locations: LocationType[];
}

// Use type for unions/primitives
type LocationType = 'rural' | 'suburban' | 'urban';

// No `any` - use `unknown` if type is truly unknown
```

---

## 4. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `IdeaGenerator.tsx` |
| Hooks | camelCase with `use` prefix | `useFavorites.ts` |
| Utils | camelCase | `shuffleArray.ts` |
| Types | PascalCase | `PhotoIdea.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_FAVORITES` |
| CSS Classes | kebab-case (Tailwind) | `bg-primary-500` |
| Files | kebab-case | `idea-generator.tsx` |
| Test Files | `*.test.ts(x)` | `idea-generator.test.tsx` |

---

## 5. Code Organization

```
photomuse/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (single page app)
│   └── globals.css           # Global styles + Tailwind
├── components/
│   ├── ui/                   # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── filter-toggle.tsx
│   └── features/             # Feature components
│       ├── idea-generator/
│       │   ├── idea-generator.tsx
│       │   └── idea-generator.test.tsx
│       ├── location-filter/
│       │   ├── location-filter.tsx
│       │   └── location-filter.test.tsx
│       └── favorites/
│           ├── favorites-panel.tsx
│           └── favorites-panel.test.tsx
├── hooks/
│   ├── use-favorites.ts
│   └── use-favorites.test.ts
├── lib/
│   ├── ideas.ts              # Idea generation logic
│   ├── storage.ts            # localStorage wrapper
│   └── types.ts              # Shared types
├── data/
│   └── photography-ideas.json
├── tests/
│   └── e2e/
│       ├── idea-generation.spec.ts
│       ├── filtering.spec.ts
│       └── favorites.spec.ts
└── public/
    └── fonts/
```

---

## 6. Testing Standards

### Coverage Requirements
- Minimum: 80% line coverage
- Critical paths: 100% coverage

### Test Structure
```typescript
describe('IdeaGenerator', () => {
  describe('when generate button is clicked', () => {
    it('should display a new photography idea', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Test Priorities
1. User interactions (clicks, inputs)
2. State changes (favorites, filters)
3. Edge cases (empty states, limits)
4. Accessibility (keyboard nav, screen readers)

---

## 7. Documentation Standards

### Required Documentation
- README.md in project root
- JSDoc for exported functions
- Comments for complex logic only

### JSDoc Format
```typescript
/**
 * Generates a random photography idea based on location filter.
 * @param filter - The location type to filter by, or 'all' for no filter
 * @returns A random PhotoIdea matching the filter criteria
 */
export function generateIdea(filter: LocationType | 'all'): PhotoIdea {
  // ...
}
```

---

## 8. Version Control Guidelines

### Branch Naming
- `feature/FTR-XXX-short-description`
- `fix/bug-description`
- `task/TASK-XXX-description`

### Commit Messages
```
type(scope): description

- feat: new feature
- fix: bug fix
- test: adding tests
- refactor: code refactoring
- docs: documentation
- style: formatting
- chore: maintenance
```

### Examples
```
feat(generator): add random idea generation
fix(favorites): handle localStorage quota exceeded
test(filter): add location filter unit tests
```

---

## 9. Deployment & DevOps

### Build Commands
```bash
pnpm install          # Install dependencies
pnpm dev -p 3002      # Start dev server on port 3002
pnpm build            # Production build
pnpm test             # Run unit tests
pnpm test:e2e         # Run Playwright tests
pnpm lint             # Run ESLint
```

### Environment
- No environment variables required
- No secrets management needed
- Static export compatible
- **Development Port: 3002**

---

## 10. Performance Guidelines

### Targets
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 2.0s |
| Lighthouse Performance | > 90 |
| Bundle Size (gzipped) | < 100KB |

### Rules
1. No heavy dependencies (lodash, moment.js)
2. Lazy load non-critical components
3. Use React.memo for expensive renders
4. Optimize images (WebP, proper sizing)

---

## 11. Security Standards

### Client-Side Security
- No eval() or Function constructor
- No innerHTML with user content
- Sanitize localStorage data on read
- No external script loading

### Data Handling
- All data stays in browser
- No PII collection
- No cookies or tracking
- No external API calls

---

## 12. Code Review Checklist

### Before Submitting PR
- [ ] Tests pass locally
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Follows naming conventions
- [ ] Includes tests for new code
- [ ] Updates documentation if needed

### Review Focus Areas
1. Logic correctness
2. Edge case handling
3. Performance implications
4. Accessibility compliance
5. Type safety

---

## 13. Design System Integration

### Design Philosophy
**CREATIVE** - Bold, artistic, visually striking designs that inspire photographers.

### Design Tokens

```typescript
// colors
const colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    500: '#4F46E5',  // Main primary
    600: '#4338CA',
    700: '#3730A3',
  },
  secondary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',  // Main secondary
    600: '#D97706',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    500: '#737373',
    800: '#262626',
    900: '#171717',
  }
};

// typography
const typography = {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    display: ['Playfair Display', 'serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  }
};

// spacing (4px base)
const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
};
```

### Animation Guidelines
- **Tier:** MODERATE (Framer Motion micro-interactions)
- **Duration:** 200-400ms
- **Easing:** ease-out for entrances, ease-in for exits

| Element | Animation | Duration |
|---------|-----------|----------|
| Idea card appear | fadeIn + slideUp | 300ms |
| Filter toggle | background transition | 200ms |
| Favorite heart | scale pulse | 300ms |
| Button hover | scale(1.02) | 150ms |

---

## 14. Accessibility Standards

### Requirements (WCAG 2.1 AA)
- Color contrast: 4.5:1 for text, 3:1 for UI
- Touch targets: 44x44px minimum
- Keyboard navigation: all interactive elements
- Screen reader: semantic HTML, ARIA labels
- Focus indicators: visible focus rings
- Reduced motion: respect `prefers-reduced-motion`

### Implementation
```tsx
// Always include aria-labels for icon-only buttons
<button aria-label="Save to favorites">
  <HeartIcon />
</button>

// Use semantic HTML
<main>
  <section aria-labelledby="generator-heading">
    <h2 id="generator-heading">Generate Ideas</h2>
  </section>
</main>

// Handle reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## 15. API Design Guidelines

Not applicable - this project has no API (static data only).

---

## 16. Error Handling Patterns

### User-Facing Errors
```typescript
// Show friendly error states, not technical messages
function FavoritesError() {
  return (
    <div role="alert" className="text-center p-4">
      <p>Unable to load favorites.</p>
      <button onClick={retry}>Try Again</button>
    </div>
  );
}
```

### Storage Errors
```typescript
// Gracefully handle localStorage limits
export function saveFavorite(idea: PhotoIdea): boolean {
  try {
    const favorites = getFavorites();
    if (favorites.length >= MAX_FAVORITES) {
      return false; // Silently fail, UI handles limit
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites, idea]));
    return true;
  } catch (e) {
    console.error('Failed to save favorite:', e);
    return false;
  }
}
```

---

## 17. Logging & Monitoring

### Development Logging
- Use `console.log` sparingly for debugging
- Remove all console.log before committing
- Use structured logging for errors:

```typescript
console.error('[PhotoMuse]', {
  action: 'saveFavorite',
  error: e.message,
  ideaId: idea.id
});
```

### Production
- No logging in production
- No analytics or tracking
- Error boundaries catch React errors
