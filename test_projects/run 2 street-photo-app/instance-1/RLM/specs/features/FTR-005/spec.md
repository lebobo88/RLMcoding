# Feature: Personal Insight Library (FTR-005)

**Priority**: P1 (Should Have)
**Status**: Active
**Estimated Effort**: 1 week

## Overview

Users save favorite insights, quotes, techniques, and challenges to a beautifully organized personal library with search, collections, and export capabilities.

## User Stories

1. As a learner, I want to save insights so that I can revisit them later
2. As an organized user, I want custom collections so that I can group insights by theme (e.g., "Night Photography", "Confidence Builders")
3. As a student, I want to export collections as PDFs so that I can study offline or print

## Acceptance Criteria

- [ ] Save button on every insight card (bookmark icon)
- [ ] Visual feedback: Icon fills with Kodachrome orange + haptic feedback
- [ ] Library page: `/library` route
- [ ] Four organization views:
  1. **By Master**: Auto-categorized by photographer
  2. **By Type**: Auto-categorized by insight type (technique, quote, etc.)
  3. **Collections**: User-created custom collections
  4. **Recent**: Chronological (most recent saves)
- [ ] Search bar: Search within saved insights (title, content, master name)
- [ ] Create collection modal: Name + optional description
- [ ] Drag-and-drop insights into collections (desktop) or tap-to-add (mobile)
- [ ] Collection detail page: All insights in collection, edit/delete collection
- [ ] Export collection: "Download as PDF" button
- [ ] Unsave button: Remove from library
- [ ] Empty state: "Start saving insights to build your library" with illustration
- [ ] Weekly review reminder: "You saved 7 insights this week—review them?" (notification)
- [ ] Share collection: "Share my [Collection Name] on StreetMuse" (social share with link)

## Technical Implementation

### Data Schema
```sql
CREATE TABLE saved_insights (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  insight_id UUID REFERENCES insights(id),
  collection_id UUID REFERENCES collections(id) NULL,
  saved_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE collections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
- `POST /api/library/save` - Save insight
- `DELETE /api/library/unsave/{id}` - Unsave insight
- `GET /api/library` - Get all saved insights
- `POST /api/collections` - Create collection
- `PUT /api/collections/{id}` - Update collection
- `DELETE /api/collections/{id}` - Delete collection
- `POST /api/collections/{id}/add` - Add insight to collection
- `GET /api/collections/{id}/export` - Export as PDF

### Components
- `LibraryPage.tsx` - Main library view
- `LibraryGrid.tsx` - Grid of saved insights
- `CollectionList.tsx` - List of user collections
- `CreateCollectionModal.tsx` - Create/edit modal
- `SearchBar.tsx` - Search within library
- `EmptyState.tsx` - No saved insights state

### PDF Export
```typescript
// Using jsPDF or Puppeteer for PDF generation
async function exportCollectionPDF(collectionId: string) {
  const collection = await getCollection(collectionId);
  const insights = await getCollectionInsights(collectionId);

  const pdf = new jsPDF();
  pdf.setFont('Playfair Display');
  pdf.text(collection.name, 20, 20);

  insights.forEach((insight, index) => {
    const y = 40 + (index * 30);
    pdf.setFontSize(14);
    pdf.text(insight.title, 20, y);
    pdf.setFontSize(10);
    pdf.text(insight.content, 20, y + 10, { maxWidth: 170 });
  });

  pdf.save(`${collection.name}.pdf`);
}
```

## Dependencies
- TanStack Query (CRUD mutations)
- Zustand (local UI state: selected collection)
- jsPDF or Puppeteer (PDF generation)
- Lucide React (icons)

## Risks
- **Storage limits**: Free tier users limited to 100 saved insights, Pro unlimited
- **PDF quality**: Complex layouts may not export well → Keep PDF simple, text-focused
