# Feature: Master Photographer Profiles (FTR-002)

**Priority**: P0 (Must Have)
**Status**: Active
**Estimated Effort**: 2 weeks

## Overview

Deep-dive profiles for 20+ legendary street photographers with biographies, signature techniques, iconic works, and challenges. Accessed via a visually stunning grid gallery.

## User Stories

1. As a photography student, I want to explore master profiles so that I can learn their unique styles
2. As a visual learner, I want to see example photos with annotations so that I understand techniques
3. As an inspired photographer, I want challenges based on each master so that I can practice their methods

## Acceptance Criteria

- [ ] Master gallery: Grid layout with large portrait photos (3 cols desktop, 2 cols tablet, 1 col mobile)
- [ ] Each profile includes: portrait, biography (200-300 words), birth/death years, nationality
- [ ] Signature techniques section: 3-5 bullet points with visual examples
- [ ] "10 Essential Works" gallery: Clickable thumbnails → full-screen lightbox with analysis
- [ ] Curated quotes section: 5-10 quotes in Playfair Display italic
- [ ] "Shot Like [Master]" challenge card with actionable mission
- [ ] Related insights link: "See all insights from [Master]"
- [ ] Share button: "I'm studying [Master] on StreetMuse" (social share)
- [ ] Parallax scroll: Hero image moves slower than content
- [ ] Smooth page transitions with GSAP

## Technical Implementation

### Data Schema
```sql
CREATE TABLE masters (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  portrait_url TEXT,
  birth_year INTEGER,
  death_year INTEGER,
  nationality TEXT,
  biography TEXT,
  signature_techniques JSONB,
  quotes TEXT[],
  essential_works JSONB[], -- {image_url, title, year, analysis}
  challenge TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
- `GET /api/masters` - List all masters (with portraits)
- `GET /api/masters/{id}` - Full profile details
- `GET /api/insights?master_id={id}` - Insights from specific master

### Components
- `MasterGallery.tsx` - Grid of master portraits
- `MasterProfile.tsx` - Full profile page
- `EssentialWorksGallery.tsx` - Clickable photo grid
- `Lightbox.tsx` - Full-screen image viewer
- `ChallengeCard.tsx` - "Shot Like" mission

### Key Features
- **Parallax Scroll**: Hero image background moves at 0.5x speed
- **GSAP Timeline**: Profile opens with staggered reveals (portrait → bio → techniques → gallery)
- **Image Optimization**: Next.js Image component with blur-up placeholders

## Dependencies
- Next.js Image (optimization)
- GSAP (parallax, timeline animations)
- Lucide React (icons)

## Risks
- **Image licensing**: Need permissions for iconic works → Use public domain or Creative Commons
- **Biography accuracy**: Fact-check all content → Hire photography historian
