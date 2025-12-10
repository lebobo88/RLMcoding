# FTR-003: Context-Aware Smart Coaching

**Priority**: P1 (Post-MVP)
**Status**: Approved
**Created**: 2025-12-02

## Overview
Real-time coaching based on user's current context: time of day, weather, location type. Delivers push notifications with actionable tips when conditions are ideal for shooting.

## Acceptance Criteria
- [ ] Geolocation permission request (opt-in)
- [ ] Time-aware tips (golden hour = lighting suggestions)
- [ ] Weather API integration (OpenWeatherMap)
- [ ] Push notifications (service worker)
- [ ] Context widget on feed (shows current conditions + tip)
- [ ] Privacy-focused (location rounded to ~500m)

## Example Contextual Tips
- **Golden Hour + Urban**: "Henri says: The low angle creates dramatic shadows. Look for silhouettes against buildings."
- **Overcast + Park**: "Vivian suggests: Soft light is perfect for candid portraits. People are relaxed."
- **Night + City**: "Winogrand reminds: High ISO, wide aperture. Embrace the grain."
