# Product Requirements Document: StreetMuse

## Product Vision

StreetMuse is an immersive, unconventional mobile-first web application that transforms street photography learning into an ever-flowing stream of inspiration, wisdom, and creative coaching. Unlike traditional photography apps that treat learning as a structured course or static reference, StreetMuse presents an infinite, AI-curated scroll of insights, techniques, historical perspectives, and real-time coaching from the greatest street photographers in history—delivered as if they're speaking directly to you, right now, on the street.

The app breaks away from conventional photography app design by creating a radical, editorial-first experience that feels more like an art magazine than a utility app. Every interaction is designed to surprise, inspire, and push photographers to see the world differently.

## Target Audience

### Primary Personas

#### 1. The Aspiring Street Photographer (Sarah, 28)
- **Background**: Marketing professional with iPhone 15 Pro, shoots weekends in city
- **Pain Points**: Intimidated by approaching strangers, uncertain about composition, lacks confidence
- **Needs**: Instant encouragement, quick tips accessible while shooting, permission to experiment
- **Goals**: Develop personal style, overcome fear, capture authentic moments

#### 2. The Dedicated Amateur (Marcus, 42)
- **Background**: Has DSLR/mirrorless camera, studies photography books, follows photographers on Instagram
- **Pain Points**: Skills plateauing, inspiration fatigue, too much theory not enough practice
- **Needs**: Fresh perspectives from masters, critique of own work, deeper philosophical understanding
- **Goals**: Create portfolio-worthy work, understand "why" behind great photos, find unique voice

#### 3. The Creative Wanderer (Yuki, 35)
- **Background**: Travel blogger, shoots for Instagram Stories, values aesthetics and storytelling
- **Pain Points**: Photos feel generic, lacks depth, wants to move beyond "pretty pictures"
- **Needs**: Storytelling techniques, cultural context, emotional resonance in images
- **Goals**: Create meaningful visual narratives, connect with local culture through photos

#### 4. The Film Photography Enthusiast (James, 52)
- **Background**: Shoots film on weekends, Leica collector, nostalgic for classic street photography
- **Pain Points**: Digital world feels overwhelming, misses tangible learning experiences
- **Needs**: Connection to photography history, philosophical depth, timeless techniques
- **Goals**: Master decisive moment, understand composition instinctively, honor tradition

## Core Features

### FTR-001: The Infinite Muse Feed
An endlessly scrolling, beautifully designed feed that delivers bite-sized wisdom, iconic photographs, philosophical musings, technical tips, and motivational coaching. Each card is uniquely designed (no template repetition) with:
- **Historical Voice**: Quotes and teachings as if spoken by Cartier-Bresson, Vivian Maier, Garry Winogrand, Elliott Erwitt, Diane Arbus, Lee Friedlander, Joel Meyerowitz, and others
- **Visual Richness**: Full-bleed photography examples with subtle parallax scrolling
- **Contextual Depth**: Tappable cards expand to reveal deeper context, camera settings, historical background
- **Smart Curation**: AI learns your interests, skill level, current location, time of day, and adapts content
- **Categories**: Composition, Light, Timing, Ethics, Philosophy, Fear, Technique, Gear, Post-Processing, Storytelling

**Creative Twist**: Cards enter viewport with GSAP-powered cinematic animations—photos "develop" like film, text fades in as if written by hand, geometric overlays reference grid composition.

### FTR-002: Whispers from the Masters
An always-available "ghost advisor" system where tapping a floating, semi-transparent camera icon anywhere in the app triggers context-aware coaching:
- While scrolling at night: "Erwitt knew—street photography after dark isn't about light, it's about mystery."
- When user hasn't opened app in 3 days: "Winogrand shot 5 rolls a day. Not to be perfect. To be present."
- On a Sunday morning: "Maier photographed while working. You don't need permission to see."

**Creative Twist**: Instead of notifications, these appear as subtle, poetic whispers overlaid on the UI with gradient text effects and gentle fade animations. They never interrupt, always enhance.

### FTR-003: Today's Assignment
A single, daily micro-challenge inspired by a master photographer's approach:
- "Shoot from the hip for 30 minutes. Winogrand wanted energy, not perfection."
- "Find reflections. Saul Leiter saw the world as layers."
- "Photograph only hands today. Erwitt found humanity in details."

Each assignment includes:
- **The Why**: Philosophical reasoning from the master
- **The How**: Practical technique breakdown
- **Examples**: 3-5 iconic photos demonstrating the concept
- **Your Gallery**: Upload your attempts, see community submissions (optional social layer)

**Creative Twist**: Assignment card uses bold, rotated typography inspired by brutalist design, with a countdown timer visualized as a circular GSAP animation that fills throughout the day.

### FTR-004: The Decisive Moment Trainer
An interactive, gamified training mode that teaches the most critical skill in street photography—timing. Features:
- **Video Scenarios**: Street scenes play in slow motion; user taps screen at "decisive moment"
- **Master's Analysis**: After tapping, overlay shows where Cartier-Bresson would have clicked, with explanation
- **Pattern Recognition**: Trains eye to see emerging geometry, emotional peaks, story convergence
- **Levels**: From basic (single subject) to advanced (multi-layered scenes)

**Creative Twist**: Full-screen immersive mode with GSAP-controlled timeline scrubbing, geometric overlay guides, and "photo development" animation when user taps (screen flashes, image freezes, develops from white to full photo).

### FTR-005: Street Philosophy Library
A beautifully organized archive (not boring list!) of deeper content:
- **Master Profiles**: Interactive biographies with timelines, philosophy, style evolution
- **Technique Deep Dives**: Long-form explorations (zone focusing, hip shooting, natural light)
- **Photo Essays**: Curated series from masters with storytelling analysis
- **Ethics & Law**: Respectful street photography, privacy, cultural sensitivity

**Creative Twist**: Presented as a visual grid with unconventional bento box layout (inspired by 2025 design trends), each tile has unique shape/size based on content depth. Hover effects reveal preview quotes. Clicking opens full-screen reader with custom typography (editorial serif for philosophy, mono for technical content).

### FTR-006: Pocket Light Meter & Scene Analyzer
A practical utility that doubles as a learning tool:
- **Live Camera Feed**: Shows light values, suggested settings for film simulation
- **Composition Grid Overlays**: Rule of thirds, golden ratio, Cartier-Bresson's geometric lines
- **Scene Reading**: AI identifies promising street scenes ("Strong leading lines detected—Moriyama would shoot here")
- **Historical Comparison**: "This light matches Cartier-Bresson's Paris, 1952"

**Creative Twist**: Glassmorphism UI overlaid on camera feed, with GSAP-animated grid lines that subtly pulse when composition aligns with golden ratio. Light meter visualized as analog gauge with smooth needle animation.

## Design Requirements

### Design Philosophy: CREATIVE
StreetMuse demands a **bold, unconventional design** that reflects the rebellious, observant spirit of street photography itself. The UI should:
- **Break the Grid**: Asymmetric layouts, rotated elements, unexpected white space
- **Embrace Contrast**: High-contrast black & white as primary theme (honoring B&W street photography), with strategic color accents
- **Typography as Art**: Mix of editorial serif (for master quotes), grotesque sans (UI), and mono (technical info)
- **Photographic Textures**: Subtle film grain, light leaks, vignettes—never tacky, always tasteful
- **Negative Space**: Generous breathing room, letting photos and wisdom speak

### Animation Tier: RICH (GSAP)
Every interaction should feel **cinematic and intentional**:
- **Scroll Animations**: Parallax effects, staggered fade-ins, photo "development" reveals
- **Page Transitions**: Smooth morphing between views (card expands to full screen)
- **Micro-interactions**: Button hover states with scale/shadow, loading states as film advance animations
- **Contextual Motion**: Slow, contemplative animations (800-1200ms) to match street photography's patient observation
- **Respect Accessibility**: Honor `prefers-reduced-motion` with instant transitions fallback

### Recommended GSAP Techniques
- **ScrollTrigger**: For Infinite Muse Feed parallax and reveals
- **Timeline**: For multi-step animations (photo development sequence)
- **MorphSVG**: For geometric composition overlays
- **DrawSVG**: For light meter gauge animations
- **MotionPath**: For floating "Whispers" icon subtle movement

### CSS Framework: Tailwind CSS 4
- **Custom Theme**: Extend with photography-inspired color palette, custom font scales
- **Utility-First**: Rapid prototyping of unconventional layouts
- **Responsive**: Mobile-first (primary target), graceful desktop expansion
- **Dark Mode**: Default to dark (honors street photography aesthetic), optional light mode

### Mobile-First Requirements
- **Primary Device**: iPhone 15 Pro, Galaxy S24 (390x844, 360x800 viewports)
- **Touch Targets**: 44×44px minimum
- **Thumb Zone**: Critical actions in bottom 1/3 of screen
- **Offline Mode**: Cache Infinite Feed content for subway shooting
- **Performance**: Smooth 60fps scroll, lazy load images, optimize GSAP animations

## Technical Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animation**: GSAP (GreenSock Animation Platform)
- **State Management**: Zustand (lightweight, simple)
- **Data Fetching**: TanStack Query (caching, optimistic updates)

### Backend (Future Consideration)
- **API**: Next.js API Routes (initial), migrate to tRPC
- **Database**: PostgreSQL (user profiles, progress tracking)
- **AI/ML**: OpenAI GPT-4 (contextual whispers), Replicate (image analysis)
- **CDN**: Cloudflare (photography assets)

### Key Libraries
- **UI Components**: Radix UI (accessible primitives)
- **Icons**: Lucide React (clean, modern)
- **Fonts**: Next.js Font Optimization (self-hosted)
- **Image Optimization**: Next.js Image component with blur placeholders

## Success Metrics

### Engagement Metrics
- **Daily Active Users (DAU)**: Target 70% of weekly users open app daily
- **Session Duration**: Average 8+ minutes (indicates deep engagement with content)
- **Scroll Depth**: Users scroll through 20+ Muse Feed cards per session
- **Assignment Completion**: 40% of users complete daily assignment
- **Whisper Interaction**: 60% of users tap floating advisor at least once per session

### Learning Metrics
- **Skill Progression**: Decisive Moment Trainer accuracy improvement over 30 days
- **Content Consumption**: Users read at least 3 deep-dive articles per week
- **Behavior Change**: Users report increased shooting frequency in surveys

### Quality Metrics
- **Performance**: Lighthouse score 90+ (performance, accessibility, best practices)
- **Accessibility**: WCAG 2.1 AA compliance, tested with screen readers
- **Animation Performance**: Maintain 60fps during scroll, no jank
- **Retention**: 60% return after 7 days, 40% after 30 days

### Emotional Metrics (Qualitative)
- Users describe app as "inspiring," "beautiful," "unlike anything else"
- Users share screenshots of favorite quotes on social media
- Users report feeling more confident shooting on the street
- Users say they "think about the app" while walking around city

## Out of Scope (V1)
- Social features (commenting, following, likes)—focus on personal learning first
- Photo editing tools—reference external apps (Lightroom, VSCO)
- Camera app integration—keep utility minimal, prioritize learning
- Monetization—free during beta, explore premium tiers later
- User-generated content moderation—curated content only for V1

## Design Inspiration References
- **Editorial Design**: Kinfolk Magazine, Cereal Magazine (minimalist, high-quality photo layouts)
- **Brutalism**: Gumroad redesign 2021, Balenciaga website (bold typography, asymmetry)
- **Photography Apps**: Unsplash (visual quality), VSCO (aesthetic coherence)
- **Unconventional UI**: Apple Music (2024), Stripe Docs (bento grids), Linear (micro-interactions)

## User Journey Example

**Morning Routine**:
1. Sarah opens StreetMuse on subway commute
2. Infinite Feed shows: Cartier-Bresson quote about patience → Photo of Paris street with analysis → Quick tip about zone focusing
3. Floating advisor whispers: "Morning light is Maier's light—soft, forgiving, honest"
4. Today's Assignment appears: "Shoot only in shadow today. Moriyama found mystery in darkness."
5. Sarah saves assignment, closes app (2-minute session)

**Lunch Break**:
6. Sarah walks outside, opens app, taps Pocket Light Meter
7. Sees composition grid overlay on phone camera, notices strong diagonal line
8. App whispers: "Winogrand would tilt the frame—energy over perfection"
9. Sarah takes photo outside app, feels inspired

**Evening Reflection**:
10. Sarah opens Street Philosophy Library
11. Reads deep dive on "Overcoming Fear" with Vivian Maier examples
12. Uploads her shadow photos to Today's Assignment gallery
13. Sees community attempts, feels part of something bigger
14. Closes app feeling motivated to shoot tomorrow

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 for body text, 3:1 for UI elements
- **Focus Indicators**: Visible keyboard focus rings (2px, high contrast)
- **Screen Readers**: Semantic HTML, proper ARIA labels, alt text for all photos
- **Keyboard Navigation**: All features accessible without mouse
- **Touch Targets**: 44×44px minimum for interactive elements
- **Motion Sensitivity**: Respect `prefers-reduced-motion`, disable GSAP animations gracefully

### Inclusive Design
- **Font Scaling**: Support system font size preferences (up to 200%)
- **Dyslexia Support**: Optional OpenDyslexic font, increased letter spacing
- **Low Vision**: High contrast mode, adjustable text sizes
- **Color Blindness**: Never rely solely on color for meaning (use icons, labels)

## Competitive Analysis

### Existing Photography Learning Apps
- **Fstoppers, SLR Lounge**: Traditional course-based, desktop-focused, dry presentation
- **MasterClass**: High production value but expensive, not street photography specific
- **YouTube**: Free but overwhelming, inconsistent quality, no personalization

### Street Photography Apps
- **Streetographer**: Focus on camera functionality, minimal learning content
- **Obscura**: Beautiful camera UI but no educational component
- **Halide**: Technical/prosumer, intimidating for beginners

### StreetMuse Differentiation
- **Only app** focused exclusively on street photography learning
- **Infinite scroll** format—learning feels effortless, not like "studying"
- **Master's voices** personified—emotional connection to photography history
- **Design-first**—app itself is art object, reflects subject matter
- **Mobile-native**—designed for the device you shoot with
- **Free wisdom**—democratizing access to master-level knowledge

## Market Opportunity

### Target Market Size
- **Global Photographers**: 150M+ smartphone photographers worldwide
- **Street Photography Enthusiasts**: ~5M actively engaged (Instagram #streetphotography: 180M posts)
- **Addressable Market**: 500K-1M serious learners seeking improvement

### Market Trends
- **Mobile Photography Growth**: 90% of photos taken on smartphones (2025)
- **Creator Economy**: Photographers seeking skill development to stand out
- **Nostalgia for Film**: Renewed interest in classic photography techniques
- **Mindfulness Apps**: Success of Calm, Headspace shows appetite for contemplative mobile experiences

### Revenue Potential (Future)
- **Freemium Model**: Free Infinite Feed + Whispers, premium ($4.99/mo) for Library + Assignments + Trainer
- **Workshop Partnerships**: Affiliate with street photography tours/workshops
- **Print Sales**: Curated master prints from public domain archives
- **Sponsorships**: Camera/lens manufacturers (Leica, Fujifilm)

## Development Priorities

### Phase 1 (MVP - 6-8 weeks)
1. **FTR-001**: Infinite Muse Feed with 100+ curated cards
2. **FTR-002**: Whispers system (10 contextual triggers)
3. **FTR-003**: Today's Assignment (30 pre-written assignments)
4. Design system + component library
5. Mobile-responsive layout
6. Basic GSAP animations (scroll reveals, transitions)

### Phase 2 (Enhanced - 4 weeks)
1. **FTR-004**: Decisive Moment Trainer (10 scenarios)
2. **FTR-006**: Pocket Light Meter
3. Advanced GSAP animations (parallax, morphing)
4. Accessibility audit + improvements

### Phase 3 (Complete - 4 weeks)
1. **FTR-005**: Street Philosophy Library (20 articles)
2. AI-powered content personalization
3. Offline mode with service workers
4. Performance optimization

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Copyright on master photos** | High | Use public domain images (pre-1928), fair use for education, license from estates |
| **GSAP performance on low-end devices** | Medium | Progressive enhancement, detect device capabilities, reduce animations |
| **Content creation bottleneck** | High | Pre-create 200+ feed cards before launch, hire photography writer |
| **User retention after novelty wears off** | High | Daily assignments create habit loop, personalization increases relevance |
| **Accessibility conflicts with creative design** | Medium | Accessibility-first approach, test with disabled users, provide alternatives |

## Appendix: Master Photographers to Feature

### Primary Voices (Deep Content)
1. **Henri Cartier-Bresson** (1908-2004) - Decisive moment, geometry, 50mm lens
2. **Vivian Maier** (1926-2009) - Curiosity, self-portraiture, working while shooting
3. **Garry Winogrand** (1928-1984) - Energy, tilted frames, prolific output
4. **Elliott Erwitt** (1928-) - Humor, irony, dogs and humans
5. **Diane Arbus** (1923-1971) - Outsiders, intimacy, flash
6. **Lee Friedlander** (1934-) - Self-portraits, reflections, urban landscape

### Secondary Voices (Quotes & Examples)
7. **Joel Meyerowitz** (1938-) - Color street photography, Cape Light
8. **Saul Leiter** (1923-2013) - Color, abstraction, layers
9. **Helen Levitt** (1913-2009) - Children playing, NYC streets
10. **Robert Frank** (1924-2019) - The Americans, social critique
11. **Daido Moriyama** (1938-) - Grain, contrast, Tokyo streets
12. **Bruce Gilden** (1946-) - Flash, close proximity, confrontational

---

**Document Version**: 1.0
**Created**: 2025-12-02
**Project**: StreetMuse
**Instance**: instance-3
**Status**: APPROVED FOR DEVELOPMENT
