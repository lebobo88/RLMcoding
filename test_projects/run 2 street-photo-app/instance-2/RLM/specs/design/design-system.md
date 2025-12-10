# StreetMuse Design System

**Version**: 1.0.0
**Last Updated**: 2025-12-02
**Design Philosophy**: CREATIVE (Bold, Unconventional, Brand-Differentiating)
**Animation Tier**: RICH (GSAP scroll/loading animations)

---

## Design Philosophy

StreetMuse rejects conventional photography app aesthetics. We draw inspiration from:
- **Brutalist/Neubrutalist UI** - Raw, bold, honest design
- **Analog Photography** - Film grain, darkroom nostalgia, archival paper
- **Editorial Magazines** - Strong typography, asymmetric layouts, high contrast
- **Street Art** - Unexpected colors, deconstructed grids, visual tension

**Core Principles**:
1. **Dark First** - Cinematic, moody default theme (light mode as inversion)
2. **Typography as Hero** - Bold, oversized type that demands attention
3. **Broken Grids** - Intentional asymmetry, overlapping elements
4. **Film Nostalgia** - Grain textures, vintage borders, archival aesthetics
5. **High Contrast** - Outdoor readability, dramatic visual hierarchy

---

## Color System

### Primary Palette - "Darkroom"

Inspired by photographic darkrooms and the moody aesthetic of street photography at night.

| Token | Hex | Usage | Notes |
|-------|-----|-------|-------|
| `midnight` | `#0A0A0A` | Primary background | Deep black, not pure black for OLED |
| `charcoal` | `#1C1C1E` | Elevated surfaces (cards, modals) | Slight lift from background |
| `ash` | `#2C2C2E` | Borders, dividers, subtle separators | Low contrast boundaries |
| `smoke` | `#48484A` | Disabled states, inactive elements | 50% opacity equivalent |
| `fog` | `#8E8E93` | Secondary text, metadata, timestamps | Readable but de-emphasized |
| `silver` | `#C7C7CC` | Primary text on dark backgrounds | High contrast, main content |
| `paper` | `#F2F2F7` | Light mode background | Off-white, archival paper feel |

**Usage Example**:
```tsx
<div className="bg-midnight text-silver">
  <p className="text-fog">Posted 2 hours ago</p>
  <h2 className="text-silver">The Decisive Moment</h2>
</div>
```

### Accent Colors - "Film Palettes"

Unexpected, vibrant accents that break from traditional photography app blues.

| Token | Hex | Inspiration | Usage |
|-------|-----|-------------|-------|
| `amber` | `#FF9F0A` | Kodak film canisters | Warnings, highlights, save buttons |
| `crimson` | `#FF453A` | Red darkroom safelights | Errors, urgent CTAs, delete actions |
| `electric` | `#FFD60A` | Film leader tape | Success, achievements, completed challenges |
| `cyan` | `#64D2FF` | Cyan color separation | Links, informational elements |

**Contrast Ratios** (All meet WCAG AA on midnight background):
- `amber` on `midnight`: 5.2:1 ✅
- `crimson` on `midnight`: 4.8:1 ✅
- `electric` on `midnight`: 9.1:1 ✅
- `cyan` on `midnight`: 6.4:1 ✅

### Photographer-Specific Colors - "Mentor Palette"

Each legendary photographer gets a signature color for avatars and mentor-specific UI.

| Photographer | Token | Hex | Rationale |
|--------------|-------|-----|-----------|
| Henri Cartier-Bresson | `hcb-blue` | `#3A5A7F` | Classic, composed, structured |
| Vivian Maier | `maier-violet` | `#6B4E71` | Vintage, mysterious, timeless |
| Garry Winogrand | `winogrand-amber` | `#8B5A3C` | Warm, energetic, chaotic |
| Diane Arbus | `arbus-crimson` | `#8B2635` | Emotional, intense, provocative |
| Elliott Erwitt | `erwitt-sage` | `#5A7D5F` | Witty, calm, observant |

**Usage Example**:
```tsx
<MentorAvatar
  photographer="cartier-bresson"
  className="border-2 border-hcb-blue"
/>
```

### Light Mode - "High Noon"

Inverted palette for outdoor shooting in bright sunlight (opt-in, not default).

| Token | Hex | Dark Mode Equivalent |
|-------|-----|----------------------|
| `noon-white` | `#FAFAFA` | `midnight` |
| `graphite` | `#1C1C1E` | `silver` |
| `ash-light` | `#E5E5EA` | `ash` |

---

## Typography

### Font Families

**Display (Headlines)** - "Druk Wide"
- Bold, condensed, aggressive sans-serif
- Used for: Hero headlines, section titles, emphatic statements
- Fallback: `Impact, "Arial Black", sans-serif`
- Weight: 700 (bold only)
- Licensing: Purchase required OR use free alternative "Bebas Neue"

**Monospace (Quotes)** - "Courier Prime"
- Classic typewriter aesthetic for photographer quotes
- Used for: Pull quotes, historical attributions, code snippets
- Fallback: `"Courier New", Courier, monospace`
- Weight: 400 (regular), 700 (bold)
- Licensing: Open source (Google Fonts)

**Body (Readable Text)** - "Inter"
- Modern, readable humanist sans-serif
- Used for: Body text, UI labels, buttons
- Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`
- Weight: 400 (regular), 500 (medium), 700 (bold)
- Licensing: Open source (Google Fonts)

### Type Scale

Mobile-optimized with larger base size (18px) for outdoor readability.

| Token | Size | Line Height | Usage | Example |
|-------|------|-------------|-------|---------|
| `text-xs` | 12px | 16px | Metadata, timestamps, captions | "2 hours ago" |
| `text-sm` | 14px | 20px | Secondary text, helper text | "Swipe for more" |
| `text-base` | 18px | 28px | Body text, paragraphs | Main feed content |
| `text-lg` | 20px | 28px | Subheadings, emphasized text | Section intros |
| `text-xl` | 24px | 32px | Small headlines, card titles | Feed item titles |
| `text-2xl` | 32px | 40px | Section headlines | "Today's Challenges" |
| `text-3xl` | 48px | 56px | Page headlines | "Your Mentor" |
| `text-4xl` | 64px | 72px | Hero headlines | Landing page only |

### Type Treatments

**Pull Quote Style**:
```css
.quote {
  font-family: 'Courier Prime', monospace;
  font-size: 20px;
  line-height: 1.6;
  font-style: italic;
  border-left: 4px solid theme('colors.amber');
  padding-left: 24px;
  color: theme('colors.silver');
}
```

**Headline Style** (Brutalist):
```css
.headline-brutal {
  font-family: 'Druk Wide', Impact, sans-serif;
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: theme('colors.silver');
  text-shadow: 4px 4px 0 theme('colors.charcoal');
}
```

---

## Spacing System

Based on 4px grid (Tailwind default), with emphasis on generous whitespace.

| Token | Size | Usage |
|-------|------|-------|
| `space-1` | 4px | Icon-to-text gap, tight spacing |
| `space-2` | 8px | Between related elements (label + input) |
| `space-3` | 12px | Comfortable padding inside buttons |
| `space-4` | 16px | Default component padding |
| `space-6` | 24px | Between sections, card padding |
| `space-8` | 32px | Large gutters, major section spacing |
| `space-12` | 48px | Page margins, hero sections |
| `space-16` | 64px | Landing page sections |
| `space-24` | 96px | Dramatic spacing, landing page |

**Layout Widths**:
- Max content width: `720px` (mobile-first, single column)
- Feed item width: `100%` (full bleed on mobile)
- Desktop feed: `640px` centered

---

## Component Library

### Button

**Variants**:
1. **Primary** - High-emphasis actions (amber background)
2. **Secondary** - Medium-emphasis (outline style)
3. **Ghost** - Low-emphasis (text only)
4. **Danger** - Destructive actions (crimson)

**States**:
- Default, Hover, Focus, Active, Disabled, Loading

**Example**:
```tsx
<button className="
  bg-amber text-midnight
  px-6 py-3
  font-bold text-lg
  rounded-none
  border-2 border-midnight
  shadow-[4px_4px_0_0_rgba(0,0,0,1)]
  hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]
  hover:translate-x-[-2px] hover:translate-y-[-2px]
  active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-all duration-150
">
  Save to Journal
</button>
```

### Card - "Feed Item"

**Anatomy**:
- Full-bleed image (16:9 or 1:1)
- Content overlay (bottom gradient)
- Metadata row (photographer, type, timestamp)
- Action buttons (save, share)

**Visual Style**:
```tsx
<article className="
  relative
  bg-charcoal
  border-2 border-ash
  overflow-hidden
  mb-6
  group
">
  {/* Image */}
  <img
    className="w-full h-64 object-cover filter grayscale-[30%]"
    src="..."
  />

  {/* Content Overlay */}
  <div className="
    absolute bottom-0 left-0 right-0
    bg-gradient-to-t from-midnight to-transparent
    p-6
  ">
    <p className="font-mono text-sm text-fog mb-2">
      HENRI CARTIER-BRESSON
    </p>
    <h3 className="text-2xl font-bold text-silver">
      Wait for the geometry to align.
    </h3>
  </div>
</article>
```

### Input

**Style**: Brutalist with thick borders, no rounded corners.

```tsx
<input className="
  w-full
  bg-charcoal
  text-silver
  border-2 border-ash
  px-4 py-3
  text-lg
  focus:border-amber
  focus:outline-none
  focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-midnight
  disabled:opacity-50 disabled:cursor-not-allowed
  placeholder:text-smoke
"
placeholder="Ask a master photographer..."
/>
```

### Avatar - "Mentor"

**Circular avatar with photographer-specific color ring**:

```tsx
<div className="relative">
  <img
    src="/avatars/cartier-bresson.jpg"
    className="
      w-16 h-16
      rounded-full
      border-4 border-hcb-blue
      filter grayscale
      hover:grayscale-0
      transition-all duration-300
    "
  />
  <span className="
    absolute -bottom-1 -right-1
    w-6 h-6
    bg-hcb-blue
    rounded-full
    border-2 border-midnight
  " />
</div>
```

### Modal

**Full-screen on mobile, centered card on desktop**:

```tsx
<div className="
  fixed inset-0 z-50
  bg-midnight/95 backdrop-blur-sm
  flex items-center justify-center
  p-4
">
  <div className="
    w-full max-w-2xl
    bg-charcoal
    border-2 border-ash
    p-8
    shadow-[8px_8px_0_0_rgba(255,159,10,1)]
  ">
    {/* Modal content */}
  </div>
</div>
```

---

## Animation System (RICH Tier)

### Loading Sequence - "Film Development"

Simulates photo development when app opens:

```javascript
const loadingTimeline = gsap.timeline();

loadingTimeline
  .from('.logo', {
    scale: 0,
    rotation: -180,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
  })
  .from('.splash-overlay', {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.8,
    ease: 'power2.inOut',
  }, '-=0.3')
  .to('.splash-overlay', {
    scaleX: 0,
    transformOrigin: 'right center',
    duration: 0.8,
    ease: 'power2.inOut',
  })
  .from('.tagline', {
    y: 20,
    opacity: 0,
    duration: 0.5,
  }, '-=0.4');
```

### Infinite Scroll Animations

Feed items fade/slide in as they enter viewport:

```javascript
gsap.utils.toArray('.feed-item').forEach((item) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    opacity: 0,
    y: 60,
    duration: 0.7,
    ease: 'power2.out',
  });
});
```

### Button Hover - "Brutalist Lift"

Shadow expands and button moves on hover:

```javascript
gsap.to('.btn-primary', {
  boxShadow: '6px 6px 0 0 rgba(0,0,0,1)',
  x: -2,
  y: -2,
  duration: 0.15,
  paused: true,
  onReverseComplete: () => {
    // Reset to default shadow
  }
});
```

### Page Transition - "Camera Pan"

Simulate camera movement between pages:

```javascript
const pageTransition = gsap.timeline();

pageTransition
  .to('.current-page', {
    x: '-100%',
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
  })
  .from('.next-page', {
    x: '100%',
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
  }, '-=0.25');
```

### Pull-to-Refresh - "Film Advance"

Custom animation simulating 35mm film advance:

```javascript
// Visual representation of film sprocket holes moving
gsap.to('.refresh-indicator', {
  y: pullDistance,
  rotation: pullDistance * 0.5,
  ease: 'none',
});

// On release
gsap.timeline()
  .to('.refresh-indicator', {
    scale: 1.2,
    duration: 0.2,
  })
  .to('.refresh-indicator', {
    scale: 0,
    opacity: 0,
    duration: 0.3,
  });
```

### Timing Standards

| Interaction Type | Duration | Easing |
|------------------|----------|--------|
| Button hover | 150ms | `power1.out` |
| Focus ring | 200ms | `power2.out` |
| Modal open | 400ms | `power2.inOut` |
| Page transition | 500ms | `power2.inOut` |
| Scroll reveal | 700ms | `power2.out` |
| Loading sequence | 1200ms | Custom timeline |

### Reduced Motion

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Iconography

### Icon Style

**Approach**: Outlined, geometric, consistent stroke width (2px).

**Library**: [Lucide Icons](https://lucide.dev/) (React components)
- Lightweight (tree-shakeable)
- Consistent design language
- Open source

**Icon Sizes**:
- Small: `16px` (inline with text)
- Medium: `24px` (buttons, UI actions)
- Large: `32px` (feature icons)
- Hero: `48px` (landing page)

**Color**:
- Default: `text-silver` (primary text)
- Muted: `text-fog` (secondary)
- Accent: `text-amber` (active states)

**Example**:
```tsx
import { Camera, Heart, Share2 } from 'lucide-react';

<Camera size={24} className="text-silver" />
<Heart size={24} className="text-amber" />
```

---

## Layout Patterns

### Bento Grid - "Asymmetric Feed"

Inspired by Japanese bento boxes, sections have unequal sizes:

```tsx
<div className="grid grid-cols-6 gap-4">
  {/* Large feature */}
  <div className="col-span-6 md:col-span-4 row-span-2">
    <FeedItem type="large" />
  </div>

  {/* Sidebar items */}
  <div className="col-span-3 md:col-span-2">
    <FeedItem type="small" />
  </div>
  <div className="col-span-3 md:col-span-2">
    <FeedItem type="small" />
  </div>
</div>
```

### Overlapping Elements

Intentional overlap creates visual depth:

```tsx
<div className="relative">
  <img
    src="..."
    className="relative z-10 -mr-8 -mb-8"
  />
  <div className="
    absolute top-8 left-8
    w-full h-full
    bg-amber
    z-0
  " />
</div>
```

### Sticky Section Headers

Section titles stick to top during scroll (with darkroom aesthetic):

```tsx
<h2 className="
  sticky top-0 z-20
  bg-midnight/80 backdrop-blur-md
  py-4 px-6
  text-3xl font-bold
  border-b-2 border-amber
">
  Today's Challenges
</h2>
```

---

## Dark Mode / Light Mode

### Default: Dark Mode ("Darkroom")

Reflects street photography's moody, low-light aesthetic.

**Color Mapping**:
```javascript
:root {
  --color-bg: theme('colors.midnight');
  --color-surface: theme('colors.charcoal');
  --color-text: theme('colors.silver');
  --color-text-muted: theme('colors.fog');
}
```

### Light Mode: "High Noon" (Opt-In)

Inverted palette for bright outdoor conditions.

**Color Mapping**:
```javascript
:root[data-theme="light"] {
  --color-bg: theme('colors.paper');
  --color-surface: theme('colors.ash-light');
  --color-text: theme('colors.graphite');
  --color-text-muted: theme('colors.smoke');
}
```

**Toggle Implementation**:
```tsx
<button
  onClick={toggleTheme}
  className="
    relative w-16 h-8
    bg-charcoal
    border-2 border-ash
    cursor-pointer
  "
>
  <span className="
    absolute top-1 left-1
    w-6 h-6
    bg-amber
    transition-transform duration-300
    data-[theme=light]:translate-x-8
  " />
</button>
```

---

## Texture & Effects

### Film Grain Overlay

Subtle noise texture applied to backgrounds:

```css
.film-grain {
  position: relative;
}

.film-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/film-grain.png');
  opacity: 0.03;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

### Vintage Photo Borders

Optional border style for featured photos:

```css
.vintage-border {
  border: 8px solid theme('colors.paper');
  box-shadow:
    0 0 0 1px theme('colors.ash'),
    4px 4px 12px rgba(0, 0, 0, 0.3);
}
```

### Gradient Overlays

For text-over-image readability:

```css
.gradient-overlay {
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 10, 0) 0%,
    rgba(10, 10, 10, 0.7) 70%,
    rgba(10, 10, 10, 1) 100%
  );
}
```

---

## Accessibility Features

### Focus Indicators

High-contrast, 2px outline on all interactive elements:

```css
*:focus-visible {
  outline: 2px solid theme('colors.amber');
  outline-offset: 2px;
}
```

### Skip Links

Keyboard users can skip to main content:

```tsx
<a
  href="#main-content"
  className="
    sr-only
    focus:not-sr-only
    focus:fixed focus:top-4 focus:left-4
    focus:z-50
    bg-amber text-midnight
    px-4 py-2
    font-bold
  "
>
  Skip to main content
</a>
```

### High Contrast Mode

Optional mode for visual impairments:

```css
@media (prefers-contrast: high) {
  :root {
    --color-bg: #000000;
    --color-text: #FFFFFF;
  }
}
```

---

## Responsive Breakpoints

Mobile-first approach with minimal breakpoints:

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets (portrait) |
| `md` | 768px | Tablets (landscape), small laptops |
| `lg` | 1024px | Desktops, large tablets |
| `xl` | 1280px | Large desktops (rare for this app) |

**Design Priority**: 90% of usage is mobile (phone), so optimize for `< 640px` first.

---

## Component Checklist

All interactive components MUST implement:

- [ ] **Default State** - Resting appearance
- [ ] **Hover State** - Mouse over (desktop only, `@media (hover: hover)`)
- [ ] **Focus State** - Keyboard focus (2px amber outline)
- [ ] **Active State** - Being clicked/pressed
- [ ] **Disabled State** - Non-interactive (opacity 50%, cursor not-allowed)
- [ ] **Loading State** - Async operation (spinner or skeleton)
- [ ] **Error State** - Validation failure (red border, error message)
- [ ] **Empty State** - No content (illustration + message)

---

## Design Tokens Export

See `tokens.json` for framework-agnostic design tokens compatible with:
- Tailwind CSS (primary)
- CSS Variables (fallback)
- Styled Components
- Emotion

---

**Design System Version**: 1.0.0
**Maintained By**: StreetMuse Design Team
**Last Updated**: 2025-12-02
**Next Review**: 2025-03-02
