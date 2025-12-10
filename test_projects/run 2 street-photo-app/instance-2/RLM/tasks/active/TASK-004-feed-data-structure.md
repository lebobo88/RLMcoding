# TASK-004: Create Feed Content Data

**Feature**: FTR-001 Infinite Feed
**Priority**: P0
**Estimated Time**: 60 minutes
**Dependencies**: TASK-001

## Description
Create JSON files with 50+ feed items (quotes, techniques, challenges) from famous street photographers.

## Acceptance Criteria
- [ ] `src/data/photographers.json` with 5 photographer profiles
- [ ] `src/data/feed-items.json` with 50+ diverse items
- [ ] Mix of content types: 40% techniques, 30% quotes, 20% challenges, 10% stories
- [ ] Each item has all required fields (type, photographer, content, metadata)
- [ ] TypeScript interfaces match architecture spec
- [ ] Items tagged with context (timeOfDay, weather, location)

## Sample Data Structure

### photographers.json
```json
[
  {
    "id": "cartier-bresson",
    "name": "Henri Cartier-Bresson",
    "bio": "French photographer and pioneer of street photography. Founder of Magnum Photos and master of the 'decisive moment'.",
    "avatar": "/avatars/cartier-bresson.jpg",
    "color": "#3A5A7F",
    "specialty": ["composition", "decisive-moment", "patience"],
    "era": "1930-1970",
    "notable": ["Magnum Photos co-founder", "The Decisive Moment (1952)"],
    "voiceProfile": {
      "tone": "strict",
      "style": "prescriptive",
      "signature": ["Wait for the geometry to align", "No cropping"]
    }
  }
  // ... 4 more
]
```

### feed-items.json (sample)
```json
[
  {
    "id": "quote-hcb-001",
    "type": "quote",
    "photographer": "cartier-bresson",
    "content": {
      "body": "There is nothing in this world that does not have a decisive moment.",
      "image": {
        "url": "/examples/hcb-decisive-moment.jpg",
        "alt": "Henri Cartier-Bresson photograph demonstrating decisive moment"
      }
    },
    "metadata": {
      "tags": ["timing", "decisive-moment", "philosophy"],
      "difficulty": "beginner",
      "readTime": 30,
      "createdAt": "2025-12-02T00:00:00Z"
    }
  },
  {
    "id": "technique-hcb-002",
    "type": "technique",
    "photographer": "cartier-bresson",
    "content": {
      "title": "Pre-Focusing for the Decisive Moment",
      "body": "Master the art of pre-focusing to never miss the moment.",
      "steps": [
        "Set your lens to manual focus",
        "Estimate the distance where action will occur (1-3 meters)",
        "Pre-focus to that distance",
        "Use a narrow aperture (f/8-f/16) for depth of field",
        "Wait for the subject to enter your focus zone, then shoot"
      ],
      "image": {
        "url": "/examples/pre-focusing-diagram.jpg",
        "alt": "Diagram showing pre-focusing zone"
      }
    },
    "metadata": {
      "tags": ["focusing", "technique", "timing"],
      "difficulty": "intermediate",
      "readTime": 120,
      "createdAt": "2025-12-02T00:00:00Z"
    },
    "context": {
      "timeOfDay": ["morning", "afternoon", "golden-hour"],
      "location": ["urban"]
    }
  }
  // ... 48 more items
]
```

## Content Ideas
- Quotes from each photographer
- Techniques: Pre-focusing, zone focusing, working the scene, approaching subjects
- Challenges: Decisive moment, invisible observer, chaos capture
- Stories: Behind famous photos
- Composition breakdowns: Rule of thirds, leading lines, framing

## Files Created
- `src/data/photographers.json`
- `src/data/feed-items.json`
- `src/lib/types/feed.ts` (TypeScript interfaces)

---

**Status**: Active
