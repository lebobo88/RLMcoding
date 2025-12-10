# StreetMuse Technology Stack Decisions

**Version**: 1.0.0
**Last Updated**: 2025-12-02

---

## Technology Selection Matrix

### Decision Framework

Each technology choice evaluated on:
1. **Performance** - Mobile-first, 60fps animations, fast load times
2. **Developer Experience** - TypeScript support, documentation, ecosystem
3. **Bundle Size** - Critical for mobile, target < 200KB initial load
4. **Maintenance** - Active development, community support
5. **Scalability** - Can grow from MVP to 100K+ users

---

## Frontend Framework: Next.js 16

### Alternatives Considered
| Framework | Pros | Cons | Score |
|-----------|------|------|-------|
| **Next.js 16** | Server Components, App Router, image optimization, Vercel deployment | Learning curve for App Router | **9/10** |
| Create React App | Simple, familiar | No SSR, deprecated, poor performance | 4/10 |
| Vite + React | Fast dev server, lightweight | Manual SSR setup, no image optimization | 6/10 |
| Remix | Great data loading | Smaller ecosystem, less tooling | 7/10 |

### Decision: Next.js 16

**Rationale**:
- **Server Components** reduce client bundle size (critical for mobile)
- **App Router** enables granular loading states, streaming SSR
- **Built-in Image Optimization** - automatic WebP conversion, lazy loading
- **API Routes** - serverless functions for mentor chat, feed API
- **Vercel Integration** - zero-config deployment, global CDN

**Key Features Used**:
```typescript
// Server Component for initial feed load (no JS sent to client)
export default async function FeedPage() {
  const initialItems = await getFeedItems({ limit: 10 });
  return <Feed initialItems={initialItems} />;
}

// Streaming for mentor chat responses
export async function POST(request: Request) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [...],
  });
  return new Response(stream);
}
```

---

## UI Library: React 19

### Decision: React 19 with Server Components

**Rationale**:
- **Improved hydration** - faster Time to Interactive
- **Server Components** - zero-bundle-impact data fetching
- **Concurrent rendering** - smoother animations, better UX
- **use() hook** - simplified async data handling

**Key Patterns**:
```typescript
// Server Component (no useState, useEffect)
async function FeedItemServer({ id }: { id: string }) {
  const item = await fetchFeedItem(id);
  return <FeedItemClient item={item} />;
}

// Client Component (interactive)
'use client';
function FeedItemClient({ item }: { item: FeedItem }) {
  const [saved, setSaved] = useState(false);
  return (...);
}
```

---

## Language: TypeScript 5.3+

### Decision: TypeScript (Strict Mode)

**Rationale**:
- **Type Safety** - catch errors at compile time, not runtime
- **Better IntelliSense** - autocomplete for better DX
- **Self-documenting** - types serve as inline documentation
- **Refactoring confidence** - rename, restructure safely

**Configuration** (tsconfig.json):
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "target": "ES2022",
    "jsx": "preserve"
  }
}
```

---

## Styling: Tailwind CSS 4

### Alternatives Considered
| Solution | Pros | Cons | Score |
|----------|------|------|-------|
| **Tailwind CSS 4** | Utility-first, JIT, design tokens, small bundle | Verbose HTML | **9/10** |
| Styled Components | CSS-in-JS, scoped styles | Large bundle, runtime cost | 6/10 |
| CSS Modules | Scoped, no runtime | Verbose, no tokens | 5/10 |
| Vanilla CSS | Full control | Maintenance hell | 3/10 |

### Decision: Tailwind CSS 4

**Rationale**:
- **JIT Compilation** - only includes used classes (tiny bundle)
- **Design Tokens** - direct mapping to our design system
- **Mobile-First** - responsive utilities out of the box
- **Dark Mode** - built-in support via `dark:` prefix
- **Custom Plugin** - extend with brutalist shadows, film grain

**Custom Configuration** (tailwind.config.ts):
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
        amber: '#FF9F0A',
        // ... (from tokens.json)
      },
      fontFamily: {
        display: ['Druk Wide', 'Impact', 'sans-serif'],
        mono: ['Courier Prime', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0 0 #0A0A0A',
        'brutal-md': '4px 4px 0 0 #0A0A0A',
        'brutal-lg': '8px 8px 0 0 #0A0A0A',
        'brutal-amber': '4px 4px 0 0 #FF9F0A',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Animation: GSAP 3.12+

### Alternatives Considered
| Solution | Pros | Cons | Score |
|----------|------|------|-------|
| **GSAP 3** | Best performance, ScrollTrigger, timeline control | License for commercial (free Club tier) | **9/10** |
| Framer Motion | React-native API, declarative | Heavier bundle, less performant | 7/10 |
| CSS Animations | Lightest, no JS | Limited control, no scroll triggers | 5/10 |
| Anime.js | Lightweight | Less ecosystem, fewer plugins | 6/10 |

### Decision: GSAP 3.12+ (with ScrollTrigger)

**Rationale**:
- **60fps Performance** - GPU-accelerated, optimized for mobile
- **ScrollTrigger Plugin** - perfect for infinite feed animations
- **Timeline Control** - complex sequences (loading animations)
- **Cross-browser** - consistent behavior everywhere

**Key Plugins**:
- `gsap.core` - base library
- `ScrollTrigger` - scroll-based animations
- `ScrollToPlugin` - smooth scroll to elements

**Example Usage**:
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Feed item reveal on scroll
gsap.from('.feed-item', {
  scrollTrigger: {
    trigger: '.feed-item',
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  },
  opacity: 0,
  y: 50,
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.1,
});
```

---

## State Management: Zustand 4.5+

### Alternatives Considered
| Solution | Pros | Cons | Score |
|----------|------|------|-------|
| **Zustand** | Tiny (1KB), simple API, TypeScript-first | Less ecosystem | **9/10** |
| Redux Toolkit | Battle-tested, devtools | Boilerplate, heavy | 6/10 |
| Jotai | Atomic, modern | Newer, less proven | 7/10 |
| Context API | Built-in | Re-render issues, verbose | 5/10 |

### Decision: Zustand 4.5+

**Rationale**:
- **Tiny Bundle** - 1KB gzipped (critical for mobile)
- **Simple API** - no boilerplate, easy to learn
- **TypeScript-first** - great type inference
- **Devtools** - Redux devtools compatible
- **No Context Provider** - less React tree pollution

**Example Store**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  savedItems: string[];
  theme: 'dark' | 'light';
  addSavedItem: (id: string) => void;
  removeSavedItem: (id: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      savedItems: [],
      theme: 'dark',
      addSavedItem: (id) =>
        set((state) => ({ savedItems: [...state.savedItems, id] })),
      removeSavedItem: (id) =>
        set((state) => ({ savedItems: state.savedItems.filter((i) => i !== id) })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'streetmuse-user',
    }
  )
);
```

---

## Data Fetching: TanStack Query 5

### Decision: TanStack Query (React Query)

**Rationale**:
- **Caching** - automatic, configurable
- **Infinite Scroll** - `useInfiniteQuery` hook built-in
- **Optimistic Updates** - instant UI feedback
- **Background Refetching** - always fresh data
- **TypeScript Support** - excellent types

**Example Hook**:
```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export function useFeed(context?: FeedContext) {
  return useInfiniteQuery({
    queryKey: ['feed', context],
    queryFn: ({ pageParam = 0 }) =>
      fetchFeed({ offset: pageParam, limit: 20, context }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## AI Integration: OpenAI GPT-4

### Decision: OpenAI GPT-4 API

**Rationale**:
- **Best Quality** - most sophisticated responses
- **Fast Streaming** - real-time chat experience
- **System Prompts** - shape mentor personalities
- **Function Calling** - can suggest feed items, challenges

**Mentor System Prompt**:
```typescript
const mentorPrompts = {
  'cartier-bresson': `
    You are Henri Cartier-Bresson, master of the decisive moment.
    Your teaching style is precise, compositional, and patient.
    You emphasize geometry, timing, and the importance of waiting.
    You speak in short, direct sentences.
    You disapprove of cropping and believe in getting it right in-camera.
    Common phrases: "Wait for the geometry to align."
  `,
  // ... other mentors
};

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: mentorPrompts[mentorId] },
    { role: 'user', content: userMessage },
  ],
  stream: true,
});
```

---

## Icons: Lucide React

### Decision: Lucide React (fork of Feather Icons)

**Rationale**:
- **Tree-Shakeable** - only import icons you use
- **Lightweight** - each icon ~1KB
- **Consistent Design** - 2px stroke, outlined style
- **React Components** - TypeScript support
- **Customizable** - size, color, stroke width

**Example**:
```typescript
import { Camera, Heart, Share2, ChevronDown } from 'lucide-react';

<Camera size={24} className="text-silver" strokeWidth={2} />
```

---

## Database: IndexedDB (via Dexie.js)

### Decision: IndexedDB with Dexie.js wrapper

**Rationale**:
- **Client-Side** - no server needed for MVP
- **Offline Support** - works without network
- **Structured Data** - better than localStorage
- **Type-Safe** - Dexie provides TypeScript wrappers

**Schema**:
```typescript
import Dexie, { Table } from 'dexie';

interface SavedItem {
  id: string;
  feedItemId: string;
  savedAt: number;
  notes?: string;
}

class StreetMuseDB extends Dexie {
  savedItems!: Table<SavedItem>;

  constructor() {
    super('StreetMuseDB');
    this.version(1).stores({
      savedItems: '++id, feedItemId, savedAt',
    });
  }
}

export const db = new StreetMuseDB();
```

---

## Testing

### Unit Tests: Jest + React Testing Library

**Rationale**:
- **Industry Standard** - most popular React testing combo
- **User-Centric** - test behavior, not implementation
- **Fast** - jsdom environment, parallel execution

**Example Test**:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedItem } from './FeedItem';

test('saves item when save button clicked', async () => {
  const onSave = jest.fn();
  render(<FeedItem item={mockItem} onSave={onSave} />);

  await userEvent.click(screen.getByRole('button', { name: /save/i }));

  expect(onSave).toHaveBeenCalledWith(mockItem.id);
});
```

### E2E Tests: Playwright

**Rationale**:
- **Cross-Browser** - test Chrome, Safari, Firefox
- **Mobile Simulation** - responsive testing
- **Visual Regression** - screenshot comparison
- **Fast** - parallel execution

**Example Test**:
```typescript
import { test, expect } from '@playwright/test';

test('infinite scroll loads more items', async ({ page }) => {
  await page.goto('/');

  const initialCount = await page.locator('.feed-item').count();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForSelector('.feed-item', { timeout: 5000 });

  const newCount = await page.locator('.feed-item').count();

  expect(newCount).toBeGreaterThan(initialCount);
});
```

---

## Deployment: Vercel

### Decision: Vercel

**Rationale**:
- **Next.js Native** - built by same team
- **Global CDN** - edge functions, low latency
- **Auto-Deploy** - GitHub integration, preview URLs
- **Analytics** - Core Web Vitals, error tracking
- **Zero Config** - works out of the box

**Deployment Config**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url",
    "OPENAI_API_KEY": "@openai_key"
  }
}
```

---

## Monitoring: Sentry + PostHog

### Error Tracking: Sentry

**Rationale**:
- **Source Maps** - readable stack traces
- **Context** - user actions, breadcrumbs
- **Performance** - transaction tracking
- **Alerts** - Slack/email notifications

### Analytics: PostHog

**Rationale**:
- **Privacy-Focused** - GDPR compliant, self-hostable
- **Session Replay** - see user interactions
- **Feature Flags** - A/B testing
- **Funnels** - track user flows

---

## Package Manager: npm

### Decision: npm (over yarn, pnpm)

**Rationale**:
- **Default** - comes with Node.js
- **Stable** - battle-tested
- **Next.js Compatible** - no lockfile conflicts
- **Simple** - one less tool to manage

---

## Summary Table

| Category | Technology | Version | Bundle Impact |
|----------|-----------|---------|---------------|
| Framework | Next.js | 16.1+ | Base |
| UI Library | React | 19+ | Base |
| Language | TypeScript | 5.3+ | 0 (compiles away) |
| Styling | Tailwind CSS | 4.0+ | ~15KB |
| Animations | GSAP | 3.12+ | ~30KB |
| State | Zustand | 4.5+ | 1KB |
| Data Fetching | TanStack Query | 5+ | ~12KB |
| Icons | Lucide React | 0.300+ | ~5KB (5 icons) |
| Database | Dexie.js | 4+ | ~8KB |
| AI | OpenAI | Latest | 0 (server-only) |
| Testing | Jest + Playwright | Latest | 0 (dev-only) |
| Deployment | Vercel | - | - |

**Total Client Bundle**: ~70KB gzipped (well under 200KB target)

---

**Document Version**: 1.0
**Last Updated**: 2025-12-02
