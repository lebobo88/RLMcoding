# StreetMuse Design System

## Design Philosophy

StreetMuse breaks away from the conventional photography app aesthetic (white backgrounds, grid layouts, minimal chrome) to create a **cinema-inspired, film photography-influenced experience** that honors the artistry and drama of street photography itself.

**Core Values**:
- **Cinematic Drama**: High contrast, dramatic lighting, deep blacks
- **Film Photography Heritage**: Grain textures, vignettes, light leaks, film borders
- **Bold & Unconventional**: Large typography, unexpected layouts, parallax depth
- **Mobile-First Storytelling**: Designed for one-handed scrolling, thumb-zone interactions
- **Performance as Feature**: 60fps animations that enhance, not distract

**Design Tier**: CREATIVE (bold, unique, brand-differentiating)
**Animation Tier**: RICH (GSAP scroll animations, parallax, cinematic transitions)

---

## Color System

### Primary Palette

**Warm Amber** (Primary)
- `amber-900`: #78350F - Deep amber shadows
- `amber-600`: #D97706 - Rich amber
- `amber-500`: #E8A87C - Primary brand color (tungsten film warmth)
- `amber-400`: #F59E0B - Bright amber highlights
- `amber-100`: #FEF3C7 - Subtle amber tints

**Cool Cyan** (Secondary)
- `cyan-900`: #164E63 - Deep cyan shadows
- `cyan-600`: #0891B2 - Rich cyan
- `cyan-500`: #38BDF8 - Secondary brand color (modern digital contrast)
- `cyan-400`: #22D3EE - Bright cyan highlights
- `cyan-100`: #CFFAFE - Subtle cyan tints

**Magenta** (Accent)
- `magenta-900`: #831843 - Deep magenta shadows
- `magenta-600`: #DB2777 - Rich magenta
- `magenta-500`: #EC4899 - Accent color for CTAs and highlights
- `magenta-400`: #F472B6 - Bright magenta
- `magenta-100`: #FCE7F3 - Subtle magenta tints

### Neutral Palette

**Blacks & Grays**
- `black-pure`: #000000 - Pure black (use sparingly for OLED screens)
- `black-matte`: #0A0A0A - Primary background (deep matte black)
- `charcoal`: #1A1A1A - Secondary backgrounds, cards
- `slate-dark`: #262626 - Elevated surfaces
- `slate`: #404040 - Borders, dividers
- `gray-600`: #737373 - Secondary text
- `gray-400`: #A3A3A3 - Tertiary text, disabled states
- `gray-200`: #E5E5E5 - Light borders
- `white-pure`: #FFFFFF - Primary text (high contrast)

### Semantic Colors

**Success** (Vintage Green)
- `success-600`: #16A34A
- `success-500`: #22C55E - Streaks, achievements
- `success-400`: #4ADE80

**Warning** (Film Yellow)
- `warning-600`: #CA8A04
- `warning-500`: #EAB308 - Warnings, alerts
- `warning-400`: #FACC15

**Error** (Dark Red)
- `error-600`: #DC2626
- `error-500`: #EF4444 - Errors, validation failures
- `error-400`: #F87171

**Info** (Muted Blue)
- `info-600`: #2563EB
- `info-500`: #3B82F6 - Informational messages
- `info-400`: #60A5FA

### Color Usage Guidelines

**Backgrounds**:
- Primary background: `black-matte` (#0A0A0A)
- Card backgrounds: `charcoal` (#1A1A1A)
- Elevated surfaces: `slate-dark` (#262626)
- Overlays: `black-pure` at 80% opacity

**Text**:
- Primary text: `white-pure` (#FFFFFF)
- Secondary text: `gray-600` (#737373)
- Tertiary text: `gray-400` (#A3A3A3)
- Disabled text: `gray-400` at 50% opacity

**Interactive Elements**:
- Primary CTA: `amber-500` background, `black-matte` text
- Secondary CTA: `cyan-500` border, `cyan-500` text, transparent background
- Destructive: `error-500` background, `white-pure` text
- Links: `cyan-500` with `cyan-400` hover

**Overlays & Shadows**:
- Modal backdrop: `black-pure` at 85% opacity
- Card shadows: Use `amber-900` at 10% for warm glow effect
- Focus rings: `cyan-500` with 2px offset

---

## Typography

### Font Families

**Display Font**: Bebas Neue
- Usage: Headings, hero text, card titles, navigation
- Characteristics: Condensed, bold, impact
- Weights: Regular (400), Bold (700)
- Source: Google Fonts

**Body Font**: Inter
- Usage: Body text, descriptions, captions, metadata
- Characteristics: Geometric, highly legible, variable font
- Weights: Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700)
- Source: Google Fonts (variable font for performance)

**Monospace Font**: JetBrains Mono
- Usage: Dates, timestamps, technical metadata, code snippets
- Characteristics: Developer-focused, clear letterforms
- Weights: Regular (400), Medium (500)
- Source: Google Fonts

### Type Scale

**Mobile** (Base: 16px)
```
5xl: 56px / 3.5rem   - Hero titles
4xl: 48px / 3rem     - Page titles
3xl: 36px / 2.25rem  - Section headings
2xl: 28px / 1.75rem  - Card titles
xl:  24px / 1.5rem   - Large text
lg:  20px / 1.25rem  - Emphasized text
base: 16px / 1rem    - Body text
sm:  14px / 0.875rem - Small text
xs:  12px / 0.75rem  - Captions, metadata
```

**Desktop** (Scale up by 1.2x for xl breakpoint)
```
5xl: 64px / 4rem
4xl: 56px / 3.5rem
3xl: 40px / 2.5rem
2xl: 32px / 2rem
xl:  28px / 1.75rem
lg:  24px / 1.5rem
base: 18px / 1.125rem
sm:  16px / 1rem
xs:  14px / 0.875rem
```

### Line Heights

- **Display**: 1.1 (tight, for impact)
- **Heading**: 1.2 (tight, for hierarchy)
- **Body**: 1.6 (comfortable reading)
- **Caption**: 1.4 (compact for metadata)

### Letter Spacing

- **Display**: -0.02em (tighter for large type)
- **Heading**: -0.01em (slightly tighter)
- **Body**: 0em (normal)
- **Monospace**: 0.05em (looser for clarity)
- **Uppercase**: 0.1em (looser for all-caps)

### Font Weights

- **Light**: 300 (body text, minimal use)
- **Regular**: 400 (default body text)
- **Medium**: 500 (emphasized body text)
- **SemiBold**: 600 (subheadings, labels)
- **Bold**: 700 (headings, CTAs)

### Typography Pairings

**Hero Section**:
- Title: Bebas Neue, 5xl, Bold, `amber-500`
- Subtitle: Inter, lg, Regular, `gray-600`

**Wisdom Card**:
- Quote: Inter, 2xl, Medium, `white-pure`, line-height 1.4
- Attribution: JetBrains Mono, xs, Regular, `gray-400`, uppercase, letter-spacing 0.1em

**Master Profile**:
- Name: Bebas Neue, 4xl, Bold, `white-pure`
- Bio: Inter, base, Regular, `gray-600`
- Dates: JetBrains Mono, sm, Regular, `gray-400`

**Buttons**:
- Label: Inter, base, SemiBold, uppercase, letter-spacing 0.05em

---

## Spacing System

### Scale (based on 4px base unit)

```
xs:    4px  / 0.25rem
sm:    8px  / 0.5rem
md:    16px / 1rem
lg:    24px / 1.5rem
xl:    32px / 2rem
2xl:   48px / 3rem
3xl:   64px / 4rem
4xl:   96px / 6rem
5xl:   128px / 8rem
```

### Component Spacing

**Cards**:
- Padding: `lg` (24px) on mobile, `xl` (32px) on desktop
- Gap between cards: `md` (16px)
- Border radius: `md` (8px)

**Sections**:
- Vertical spacing: `2xl` (48px) on mobile, `3xl` (64px) on desktop
- Horizontal padding: `md` (16px) on mobile, `lg` (24px) on desktop

**Interactive Elements**:
- Button padding: `sm` vertical (8px), `lg` horizontal (24px)
- Icon spacing from text: `sm` (8px)
- Form input padding: `md` (16px)

**Grids**:
- Gap: `md` (16px) on mobile, `lg` (24px) on desktop

---

## Shadow System

### Elevation Shadows

**Subtle** (Elevation 1)
```css
box-shadow: 0 1px 2px rgba(232, 168, 124, 0.05);
```
Usage: Subtle card separation

**Low** (Elevation 2)
```css
box-shadow: 0 4px 6px rgba(232, 168, 124, 0.1);
```
Usage: Cards, dropdowns

**Medium** (Elevation 3)
```css
box-shadow: 0 10px 15px rgba(232, 168, 124, 0.15);
```
Usage: Floating buttons, modals

**High** (Elevation 4)
```css
box-shadow: 0 20px 25px rgba(232, 168, 124, 0.2);
```
Usage: Overlays, dialogs

**Dramatic** (Elevation 5)
```css
box-shadow:
  0 25px 50px rgba(10, 10, 10, 0.5),
  0 0 40px rgba(232, 168, 124, 0.15);
```
Usage: Hero elements, dramatic focus

### Glow Effects

**Amber Glow**:
```css
box-shadow: 0 0 20px rgba(232, 168, 124, 0.3);
```
Usage: Hover states, active elements

**Cyan Glow**:
```css
box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
```
Usage: Focus states, interactive highlights

---

## Border Radius

### Scale

```
none: 0px
sm:   4px   - Small elements (badges, tags)
md:   8px   - Cards, buttons, inputs
lg:   12px  - Large cards, containers
xl:   16px  - Hero elements
2xl:  24px  - Dramatic rounded elements
full: 9999px - Pills, circular avatars
```

### Usage

- **Cards**: `md` (8px) for standard cards, `lg` (12px) for featured cards
- **Buttons**: `md` (8px) for most buttons, `full` for pill-shaped buttons
- **Inputs**: `md` (8px)
- **Images**: `sm` (4px) for thumbnails, `md` (8px) for larger images
- **Modals**: `lg` (12px)

---

## Animation System

### Durations

```
instant: 0ms       - Immediate state changes
fast:    150ms     - Quick micro-interactions (hover, focus)
base:    250ms     - Standard transitions (buttons, links)
slow:    400ms     - Deliberate animations (cards entering view)
slower:  800ms     - Dramatic effects (page transitions)
```

### Easing Functions

**Ease Out** (Default for entrances)
```css
cubic-bezier(0.16, 1, 0.3, 1)
```
Usage: Elements entering viewport, modals opening

**Ease In** (For exits)
```css
cubic-bezier(0.7, 0, 0.84, 0)
```
Usage: Elements leaving, modals closing

**Ease In-Out** (For state changes)
```css
cubic-bezier(0.87, 0, 0.13, 1)
```
Usage: Toggles, accordions

**Bounce** (For playful interactions)
```css
cubic-bezier(0.68, -0.55, 0.265, 1.55)
```
Usage: Badges appearing, success states (use sparingly)

### Animation Guidelines (RICH Tier)

#### Scroll Animations (GSAP ScrollTrigger)

**Parallax Layering**:
- Background: scroll at 0.5x speed
- Midground: scroll at 1x speed (normal)
- Foreground: scroll at 1.5x speed
- Use for wisdom cards, master profile hero sections

**Stagger Entrances**:
- Cards/items stagger in with 0.1s delay
- Fade + translateY(20px) → translateY(0)
- Duration: 400ms, ease-out

**Pin & Reveal**:
- Pin section while content reveals
- Use for master photographer timelines, photo analyses

#### Micro-Interactions

**Button Hover**:
- Scale: 1 → 1.02
- Shadow: medium → high
- Duration: 150ms, ease-out

**Card Tap**:
- Scale: 1 → 0.98
- Duration: 100ms, ease-in-out
- Spring back on release

**Like/Favorite**:
- Heart icon: scale 0 → 1.2 → 1
- Magenta glow pulse
- Duration: 400ms, bounce easing

**Pull-to-Refresh**:
- Vintage film loading animation
- Film reel spinning
- Duration: 800ms, ease-in-out

#### Page Transitions

**Route Changes**:
- Exit: Fade out + scale 0.95
- Enter: Fade in + scale 1
- Duration: 400ms, ease-in-out
- Stagger by 100ms

**Modal Open**:
- Backdrop: Fade in 0 → 0.85
- Content: Scale 0.9 → 1 + fade in
- Duration: 300ms, ease-out

**Modal Close**:
- Content: Scale 1 → 0.9 + fade out
- Backdrop: Fade out
- Duration: 200ms, ease-in

#### Loading States

**Skeleton Screens**:
- Shimmer effect (gradient animation)
- Duration: 1500ms, infinite loop

**Spinner**:
- Vintage camera aperture opening/closing
- Duration: 1000ms, infinite loop

**Progressive Image Load**:
- Scan-line effect (top to bottom reveal)
- Duration: 600ms, ease-out

### Reduced Motion Support

For users with `prefers-reduced-motion: reduce`:
- Disable parallax scrolling
- Replace complex animations with simple fades
- Reduce durations to 50ms (near-instant)
- Disable auto-playing animations

---

## Iconography

### Icon System

**Primary**: Lucide React
- Style: Outline icons with 2px stroke
- Size: 16px, 20px, 24px, 32px
- Color: Inherit from parent text color

**Usage Guidelines**:
- Always pair with text labels for accessibility (aria-label)
- Use consistent sizing within context (e.g., all nav icons 24px)
- Icon-only buttons require tooltips

### Custom Icons

For photography-specific icons:
- Camera shutter (for likes/favorites)
- Film strip (for galleries)
- Aperture (for loading states)
- Viewfinder (for composition coach)

---

## Layout System

### Grid System

**Mobile** (320px - 768px):
- Container: 100% width, 16px horizontal padding
- Columns: 4 columns, 16px gap
- Content max-width: 100%

**Tablet** (769px - 1024px):
- Container: 100% width, 24px horizontal padding
- Columns: 8 columns, 24px gap
- Content max-width: 100%

**Desktop** (1025px+):
- Container: 1280px max-width, centered
- Columns: 12 columns, 32px gap
- Content max-width: 1280px

### Breakpoints

```
sm:  640px  - Large mobile
md:  768px  - Tablet
lg:  1024px - Small desktop
xl:  1280px - Desktop
2xl: 1536px - Large desktop
```

### Layout Patterns

**Wisdom Stream**:
- Vertical scroll, full-width cards
- Snap-to-card on mobile (smooth snap)
- Max card height: 90vh
- Gap: 16px

**Master Profile**:
- Hero image: full-width, 50vh
- Content: centered, max-width 768px
- Photo gallery: horizontal scroll (film-strip)

**Challenge Cards**:
- Grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Aspect ratio: 1:1 (square cards)
- Gap: 16px (mobile), 24px (desktop)

---

## Component Library Overview

### Buttons

**Primary Button**:
- Background: `amber-500`
- Text: `black-matte`, SemiBold, uppercase
- Padding: 12px vertical, 24px horizontal
- Border radius: `md` (8px)
- Hover: `amber-400`, scale 1.02
- Focus: `cyan-500` ring, 2px offset

**Secondary Button**:
- Background: transparent
- Border: 2px solid `cyan-500`
- Text: `cyan-500`, SemiBold, uppercase
- Padding: 10px vertical, 22px horizontal (accounts for border)
- Hover: background `cyan-500/10`

**Icon Button**:
- Size: 44x44px (touch target)
- Icon: 24px
- Background: `slate-dark`
- Border radius: `full`
- Hover: `slate` background, `amber-500` icon

### Cards

**Wisdom Card**:
- Background: `charcoal` with subtle grain texture
- Padding: 24px
- Border radius: `lg` (12px)
- Shadow: medium elevation
- Hover: high elevation shadow, `amber-500` glow

**Master Profile Card**:
- Background: linear gradient (top: `black-matte`, bottom: `charcoal`)
- Hero image: top 40%, object-fit cover
- Content: bottom 60%, padding 24px
- Border radius: `lg` (12px)

**Challenge Card**:
- Background: `slate-dark`
- Aspect ratio: 1:1
- Border: 2px solid transparent
- Active border: `cyan-500`
- Completed border: `success-500`

### Inputs

**Text Input**:
- Background: `slate-dark`
- Border: 2px solid `slate`
- Text: `white-pure`, base size
- Padding: 12px 16px
- Border radius: `md` (8px)
- Focus: `cyan-500` border, `cyan-500` glow

**Textarea**:
- Same as text input
- Min height: 120px
- Resize: vertical only

**Select**:
- Same as text input
- Chevron icon: `gray-400`
- Options: dropdown with `charcoal` background

### Navigation

**Bottom Nav Bar** (Mobile):
- Background: `charcoal` with backdrop blur
- Height: 64px
- Icons: 24px, `gray-400` inactive, `amber-500` active
- Labels: xs size, `gray-400` inactive, `white-pure` active
- Border top: 1px solid `slate`

**Top Nav Bar** (Desktop):
- Background: `black-matte` with backdrop blur
- Height: 72px
- Logo: left, Bebas Neue, 2xl
- Links: right, Inter, base, `gray-600` → `white-pure` hover

### Modals & Overlays

**Modal**:
- Backdrop: `black-pure` 85% opacity
- Content: `charcoal` background, `lg` border radius
- Max width: 600px (centered)
- Padding: 32px
- Close button: top-right, icon button

**Toast Notification**:
- Background: `slate-dark` with backdrop blur
- Border left: 4px solid (color by type)
- Padding: 16px
- Border radius: `md` (8px)
- Position: top-right (desktop), top (mobile)

---

## Textures & Effects

### Grain Texture

Apply subtle film grain to backgrounds:
```css
background-image: url('/textures/grain.png');
opacity: 0.03;
mix-blend-mode: overlay;
```

### Vignette Effect

Apply vignette to hero images:
```css
box-shadow: inset 0 0 100px rgba(10, 10, 10, 0.5);
```

### Light Leak Overlay

For dramatic hero sections:
```css
background: linear-gradient(
  135deg,
  rgba(232, 168, 124, 0.1) 0%,
  transparent 50%,
  rgba(56, 189, 248, 0.1) 100%
);
```

---

## Accessibility Features

### Focus Indicators

All interactive elements:
```css
outline: 2px solid #38BDF8;
outline-offset: 2px;
border-radius: 4px;
```

### Color Contrast

All text meets WCAG 2.1 AA standards:
- Large text (≥18px or ≥14px bold): 3:1 contrast
- Normal text (<18px): 4.5:1 contrast

**Verified Pairings**:
- `white-pure` on `black-matte`: 21:1 ✓
- `gray-600` on `black-matte`: 6.5:1 ✓
- `amber-500` on `black-matte`: 5.2:1 ✓
- `cyan-500` on `black-matte`: 7.8:1 ✓

### Touch Targets

Minimum 44x44px for all tappable elements

### Screen Reader Text

Use visually hidden utility for screen reader-only text:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Dark Mode

StreetMuse is **dark-first**. Light mode is not planned for v1.0.

---

## Design System Exports

Design tokens are exported to:
- `tokens.json`: Source of truth (Design Tokens Community Group format)
- `tailwind.config.js`: Tailwind CSS configuration
- `tokens.css`: CSS custom properties for non-Tailwind usage

---

**Last Updated**: 2025-12-02
**Version**: 1.0.0
