# TASK-007: Configure TanStack Query Provider

**Feature**: Foundation
**Priority**: P0
**Estimated Time**: 15 minutes
**Dependencies**: TASK-001

## Description
Set up TanStack Query provider in Next.js App Router for data fetching and caching.

## Acceptance Criteria
- [ ] QueryClient configured with optimal defaults
- [ ] QueryClientProvider wraps app
- [ ] React Query Devtools included (dev only)
- [ ] Caching strategy set (5min stale time)

## Implementation

`src/app/providers.tsx`:
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 30 * 60 * 1000, // 30 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

`src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'StreetMuse | Street Photography Wisdom',
  description: 'Learn from the masters. Infinite scroll of photography wisdom.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Files Created
- `src/app/providers.tsx`
- `src/app/layout.tsx` (modified)

---

**Status**: Active
