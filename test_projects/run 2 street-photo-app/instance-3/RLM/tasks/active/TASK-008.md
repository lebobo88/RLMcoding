# TASK-008: GSAP Animation System & Performance Optimization

## Description
Set up GSAP animation utilities, ScrollTrigger configurations, and performance optimizations.

## Feature
FTR-001, FTR-002, FTR-004 (cross-cutting)

## Acceptance Criteria
- [ ] GSAP utils in lib/animations/ (parallax, transitions, micro-interactions)
- [ ] ScrollTrigger setup for wisdom cards
- [ ] Reduced motion detection and fallbacks
- [ ] Animation performance monitoring (detect if <60fps, reduce complexity)
- [ ] Lazy load GSAP (dynamic import on interaction)
- [ ] Image optimization (next/image with responsive sizes)
- [ ] Bundle analysis (ensure <200KB initial JS)
- [ ] Lighthouse audit (Performance >90, Accessibility >95)
- [ ] Preload critical fonts
- [ ] Prefetch likely next pages

## Dependencies
TASK-001

## Estimated Complexity
Medium (4-5 hours)
