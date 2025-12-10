# FTR-002: Master Photographer Profiles

## Overview
Immersive profiles of legendary street photographers with film-strip galleries, Ken Burns animations, and deep-dive content.

## User Stories
- As a photography student, I want to learn about master photographers so I understand their techniques
- As a user, I want to see their iconic photos so I can study composition
- As a visual learner, I want cinematic presentation so content is engaging

## Acceptance Criteria
- [ ] 10 master photographer profiles for v1.0
- [ ] Profile sections: Hero, Biography, Philosophy, Techniques, Iconic Photos, Quotes
- [ ] Horizontal scroll photo gallery (film-strip metaphor)
- [ ] Ken Burns zoom effect on hero image
- [ ] Photo analysis overlays (composition lines, golden ratio)
- [ ] "If [Master] Shot This Scene" interactive feature (future)
- [ ] Breadcrumb navigation back to list
- [ ] Related wisdom cards at bottom
- [ ] Mobile-optimized horizontal scroll
- [ ] Lazy load images

## Technical Design
**Route**: `/masters` (list), `/masters/[slug]` (detail)
**Components**: MasterList, MasterProfile, PhotoGallery, PhotoAnalysis
**Data Source**: Sanity CMS
**Animation**: GSAP timeline for Ken Burns, ScrollTrigger for reveals

## Dependencies
None
