# TASK-006: Implement Infinite Scroll Feed UI

**Feature**: FTR-001 Infinite Feed
**Priority**: P0
**Estimated Time**: 60 minutes
**Dependencies**: TASK-003, TASK-005

## Description
Build the main feed page with infinite scroll, GSAP animations, and feed item components. This is the core user experience.

## Acceptance Criteria
- [ ] Feed page at `/` (homepage)
- [ ] TanStack Query infinite scroll hook
- [ ] Feed items render with proper styling
- [ ] GSAP scroll-triggered animations
- [ ] Loading skeletons during fetch
- [ ] Intersection Observer triggers next page load
- [ ] Maintains 60fps scroll performance
- [ ] Save button on each item (stores to IndexedDB)
- [ ] Mobile-optimized (full-width cards)

## Implementation

`src/app/page.tsx`:
```typescript
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { FeedItem } from '@/components/feed/FeedItem';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadMoreVisible = useIntersectionObserver(loadMoreRef, {
    threshold: 0.1,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/feed?offset=${pageParam}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch feed');
      return res.json();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
  });

  // Trigger load more when observer fires
  useEffect(() => {
    if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // GSAP animations for feed items
  useEffect(() => {
    const items = document.querySelectorAll('.feed-item');
    items.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 60,
        duration: 0.7,
        ease: 'power2.out',
      });
    });
  }, [data]);

  const allItems = data?.pages.flatMap((page) => page.items) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight p-4">
        <FeedSkeleton count={5} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-midnight">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-display font-bold text-silver mb-8 text-shadow-brutal">
          STREETMUSE
        </h1>

        <div className="space-y-6">
          {allItems.map((item) => (
            <FeedItem key={item.id} item={item} className="feed-item" />
          ))}
        </div>

        {/* Load more trigger */}
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {isFetchingNextPage && <FeedSkeleton count={2} />}
        </div>

        {!hasNextPage && allItems.length > 0 && (
          <p className="text-center text-fog py-8">
            You've reached the end. More wisdom coming soon.
          </p>
        )}
      </div>
    </main>
  );
}
```

`src/components/feed/FeedItem.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSaveItem } from '@/lib/hooks/useSaveItem';
import type { FeedItem as FeedItemType } from '@/lib/types/feed';

interface FeedItemProps {
  item: FeedItemType;
  className?: string;
}

export function FeedItem({ item, className }: FeedItemProps) {
  const { saveItem, isSaved } = useSaveItem(item.id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={`relative bg-charcoal border-2 border-ash overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      {item.content.image && (
        <img
          src={item.content.image.url}
          alt={item.content.image.alt}
          className="w-full h-64 object-cover filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-normal"
        />
      )}

      {/* Content */}
      <div className="p-6">
        <p className="font-mono text-sm text-fog uppercase tracking-wide mb-2">
          {item.photographer} • {item.type}
        </p>

        {item.type === 'quote' && (
          <blockquote className="text-xl font-mono italic text-silver border-l-4 border-amber pl-4 my-4">
            "{item.content.body}"
          </blockquote>
        )}

        {item.type === 'technique' && (
          <div>
            <h3 className="text-2xl font-bold text-silver mb-4">
              {item.content.title}
            </h3>
            <p className="text-silver mb-4">{item.content.body}</p>
            {item.content.steps && (
              <ol className="list-decimal list-inside space-y-2 text-fog">
                {item.content.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <Button
            variant={isSaved ? 'primary' : 'secondary'}
            onClick={() => saveItem()}
            className="flex items-center gap-2"
          >
            <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </article>
  );
}
```

## Files Created
- `src/app/page.tsx`
- `src/components/feed/FeedItem.tsx`
- `src/components/feed/FeedSkeleton.tsx`
- `src/lib/hooks/useIntersectionObserver.ts`
- `src/lib/hooks/useSaveItem.ts`

---

**Status**: Active
