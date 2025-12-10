# TASK-005: Build Feed API Route

**Feature**: FTR-001 Infinite Feed
**Priority**: P0
**Estimated Time**: 30 minutes
**Dependencies**: TASK-004

## Description
Create Next.js API route to serve feed items with pagination, filtering, and optional context-awareness.

## Acceptance Criteria
- [ ] API route at `/api/feed/route.ts`
- [ ] Supports query params: offset, limit, type, photographer
- [ ] Returns paginated results with `hasMore` and `nextOffset`
- [ ] Filters items by type or photographer if specified
- [ ] TypeScript types for request/response
- [ ] Error handling with appropriate status codes
- [ ] Response time < 100ms (local JSON)

## Implementation

`src/app/api/feed/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import feedItems from '@/data/feed-items.json';
import { FeedItem } from '@/lib/types/feed';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const type = searchParams.get('type');
    const photographer = searchParams.get('photographer');

    let items = feedItems as FeedItem[];

    // Filter by type
    if (type) {
      items = items.filter(item => item.type === type);
    }

    // Filter by photographer
    if (photographer) {
      items = items.filter(item => item.photographer === photographer);
    }

    // Paginate
    const paginatedItems = items.slice(offset, offset + limit);
    const hasMore = offset + limit < items.length;
    const nextOffset = hasMore ? offset + limit : null;

    return NextResponse.json({
      items: paginatedItems,
      hasMore,
      nextOffset,
      total: items.length,
    });
  } catch (error) {
    console.error('Feed API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
```

## Testing
- [ ] Test pagination: `GET /api/feed?offset=0&limit=10`
- [ ] Test filtering: `GET /api/feed?type=quote`
- [ ] Test photographer filter: `GET /api/feed?photographer=cartier-bresson`
- [ ] Verify `hasMore` is correct
- [ ] Test error handling

## Files Created
- `src/app/api/feed/route.ts`

---

**Status**: Active
