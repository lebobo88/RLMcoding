# Product Requirements Document (PRD)

## Project Identity
- **Product Name**: StreetMuse
- **Version**: 1.0.0
- **Created**: 2025-12-02
- **Status**: Active Development

## Executive Summary

StreetMuse is a revolutionary mobile-first application that reimagines street photography education by creating an infinite, AI-curated stream of wisdom from history's greatest street photographers. Unlike traditional photography apps that focus on camera settings or post-processing, StreetMuse is a perpetual mentor—delivering insights, techniques, compositional guidance, and inspiration from masters like Henri Cartier-Bresson, Vivian Maier, Garry Winogrand, and dozens more.

The app breaks conventional photography app patterns by presenting content as an infinite, tactile scroll experience—similar to a social feed but curated exclusively from photographic masters. Each insight card is interactive, visually rich, and contextual, adapting to user behavior, time of day, and shooting conditions.

## Product Vision

**Mission Statement**: Transform every street photographer's smartphone into a pocket mentor that provides real-time coaching, historical context, and creative inspiration from the greatest practitioners of the art form.

**Vision**: Become the definitive companion app for street photographers worldwide—not replacing their camera app, but enriching their artistic practice with knowledge, technique, and confidence derived from photographic masters throughout history.

## Target Audience

### Primary Personas

#### 1. **Maya - The Aspiring Street Photographer**
- **Age**: 28
- **Background**: Marketing professional, hobbyist photographer for 3 years
- **Pain Points**:
  - Feels intimidated photographing strangers in public
  - Struggles with composition under pressure (decisive moment anxiety)
  - Lacks confidence in her artistic eye
  - Wants to learn from masters but finds books/courses too academic
- **Goals**:
  - Build confidence approaching street photography
  - Develop a recognizable style
  - Learn composition techniques that work in real-world conditions
  - Get inspired daily without information overload
- **Tech Proficiency**: High (uses iPhone 16 Pro, Instagram, VSCO)
- **Time Available**: 15-30 minutes daily commute, weekend photo walks

#### 2. **David - The Intermediate Photographer**
- **Age**: 42
- **Background**: Architect, serious photographer for 8 years, owns Leica Q2
- **Pain Points**:
  - Hit a creative plateau—photos feel repetitive
  - Wants to study specific photographers' techniques
  - Needs fresh perspectives and challenges
  - Limited time to read photography books or take workshops
- **Goals**:
  - Break out of creative ruts
  - Master specific techniques (e.g., Winogrand's tilted horizons)
  - Understand the "why" behind great compositions
  - Apply historical lessons to modern street photography
- **Tech Proficiency**: Medium-High (uses iPhone + professional camera)
- **Time Available**: Daily walks, monthly dedicated photo outings

#### 3. **Zara - The Documentary Storyteller**
- **Age**: 35
- **Background**: Journalist, uses street photography to tell stories
- **Pain Points**:
  - Needs to capture authentic moments quickly
  - Struggles with ethical considerations of street photography
  - Wants to improve narrative sequencing
  - Balances speed with compositional quality
- **Goals**:
  - Learn candid photography techniques from masters like Maier
  - Understand ethical frameworks from historical practitioners
  - Improve storytelling through photo sequences
  - Get situational advice (e.g., protest photography, low light)
- **Tech Proficiency**: High (professional photographer mindset)
- **Time Available**: On-the-go during assignments

### Secondary Personas
- **Photo Enthusiasts**: General photography lovers exploring street photography
- **Visual Artists**: Painters, designers seeking compositional inspiration
- **Educators**: Photography teachers looking for teaching resources

## Core Features

### Feature 1: The Infinite Wisdom Stream (FTR-001)
**Priority**: P0 (Must Have)

An endless, vertically-scrolling feed of curated content cards from street photography masters. Unlike social feeds, this is 100% educational—no user-generated content, no distractions.

**Content Card Types**:
1. **Technique Insights**: Specific methods (e.g., "Cartier-Bresson's Zone Focusing Technique")
2. **Compositional Tips**: Visual breakdowns with annotated example photos
3. **Decisive Moment Stories**: Historical anecdotes about iconic shots
4. **Quotes & Philosophy**: Wisdom from masters on seeing and timing
5. **Challenges**: Actionable missions (e.g., "Find 3 frames within a frame today")
6. **Before/After Analysis**: Side-by-side comparisons showing compositional choices
7. **Equipment Context**: What gear masters used and why (demystifying gear obsession)
8. **Situational Advice**: Tips for specific scenarios (crowds, low light, rain, etc.)

**Key Behaviors**:
- Infinite scroll with momentum physics (GSAP ScrollTrigger)
- Intelligent caching: pre-loads 10 cards ahead, keeps 20 in memory
- Adaptive content: learns from dwell time, saves, and skips
- Contextual awareness: suggests low-light tips at dusk, composition tips in bright light
- No pagination—truly endless

### Feature 2: Master Photographer Profiles (FTR-002)
**Priority**: P0 (Must Have)

Deep-dive profiles for 20+ legendary street photographers, accessible via a visually stunning gallery interface.

**Profile Contents**:
- Biography with career timeline (illustrated with period-appropriate design)
- Signature techniques and visual style analysis
- Most influential works with compositional breakdowns
- Curated quotes and philosophy
- Recommended study path: 10 essential photos to analyze
- "Shot Like [Master]" challenges

**Featured Masters** (Initial Launch):
1. Henri Cartier-Bresson (decisive moment pioneer)
2. Vivian Maier (candid intimacy, hidden genius)
3. Garry Winogrand (dynamic tilted compositions)
4. Diane Arbus (psychological portraiture)
5. Robert Frank (The Americans, narrative sequences)
6. Joel Meyerowitz (color street photography pioneer)
7. Daido Moriyama (high-contrast, gritty Japanese aesthetic)
8. Alex Webb (complex layered color compositions)
9. Fan Ho (geometric light and shadow, Hong Kong)
10. Helen Levitt (playful street life, children)
11. William Klein (aggressive, in-your-face style)
12. Saul Leiter (painterly color abstractions)
13. Bruce Gilden (flash street portraits, confrontational)
14. Lee Friedlander (self-portraits, reflections, urban landscapes)
15. Mary Ellen Mark (empathetic documentary)
16. Elliott Erwitt (wit and humor)
17. Martin Parr (satirical color documentation)
18. Lisette Model (bold, direct portraits)
19. Josef Koudelka (geometric, theatrical compositions)
20. Trent Parke (Australian light, shadows, movement)

**UI/UX**: Grid layout with large portrait photos of each master (or iconic self-portrait), transitioning to full-screen immersive profile with parallax scrolling

### Feature 3: Daily Muse Notification (FTR-003)
**Priority**: P1 (Should Have)

A single, beautifully designed push notification each day delivering one powerful insight, quote, or challenge from a street photography master.

**Timing Intelligence**:
- Learns user's typical photo walk times
- Defaults to "golden hour" (1 hour before sunset) if no pattern detected
- Adapts to timezone and seasonal daylight changes
- Never intrusive—max 1 notification per day

**Notification Design**:
- Rich notification with thumbnail image
- Tappable to expand into full card within app
- Option to save directly to personal collection
- Deep link to related master profile or technique

**Content Examples**:
- "Cartier-Bresson: 'Your first 10,000 photographs are your worst.' Keep shooting."
- "Winogrand Challenge: Take 5 photos today with a tilted horizon."
- "Maier Technique: Shoot from hip level—it changes your perspective literally and figuratively."

### Feature 4: Situational Guidance Mode (FTR-004)
**Priority**: P1 (Should Have)

Context-aware coaching that adapts to current conditions—time of day, weather, location density, etc.

**Contextual Triggers**:
- **Time-Based**:
  - Golden Hour (5:00-6:30pm): "Cartier-Bresson loved this light for silhouettes..."
  - Blue Hour (6:30-7:30pm): "Fan Ho mastered neon reflections at dusk..."
  - Midday Harsh Light (11am-2pm): "Friedlander found geometry in shadows..."
  - Night (8pm+): "Moriyama embraced grain and blur in darkness..."
- **Device Sensors** (if permissions granted):
  - GPS: Urban vs. suburban vs. nature guidance
  - Accelerometer: Detects walking—suggests "zone focusing" technique
  - Light sensor: Suggests masters who excelled in current lighting
- **Manual Toggles**:
  - Crowded streets, empty streets, markets, transit, protests, etc.

**UI/UX**: Floating pill button (bottom-right) with contextual icon, expands to modal with 3-5 relevant tips

### Feature 5: Personal Insight Library (FTR-005)
**Priority**: P1 (Should Have)

Users can save favorite insights, quotes, techniques, and challenges to a beautifully organized personal library.

**Organization Options**:
- By Master (auto-categorized)
- By Type (technique, quote, challenge, composition, etc.)
- Custom Collections (e.g., "Confidence Builders," "Night Photography," "Ethical Practices")
- Chronological (most recent saves)

**Advanced Features**:
- Search within saved insights
- Export collections as PDF study guides
- Share individual cards to social media (with StreetMuse watermark)
- Weekly review reminder: "You saved 7 insights this week—review them?"

### Feature 6: Visual Composition Analyzer (FTR-006)
**Priority**: P2 (Nice to Have)

An experimental AI tool that analyzes user-uploaded photos and identifies compositional techniques from masters present in the image.

**How It Works**:
1. User uploads a street photo
2. AI analyzes composition (lines, rule of thirds, framing, layering, etc.)
3. App identifies which master's techniques are present
4. Provides feedback: "This has Cartier-Bresson's geometric balance, but consider Winogrand's dynamic tilt"

**Privacy First**:
- 100% on-device processing (Core ML model)
- Photos never uploaded to servers
- Optional feature—fully functional app without it

**UI/UX**: Camera icon in top nav → Upload/take photo → Overlay analysis with annotations → Link to relevant master techniques

## Design Requirements

### Design Philosophy: CREATIVE

StreetMuse deliberately breaks from conventional photography app aesthetics (clean, minimal, white space). Instead:

**Core Design Principles**:
1. **Cinematic Darkness**: Predominantly dark UI (rich blacks, deep grays) to make photographic content pop—mimicking a darkroom or gallery space
2. **Tactile Physicality**: Cards have paper-like texture, depth, and shadows—evoking physical photo prints
3. **Typographic Boldness**: Large, editorial typography inspired by photography magazines (Think: Aperture, Foam Magazine)
4. **Unexpected Color**: Accent colors derived from street photography film stocks (Kodachrome warm oranges, Tri-X silver grays, Portra soft blues)
5. **Asymmetric Layouts**: Break the grid—cards can be offset, overlapping, varied sizes
6. **Analog References**: Grain textures, film rebate marks, contact sheet aesthetics

### Animation Tier: RICH

Animations should feel **deliberate, weighty, and cinematic**—never frivolous. Use GSAP for advanced effects.

**Animation Principles**:
1. **Momentum-Based Physics**: Scrolling has inertia, cards have weight
2. **Parallax Depth**: Background elements move slower than foreground (create depth)
3. **Reveal Animations**: Cards fade + slide in with stagger (like photos developing)
4. **Micro-Interactions**: Haptic feedback on saves, subtle scale on tap, elastic bounce on pull-to-refresh
5. **Transition Sequences**: Master profile opens with GSAP timeline (photo expands → bio fades in → works gallery slides up)
6. **Scroll-Triggered Effects**: Quotes reveal as you scroll, images parallax, stats count up

**Performance Budget**:
- 60fps on iPhone 12 and newer
- Smooth 30fps on older devices (graceful degradation)
- Animations pause when battery < 20% (respect user's device)

### CSS Framework: Tailwind CSS 4

**Custom Configuration**:
- Extended color palette (film stock inspired)
- Custom spacing scale (4px base unit)
- Typography scale: 8 sizes from 0.75rem to 4rem
- Shadow system: 6 levels (subtle to dramatic)
- Custom animation utilities for GSAP integration

### Accessibility Standards

**Target**: WCAG 2.1 AA (with AAA aspirations)

- Color contrast: 4.5:1 text, 3:1 UI elements (test against dark backgrounds)
- Touch targets: 48×48px minimum (critical for on-the-go use)
- Keyboard navigation: full support (even on mobile web)
- Screen reader: semantic HTML, ARIA labels on all interactive elements
- Reduced motion: respect `prefers-reduced-motion`, disable GSAP animations
- Font scaling: supports iOS/Android system text size preferences
- Focus indicators: high-contrast visible rings

### Responsive Design

**Mobile-First Approach**:
- Designed for iPhone 12 Pro (390×844) and up
- Supports Android phones (360px width minimum)
- Tablet support (iPad Mini and up)—two-column layout
- Desktop web (1440px+)—three-column masonry layout with sidebar navigation

**Breakpoints**:
- `sm`: 640px (small tablets)
- `md`: 768px (iPads)
- `lg`: 1024px (landscape tablets)
- `xl`: 1280px (small desktop)
- `2xl`: 1536px (large desktop)

## User Flows

### Primary Flow: Daily Inspiration Session
1. User opens app (or taps Daily Muse notification)
2. Lands in Infinite Wisdom Stream (scrolling from where they left off)
3. Scrolls through 5-10 cards (dwell time: 10-30 seconds per card)
4. Saves 1-2 insights to Personal Library
5. Taps on a master's name → Opens Master Profile
6. Explores profile → Starts a "Shot Like Cartier-Bresson" challenge
7. Exits app to go shoot (challenge stored for later review)

### Secondary Flow: Pre-Shoot Preparation
1. User plans a photo walk (opens app 10 mins before leaving)
2. Activates Situational Guidance (sets context: "Golden Hour, Urban, Crowded")
3. Reads 3-4 contextual tips
4. Saves one tip for reference during shoot
5. Enables Daily Muse notification reminder for post-shoot
6. Exits app to shoot

### Tertiary Flow: Learning a Specific Technique
1. User searches for "zone focusing" (in Personal Library or Wisdom Stream)
2. Finds Cartier-Bresson technique card
3. Watches embedded visual tutorial (animated diagrams)
4. Saves card to "Techniques to Practice" collection
5. Shares card to Instagram story ("Studying from the masters")

## Technical Architecture

### Tech Stack

**Frontend**:
- Next.js 16 (App Router)
- React 19 (Server Components where applicable)
- TypeScript 5
- Tailwind CSS 4
- GSAP 3 (GreenSock Animation Platform)
- Framer Motion (for simpler UI animations)

**State Management**:
- Zustand (lightweight, perfect for client state)
- TanStack Query (React Query v5) for server state caching

**Data Storage**:
- Supabase (PostgreSQL) for content database
- Supabase Storage for images (CDN-backed)
- IndexedDB (via Dexie.js) for offline mode

**APIs**:
- RESTful API (Next.js Route Handlers)
- Real-time subscriptions (Supabase Realtime) for live content updates

**Mobile**:
- PWA (Progressive Web App) for installability
- Capacitor for native features (notifications, haptics, sensors)
- Service Worker for offline caching

**Analytics**:
- Plausible (privacy-friendly, GDPR-compliant)
- Track: card views, saves, master profile visits, challenge completions

**Hosting**:
- Vercel (optimal Next.js performance)
- Edge functions for personalization logic

### Database Schema (Simplified)

**Core Tables**:
- `masters`: Photographer profiles (name, bio, birth_year, death_year, signature_style, etc.)
- `insights`: Content cards (type, content, master_id, tags, difficulty_level, etc.)
- `users`: User accounts (email, preferences, timezone, notification_time, etc.)
- `saved_insights`: User's saved cards (user_id, insight_id, collection_name, saved_at)
- `user_activity`: Analytics (user_id, insight_id, dwell_time, completed_challenge, etc.)

## Success Metrics

### Primary KPIs

1. **Daily Active Users (DAU)**:
   - Target: 60% of registered users open app daily
   - Measure: Unique sessions per day

2. **Engagement Rate**:
   - Target: Average 8-minute session duration
   - Measure: Time spent in app per session

3. **Content Discovery**:
   - Target: Users view 15+ insight cards per session
   - Measure: Cards viewed / session

4. **Learning Retention**:
   - Target: 40% of users save 3+ insights per week
   - Measure: Saves per user per week

5. **Master Exploration**:
   - Target: Users explore 5+ master profiles in first month
   - Measure: Unique master profile views per user

### Secondary Metrics

- **Challenge Completion Rate**: 25% of users complete 1+ challenge per month
- **Notification Open Rate**: 50% of Daily Muse notifications opened
- **Offline Usage**: 20% of sessions occur offline (cached content)
- **Share Rate**: 10% of users share 1+ card to social media per month
- **Retention Rates**:
  - Day 7: 40%
  - Day 30: 25%
  - Day 90: 15%

### Qualitative Success

- User testimonials: "StreetMuse gave me confidence to approach strangers"
- App Store reviews: 4.5+ stars with comments on educational value
- Social proof: Users posting StreetMuse-inspired photos on Instagram
- Community growth: Reddit/Discord community forms organically

## Competitive Landscape

### Direct Competitors
- **Every Street** (Lens Culture): Curated street photography gallery, but no educational focus
- **Photography apps (VSCO, Halide)**: Focus on capture/editing, not education
- **Photography courses (Skillshare, Udemy)**: Long-form video courses, not bite-sized mobile learning

### Indirect Competitors
- **Photography books**: Deep but not mobile-friendly or interactive
- **YouTube channels (ERIC KIM, Sean Tucker)**: Great content but requires active video watching
- **Instagram street photography accounts**: Inspirational but lacks structured learning

### StreetMuse's Unique Value Proposition

1. **Mobile-Native Education**: Bite-sized, scrollable, on-the-go learning (not videos or articles)
2. **Historical Masters Focus**: Content from legendary photographers, not influencers
3. **Contextual Intelligence**: Adapts to time, location, conditions (competitors don't do this)
4. **Infinite Discovery**: Endless stream vs. finite courses or galleries
5. **No Camera/Editing**: Pure education—complements their existing camera app (not competing)

## Go-to-Market Strategy

### Launch Plan (MVP - Month 1-3)

**Phase 1: Seed Launch (Month 1)**
- Invite-only beta: 100 street photographers from Instagram/Reddit
- Focus: Core Wisdom Stream + 10 Master Profiles + Daily Muse
- Goal: Validate engagement, gather qualitative feedback

**Phase 2: Public Beta (Month 2)**
- Open to all via Product Hunt, r/streetphotography, Hacker News
- Add: Situational Guidance + Personal Library
- Goal: 1,000 users, 60% DAU, 4.5+ App Store rating

**Phase 3: Full Launch (Month 3)**
- App Store Feature application
- Partnership with street photography communities (Lens Culture, Magnum Photos)
- PR push: PetaPixel, DIY Photography, Photoshelter blog
- Goal: 10,000 users, monetization ready

### Monetization Strategy (Post-Launch)

**Free Tier**:
- Unlimited Wisdom Stream access
- 5 Master Profiles (rotating monthly)
- Daily Muse notifications
- Limited saves (20 per month)

**StreetMuse Pro** ($4.99/month or $39/year):
- All 20+ Master Profiles
- Unlimited saves + custom collections
- Situational Guidance Mode
- Visual Composition Analyzer
- Priority content (new insights released 1 week early)
- Export collections as PDF study guides
- Ad-free (if we add ads to free tier later)

**Alternative Revenue Streams**:
- Affiliate links to photography books (Amazon Associates)
- Partnerships with camera brands (Leica, Fujifilm) for sponsored content (ethically labeled)
- Premium workshops: Live virtual "walk with a pro" events ($20/ticket)

## Risks & Mitigation

### Risk 1: Content Licensing (Historical Photos)
**Risk**: Using photos from deceased masters may require estate permissions.
**Mitigation**:
- Focus on public domain works (pre-1927, or Creative Commons)
- License from Magnum Photos, Getty, Bridgeman Images where needed
- Budget $5,000-$10,000 for initial licensing
- Use illustrative diagrams for technique explanations (original artwork)

### Risk 2: User Engagement Drop-Off
**Risk**: Users lose interest after initial novelty wears off.
**Mitigation**:
- Weekly content refresh: Add 10-20 new insight cards per week
- Seasonal challenges: "30 Days of Cartier-Bresson" (April), "Summer Light" (July)
- Push notification intelligence: Learn optimal times, reduce frequency if user disengages
- Gamification (subtle): "You've explored 5 masters this month" achievements

### Risk 3: Technical Performance (Animation Heavy)
**Risk**: GSAP animations cause lag on older devices.
**Mitigation**:
- Device detection: Disable RICH animations on iPhone X and older
- Performance budget: Max 1 GSAP timeline per screen
- Lazy load animations: Only animate visible cards (IntersectionObserver)
- Provide "Reduce Motion" toggle in settings (beyond system preference)

### Risk 4: Market Size (Niche Audience)
**Risk**: Street photography is a niche—limits TAM.
**Mitigation**:
- Expand to "Street Photography & Documentary" (broader appeal)
- Add lifestyle photographers, travel photographers as secondary personas
- International expansion: Translate to Spanish, French, Japanese (major photography markets)
- B2B pivot: License content to photography schools (Parsons, School of Visual Arts)

## Development Roadmap

### Sprint 1-2 (Weeks 1-4): Foundation
- [ ] Next.js app setup with Tailwind 4 configuration
- [ ] Design system implementation (colors, typography, components)
- [ ] Database schema + seed with 50 insight cards + 5 master profiles
- [ ] Infinite Wisdom Stream (basic scroll, card rendering)

### Sprint 3-4 (Weeks 5-8): Core Features
- [ ] Master Profiles (detail pages, navigation)
- [ ] Personal Library (save/unsave, collections)
- [ ] Daily Muse notification system
- [ ] User authentication (Supabase Auth)

### Sprint 5-6 (Weeks 9-12): Polish & Intelligence
- [ ] GSAP animations (scroll triggers, card reveals, transitions)
- [ ] Situational Guidance Mode
- [ ] Offline mode (IndexedDB caching)
- [ ] Analytics integration (Plausible)

### Sprint 7 (Weeks 13-14): Beta Launch
- [ ] Bug fixes, performance optimization
- [ ] Onboarding flow (3-screen intro)
- [ ] Invite-only beta deployment
- [ ] Feedback collection system

### Post-Launch (Months 4-6)
- [ ] Visual Composition Analyzer (AI feature)
- [ ] Pro tier subscription system (Stripe)
- [ ] Expanded content: 20 total masters, 500+ insights
- [ ] Community features: Discussion boards, user challenges

## Content Strategy

### Initial Content Library (MVP)

**10 Master Profiles**:
1. Henri Cartier-Bresson
2. Vivian Maier
3. Garry Winogrand
4. Diane Arbus
5. Joel Meyerowitz
6. Daido Moriyama
7. Alex Webb
8. Fan Ho
9. Helen Levitt
10. Robert Frank

**200 Insight Cards**:
- 40% Technique cards (zone focusing, timing, framing, etc.)
- 30% Composition tips (leading lines, layering, rule of thirds breaks)
- 15% Philosophy/quotes
- 10% Challenges (actionable missions)
- 5% Equipment context (demystifying gear)

**Distribution by Master** (equal representation):
- 20 cards per master (2 per type)

**Content Refresh Schedule**:
- Weekly: 10 new insight cards
- Monthly: 1 new master profile
- Quarterly: 1 special themed collection (e.g., "Ethics in Street Photography")

### Content Sourcing

- **Primary**: Photography historians on team (1 FT researcher)
- **Secondary**: Licensing from publishers (Aperture, Thames & Hudson)
- **Tertiary**: Public domain sources (Library of Congress, Wikimedia)
- **Community**: User-submitted insights (moderated, credited)

## Legal & Compliance

- **Copyright**: Secure licensing for all historical photos used
- **Privacy**: GDPR-compliant (data minimization, right to deletion)
- **Terms of Service**: Standard app TOS with educational use clause
- **Content Moderation**: All content is curated (no UGC), so minimal moderation needed
- **Accessibility**: WCAG 2.1 AA compliance audited pre-launch

## Appendix

### Glossary

- **Decisive Moment**: Cartier-Bresson's concept—the precise instant when composition, action, and emotion align
- **Zone Focusing**: Pre-focusing at a set distance (e.g., 10 feet) to capture action without autofocus delay
- **Tilted Horizon**: Garry Winogrand's technique of tilting the camera to create dynamic tension
- **Fishing Technique**: Finding a good background, waiting for the right subject to enter frame

### References

- "The Decisive Moment" by Henri Cartier-Bresson (1952)
- "Vivian Maier: Street Photographer" by John Maloof (2011)
- "Garry Winogrand: The Street Philosophy of Garry Winogrand" (2018)
- [ERIC KIM Blog](https://erickimphotography.com/blog/) - Street photography education
- [Magnum Photos](https://www.magnumphotos.com/) - Legendary photo agency
- [Street Photography Magazine](https://streetphotographymagazine.com/) - Community resource

---

**Document Version**: 1.0
**Last Updated**: 2025-12-02
**Next Review**: Post-Beta Feedback (Estimated Month 3)
