# Feature: Situational Guidance Mode (FTR-004)

**Priority**: P1 (Should Have)
**Status**: Active
**Estimated Effort**: 1.5 weeks

## Overview

Context-aware coaching that adapts to current conditions—time of day, weather, location density, lighting—providing relevant tips from masters who excelled in similar scenarios.

## User Stories

1. As a daytime shooter, I want tips for harsh midday light so that I don't avoid shooting in challenging conditions
2. As a night photographer, I want low-light techniques so that I can shoot confidently after dark
3. As an anxious beginner, I want crowd-specific tips so that I feel prepared in busy environments

## Acceptance Criteria

- [ ] Floating action button (FAB): Bottom-right corner, Kodachrome orange
- [ ] Icon changes based on context: Sun (day), Moon (night), MapPin (location), Cloud (weather)
- [ ] Tap FAB → modal with 3-5 contextual tips
- [ ] Context detection:
  - **Time**: Golden hour, blue hour, midday, night (via device clock)
  - **Light**: Bright, dim, changing (via device light sensor if permission)
  - **Location**: Urban, suburban, nature (via GPS if permission, else manual toggle)
  - **Movement**: Walking detected (via accelerometer) → zone focusing tips
- [ ] Manual context toggles: "Crowded streets", "Empty streets", "Markets", "Transit", "Protests", "Rainy", "Snowy"
- [ ] Each tip includes: Master name, technique, visual example (optional), quick action ("Try this now")
- [ ] "Save to Library" button on each tip
- [ ] Close modal: Swipe down or tap X
- [ ] Haptic feedback on open
- [ ] Tips cached for offline use

## Technical Implementation

### Context Detection
```typescript
function detectContext() {
  const hour = new Date().getHours();
  let timeContext = 'day';

  if (hour >= 5 && hour <= 6) timeContext = 'golden-hour';
  else if (hour >= 18 && hour <= 19) timeContext = 'golden-hour';
  else if (hour >= 19 && hour <= 20) timeContext = 'blue-hour';
  else if (hour >= 21 || hour <= 5) timeContext = 'night';
  else if (hour >= 11 && hour <= 14) timeContext = 'harsh-midday';

  // Light sensor (if available)
  const lightLevel = await LightSensor.read(); // Capacitor plugin
  const lightContext = lightLevel < 50 ? 'low-light' : 'bright';

  // GPS (if available)
  const location = await Geolocation.getCurrentPosition();
  const locationType = classifyLocation(location); // 'urban', 'suburban', 'nature'

  return { timeContext, lightContext, locationType };
}
```

### Data Schema
```sql
CREATE TABLE situational_tips (
  id UUID PRIMARY KEY,
  context_type TEXT NOT NULL, -- 'time', 'light', 'location', 'weather', 'movement'
  context_value TEXT NOT NULL, -- 'golden-hour', 'low-light', 'urban', 'rainy', 'walking'
  master_id UUID REFERENCES masters(id),
  tip_content TEXT NOT NULL,
  visual_example_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
- `GET /api/guidance?context={json}` - Get tips for current context
- Example: `/api/guidance?context={"time":"golden-hour","location":"urban","light":"bright"}`

### Components
- `GuidanceFAB.tsx` - Floating action button with context icon
- `GuidanceModal.tsx` - Tips modal
- `TipCard.tsx` - Individual tip card
- `ContextSelector.tsx` - Manual toggles

## Dependencies
- Capacitor Sensors (light, GPS, accelerometer)
- GSAP (modal open/close animation)
- Lucide React (context icons)

## Risks
- **Permission denial**: GPS/sensors optional, fall back to manual selection
- **Battery drain**: Only poll sensors when modal open, not continuously
