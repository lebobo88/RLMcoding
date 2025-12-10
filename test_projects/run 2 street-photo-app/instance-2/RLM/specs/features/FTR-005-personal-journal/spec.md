# FTR-005: Personal Photography Journal

**Priority**: P2 (Future)
**Status**: Approved
**Created**: 2025-12-02

## Overview
A personal space to save favorite tips, track progress, and reflect on learning. Serves as a curated knowledge base built from the feed.

## Acceptance Criteria
- [ ] Saved items organized by photographer or topic
- [ ] Add personal notes to saved items
- [ ] Tag items with custom labels
- [ ] Search saved items
- [ ] Export journal as PDF or markdown
- [ ] Progress tracking (skills developed, challenges completed)
- [ ] Reflection prompts ("What did you learn this week?")
- [ ] Photo gallery linked to techniques practiced
- [ ] Statistics dashboard (total scroll time, items saved, etc.)

## Data Model
```typescript
interface JournalEntry {
  id: string;
  feedItemId: string;
  savedAt: number;
  notes?: string;
  tags: string[];
  linkedPhotos?: string[]; // User's photos
}
```
