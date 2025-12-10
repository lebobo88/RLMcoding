# Product Requirements Document: StreetMuse

## Executive Summary

StreetMuse is a revolutionary mobile-first app that transforms street photography education into an immersive, infinite-scroll experience. Unlike traditional photography apps that focus on editing or camera controls, StreetMuse serves as an always-available AI companion that delivers timely wisdom, techniques, and inspiration from history's greatest street photographers—precisely when you need it.

## Product Vision

Create the world's first **perpetual learning feed** for street photography—a living, breathing scroll of insights that adapts to your location, time of day, skill level, and creative mood. StreetMuse breaks the mold of conventional photography apps by treating learning as a continuous, contextual experience rather than isolated lessons.

## Market Opportunity

### Target Market
- **Primary**: Amateur to intermediate street photographers (ages 25-45)
- **Secondary**: Mobile photography enthusiasts, urban explorers, visual storytellers
- **Market Size**: 50M+ active mobile photographers worldwide, with street photography growing 23% YoY

### Problem Statement

Current photography education apps have critical gaps:
1. **Learning is disconnected from shooting** - Users must context-switch between education and practice
2. **One-size-fits-all content** - No adaptation to location, lighting, or moment
3. **Stale, boring UIs** - Traditional lesson-based interfaces feel like homework
4. **No contextual coaching** - Photographers struggle most when in the field, but apps can't help in real-time
5. **Missing historical wisdom** - Rich lessons from masters like Cartier-Bresson are locked in books

### Solution

StreetMuse delivers:
- **Infinite Scroll Feed** - Endlessly scrolling stream of tips, quotes, examples, techniques
- **AI-Powered Contextual Coaching** - Location-aware, time-aware, weather-aware suggestions
- **Virtual Mentors** - Personified wisdom from Cartier-Bresson, Vivian Maier, Garry Winogrand, and 20+ masters
- **Micro-Learning Moments** - 5-15 second digestible insights designed for in-field consumption
- **Challenge Mode** - Daily photography missions with historical context
- **Visual Storytelling** - Every tip paired with stunning archival and contemporary examples

## User Personas

### Persona 1: "The Urban Explorer" - Marcus, 32
- **Background**: Marketing professional, shoots on weekends in NYC
- **Pain Points**: Loses confidence approaching strangers, struggles with composition in busy scenes
- **Goals**: Capture authentic moments, build portfolio for gallery submission
- **Usage Pattern**: Morning commute scroll (inspiration), weekend shooting (contextual tips)

### Persona 2: "The Mobile-First Creator" - Aisha, 28
- **Background**: Content creator, iPhone-only photographer, travels frequently
- **Pain Points**: Intimidated by "rules," wants to develop unique style
- **Goals**: Create distinctive visual voice, grow Instagram following
- **Usage Pattern**: Late-night learning sessions, on-location quick reference

### Persona 3: "The Retiring Hobbyist" - Robert, 58
- **Background**: Recently retired, newfound passion for photography, shooting in local neighborhoods
- **Pain Points**: Overwhelmed by technical jargon, unsure where to start
- **Goals**: Document community, leave legacy for grandchildren
- **Usage Pattern**: Daily morning reading ritual, afternoon shooting practice

## Core Features

### FTR-001: Infinite Wisdom Feed
**Priority**: P0 (MVP)

An endlessly scrolling, algorithmically curated feed of:
- **Photographer Quotes** - Wisdom from 30+ masters with context
- **Technique Cards** - Visual how-to with before/after examples
- **Composition Breakdowns** - Annotated famous photos showing golden ratio, leading lines
- **Historical Moments** - Stories behind iconic street photos
- **Quick Tips** - 1-sentence actionable advice with icons
- **Challenge Prompts** - "Capture a shadow story in the next hour"

**Unique Twist**: Feed items are **time-aware** (golden hour = lighting tips), **location-aware** (urban = crowd composition), and **skill-aware** (adapts to user level).

### FTR-002: Virtual Mentor System
**Priority**: P0 (MVP)

Personified AI mentors based on legendary photographers:
- **Henri Cartier-Bresson** - Master of decisive moment, composition purist
- **Vivian Maier** - Observer of human nature, expert in candid anonymity
- **Garry Winogrand** - Chaos capture, energy and movement
- **Diane Arbus** - Unconventional subjects, emotional depth
- **Elliott Erwitt** - Wit and humor, timing and irony

Each mentor has:
- Distinct voice and teaching style
- Specialty areas (composition, timing, approach, etc.)
- Interactive "Ask a Master" feature
- Progression system (unlock deeper wisdom as you grow)

**Unique Twist**: Mentors "argue" with each other—Cartier-Bresson might contradict Winogrand's advice, showing multiple valid approaches.

### FTR-003: Context-Aware Smart Coaching
**Priority**: P1 (Post-MVP)

Real-time coaching based on:
- **Time of Day**: Golden hour = lighting techniques, noon = shadow play
- **Weather**: Overcast = portrait opportunities, rain = reflection shots
- **Location Type**: Busy street = anticipation tips, quiet alley = patience advice
- **Movement Speed**: Walking = observational prompts, stationary = scene-building guidance
- **Shooting Frequency**: On a roll = "work the scene" reminders, dry spell = motivational quotes

Delivers push notifications like:
- "Henri says: The light is perfect for long shadows. Look down."
- "Vivian suggests: Crowded metro at 5pm—perfect for candid portraits."

### FTR-004: Daily Challenge System
**Priority**: P1 (Post-MVP)

Photographer-inspired daily missions:
- "Capture the Cartier-Bresson decisive moment"
- "Find Vivian's hidden observer angle"
- "Embrace Winogrand's beautiful chaos"

Each challenge includes:
- Historical context and example
- 3-5 specific prompts
- Community gallery of submissions
- AI feedback on submitted photos
- Difficulty levels (Beginner → Master)

### FTR-005: Technique Deep-Dives
**Priority**: P1 (Post-MVP)

Swipeable, Instagram-story-style tutorials on:
- Pre-focusing techniques
- Working the scene
- Overcoming fear and confidence
- Reading light and shadows
- Gesture and emotion capture
- Background management
- Zone focusing
- Framing and juxtaposition

Each deep-dive includes:
- 5-10 swipeable cards
- Video examples
- Interactive exercises
- Links to relevant feed content

### FTR-006: Personal Photography Journal
**Priority**: P2 (Future)

- Save favorite tips and quotes
- Track photos by location and challenge
- Progress tracking (skills developed)
- Reflection prompts ("What did you learn today?")
- Export journal as PDF or photobook

## Design Requirements

### Design Philosophy: CREATIVE

StreetMuse must **reject conventional photography app aesthetics**. We aim for:

**Visual Language**:
- **Brutalist meets Editorial** - Bold typography, high contrast, asymmetric layouts
- **Analog Photography Nostalgia** - Film grain textures, vintage print borders, archival paper backgrounds
- **Deconstructed Grid** - Bento box layouts, overlapping elements, intentional "broken" alignments
- **Dark Mode Primary** - Moody, cinematic default theme (light mode as high-contrast alternative)

**Color Palette**:
- **NOT typical photography app blues/whites**
- Inspired by darkroom and street aesthetics
- High contrast ratios for outdoor readability
- Unexpected accent colors (burnt orange, electric yellow, deep crimson)

**Typography**:
- **Bold, editorial display fonts** for headlines (unconventional, slightly aggressive)
- **Classic typewriter/monospace fonts** for quotes (evokes historical documentation)
- **Humanist sans-serif** for body text (readable but distinctive)
- Large type scales (18px minimum for mobile body text)

**Interactions**:
- **Kinetic scrolling** with momentum physics
- **Magnetic snap points** in feed
- **Parallax layering** of text over images
- **Gesture-rich** (swipe to save, long-press for context, pinch for focus mode)

### Animation Tier: RICH

Leverage GSAP for:
- **Scroll-triggered animations** - Elements fade/slide into view as you scroll
- **Loading sequences** - Simulated film development effect when app opens
- **Transition cinematics** - Page transitions feel like camera movements (pan, tilt, zoom)
- **Micro-interactions** - Buttons react with exaggerated bounce, mentor avatars subtly animate
- **Infinite scroll magic** - Seamless content injection with smooth crossfades
- **Pull-to-refresh** - Custom animation of film advance mechanism

Animation principles:
- Fast-in, slow-out easing (250-600ms)
- Stagger effects for list items (50ms delays)
- Reduced motion alternatives for accessibility

### Mobile-First Constraints

- **90% of usage will be on mobile** (iOS/Android)
- Thumb-friendly hit targets (minimum 48x48px)
- One-handed scrolling optimized
- Portrait orientation primary (landscape optional)
- Offline-capable (cache feed content)
- Low data mode (text-first, lazy load images)

## Technical Requirements

### Tech Stack
- **Framework**: Next.js 16 with React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Animations**: GSAP (primary), Framer Motion (fallback)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **AI/Content**: OpenAI GPT-4 for mentor responses, custom RAG system for photographer knowledge
- **Geolocation**: Native browser APIs
- **PWA**: Service workers for offline support

### Performance Targets
- **First Contentful Paint**: < 1.5s on 4G
- **Time to Interactive**: < 3s
- **Infinite Scroll FPS**: 60fps constant
- **Animation smoothness**: No jank on iPhone 12+
- **Bundle size**: < 200KB initial JS (code splitting)

### Accessibility Standards
- **WCAG 2.1 AA compliance** minimum
- Color contrast: 4.5:1 for text, 3:1 for UI
- Keyboard navigation: Full app usable without touch
- Screen reader: Semantic HTML, ARIA labels
- Reduced motion: Honors `prefers-reduced-motion`
- Touch targets: 48x48px minimum

## Success Metrics

### North Star Metric
**Daily Active Engagement Time** - Average time spent in feed per day

Target: 12 minutes/day (indicating genuine learning and inspiration)

### Key Performance Indicators

**Acquisition**:
- 10K downloads in first 3 months
- 40% organic (word-of-mouth, App Store discovery)
- 60% paid (Instagram ads, photography community partnerships)

**Engagement**:
- 60% DAU/MAU ratio (daily active / monthly active)
- 5+ feed scrolls per session
- 2+ mentor interactions per week
- 80% completion rate on daily challenges

**Retention**:
- 70% D1 retention (return next day)
- 45% D7 retention (return after 1 week)
- 30% D30 retention (return after 1 month)

**Quality**:
- 4.5+ star rating on App Store
- < 2% crash rate
- 90%+ positive sentiment in reviews

## Go-To-Market Strategy

### Launch Phases

**Phase 1: Closed Beta (Month 1-2)**
- 500 invited users from photography communities (Reddit r/streetphotography, Facebook groups)
- Heavy feedback collection
- Ambassador program (10 influential street photographers)

**Phase 2: Public Launch (Month 3)**
- App Store + Google Play release
- Press outreach (PetaPixel, DIY Photography, Fstoppers)
- Launch video featuring app's unique UI
- Limited-time free premium access

**Phase 3: Growth (Month 4-6)**
- Instagram/TikTok content strategy (daily tips using app UI)
- Photography workshop partnerships
- Influencer collaborations
- Photography festival sponsorships

### Monetization Strategy (Post-MVP)

**Freemium Model**:
- **Free Tier**: Unlimited feed, 3 mentor chats/day, basic challenges
- **Premium Tier** ($6.99/month or $49.99/year):
  - Unlimited mentor chats
  - Advanced challenges with AI feedback
  - Photography journal and analytics
  - Early access to new mentors
  - Offline mode with 500+ cached tips
  - Community features (share and discuss)

**Revenue Projections**:
- 10K users by Month 6
- 15% conversion to premium = 1,500 paying
- Monthly revenue: $10,500 ($126K/year)

## Competitive Analysis

| App | Strength | Weakness | StreetMuse Advantage |
|-----|----------|----------|----------------------|
| **VSCO** | Filters, community | Not educational, editing-focused | We teach shooting, not editing |
| **Camera+** | Manual controls | Technical, not creative | We inspire, not just enable |
| **Snapseed** | Powerful editing | Post-process only | Pre-shoot coaching in-field |
| **500px** | Inspiration gallery | Passive viewing | Active learning with context |
| **Photography Lessons Apps** | Structured courses | Boring UI, not contextual | Engaging feed, real-time relevance |

**Unique Value Proposition**: StreetMuse is the only app that combines historical photographer wisdom with AI-powered contextual coaching in an addictive, always-available feed format.

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content gets repetitive | High | 500+ unique feed items at launch, AI remixing, community contributions |
| Users want editing tools | Medium | Stay focused on pre-shoot coaching; partner with VSCO/Snapseed for editing |
| AI mentor responses feel generic | High | Fine-tune with extensive photographer biographies, writing samples, interview transcripts |
| Geolocation privacy concerns | Medium | Make contextual features opt-in, transparent data policy |
| Monetization too early hurts growth | Medium | Delay premium tier until 5K MAU achieved |

## Development Timeline

**Sprint 1-2 (Weeks 1-4)**: Design system, core feed UI, basic content CMS
**Sprint 3-4 (Weeks 5-8)**: Mentor system, infinite scroll optimization, 200+ feed items
**Sprint 5-6 (Weeks 9-12)**: Context-aware coaching, daily challenges, PWA setup
**Sprint 7 (Weeks 13-14)**: Polish, performance optimization, accessibility audit
**Sprint 8 (Weeks 15-16)**: Beta testing, bug fixes, launch prep

## Appendix: Research Sources

**Street Photography Apps**:
- [Must-Have Android Photography Apps 2025](https://www.slashgear.com/2022547/must-have-android-photography-apps-2025/)
- [10 Best Street Photography Apps](https://mobilelensmastery.com/smartphone-street-photography-apps-review/)
- [Best Smartphone Photography Apps 2025](https://www.diyphotography.net/best-smartphone-photography-apps-2025/)

**Famous Photographers & Techniques**:
- [Henri Cartier-Bresson - Master of Decisive Moment](https://aboutphotography.blog/photographer/henri-cartier-bresson)
- [Learning Street Photography Through Cartier-Bresson](https://www.dostreetphotography.com/blog/henri-cartier-bresson)
- [Top Famous Street Photographers](https://www.shuttergroove.com/reviews/photography/top-famous-street-photographers/)
- [10 Pioneering Street Photographers](https://www.domestika.org/en/blog/7406-10-pioneering-street-photographers-that-you-should-know)

**Street Photography Tips & Techniques**:
- [12 Tips for Capturing Decisive Moment](https://digital-photography-school.com/7-tips-capturing-decisive-moment-street-photography/)
- [How to Capture Decisive Moment](https://erickimphotography.com/blog/how-to-capture-the-decisive-moment-in-street-photography/)
- [Street Photography Composition Rules](https://streetphotographymagazine.com/article/street-photography-composition-rules/)

**Common Challenges**:
- [Street Photography - 10 Mistakes to Avoid](https://www.theschoolofphotography.com/tutorials/street-photography-mistakes)
- [5 Greatest Challenges of Street Photography](https://www.lightstalking.com/5-greatest-challenges-street-photography/)
- [Why Street Photography Is So Difficult](https://www.digitalphotomentor.com/why-street-photography-is-difficult/)

**UI/UX Design Inspiration**:
- [Top 100 Most Creative Portfolio Websites 2025](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- [Top 10 Mobile App UI/UX Design Trends 2025](https://apptechies.com/top-10-mobile-app-ui-ux-design-trends-for-2023/)
- [UX/UI Trends Defining 2025](https://www.shortcut.io/news-events/the-ux-ui-trends-defining-2025-nostalgic-chaotic-and-personal)

---

**Document Version**: 1.0
**Last Updated**: 2025-12-02
**Owner**: RLM AI Agent System
**Status**: Approved for Development
