# FTR-001: Infinite Wisdom Stream

## Overview
An endlessly scrolling, TikTok-style feed presenting curated street photography wisdom in visually stunning cards with cinematic parallax animations.

## User Stories
- As a street photographer, I want to scroll through bite-sized tips so I can learn during commutes
- As a beginner, I want to see different content types so I stay engaged
- As a user, I want smooth animations so the experience feels premium

## Acceptance Criteria
- [ ] Infinite scroll loads 10 cards at a time
- [ ] 5 card types: Quote, Technique, Composition, History, Challenge
- [ ] Parallax animation on scroll (background slower than foreground)
- [ ] Smooth snap-to-card behavior on mobile
- [ ] Skeleton loading states while fetching
- [ ] Pull-to-refresh with film reel animation
- [ ] Filter by difficulty (beginner/intermediate/advanced)
- [ ] Filter by photographer
- [ ] Card actions: like, bookmark, share
- [ ] Accessible keyboard navigation
- [ ] 60fps scroll performance

## Technical Design
**Route**: `/stream`
**Components**: WisdomStream, WisdomCard (Quote, Technique, Composition, History, Challenge variants)
**Data Source**: Sanity CMS via React Query infinite scroll
**Animation**: GSAP ScrollTrigger for parallax

## Dependencies
None (foundational feature)
