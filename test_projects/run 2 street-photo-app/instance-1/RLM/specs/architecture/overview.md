# StreetMuse Architecture Overview

**Version**: 1.0.0
**Created**: 2025-12-02

## System Architecture

StreetMuse is a modern, mobile-first Progressive Web Application (PWA) built with Next.js 16 App Router, emphasizing performance, offline capability, and rich animations.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser/PWA)                   │
├─────────────────────────────────────────────────────────┤
│  React 19 UI Layer                                        │
│  ├── App Router Pages (Next.js 16)                       │
│  ├── React Server Components (data fetching)             │
│  ├── Client Components (interactivity, animations)       │
│  └── GSAP Animation Engine                               │
├─────────────────────────────────────────────────────────┤
│  State Management                                         │
│  ├── Zustand (client state: UI, preferences)             │
│  ├── TanStack Query (server state: cache, mutations)     │
│  └── IndexedDB/Dexie (offline persistence)               │
├─────────────────────────────────────────────────────────┤
│  Service Worker (Workbox)                                │
│  ├── Route caching (app shell)                           │
│  ├── API response caching (stale-while-revalidate)       │
│  ├── Image optimization (lazy load)                      │
│  └── Offline fallback                                    │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                  API LAYER (Next.js)                      │
├─────────────────────────────────────────────────────────┤
│  /api/insights     - Insight card CRUD                   │
│  /api/masters      - Master photographer profiles        │
│  /api/library      - User's saved insights               │
│  /api/auth         - Authentication (Supabase)           │
│  /api/guidance     - Contextual guidance logic           │
│  /api/notifications - Daily Muse scheduling              │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│               BACKEND SERVICES (Supabase)                 │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                      │
│  ├── masters (photographer profiles)                     │
│  ├── insights (content cards)                            │
│  ├── users (auth + preferences)                          │
│  ├── saved_insights (user library)                       │
│  └── user_activity (analytics)                           │
├─────────────────────────────────────────────────────────┤
│  Supabase Auth (JWT)                                      │
│  ├── Email/password                                      │
│  ├── Magic links                                         │
│  └── OAuth (Google, Apple)                               │
├─────────────────────────────────────────────────────────┤
│  Supabase Storage (CDN)                                   │
│  ├── Master photos (WebP, optimized)                     │
│  ├── Insight images (example shots)                      │
│  └── User uploads (optional AI analyzer)                 │
├─────────────────────────────────────────────────────────┤
│  Supabase Realtime                                        │
│  └── Live content updates (new insights)                 │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────┤
│  Vercel Edge Functions                                    │
│  ├── Personalization logic (contextual guidance)         │
│  └── Notification triggers (Daily Muse)                  │
├─────────────────────────────────────────────────────────┤
│  Plausible Analytics (Privacy-friendly)                   │
│  └── Pageviews, events, no PII tracking                  │
├─────────────────────────────────────────────────────────┤
│  Capacitor (Native APIs)                                  │
│  ├── Push notifications                                  │
│  ├── Haptic feedback                                     │
│  ├── Device sensors (light, GPS, accelerometer)          │
│  └── Local notifications (Daily Muse)                    │
└─────────────────────────────────────────────────────────┘
```

## Core Principles

### 1. Mobile-First
- Designed for smartphones (primary device)
- Touch-optimized interactions (48px targets)
- Performant animations (60fps on modern devices)
- Offline-capable (Service Worker + IndexedDB)

### 2. Progressive Enhancement
- Server-rendered HTML (SEO, fast initial load)
- Client-side hydration (interactivity)
- Graceful degradation (older browsers, slow networks)

### 3. Performance Budget
- Initial JS: < 200 KB (gzipped)
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### 4. Offline-First
- App shell cached (instant load)
- Content cached (stale-while-revalidate)
- 20 most recent insights cached locally
- Optimistic UI updates (instant feedback)

### 5. Scalability
- Stateless API (horizontal scaling)
- CDN-backed assets (global delivery)
- Database connection pooling (Supabase Pooler)
- Edge caching (Vercel Edge Network)

## Data Flow

### Infinite Scroll (Wisdom Stream)

```
1. User opens app
   ↓
2. Server Component fetches initial 10 insights
   ↓
3. Page renders with SSR content (fast FCP)
   ↓
4. Client hydrates, GSAP initializes
   ↓
5. User scrolls down
   ↓
6. IntersectionObserver detects near-end
   ↓
7. TanStack Query fetches next 10 (from cache or API)
   ↓
8. GSAP animates new cards in (stagger reveal)
   ↓
9. IndexedDB caches insights (offline support)
   ↓
10. Repeat from step 5
```

### Save Insight

```
1. User taps bookmark icon
   ↓
2. Optimistic UI update (instant visual feedback)
   ↓
3. Haptic feedback (native vibration)
   ↓
4. TanStack Query mutation → POST /api/library
   ↓
5. Supabase inserts into saved_insights table
   ↓
6. Response success → update cache
   ↓
7. If error → rollback optimistic update, show toast
```

### Daily Muse Notification

```
1. User enables notifications (Capacitor permission)
   ↓
2. Store preference + timezone in Supabase
   ↓
3. Vercel Cron Job runs daily at 4am UTC
   ↓
4. Query users with notifications enabled
   ↓
5. For each user, calculate local golden hour time
   ↓
6. Schedule notification via Capacitor Local Notifications
   ↓
7. At scheduled time, notification triggers
   ↓
8. User taps → Deep link to specific insight in app
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 (JIT compiler)
- **Animations**: GSAP 3 + Framer Motion
- **State**: Zustand + TanStack Query v5
- **Offline**: Dexie.js (IndexedDB wrapper)

### Backend
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (JWT)
- **Storage**: Supabase Storage (S3-compatible)
- **Realtime**: Supabase Realtime (WebSockets)

### Infrastructure
- **Hosting**: Vercel (Edge Network)
- **CDN**: Vercel CDN + Supabase CDN
- **Analytics**: Plausible (GDPR-compliant)
- **Monitoring**: Vercel Analytics + Sentry

### Native Features
- **Capacitor**: PWA → Native wrapper
  - iOS (App Store distribution)
  - Android (Play Store distribution)

## Security

### Authentication
- JWT tokens (httpOnly cookies)
- Refresh tokens (30-day expiry)
- Row-Level Security (RLS) in Supabase

### API Security
- Rate limiting (100 req/min per IP)
- CORS (whitelist origins)
- Input validation (Zod schemas)
- SQL injection prevention (Supabase prepared statements)

### Data Privacy
- No PII in analytics
- GDPR-compliant (data export, deletion)
- No third-party tracking cookies

## Deployment

### Environments
- **Production**: `main` branch → Vercel (streetmuse.app)
- **Staging**: `develop` branch → Vercel preview
- **Preview**: Every PR → Unique Vercel URL

### CI/CD Pipeline (GitHub Actions)
1. Lint + Type check
2. Unit tests (Jest)
3. Build verification
4. Deploy to Vercel
5. E2E smoke tests (Playwright)

### Rollback Strategy
- Instant rollback via Vercel dashboard
- Database migrations versioned (Supabase migrations)
- Feature flags (environment variables)

## Performance Optimizations

### Images
- WebP format (fallback to JPEG)
- Responsive sizes (`srcset`)
- Lazy loading (IntersectionObserver)
- Blur-up placeholders (LQIP)

### Code Splitting
- Route-based splitting (automatic with Next.js App Router)
- Dynamic imports for heavy components (GSAP, modals)

### Caching Strategy
- **Static assets**: Cache-Control: max-age=31536000 (1 year)
- **API responses**: stale-while-revalidate (60s)
- **HTML pages**: no-cache (always fresh)

### Database
- Connection pooling (Supabase Pooler)
- Indexes on frequently queried columns (master_id, user_id)
- Materialized views for analytics

## Monitoring & Observability

### Metrics
- **Vercel Analytics**: Core Web Vitals (LCP, FID, CLS)
- **Plausible**: User behavior (pageviews, events)
- **Sentry**: Error tracking (JS errors, API failures)

### Alerts
- P0 (Critical): App down → Slack + Email (immediate)
- P1 (High): Error rate > 5% → Slack (30 mins)
- P2 (Medium): Slow API (> 2s) → Email (daily digest)

## Scalability Plan

### Current (MVP)
- 10K users
- 500 insights
- 20 master profiles
- Vercel Hobby tier + Supabase Free tier

### Growth (6 months)
- 100K users
- 2,000 insights
- 50 master profiles
- Vercel Pro tier + Supabase Pro tier
- Read replicas (Supabase)

### Scale (1 year)
- 1M users
- 10,000 insights
- 100 master profiles
- Vercel Enterprise + Supabase Team
- Multi-region deployment
- CDN optimizations
