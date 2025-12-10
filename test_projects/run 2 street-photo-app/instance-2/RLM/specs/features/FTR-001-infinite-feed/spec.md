# FTR-001: Infinite Wisdom Feed

**Priority**: P0 (MVP)
**Status**: Approved
**Created**: 2025-12-02

---

## Overview

The Infinite Wisdom Feed is the core experience of StreetMuse—an endlessly scrolling stream of photography wisdom, techniques, quotes, and challenges. It combines the addictive nature of social media feeds with genuine educational value, delivering contextually relevant content that adapts to the user's skill level, location, and time of day.

## User Stories

**As a street photographer**, I want to:
- Scroll through an endless feed of photography tips so I can learn whenever I have spare time
- See content relevant to my current context (time of day, location) so the advice is immediately actionable
- Filter content by photographer or topic so I can focus on what interests me
- Save items for later review so I can build my personal knowledge library

## Acceptance Criteria

### Must Have (P0)
- [ ] Feed displays minimum 20 items on initial load
- [ ] Infinite scroll automatically loads more items when user reaches bottom 80% of page
- [ ] Each feed item displays: photographer name, content type, main content, image (if applicable)
- [ ] Feed maintains 60fps scroll performance on iPhone 12+ devices
- [ ] Items animate into view using GSAP scroll-trigger
- [ ] Save button on each item persists to IndexedDB
- [ ] Feed works offline with cached content (minimum 100 items)
- [ ] Loading states show skeleton screens, not blank pages
- [ ] Error states show retry button with helpful message

### Should Have (P1)
- [ ] Filter by content type (quotes, techniques, challenges)
- [ ] Filter by photographer
- [ ] Contextual sorting (time-aware, location-aware)
- [ ] Pull-to-refresh with custom film-advance animation
- [ ] Magnetic snap-points for easier reading
- [ ] "Jump to top" button after scrolling 3+ screens

### Nice to Have (P2)
- [ ] Swipe gestures (left = save, right = share)
- [ ] Read progress indicator (% of available content consumed)
- [ ] Related items carousel at bottom of each card
- [ ] Haptic feedback on save (mobile only)

---

## Design Requirements

### Visual Design

**Feed Item Anatomy**:
```
┌─────────────────────────────────────┐
│ [Image - 16:9 or 1:1]              │ ← Full-bleed, grayscale filter
│                                     │
│ ┌─────────────────────────────────┐│
│ │ [Gradient Overlay]              ││
│ │                                 ││
│ │ HENRI CARTIER-BRESSON           ││ ← Photographer (mono font)
│ │ Technique • 2 min read          ││ ← Type & read time
│ │                                 ││
│ │ Wait for the geometry to        ││ ← Title/Quote (bold)
│ │ align before you shoot.         ││
│ │                                 ││
│ │ [Save] [Share]                  ││ ← Action buttons
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

**Feed Item Types**:

1. **Quote Card**
   - Large pull quote in Courier Prime font
   - Photographer attribution
   - Historical context (date, location if known)
   - Example image from their work

2. **Technique Card**
   - Title (e.g., "Pre-Focusing for Speed")
   - Step-by-step breakdown (3-5 steps)
   - Before/after comparison images
   - Difficulty badge

3. **Challenge Card**
   - Challenge title
   - Brief description
   - Time estimate
   - CTA button to accept challenge
   - Example photo

4. **Story Card**
   - Behind-the-scenes of famous photo
   - Narrative format
   - Multiple images
   - Pull quotes

5. **Breakdown Card**
   - Famous photo with annotations
   - Compositional elements highlighted
   - Rule of thirds overlay
   - Interactive layer toggle

### Animations

**Scroll Reveal** (GSAP):
```javascript
gsap.from('.feed-item', {
  scrollTrigger: {
    trigger: '.feed-item',
    start: 'top 85%',
    toggleActions: 'play none none reverse',
  },
  opacity: 0,
  y: 60,
  duration: 0.7,
  ease: 'power2.out',
  stagger: 0.1, // Stagger multiple items
});
```

**Loading Animation** (Skeleton):
```typescript
<div className="animate-pulse">
  <div className="h-64 bg-charcoal mb-4" />
  <div className="h-4 bg-ash w-3/4 mb-2" />
  <div className="h-4 bg-ash w-1/2" />
</div>
```

**Save Button** (Brutalist lift):
```javascript
// On click
gsap.to('.save-btn', {
  scale: 1.1,
  boxShadow: '6px 6px 0 0 #FF9F0A',
  duration: 0.15,
});
```

### Responsive Behavior

**Mobile** (< 640px):
- Full-width cards (no margins)
- Single column
- Touch-optimized hit targets (min 48px)
- Bottom navigation bar

**Tablet** (640px - 1024px):
- Max-width 640px, centered
- Slight side margins (16px)
- Desktop-style top navigation

**Desktop** (> 1024px):
- Max-width 720px, centered
- Larger margins (48px)
- Keyboard shortcuts (↑↓ to scroll, S to save, R to refresh)

---

## Technical Implementation

### Data Structure

```typescript
interface FeedItem {
  id: string;
  type: 'quote' | 'technique' | 'challenge' | 'story' | 'breakdown';
  photographer: Photographer;
  content: {
    title?: string;
    body: string; // Markdown supported
    image?: {
      url: string;
      alt: string;
      credit?: string;
    };
    steps?: string[]; // For technique cards
    annotations?: Annotation[]; // For breakdown cards
  };
  metadata: {
    tags: string[]; // ['composition', 'lighting']
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    readTime: number; // Seconds
    createdAt: string;
  };
  context?: {
    timeOfDay?: TimeOfDay[];
    weather?: Weather[];
    location?: LocationType[];
  };
}
```

### API Endpoint

**GET /api/feed**

Query Parameters:
```typescript
{
  offset?: number;         // Default: 0
  limit?: number;          // Default: 20, max: 50
  type?: FeedItemType;     // Filter by type
  photographer?: string;   // Filter by photographer ID
  context?: {
    lat?: number;
    lng?: number;
    time?: string;         // ISO timestamp
  };
}
```

Response:
```typescript
{
  items: FeedItem[];
  hasMore: boolean;
  nextOffset: number;
  total?: number;          // Optional total count
  context?: {
    location?: string;
    timeOfDay?: string;
    suggestions?: string[];
  };
}
```

### Component Structure

```
components/feed/
├── Feed.tsx                  # Main container
├── FeedItem.tsx              # Generic item wrapper
├── FeedItemQuote.tsx         # Quote variant
├── FeedItemTechnique.tsx     # Technique variant
├── FeedItemChallenge.tsx     # Challenge variant
├── FeedItemStory.tsx         # Story variant
├── FeedItemBreakdown.tsx     # Breakdown variant
├── InfiniteScroll.tsx        # Infinite scroll logic
├── FeedFilter.tsx            # Filter UI
├── FeedEmpty.tsx             # Empty state
└── FeedError.tsx             # Error state
```

### Key Hooks

**useInfiniteFeed**:
```typescript
export function useInfiniteFeed(filters?: FeedFilters) {
  return useInfiniteQuery({
    queryKey: ['feed', filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchFeed({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}
```

**useIntersectionObserver** (for infinite scroll):
```typescript
export function useIntersectionObserver(
  elementRef: RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
}
```

**useSaveItem**:
```typescript
export function useSaveItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      await db.savedItems.add({
        feedItemId: itemId,
        savedAt: Date.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['savedItems']);
    },
  });
}
```

### Performance Optimization

**Virtualization** (for long feeds):
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 400, // Estimated item height
  overscan: 5, // Render 5 items above/below viewport
});
```

**Image Lazy Loading**:
```typescript
<Image
  src={item.content.image.url}
  alt={item.content.image.alt}
  width={640}
  height={360}
  loading="lazy"
  placeholder="blur"
  blurDataURL={generateBlurDataURL(item.content.image.url)}
/>
```

**Skeleton Loading**:
```typescript
{isLoading && (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <FeedItemSkeleton key={i} />
    ))}
  </div>
)}
```

---

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate between items and buttons
- **Enter/Space**: Activate buttons (save, share)
- **↑↓**: Scroll feed (optional enhancement)

### Screen Reader
```tsx
<article
  role="article"
  aria-label={`${item.photographer.name}: ${item.content.title}`}
>
  <img alt={item.content.image.alt} />
  <button aria-label={`Save ${item.content.title}`}>
    <Heart />
  </button>
</article>
```

### Focus Management
- Visible focus ring (2px amber outline)
- Focus trap in modals
- Restore focus after modal close

---

## Testing Requirements

### Unit Tests
```typescript
describe('FeedItem', () => {
  it('renders quote variant correctly', () => {
    render(<FeedItem item={mockQuoteItem} />);
    expect(screen.getByText(mockQuoteItem.content.body)).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', async () => {
    const onSave = jest.fn();
    render(<FeedItem item={mockItem} onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(onSave).toHaveBeenCalledWith(mockItem.id);
  });
});
```

### E2E Tests
```typescript
test('infinite scroll loads more items', async ({ page }) => {
  await page.goto('/');

  const initialCount = await page.locator('.feed-item').count();
  expect(initialCount).toBeGreaterThan(0);

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  const newCount = await page.locator('.feed-item').count();
  expect(newCount).toBeGreaterThan(initialCount);
});
```

### Accessibility Tests
```typescript
test('feed has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Avg. Items Viewed** | 10+ per session | PostHog event tracking |
| **Scroll Depth** | 80% reach bottom | Scroll tracking |
| **Save Rate** | 15% of items | Save/view ratio |
| **Load Time** | < 2s (initial) | Lighthouse CI |
| **FPS** | 60fps (scroll) | Chrome DevTools |
| **Bounce Rate** | < 40% | PostHog analytics |

---

## Dependencies

- TanStack Query (infinite queries)
- GSAP + ScrollTrigger (animations)
- Dexie.js (saved items storage)
- Next.js Image (optimization)

---

## Future Enhancements (Post-MVP)

- **Smart Recommendations** - ML-based content ranking
- **User Feedback** - "More like this" / "Less like this"
- **Read Later Queue** - Dedicated "to read" list
- **Collaborative Filtering** - "Users like you also saved..."
- **Audio Narration** - Listen to tips while shooting

---

**Feature Version**: 1.0
**Last Updated**: 2025-12-02
