# TASK-001: Project Setup and Configuration

**Feature**: Foundation
**Priority**: P0
**Estimated Time**: 30 minutes
**Dependencies**: None

## Description
Initialize Next.js 16 project with TypeScript, Tailwind CSS 4, and all required dependencies. Configure for port 3004 and set up project structure.

## Acceptance Criteria
- [ ] Next.js 16 app created with TypeScript and App Router
- [ ] Tailwind CSS 4 configured with design tokens
- [ ] All dependencies installed (GSAP, Zustand, TanStack Query, etc.)
- [ ] Port configured to 3004 in package.json
- [ ] ESLint and Prettier configured
- [ ] Folder structure matches architecture spec
- [ ] `npm run dev` starts development server successfully

## Implementation Steps
1. Run `npx create-next-app@latest streetmuse --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. Install dependencies:
   ```bash
   npm install gsap zustand @tanstack/react-query lucide-react dexie
   npm install -D @types/node
   ```
3. Update `package.json` to use port 3004:
   ```json
   {
     "scripts": {
       "dev": "next dev -p 3004"
     }
   }
   ```
4. Configure `tailwind.config.ts` with design tokens
5. Create folder structure:
   - `src/components/{ui,feed,mentors,shared}`
   - `src/lib/{api,stores,hooks,utils,types}`
   - `src/data/`
6. Add globals.css with custom styles

## Testing
- [ ] Run `npm run dev` and verify app loads on `http://localhost:3004`
- [ ] Verify TypeScript has no errors
- [ ] Verify Tailwind classes work

## Files Created/Modified
- `package.json`
- `tailwind.config.ts`
- `src/styles/globals.css`
- Folder structure

---

**Status**: Active
**Assigned**: Auto
