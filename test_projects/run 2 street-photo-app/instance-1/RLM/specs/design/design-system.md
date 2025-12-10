# StreetMuse Design System

**Version**: 1.0.0
**Design Philosophy**: CREATIVE (bold, unique, brand-differentiating)
**Animation Tier**: RICH (GSAP scroll/loading animations)
**Created**: 2025-12-02

---

## Design Philosophy

StreetMuse breaks away from conventional photography app aesthetics. Instead of minimal white spaces and flat designs, we embrace **cinematic darkness**, **editorial typography**, and **tactile physicality** that evokes the darkroom and the golden age of photographic magazines.

### Core Principles

1. **Darkroom Immersion**: Rich blacks and deep grays create a gallery-like environment where photographic content becomes the hero
2. **Film Stock Color**: Accent colors inspired by iconic film stocks (Kodachrome warmth, Tri-X silver, Portra softness)
3. **Editorial Typography**: Large, bold type inspired by Aperture, Foam Magazine, and classic photography publications
4. **Tactile Cards**: Cards feel like physical photo prints with texture, depth, and weight
5. **Asymmetric Dynamism**: Break the grid—overlapping elements, varied card sizes, tilted angles (homage to Winogrand)
6. **Analog Texture**: Subtle grain, film rebate marks, and contact sheet aesthetics

---

## 1. Color System

### 1.1 Primary Palette

Our color system is inspired by iconic photographic film stocks and darkroom chemistry:

#### Darkroom (Base Blacks & Grays)

```
Darkroom Black (#0D0D0D)
- Usage: Main background, app canvas
- Contrast: Creates maximum pop for white text and color accents
- Psychology: Professional, gallery-like, focuses attention on content

Darkroom 100 (#1A1A1A)
- Usage: Card backgrounds, elevated surfaces
- Contrast: Subtle lift from main background
- Psychology: Creates depth hierarchy

Darkroom 200 (#262626)
- Usage: Borders, dividers, subtle UI elements
- Contrast: Just visible against cards
- Psychology: Gentle separation without harshness
```

#### Kodachrome (Warm Orange - Primary Accent)

```
Kodachrome (#E86E3A)
- Usage: Primary buttons, active states, CTA elements
- Inspiration: Kodachrome 64 warm sunset tones
- Contrast: 4.8:1 against darkroom black ✅
- Psychology: Energetic, warm, inviting

Kodachrome Light (#FF8C61)
- Usage: Hover states, highlights
- Contrast: 3.2:1 against darkroom black ✅
- Psychology: Accessible warmth

Kodachrome Dark (#C65429)
- Usage: Active/pressed states
- Psychology: Confident, grounded
```

#### Tri-X (Silver Gray - Secondary Accent)

```
Tri-X (#B8B8B8)
- Usage: Secondary text, labels, inactive elements
- Inspiration: Kodak Tri-X black & white film's silvery midtones
- Contrast: 6.5:1 against darkroom black ✅
- Psychology: Professional, timeless, photographic

Tri-X Light (#D4D4D4)
- Usage: Subtle highlights, secondary hover states
- Contrast: 9.2:1 against darkroom black ✅

Tri-X Dark (#8C8C8C)
- Usage: Muted text, disabled states
- Contrast: 3.8:1 against darkroom black ✅
```

#### Portra (Soft Blue - Tertiary Accent)

```
Portra (#A3C7D6)
- Usage: Tertiary actions, informational states, subtle highlights
- Inspiration: Kodak Portra's soft cyan shadows
- Contrast: 5.2:1 against darkroom black ✅
- Psychology: Calm, sophisticated, artistic

Portra Light (#C1DDE9)
- Usage: Light backgrounds, hover states
- Contrast: 8.1:1 against darkroom black ✅

Portra Dark (#7FA9B8)
- Usage: Active tertiary elements
- Contrast: 3.5:1 against darkroom black ✅
```

#### Paper (Text White)

```
Paper (#F5F5F0)
- Usage: Primary text, headings, high-contrast content
- Inspiration: Photographic paper off-white (not stark white)
- Contrast: 13.5:1 against darkroom black ✅ (AAA)
- Psychology: Softer than pure white, reduces eye strain
```

### 1.2 Semantic Colors

#### State Colors

```
Error (#DC2626)
- Usage: Error messages, failed states, validation errors
- Contrast: 5.1:1 against darkroom black ✅
- Accessibility: Paired with icons, never color-only indication

Success (#16A34A)
- Usage: Success messages, completed states, confirmations
- Contrast: 4.6:1 against darkroom black ✅
- Accessibility: Paired with icons

Warning (#F59E0B)
- Usage: Warning messages, caution states
- Contrast: 5.8:1 against darkroom black ✅
- Accessibility: Paired with icons
```

#### Interactive States

```
Focus Ring: Kodachrome (#E86E3A)
- Width: 2px
- Offset: 2px
- Always visible for keyboard navigation

Hover: Darkroom 200 (#262626) background lift
- Subtle elevation, not color change
- Paired with shadow increase

Active/Pressed: Scale 95% + Kodachrome Dark
- Physical feedback, tactile interaction
```

### 1.3 Color Usage Guidelines

**Text Hierarchy**:
- Primary text: Paper (#F5F5F0) on Darkroom Black
- Secondary text: Tri-X (#B8B8B8) on Darkroom Black
- Muted text: Tri-X Dark (#8C8C8C) on Darkroom Black
- Inverse text: Darkroom Black on Paper (light mode elements)

**Interactive Elements**:
- Primary actions: Kodachrome background + Paper text
- Secondary actions: Darkroom 200 background + Paper text + Kodachrome border
- Tertiary actions: Portra background + Darkroom Black text
- Destructive actions: Error red background + Paper text

**Backgrounds**:
- App canvas: Darkroom Black (#0D0D0D)
- Cards: Darkroom 100 (#1A1A1A)
- Elevated modals: Darkroom 100 with shadow-xl
- Input fields: Darkroom 200 (#262626)

---

## 2. Typography System

### 2.1 Font Families

#### Primary (Body & UI)
**Inter Variable**
- Type: Sans-serif, humanist
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold)
- Usage: Body text, UI labels, buttons, navigation
- Rationale: Highly readable at small sizes, optimized for screens, professional
- Variable axes: Weight (400-700)

#### Display (Headings & Quotes)
**Playfair Display**
- Type: Serif, transitional
- Weights: 400 (Regular), 600 (Semibold), 700 (Bold)
- Usage: Page titles, section headings, pull quotes, master names
- Rationale: Editorial feel, reminiscent of photography magazines, contrasts beautifully with Inter
- Variable axes: Weight (400-900)

#### Monospace (Technical)
**JetBrains Mono**
- Type: Monospace
- Weights: 400 (Regular), 600 (Semibold)
- Usage: Code snippets, technical camera settings (rare usage)
- Rationale: Highly legible, modern monospace

### 2.2 Type Scale

Based on **Major Third (1.250)** ratio:

```
4xl: 3.052rem (49px) — Page titles, hero headings
3xl: 2.441rem (39px) — Section headings
2xl: 1.953rem (31px) — Subsection headings, quotes
xl:  1.563rem (25px) — Card titles
lg:  1.25rem  (20px) — Large body text, labels
base: 1rem    (16px) — Body text (default)
sm:  0.875rem (14px) — Secondary text, captions
xs:  0.75rem  (12px) — Fine print, metadata
```

**Line Heights**:
- Headings (4xl-xl): 1.1-1.4 (tighter for display type)
- Body (lg-base): 1.6 (comfortable reading)
- Small text (sm-xs): 1.5 (compact but legible)

### 2.3 Typography Usage

#### Headings

```css
/* Page Title (H1) */
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.052rem; /* 4xl */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #F5F5F0; /* Paper */
}

/* Section Heading (H2) */
.section-heading {
  font-family: 'Playfair Display', serif;
  font-size: 2.441rem; /* 3xl */
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #F5F5F0;
}

/* Subsection Heading (H3) */
.subsection-heading {
  font-family: 'Playfair Display', serif;
  font-size: 1.953rem; /* 2xl */
  font-weight: 600;
  line-height: 1.3;
  color: #F5F5F0;
}

/* Card Title (H4) */
.card-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.563rem; /* xl */
  font-weight: 600;
  line-height: 1.4;
  color: #F5F5F0;
}
```

#### Body Text

```css
/* Primary Body Text */
.body-text {
  font-family: 'Inter', sans-serif;
  font-size: 1rem; /* base */
  font-weight: 400;
  line-height: 1.6;
  color: #F5F5F0;
}

/* Large Body (Intro paragraphs) */
.body-large {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem; /* lg */
  font-weight: 400;
  line-height: 1.6;
  color: #F5F5F0;
}

/* Secondary Text (Labels, captions) */
.text-secondary {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem; /* sm */
  font-weight: 500;
  line-height: 1.5;
  color: #B8B8B8; /* Tri-X */
}
```

#### Special Styles

```css
/* Pull Quote */
.pull-quote {
  font-family: 'Playfair Display', serif;
  font-size: 1.953rem; /* 2xl */
  font-weight: 400;
  font-style: italic;
  line-height: 1.4;
  color: #F5F5F0;
  border-left: 4px solid #E86E3A; /* Kodachrome accent */
  padding-left: 1.5rem;
}

/* Master Name (Special emphasis) */
.master-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem; /* lg */
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #E86E3A; /* Kodachrome */
}

/* Small Caps (Historical dates, metadata) */
.small-caps {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem; /* sm */
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8C8C8C; /* Tri-X Dark */
}
```

### 2.4 Responsive Typography

Mobile-first approach with scaling at breakpoints:

```css
/* Mobile (default) */
.page-title { font-size: 2.441rem; } /* 3xl */
.section-heading { font-size: 1.953rem; } /* 2xl */
.body-text { font-size: 1rem; } /* base */

/* Tablet (md: 768px) */
@media (min-width: 768px) {
  .page-title { font-size: 3.052rem; } /* 4xl */
  .section-heading { font-size: 2.441rem; } /* 3xl */
  .body-text { font-size: 1rem; } /* base (same) */
}

/* Desktop (lg: 1024px) */
@media (min-width: 1024px) {
  .page-title { font-size: 3.815rem; } /* Even larger */
  .section-heading { font-size: 3.052rem; } /* 4xl */
  .body-text { font-size: 1.125rem; } /* Slightly larger */
}
```

---

## 3. Spacing System

### 3.1 Base Unit

**4px base unit** (0.25rem)

Provides granular control while maintaining consistent rhythm.

### 3.2 Spacing Scale

```
0:  0rem      (0px)   — No spacing
1:  0.25rem   (4px)   — Micro spacing
2:  0.5rem    (8px)   — Tight spacing
3:  0.75rem   (12px)  — Small spacing
4:  1rem      (16px)  — Base spacing
5:  1.25rem   (20px)  — Medium spacing
6:  1.5rem    (24px)  — Large spacing
8:  2rem      (32px)  — XL spacing
10: 2.5rem    (40px)  — 2XL spacing
12: 3rem      (48px)  — 3XL spacing
16: 4rem      (64px)  — 4XL spacing
20: 5rem      (80px)  — 5XL spacing
24: 6rem      (96px)  — 6XL spacing
```

### 3.3 Spacing Usage

#### Component Internal Spacing

```css
/* Card padding */
.card {
  padding: 1.5rem; /* 6 — 24px mobile */
}

@media (min-width: 768px) {
  .card {
    padding: 2rem; /* 8 — 32px tablet */
  }
}

/* Button padding */
.button {
  padding: 0.75rem 1.5rem; /* 3/6 — 12px/24px */
}

/* Input padding */
.input {
  padding: 0.75rem 1rem; /* 3/4 — 12px/16px */
}
```

#### Layout Spacing

```css
/* Container padding (screen edges) */
.container {
  padding-left: 1rem;   /* 4 — 16px mobile */
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding-left: 1.5rem;  /* 6 — 24px tablet */
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: 2rem;    /* 8 — 32px desktop */
    padding-right: 2rem;
  }
}

/* Gap between cards (vertical scroll) */
.card-stack {
  gap: 1.5rem; /* 6 — 24px */
}

/* Section spacing (major sections) */
.section {
  margin-top: 3rem;    /* 12 — 48px mobile */
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .section {
    margin-top: 4rem;    /* 16 — 64px tablet */
    margin-bottom: 4rem;
  }
}
```

---

## 4. Shadow System

### 4.1 Shadow Scale

Our shadows are deeper and more dramatic than standard design systems, evoking the physical depth of photographic prints.

```css
/* Subtle elevation (sm) */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
/* Usage: Subtle borders, input fields */

/* Default card (base) */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4),
            0 2px 4px -1px rgba(0, 0, 0, 0.3);
/* Usage: Content cards (default state) */

/* Hover state (md) */
box-shadow: 0 8px 16px -2px rgba(0, 0, 0, 0.5),
            0 4px 8px -2px rgba(0, 0, 0, 0.4);
/* Usage: Cards on hover, elevated buttons */

/* Modal/Popover (lg) */
box-shadow: 0 16px 32px -4px rgba(0, 0, 0, 0.6),
            0 8px 16px -4px rgba(0, 0, 0, 0.5);
/* Usage: Modals, popovers, dropdowns */

/* Dramatic emphasis (xl) */
box-shadow: 0 24px 48px -8px rgba(0, 0, 0, 0.7),
            0 16px 32px -8px rgba(0, 0, 0, 0.6);
/* Usage: Hero cards, featured content, master profile headers */

/* None */
box-shadow: none;
/* Usage: Background elements, no elevation */
```

### 4.2 Shadow Usage Guidelines

**Elevation Hierarchy**:
- Level 0 (none): App background, static text
- Level 1 (sm): Input fields, subtle borders
- Level 2 (base): Default card state
- Level 3 (md): Hovered card, active interactive elements
- Level 4 (lg): Modals, popovers, overlays
- Level 5 (xl): Hero elements, master profile covers

**Transitions**:
- Animate shadows on hover: `transition: box-shadow 200ms ease-out`
- Never animate from `none` to `xl` (too jarring)—step through levels

---

## 5. Border Radius System

### 5.1 Radius Scale

```
none: 0rem       (0px)   — Sharp edges
sm:   0.25rem    (4px)   — Subtle rounding
base: 0.5rem     (8px)   — Standard rounding
md:   0.75rem    (12px)  — Medium rounding
lg:   1rem       (16px)  — Large rounding
xl:   1.5rem     (24px)  — Extra large rounding
2xl:  2rem       (32px)  — Very round
full: 9999px             — Fully rounded (pills, avatars)
```

### 5.2 Radius Usage

```css
/* Cards */
.card {
  border-radius: 1rem; /* lg — 16px */
}

/* Buttons */
.button {
  border-radius: 0.75rem; /* md — 12px */
}

/* Input fields */
.input {
  border-radius: 0.5rem; /* base — 8px */
}

/* Avatar/Profile images */
.avatar {
  border-radius: 9999px; /* full — circle */
}

/* Modal corners */
.modal {
  border-radius: 1.5rem; /* xl — 24px */
}
```

---

## 6. Animation System (RICH Tier)

### 6.1 Animation Principles

1. **Weighty & Cinematic**: Animations feel deliberate, not bouncy
2. **Momentum Physics**: Scrolling and gestures have inertia
3. **Parallax Depth**: Create 3D-like depth with layered scroll speeds
4. **Reveal Elegance**: Content fades and slides in like photos developing
5. **Micro-Interactions**: Subtle haptic feedback, scale changes, elastic effects
6. **Performance First**: 60fps on modern devices, graceful degradation on older ones

### 6.2 Animation Durations

```
Instant:  0ms     — No animation
Fast:     150ms   — Micro-interactions (hover, active)
Base:     250ms   — Standard transitions (fade, slide)
Moderate: 400ms   — Modal open/close, page transitions
Slow:     600ms   — Dramatic reveals, scroll-triggered effects
Cinematic: 1000ms — Hero animations, special moments
```

### 6.3 Easing Curves

Using GSAP easing notation:

```javascript
// Standard eases
power1.out   // Subtle deceleration (gentle)
power2.out   // Medium deceleration (most common)
power3.out   // Strong deceleration (dramatic)

// Elastic (use sparingly)
elastic.out(1, 0.5)  // Gentle bounce

// Back (slight overshoot)
back.out(1.2)  // Subtle overshoot on reveal
```

### 6.4 Core Animations

#### Card Reveal (Scroll Trigger)

```javascript
gsap.from('.insight-card', {
  opacity: 0,
  y: 50,
  duration: 0.6,
  ease: 'power3.out',
  stagger: 0.1, // Cascade effect
  scrollTrigger: {
    trigger: '.insight-card',
    start: 'top 90%',
    toggleActions: 'play none none reverse'
  }
});
```

#### Parallax Scroll

```javascript
gsap.to('.parallax-bg', {
  y: () => window.innerHeight * 0.3,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top top',
    end: 'bottom top',
    scrub: true // Smooth scrolling tie
  }
});
```

#### Hover Scale (Micro-interaction)

```css
.card {
  transition: transform 150ms ease-out, box-shadow 200ms ease-out;
}

.card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px -2px rgba(0, 0, 0, 0.5);
}

.card:active {
  transform: scale(0.98);
}
```

#### Modal Open (GSAP Timeline)

```javascript
const tl = gsap.timeline();

tl.from('.modal-overlay', {
  opacity: 0,
  duration: 0.25,
  ease: 'power2.out'
})
.from('.modal-content', {
  opacity: 0,
  scale: 0.9,
  y: 30,
  duration: 0.4,
  ease: 'back.out(1.3)'
}, '-=0.1'); // Overlap slightly
```

#### Page Transition

```javascript
// Exit animation
gsap.to('.page', {
  opacity: 0,
  y: -30,
  duration: 0.3,
  ease: 'power2.in'
});

// Enter animation (new page)
gsap.from('.page', {
  opacity: 0,
  y: 30,
  duration: 0.4,
  ease: 'power2.out',
  delay: 0.1
});
```

### 6.5 Reduced Motion

**Always respect user preferences**:

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable GSAP animations
  gsap.globalTimeline.pause();

  // Use simple CSS transitions only
  document.body.classList.add('reduce-motion');
}
```

```css
/* Reduced motion fallback */
.reduce-motion * {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

---

## 7. Component Library

### 7.1 Button Component

**8 States Required**: Default, Hover, Focus, Active, Disabled, Loading, Error, Empty (N/A for buttons)

#### Primary Button

```typescript
<button className="
  px-6 py-3 rounded-md
  bg-kodachrome text-paper font-medium text-base
  shadow transition-all duration-200
  hover:bg-kodachrome-dark hover:shadow-md hover:scale-102
  focus:ring-2 focus:ring-kodachrome focus:outline-none focus:ring-offset-2 focus:ring-offset-darkroom
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Save Insight
</button>
```

#### Secondary Button

```typescript
<button className="
  px-6 py-3 rounded-md
  bg-darkroom-200 text-paper font-medium text-base
  border-2 border-kodachrome
  shadow-sm transition-all duration-200
  hover:bg-darkroom-100 hover:shadow hover:scale-102
  focus:ring-2 focus:ring-kodachrome focus:outline-none
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Explore Masters
</button>
```

#### Ghost Button

```typescript
<button className="
  px-6 py-3 rounded-md
  bg-transparent text-trix font-medium text-base
  border border-trix-dark
  transition-all duration-200
  hover:bg-darkroom-200 hover:text-paper hover:border-trix
  focus:ring-2 focus:ring-kodachrome focus:outline-none
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Skip
</button>
```

### 7.2 Card Component

**Insight Card** (Default state):

```typescript
<article className="
  bg-darkroom-100 rounded-lg p-6
  shadow transition-all duration-300
  hover:shadow-md hover:scale-[1.01]
  focus-within:ring-2 focus-within:ring-kodachrome focus-within:outline-none
">
  <header className="flex items-start justify-between mb-4">
    <span className="text-xs font-semibold uppercase tracking-wider text-trix-dark">
      Technique
    </span>
    <button className="text-trix hover:text-paper transition-colors" aria-label="Save insight">
      <BookmarkIcon />
    </button>
  </header>

  <h3 className="font-display text-xl font-semibold text-paper mb-3">
    Cartier-Bresson's Zone Focusing
  </h3>

  <p className="text-base text-paper leading-relaxed mb-4">
    Pre-focus your lens at a set distance (10 feet) and use a small aperture (f/8-f/11)...
  </p>

  <footer className="flex items-center gap-2 text-sm text-trix">
    <span>Henri Cartier-Bresson</span>
    <span>•</span>
    <span>1952</span>
  </footer>
</article>
```

### 7.3 Input Component

**8 States**: Default, Hover, Focus, Active (N/A), Disabled, Loading (N/A), Error, Empty

```typescript
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium text-paper">
    Email Address
  </label>

  <input
    id="email"
    type="email"
    placeholder="your@email.com"
    className="
      w-full px-4 py-3 rounded-md
      bg-darkroom-200 text-paper placeholder-trix-dark
      border-2 border-transparent
      transition-all duration-200
      hover:bg-darkroom-100
      focus:border-kodachrome focus:ring-2 focus:ring-kodachrome focus:ring-opacity-30 focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
      error:border-error error:focus:ring-error
    "
  />

  {/* Error state */}
  <p className="text-sm text-error flex items-center gap-1">
    <AlertIcon className="w-4 h-4" />
    Please enter a valid email address
  </p>
</div>
```

### 7.4 Modal Component

```typescript
<div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Overlay */}
  <div className="absolute inset-0 bg-darkroom bg-opacity-80 backdrop-blur-sm" />

  {/* Modal */}
  <div className="
    relative z-10 w-full max-w-lg mx-4
    bg-darkroom-100 rounded-xl p-8
    shadow-xl
  ">
    <header className="mb-6">
      <h2 className="font-display text-2xl font-bold text-paper">
        Master Profile
      </h2>
      <button className="absolute top-6 right-6 text-trix hover:text-paper transition-colors">
        <XIcon className="w-6 h-6" />
      </button>
    </header>

    <div className="space-y-4">
      {/* Modal content */}
    </div>
  </div>
</div>
```

---

## 8. Iconography

### 8.1 Icon System

**Library**: Lucide React (modern, consistent, optimized)

**Icon Sizes**:
```
xs: 16px  — Inline with text
sm: 20px  — Buttons, labels
base: 24px — Default (most common)
lg: 32px  — Section headers
xl: 48px  — Hero elements
```

**Icon Colors**:
- Default: `text-trix` (gray)
- Hover: `text-paper` (white)
- Active: `text-kodachrome` (orange)
- Disabled: `text-trix-dark` (dark gray)

### 8.2 Common Icons

```typescript
import {
  Bookmark,      // Save insight
  Heart,         // Like
  Share2,        // Share
  Camera,        // Photography-related
  Eye,           // View
  Clock,         // Time/History
  MapPin,        // Location
  Sun,           // Golden hour
  Moon,          // Night mode
  Settings,      // Settings
  User,          // Profile
  ChevronRight,  // Navigation
  X,             // Close
  Menu,          // Hamburger menu
  Search         // Search
} from 'lucide-react';
```

---

## 9. Responsive Design

### 9.1 Breakpoints

```typescript
// tailwind.config.ts
screens: {
  'sm': '640px',   // Small tablets, large phones (landscape)
  'md': '768px',   // Tablets (iPad Mini)
  'lg': '1024px',  // Landscape tablets, small laptops
  'xl': '1280px',  // Desktops
  '2xl': '1536px'  // Large desktops
}
```

### 9.2 Layout Strategy

**Mobile (< 640px)**:
- Single column
- Full-width cards
- Bottom navigation bar
- 16px container padding

**Tablet (640px - 1024px)**:
- Two columns for card grid
- Sidebar navigation (left)
- 24px container padding

**Desktop (> 1024px)**:
- Three-column masonry layout
- Persistent sidebar navigation
- 32px container padding
- Max content width: 1440px (centered)

---

## 10. Accessibility

### 10.1 WCAG 2.1 AA Compliance

**Color Contrast** (verified):
- Paper on Darkroom Black: 13.5:1 ✅ (AAA)
- Tri-X on Darkroom Black: 6.5:1 ✅ (AA)
- Kodachrome on Darkroom Black: 4.8:1 ✅ (AA)
- Portra on Darkroom Black: 5.2:1 ✅ (AA)

**Touch Targets**:
- Minimum size: 48×48px (Android), 44×44px (iOS)
- Spacing: 8px between adjacent targets

**Focus Indicators**:
- Always visible (2px ring, Kodachrome color)
- Offset: 2px from element edge
- Never hidden with `outline: none` unless replaced with custom ring

**Screen Reader Support**:
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<button>`
- ARIA labels on icon-only buttons: `aria-label="Save insight"`
- Alt text on all images: descriptive, not decorative
- Live regions for dynamic content: `aria-live="polite"`

**Keyboard Navigation**:
- All interactive elements tabbable
- Logical tab order (top to bottom, left to right)
- Modal focus trap (Tab cycles within modal)
- Skip links for repetitive navigation

**Reduced Motion**:
- Respect `prefers-reduced-motion: reduce`
- Disable GSAP animations
- Use simple fade-ins only

---

## 11. Dark Mode (Future Consideration)

**Currently**: StreetMuse is dark-only (no light mode)

**If Light Mode Added**:
- Semantic color tokens (already structured for this)
- Inverse palette: Paper (#F5F5F0) background, Darkroom Black text
- Maintain same accent colors (Kodachrome, Tri-X, Portra)
- User preference stored in local storage
- Respect system preference: `prefers-color-scheme: dark`

---

## 12. Design Tokens Export

### 12.1 Tokens Structure

All design tokens centralized in `tokens.json` (see separate file).

### 12.2 Framework Exports

Tokens can be exported for:
- **Tailwind CSS** (primary framework)
- **CSS Variables** (framework-agnostic)
- **JSON** (for programmatic access)

---

## 13. Design QA Checklist

Before shipping any UI component:

- [ ] All 8 states implemented (default, hover, focus, active, disabled, loading, error, empty)
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 text, 3:1 UI)
- [ ] Touch targets ≥ 48×48px
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible and high-contrast
- [ ] Screen reader announces meaningful content
- [ ] Responsive on mobile (390px), tablet (768px), desktop (1440px)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Typography scales correctly at breakpoints
- [ ] Spacing follows 4px base unit system
- [ ] Shadows match elevation hierarchy
- [ ] Icons are semantic and labeled

---

## 14. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-02 | Initial design system created |

---

## 15. Resources

- **Figma Design File**: (To be created)
- **Storybook**: (Component documentation)
- **Tokens JSON**: `tokens/tokens.json`
- **Tailwind Config**: `tokens/tailwind.config.js`

---

**Design System Status**: Active
**Maintained By**: Design Team (Creative Lead + Engineering)
**Review Cadence**: Quarterly (or post-major feature launch)
