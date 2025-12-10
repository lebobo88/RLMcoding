# Feature: Infinite Wisdom Stream (FTR-001)

**Priority**: P0 (Must Have)
**Status**: Active
**Estimated Effort**: 3 weeks

## Overview

The core feed experience—an endless, vertically-scrolling stream of curated insight cards from street photography masters. Features momentum physics, intelligent pre-loading, and contextual adaptation.

## User Stories

1. As a street photographer, I want to scroll through an infinite feed of insights so that I always have fresh content to learn from
2. As a mobile user, I want smooth, momentum-based scrolling so that the experience feels natural and tactile
3. As an offline user, I want to access previously viewed insights so that I can learn without internet

## Acceptance Criteria

- [ ] Infinite scroll with momentum physics (GSAP ScrollTrigger)
- [ ] Pre-loads 10 cards ahead, maintains 20 in memory
- [ ] Smooth GSAP stagger animations for new cards (fade + slide)
- [ ] 8 card types: Technique, Composition, Quote, Challenge, Before/After, Story, Equipment, Situational
- [ ] Each card shows: type badge, title, content, master name, date/era
- [ ] Save button on each card (bookmark icon)
- [ ] Tap master name → navigate to master profile
- [ ] Loading skeleton while fetching
- [ ] No pagination—truly endless
- [ ] Offline: displays cached cards, shows "offline" indicator
- [ ] Performance: 60fps scroll on iPhone 12+

## Technical Implementation

### Data Schema
```sql
CREATE TABLE insights (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL, -- 'technique', 'composition', 'quote', etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  master_id UUID REFERENCES masters(id),
  image_url TEXT,
  year INTEGER,
  difficulty_level TEXT, -- 'beginner', 'intermediate', 'advanced'
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
- `GET /api/insights?cursor={id}&limit=10` - Paginated fetch (cursor-based)
- `GET /api/insights/{id}` - Single insight detail

### Components
- `WisdomStream.tsx` - Container with infinite scroll logic
- `InsightCard.tsx` - Individual card component
- `CardSkeleton.tsx` - Loading state
- `SaveButton.tsx` - Bookmark action

### Key Logic
```typescript
// Infinite scroll with TanStack Query
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['insights'],
  queryFn: ({ pageParam }) => fetchInsights(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  initialPageParam: null,
});

// IntersectionObserver triggers fetchNextPage when near bottom
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, { threshold: 0.5 });
  // ...
}, [fetchNextPage, hasNextPage]);
```

## Dependencies
- TanStack Query (infinite scroll)
- GSAP ScrollTrigger (momentum, animations)
- Dexie.js (offline caching)
- Lucide React (icons)

## Risks
- **Performance on older devices**: Mitigate with animation degradation
- **Content exhaustion**: User scrolls through all 500 insights → show "You've seen it all" message, loop old content
