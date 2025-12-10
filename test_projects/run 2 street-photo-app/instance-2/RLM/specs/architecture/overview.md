# StreetMuse Architecture Overview

**Version**: 1.0.0
**Last Updated**: 2025-12-02
**Status**: Approved

---

## System Architecture

StreetMuse is a **mobile-first Progressive Web App (PWA)** built with Next.js 16, designed for high performance on mobile devices and optimal offline capabilities.

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js 16 App (React 19 + TypeScript)            │   │
│  │  ┌──────────────┐  ┌──────────────┐                │   │
│  │  │  UI Layer    │  │  State Mgmt  │                │   │
│  │  │ (Components) │  │  (Zustand)   │                │   │
│  │  └──────────────┘  └──────────────┘                │   │
│  │  ┌──────────────┐  ┌──────────────┐                │   │
│  │  │  Animations  │  │  Data Layer  │                │   │
│  │  │  (GSAP)      │  │  (TanStack)  │                │   │
│  │  └──────────────┘  └──────────────┘                │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Service Worker (Offline, Caching)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js API Routes (App Router)                    │   │
│  │  • /api/feed          - Infinite scroll content     │   │
│  │  • /api/mentor        - AI mentor chat              │   │
│  │  • /api/challenge     - Daily challenges            │   │
│  │  • /api/context       - Location/time awareness     │   │
│  │  • /api/journal       - User saves/notes            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      Services Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Content     │  │  AI Service  │  │  Context     │     │
│  │  Service     │  │  (OpenAI)    │  │  Service     │     │
│  │  (CMS)       │  │              │  │  (Geo/Time)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Local       │  │  IndexedDB   │  │  External    │     │
│  │  JSON Files  │  │  (User Data) │  │  APIs        │     │
│  │  (Content)   │  │              │  │  (Weather)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture Principles

### 1. Mobile-First, Offline-Capable
- **Primary Platform**: Mobile web (iOS Safari, Android Chrome)
- **Offline Mode**: Service Worker caches 100+ feed items for offline access
- **Performance**: Aggressive code splitting, lazy loading, image optimization

### 2. Progressive Enhancement
- **Core Functionality**: Works without JavaScript (initial SSR)
- **Enhanced Experience**: GSAP animations, infinite scroll, real-time mentor chat
- **Graceful Degradation**: Falls back to simpler interactions on low-end devices

### 3. Contextual Intelligence
- **Location Awareness**: Geolocation API provides city/neighborhood context
- **Time Awareness**: Time of day triggers relevant tips (golden hour, blue hour)
- **Weather Awareness**: Weather API suggests appropriate shooting conditions

### 4. Scalable Content Architecture
- **Phase 1**: Local JSON files (500+ feed items, 5 mentors)
- **Phase 2**: Headless CMS (Contentful) for dynamic content
- **Phase 3**: Community-generated content (moderated)

---

## Technology Stack

### Frontend

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Framework** | Next.js | 16.1+ | Server Components, App Router, built-in optimization |
| **UI Library** | React | 19+ | Latest features, improved hydration, Server Components |
| **Language** | TypeScript | 5.3+ | Type safety, better DX, fewer runtime errors |
| **Styling** | Tailwind CSS | 4.0+ | Utility-first, design tokens, JIT compilation |
| **Animations** | GSAP | 3.12+ | Professional animations, ScrollTrigger plugin |
| **State** | Zustand | 4.5+ | Lightweight, performant, simpler than Redux |
| **Data Fetching** | TanStack Query | 5+ | Caching, optimistic updates, infinite scroll |
| **Forms** | React Hook Form | 7+ | Performance, validation, low re-renders |
| **Icons** | Lucide React | 0.300+ | Lightweight, tree-shakeable, consistent design |

### Backend/API

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **API Routes** | Next.js API Routes | Serverless, same codebase as frontend |
| **AI Integration** | OpenAI GPT-4 | Mentor chat responses, personalization |
| **Content Storage** | JSON files → Contentful | Start simple, scale to CMS |
| **User Data** | IndexedDB (Dexie.js) | Client-side storage, offline support |
| **Analytics** | PostHog | Privacy-focused, self-hosted option |

### DevOps

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Hosting** | Vercel | Next.js-optimized, global CDN, auto-deploy |
| **CI/CD** | GitHub Actions | Automated tests, linting, preview deploys |
| **Monitoring** | Sentry | Error tracking, performance monitoring |
| **Image CDN** | Cloudflare Images | Automatic optimization, WebP conversion |

---

## Component Architecture

### Folder Structure

```
streetmuse/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (home)/
│   │   │   ├── page.tsx          # Feed (homepage)
│   │   │   └── layout.tsx
│   │   ├── mentor/
│   │   │   └── page.tsx          # Mentor chat
│   │   ├── challenges/
│   │   │   ├── page.tsx          # Challenge list
│   │   │   └── [id]/page.tsx    # Challenge detail
│   │   ├── journal/
│   │   │   └── page.tsx          # Saved items
│   │   ├── api/                  # API routes
│   │   │   ├── feed/route.ts
│   │   │   ├── mentor/route.ts
│   │   │   └── context/route.ts
│   │   └── layout.tsx            # Root layout
│   ├── components/
│   │   ├── ui/                   # Radix UI primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── modal.tsx
│   │   ├── feed/                 # Feed-specific
│   │   │   ├── FeedItem.tsx
│   │   │   ├── InfiniteScroll.tsx
│   │   │   └── FeedFilter.tsx
│   │   ├── mentors/              # Mentor system
│   │   │   ├── MentorCard.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   └── MentorSelector.tsx
│   │   ├── challenges/           # Challenge system
│   │   │   ├── ChallengeCard.tsx
│   │   │   ├── ChallengeSubmission.tsx
│   │   │   └── ChallengeGallery.tsx
│   │   └── shared/               # Shared components
│   │       ├── Layout.tsx
│   │       ├── Header.tsx
│   │       └── Navigation.tsx
│   ├── lib/
│   │   ├── api/                  # API client functions
│   │   ├── stores/               # Zustand stores
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # Utility functions
│   │   └── types/                # TypeScript types
│   ├── data/                     # Content data (Phase 1)
│   │   ├── feed-items.json
│   │   ├── photographers.json
│   │   ├── challenges.json
│   │   └── techniques.json
│   └── styles/
│       └── globals.css           # Tailwind imports, custom styles
├── public/
│   ├── avatars/                  # Photographer avatars
│   ├── examples/                 # Example street photos
│   ├── textures/                 # Film grain, paper textures
│   └── manifest.json             # PWA manifest
├── tests/
│   ├── unit/
│   └── e2e/
└── tailwind.config.ts
```

### Component Design Patterns

**Compound Components** (for complex UI):
```tsx
<FeedItem>
  <FeedItem.Image src="..." />
  <FeedItem.Content>
    <FeedItem.Photographer name="..." />
    <FeedItem.Quote>"..."</FeedItem.Quote>
  </FeedItem.Content>
  <FeedItem.Actions>
    <FeedItem.SaveButton />
    <FeedItem.ShareButton />
  </FeedItem.Actions>
</FeedItem>
```

**Custom Hooks** (for reusable logic):
```tsx
useInfiniteScroll()   // Infinite scroll detection
useMentorChat()       // Mentor AI chat state
useContextAware()     // Location/time/weather context
usePersistedState()   // IndexedDB synced state
useGSAP()            // GSAP animation setup
```

---

## Data Model

### Feed Item

```typescript
interface FeedItem {
  id: string;                        // Unique identifier
  type: FeedItemType;                // 'quote' | 'technique' | 'challenge' | 'story'
  photographer: Photographer;        // Associated photographer
  content: {
    title?: string;
    body: string;                    // Main content (markdown supported)
    image?: {
      url: string;
      alt: string;
      credit?: string;
    };
  };
  metadata: {
    tags: string[];                  // ['composition', 'lighting', 'timing']
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    readTime: number;                // Seconds
    createdAt: string;               // ISO timestamp
  };
  context?: {
    timeOfDay?: ('dawn' | 'morning' | 'noon' | 'afternoon' | 'golden-hour' | 'dusk' | 'night')[];
    weather?: ('sunny' | 'cloudy' | 'rainy' | 'overcast' | 'foggy')[];
    location?: ('urban' | 'suburban' | 'rural' | 'indoor')[];
  };
}

type FeedItemType = 'quote' | 'technique' | 'challenge' | 'story' | 'breakdown';
```

### Photographer (Mentor)

```typescript
interface Photographer {
  id: string;                        // 'cartier-bresson' | 'maier' | ...
  name: string;                      // 'Henri Cartier-Bresson'
  bio: string;                       // Short biography
  avatar: string;                    // Avatar image URL
  color: string;                     // Signature color (from design tokens)
  specialty: string[];               // ['composition', 'decisive-moment']
  era: string;                       // '1930-1970'
  notable: string[];                 // Notable works/achievements
  voiceProfile: {
    tone: string;                    // 'strict', 'empathetic', 'bold'
    style: string;                   // 'prescriptive', 'storytelling'
    signature: string[];             // Common phrases
  };
}
```

### Challenge

```typescript
interface Challenge {
  id: string;
  title: string;                     // 'Capture the Decisive Moment'
  photographer: Photographer;        // Challenge inspired by...
  description: string;               // What to do
  prompts: string[];                 // 3-5 specific prompts
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;                  // Suggested time (minutes)
  example: {
    image: string;
    caption: string;
  };
  acceptanceCriteria: string[];      // What makes a successful submission
  createdAt: string;
}
```

### User Progress (Local Storage)

```typescript
interface UserProgress {
  userId?: string;                   // Optional (if auth added later)
  savedItems: string[];              // Feed item IDs
  completedChallenges: string[];     // Challenge IDs
  mentorHistory: {
    mentorId: string;
    messages: ChatMessage[];
    lastInteraction: string;
  }[];
  preferences: {
    theme: 'dark' | 'light';
    contextAware: boolean;
    notifications: boolean;
  };
  statistics: {
    totalScrollTime: number;         // Minutes
    itemsViewed: number;
    challengesAttempted: number;
  };
}
```

---

## API Design

### Feed API

**Endpoint**: `GET /api/feed`

**Query Parameters**:
```typescript
{
  offset?: number;         // For pagination (default: 0)
  limit?: number;          // Items per page (default: 20)
  type?: FeedItemType;     // Filter by type
  photographer?: string;   // Filter by photographer
  context?: {              // Optional context filtering
    lat?: number;
    lng?: number;
    time?: string;         // ISO timestamp
    weather?: string;
  };
}
```

**Response**:
```typescript
{
  items: FeedItem[];
  hasMore: boolean;
  nextOffset: number;
  contextMetadata?: {
    location: string;      // 'Brooklyn, NY'
    timeOfDay: string;     // 'golden-hour'
    weather: string;       // 'sunny'
  };
}
```

### Mentor Chat API

**Endpoint**: `POST /api/mentor`

**Request Body**:
```typescript
{
  mentorId: string;        // 'cartier-bresson'
  message: string;         // User's question
  context?: {
    recentItems: string[]; // Recently viewed feed items
    location?: string;
    currentChallenge?: string;
  };
}
```

**Response**:
```typescript
{
  response: string;        // Mentor's answer
  relatedItems?: string[]; // Feed item IDs to explore
  suggestedActions?: {
    type: 'challenge' | 'technique' | 'example';
    id: string;
    label: string;
  }[];
}
```

### Context API

**Endpoint**: `GET /api/context`

**Query Parameters**:
```typescript
{
  lat?: number;
  lng?: number;
}
```

**Response**:
```typescript
{
  location: {
    city: string;
    neighborhood?: string;
    type: 'urban' | 'suburban' | 'rural';
  };
  time: {
    current: string;       // ISO timestamp
    timeOfDay: string;     // 'golden-hour'
    sunrise: string;
    sunset: string;
  };
  weather: {
    condition: string;     // 'sunny'
    temperature: number;
    description: string;
  };
  suggestions: {
    feedItems: string[];   // Contextually relevant feed IDs
    tips: string[];        // Context-specific quick tips
  };
}
```

---

## Performance Optimization

### Code Splitting Strategy

```typescript
// Lazy load non-critical features
const MentorChat = lazy(() => import('@/components/mentors/ChatInterface'));
const ChallengeGallery = lazy(() => import('@/components/challenges/ChallengeGallery'));
const Journal = lazy(() => import('@/app/journal/page'));

// Prefetch critical routes
<Link href="/mentor" prefetch={true}>
```

### Image Optimization

```typescript
// Next.js Image component with optimization
<Image
  src="/examples/cartier-bresson-1.jpg"
  alt="..."
  width={640}
  height={480}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 640px) 100vw, 640px"
/>
```

### Caching Strategy

```typescript
// Service Worker cache configuration
{
  'static-v1': {
    urls: ['/', '/manifest.json', '/offline.html'],
    strategy: 'CacheFirst',
    maxAge: 365 * 24 * 60 * 60, // 1 year
  },
  'images-v1': {
    urlPattern: /\.(jpg|png|webp)$/,
    strategy: 'CacheFirst',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  'api-v1': {
    urlPattern: /^\/api\//,
    strategy: 'NetworkFirst',
    maxAge: 5 * 60, // 5 minutes
  },
}
```

---

## Security Considerations

### API Rate Limiting

```typescript
// Rate limit mentor chat to prevent abuse
const RATE_LIMIT = {
  mentor: 20,      // 20 messages per hour
  feed: 100,       // 100 requests per hour
  context: 60,     // 60 requests per hour
};
```

### Content Security Policy

```typescript
// next.config.js
{
  headers: [
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.openai.com",
      ].join('; '),
    },
  ],
}
```

### Input Sanitization

```typescript
// Sanitize all user inputs (mentor chat, journal notes)
import DOMPurify from 'isomorphic-dompurify';

const sanitize = (input: string) => DOMPurify.sanitize(input);
```

---

## Scalability Roadmap

### Phase 1: MVP (Current)
- Static JSON content (500+ items)
- OpenAI API for mentor chat
- Client-side only (no auth)
- Single region deployment

### Phase 2: Growth (3-6 months)
- Headless CMS (Contentful)
- User accounts (optional, OAuth)
- Community submissions (moderated)
- Multi-region CDN

### Phase 3: Scale (6-12 months)
- Custom AI model fine-tuned on photographer writing
- Real-time collaboration features
- Native mobile apps (React Native?)
- Offline-first architecture with sync

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
- Component rendering
- User interactions
- State management
- Utility functions

### Integration Tests (Playwright)
- API routes
- End-to-end flows
- Cross-browser compatibility

### Accessibility Tests (axe-core)
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

### Performance Tests
- Lighthouse CI
- Core Web Vitals monitoring
- Bundle size tracking

---

## Monitoring & Observability

### Metrics to Track

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| **Error Rate** | Sentry | > 1% |
| **P95 Response Time** | Vercel Analytics | > 2000ms |
| **Core Web Vitals** | Lighthouse CI | LCP > 2.5s, CLS > 0.1 |
| **Feed Engagement** | PostHog | < 3 items/session (avg) |
| **Bounce Rate** | PostHog | > 50% |

---

**Document Version**: 1.0
**Last Updated**: 2025-12-02
**Next Review**: 2025-03-02
