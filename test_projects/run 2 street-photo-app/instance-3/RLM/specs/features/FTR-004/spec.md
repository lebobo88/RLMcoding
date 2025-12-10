# FTR-004: Navigation & Core UI

## Overview
Mobile-first bottom navigation with cinematic transitions and consistent layout across all pages.

## User Stories
- As a mobile user, I want thumb-zone navigation so I can use the app one-handed
- As any user, I want consistent UI so I know where things are
- As a user, I want smooth transitions so the app feels polished

## Acceptance Criteria
- [ ] Bottom navigation bar (mobile): Stream, Masters, Challenges, Profile (future)
- [ ] Top navigation bar (desktop): Logo, links, search (future)
- [ ] Floating action buttons for contextual actions
- [ ] Page transitions with fade + scale animation
- [ ] Loading states for all async operations
- [ ] Error boundaries for graceful failures
- [ ] Toast notifications for user feedback
- [ ] Modal dialogs with backdrop blur
- [ ] Accessible focus management
- [ ] Dark theme (only theme for v1.0)

## Technical Design
**Components**: BottomNav, TopNav, Layout, PageTransition, Toast, Modal, FloatingActionButton
**Styling**: Tailwind with design tokens
**Animation**: GSAP for page transitions

## Dependencies
None (foundational)
