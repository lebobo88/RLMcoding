# StreetMuse Architecture Overview

## System Architecture

StreetMuse follows a modern **Jamstack architecture** with server-side rendering (SSR) and static generation (SSG) capabilities via Next.js 16.

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Mobile     │  │   Tablet     │  │   Desktop    │     │
│  │  (Primary)   │  │  (Adapted)   │  │  (Optional)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Next.js 16 Application                   │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ App Router (React 19 + Server Components)     │  │   │
│  │  │ - Wisdom Stream (/stream)                     │  │   │
│  │  │ - Master Profiles (/masters/[id])             │  │   │
│  │  │ - Daily Challenges (/challenges)              │  │   │
│  │  │ - Composition Coach (/coach)                  │  │   │
│  │  │ - Journal (/journal)                          │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Client      │  │  Server      │  │   API        │     │
│  │  Components  │  │  Components  │  │   Routes     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                  ↓                  ↓             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Zustand    │  │  React Query │  │  Edge API    │     │
│  │ (Client State│  │(Server State)│  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         Data Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │    Sanity    │  │  Cloudinary  │     │
│  │  (User Data) │  │   (Content)  │  │   (Media)    │     │
│  │              │  │              │  │              │     │
│  │ - Users      │  │ - Masters    │  │ - Images     │     │
│  │ - Progress   │  │ - Wisdom     │  │ - Audio      │     │
│  │ - Journal    │  │ - Challenges │  │              │     │
│  │ - Streaks    │  │ - Quotes     │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Technical Stack

### Frontend (Client)

**Core Framework**:
- **Next.js 16**: React metaframework with App Router
- **React 19**: UI library with React Compiler
- **TypeScript 5**: Type-safe development

**Styling**:
- **Tailwind CSS 4**: Utility-first CSS framework
- **GSAP 3.12+**: Professional animation library
  - ScrollTrigger: Scroll-driven animations
  - ScrollSmoother: Smooth scrolling (optional)
- **Lucide React**: Icon library

**UI Components**:
- **Radix UI**: Headless accessible primitives
- **Custom Components**: Built on Radix with design system tokens

**State Management**:
- **Zustand**: Lightweight client state (user preferences, UI state)
- **TanStack Query (React Query)**: Server state, caching, data fetching
- **React Hook Form**: Form state with Zod validation

**Utilities**:
- **clsx**: Conditional class names
- **tailwind-merge**: Merge Tailwind classes intelligently
- **date-fns**: Date manipulation
- **nuqs**: Type-safe URL query strings

### Backend (Server)

**API Layer**:
- **Next.js API Routes**: Serverless API endpoints
- **Edge Runtime**: Fast, globally distributed API responses (for read-heavy routes)
- **Node.js Runtime**: For compute-heavy operations

**Database**:
- **PostgreSQL**: Primary database (via Vercel Postgres or Supabase)
- **Drizzle ORM**: Type-safe database queries

**Content Management**:
- **Sanity CMS**: Headless CMS for photographer profiles, wisdom cards, challenges
- **Sanity Studio**: Content editing interface (self-hosted at `/studio`)

**Media Storage**:
- **Cloudinary**: Image optimization, transformation, delivery
- **CDN**: Audio file hosting (via Cloudinary or dedicated CDN)

**Authentication** (Future):
- **NextAuth.js**: Authentication library (planned for v2.0 when user accounts are needed)

### DevOps & Deployment

**Hosting**:
- **Vercel**: Primary hosting platform (optimized for Next.js)

**CI/CD**:
- **GitHub Actions**: Automated testing and deployment
- **Vercel Git Integration**: Auto-deploy on push to main

**Monitoring**:
- **Vercel Analytics**: Web Vitals, performance monitoring
- **Sentry**: Error tracking and debugging

**Testing**:
- **Jest**: Unit tests
- **React Testing Library**: Component tests
- **Playwright**: E2E tests
- **axe-core**: Accessibility testing

## Data Architecture

### Database Schema (PostgreSQL)

#### Users Table (Future)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### User Progress Table
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) NOT NULL, -- 'wisdom', 'profile', 'challenge'
  feature_id VARCHAR(255) NOT NULL,  -- e.g., 'cartier-bresson', 'challenge-001'
  progress JSONB NOT NULL,           -- Flexible progress tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Streaks Table
```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Journal Entries Table
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT,
  location VARCHAR(255),
  mood VARCHAR(50),
  weather VARCHAR(50),
  photos JSONB,                      -- Array of photo URLs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Challenge Submissions Table
```sql
CREATE TABLE challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500),
  caption TEXT,
  ai_analysis JSONB,                 -- Composition, light, subject analysis
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Content Schema (Sanity CMS)

#### Master Photographer
```typescript
{
  _type: 'masterPhotographer',
  _id: string,
  name: string,
  slug: { current: string },
  birthYear: number,
  deathYear?: number,
  nationality: string,
  biography: blockContent,
  philosophy: blockContent,
  techniques: string[],
  heroImage: {
    asset: reference,
    alt: string,
    caption: string
  },
  iconicPhotos: Array<{
    image: { asset: reference, alt: string },
    title: string,
    year: number,
    location: string,
    analysis: blockContent
  }>,
  quotes: Array<{
    text: string,
    source: string
  }>
}
```

#### Wisdom Card
```typescript
{
  _type: 'wisdomCard',
  _id: string,
  cardType: 'quote' | 'technique' | 'composition' | 'history' | 'challenge',
  title: string,
  content: blockContent,
  photographer?: reference, // Links to masterPhotographer
  image?: {
    asset: reference,
    alt: string
  },
  tags: string[],
  difficulty?: 'beginner' | 'intermediate' | 'advanced',
  publishedAt: datetime
}
```

#### Daily Challenge
```typescript
{
  _type: 'dailyChallenge',
  _id: string,
  title: string,
  description: blockContent,
  photographer: reference,        // Inspired by which master
  techniques: string[],
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  examplePhotos: Array<{
    image: { asset: reference, alt: string },
    caption: string
  }>,
  startDate: date,
  endDate: date
}
```

## Routing Architecture

### App Router Structure

```
app/
├── layout.tsx                    # Root layout (fonts, providers)
├── page.tsx                      # Home page (hero, onboarding)
├── (main)/                       # Main app route group
│   ├── layout.tsx                # Main layout (nav, footer)
│   ├── stream/
│   │   └── page.tsx              # Wisdom stream (infinite scroll)
│   ├── masters/
│   │   ├── page.tsx              # Master list (grid)
│   │   └── [slug]/
│   │       └── page.tsx          # Master profile (dynamic)
│   ├── challenges/
│   │   ├── page.tsx              # Challenge list
│   │   └── [id]/
│   │       └── page.tsx          # Challenge detail
│   ├── coach/
│   │   └── page.tsx              # Composition coach
│   └── journal/
│       ├── page.tsx              # Journal list
│       └── [id]/
│           └── page.tsx          # Journal entry detail
├── api/
│   ├── wisdom/
│   │   └── route.ts              # GET /api/wisdom (paginated)
│   ├── masters/
│   │   └── [slug]/
│   │       └── route.ts          # GET /api/masters/[slug]
│   ├── challenges/
│   │   ├── route.ts              # GET /api/challenges
│   │   └── submit/
│   │       └── route.ts          # POST /api/challenges/submit
│   └── journal/
│       └── route.ts              # CRUD /api/journal
└── studio/                       # Sanity Studio (content editing)
    └── [[...index]]/
        └── page.tsx
```

## Component Architecture

### Component Hierarchy

```
App
├── RootLayout
│   ├── Providers (Theme, Query, Zustand)
│   └── MainLayout
│       ├── Navigation (Bottom nav mobile, Top nav desktop)
│       ├── Page Content
│       │   ├── WisdomStream
│       │   │   ├── WisdomCard (Quote, Technique, Composition, History)
│       │   │   ├── InfiniteScroll
│       │   │   └── ScrollAnimations (GSAP)
│       │   ├── MasterProfile
│       │   │   ├── ProfileHero (Ken Burns animation)
│       │   │   ├── Biography
│       │   │   ├── PhotoGallery (Horizontal scroll)
│       │   │   └── TechniquesList
│       │   └── ChallengeList
│       │       ├── ChallengeCard
│       │       ├── StreakTracker
│       │       └── BadgeDisplay
│       └── Footer
```

### Shared Components

**UI Primitives** (`components/ui/`):
- Button (8 states)
- Card (wisdom, master, challenge variants)
- Input, Textarea, Select
- Modal, Dialog
- Toast
- Badge
- Avatar
- Skeleton

**Feature Components** (`components/wisdom/`, `components/master/`, etc.):
- WisdomCard
- MasterProfileCard
- ChallengeCard
- JournalEntry
- StreakCounter
- ProgressBar

**Layout Components** (`components/shared/`):
- Navigation
- Header
- Footer
- Sidebar (desktop)

## State Management Strategy

### Client State (Zustand)

**UI State Store**:
```typescript
interface UIStore {
  // Navigation
  isNavOpen: boolean
  toggleNav: () => void

  // Modals
  activeModal: string | null
  openModal: (modal: string) => void
  closeModal: () => void

  // User preferences
  animationsEnabled: boolean
  setAnimations: (enabled: boolean) => void
}
```

**User Preferences Store**:
```typescript
interface PreferencesStore {
  // Display
  reducedMotion: boolean

  // Content filters
  difficultyFilter: 'all' | 'beginner' | 'intermediate' | 'advanced'
  photographerFilter: string[]

  // Setters
  setDifficultyFilter: (level: string) => void
  setPhotographerFilter: (photographers: string[]) => void
}
```

### Server State (TanStack Query)

**Wisdom Stream**:
```typescript
useInfiniteQuery({
  queryKey: ['wisdom', filters],
  queryFn: ({ pageParam = 0 }) => fetchWisdomCards(pageParam, filters),
  getNextPageParam: (lastPage) => lastPage.nextCursor
})
```

**Master Profiles**:
```typescript
useQuery({
  queryKey: ['master', slug],
  queryFn: () => fetchMasterProfile(slug),
  staleTime: 1000 * 60 * 60 // 1 hour (content doesn't change often)
})
```

**Challenges**:
```typescript
useQuery({
  queryKey: ['challenges', 'daily'],
  queryFn: fetchDailyChallenges,
  staleTime: 1000 * 60 * 30 // 30 minutes
})
```

## Animation Architecture

### GSAP Integration

**ScrollTrigger Setup** (`lib/animations/scroll-triggers.ts`):
```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initParallaxCards() {
  gsap.utils.toArray('.wisdom-card').forEach((card: any) => {
    const bg = card.querySelector('.card-background')
    const content = card.querySelector('.card-content')

    gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
    .to(bg, { yPercent: -20, ease: 'none' }, 0)
    .to(content, { yPercent: 10, ease: 'none' }, 0)
  })
}
```

**Micro-interactions** (`lib/animations/micro-interactions.ts`):
```typescript
export function animateButtonHover(button: HTMLElement) {
  gsap.to(button, {
    scale: 1.02,
    boxShadow: '0 20px 25px rgba(232, 168, 124, 0.2)',
    duration: 0.15,
    ease: 'power2.out'
  })
}

export function animateLike(icon: HTMLElement) {
  gsap.timeline()
    .to(icon, { scale: 1.2, duration: 0.2, ease: 'back.out(1.7)' })
    .to(icon, { scale: 1, duration: 0.2, ease: 'power2.inOut' })
}
```

### Reduced Motion Support

```typescript
// lib/utils/motion.ts
export function shouldReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getAnimationDuration(defaultMs: number): number {
  return shouldReduceMotion() ? 50 : defaultMs
}
```

## Performance Optimization Strategy

### Code Splitting

- **Route-based**: Automatic via Next.js App Router
- **Component-based**: Dynamic imports for heavy components

```typescript
const CompositionCoach = dynamic(() => import('@/components/coach/CompositionCoach'), {
  loading: () => <Skeleton />,
  ssr: false // Client-only component (uses camera API)
})
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src={cloudinaryUrl}
  alt={alt}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={lowQualityPlaceholder}
/>
```

### Lazy Loading

- **Images**: `loading="lazy"` on all below-the-fold images
- **Videos**: Load on intersection (IntersectionObserver)
- **GSAP**: Dynamic import, load only when needed

### Caching Strategy

**Static Assets**:
- Cache-Control: `public, max-age=31536000, immutable`

**API Responses**:
- Wisdom cards: `stale-while-revalidate=60, max-age=300` (5 min)
- Master profiles: `stale-while-revalidate=3600, max-age=7200` (2 hr)

**Service Worker** (Future):
- Cache wisdom cards for offline access
- Pre-cache critical routes

## Security Architecture

### API Security

**Rate Limiting**:
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})
```

**Input Validation**:
```typescript
// Zod schemas for all API inputs
const challengeSubmissionSchema = z.object({
  challengeId: z.string().uuid(),
  photoUrl: z.string().url(),
  caption: z.string().max(500)
})
```

**CSRF Protection**:
- Built into NextAuth.js
- CSRF tokens on all mutating requests

### Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.sanity.io;
      style-src 'self' 'unsafe-inline';
      img-src 'self' https://res.cloudinary.com data:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://*.sanity.io;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

## Scalability Considerations

### Horizontal Scaling

- **Vercel Edge Network**: Automatic global distribution
- **Database**: Connection pooling via Vercel Postgres or Supabase
- **CDN**: Cloudinary for media, Vercel for static assets

### Vertical Scaling

- **Database**: PostgreSQL with read replicas (future)
- **Cache Layer**: Redis for frequently accessed data (future)

### Performance Targets

- **Time to Interactive**: < 3s on 3G
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1

---

**Last Updated**: 2025-12-02
**Version**: 1.0.0
