# StreetMuse Technology Stack

## Technology Selection Matrix

This document details the technology choices for StreetMuse with rationale for each decision.

---

## Frontend Stack

### Core Framework: Next.js 16

**Decision**: Next.js 16 with App Router
**Alternatives Considered**: Remix, Astro, Vite + React Router
**Rationale**:
- **Server Components**: Reduce client-side JS, faster initial loads
- **Image Optimization**: Built-in with next/image
- **API Routes**: Serverless functions without separate backend
- **SEO**: Excellent SSR/SSG support for discoverability
- **Vercel Integration**: Optimal deployment experience
- **React 19 Support**: Latest React features (Compiler, Actions)

**Version**: 16.x (canary with App Router stable features)

---

### UI Library: React 19

**Decision**: React 19 with React Compiler
**Alternatives Considered**: Vue 3, Svelte, Solid
**Rationale**:
- **React Compiler**: Automatic memoization, better performance
- **Server Components**: Reduce bundle size, faster loads
- **Concurrent Features**: Smooth UI updates, better UX
- **Ecosystem**: Largest component library ecosystem
- **Team Familiarity**: Most developers know React

**Version**: 19.x

---

### Type Safety: TypeScript 5

**Decision**: TypeScript 5 in strict mode
**Alternatives Considered**: JavaScript with JSDoc, Flow
**Rationale**:
- **Type Safety**: Catch errors at compile time
- **IDE Support**: Better autocomplete, refactoring
- **Self-Documenting**: Types serve as documentation
- **Ecosystem**: Excellent Next.js/React integration
- **Team Productivity**: Faster development with fewer bugs

**Configuration**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

### Styling: Tailwind CSS 4

**Decision**: Tailwind CSS 4 with custom design tokens
**Alternatives Considered**: CSS Modules, Styled Components, Vanilla Extract, Panda CSS
**Rationale**:
- **Utility-First**: Rapid UI development
- **Design Tokens**: Easy integration with our token system
- **Performance**: PurgeCSS removes unused styles
- **Consistency**: Design system enforced through config
- **Mobile-First**: Built-in responsive utilities
- **Dark Mode**: Easy theming support (future)

**Plugins**:
- `@tailwindcss/typography`: Rich text formatting
- `tailwind-merge`: Intelligent class merging
- `clsx`: Conditional class names

**Version**: 4.x (v4 alpha with performance improvements)

---

### Animation: GSAP 3.12+

**Decision**: GSAP (GreenSock Animation Platform) with ScrollTrigger
**Alternatives Considered**: Framer Motion, React Spring, CSS animations only
**Rationale**:
- **Performance**: Hardware-accelerated, 60fps on mobile
- **ScrollTrigger**: Industry-leading scroll-driven animations
- **Parallax**: Easy implementation of layered scrolling
- **Timeline Control**: Complex animation sequences
- **Browser Support**: Works everywhere, no compatibility issues
- **File Size**: ~50KB gzipped for full library, tree-shakeable

**Plugins Used**:
- ScrollTrigger: Scroll-driven animations
- ScrollSmoother (optional): Smooth scroll polyfill

**License**: Free for most projects (GreenSock Standard License)

**Alternative for Simple Cases**: Framer Motion (lighter, React-specific)

---

### Component Library: Radix UI

**Decision**: Radix UI primitives
**Alternatives Considered**: Headless UI, Reach UI, Chakra UI, MUI
**Rationale**:
- **Headless**: Fully customizable with our design system
- **Accessibility**: WCAG 2.1 AA compliant out of the box
- **Unstyled**: No CSS to override, clean slate
- **Composable**: Build complex components from primitives
- **TypeScript**: Full type safety
- **Tree-Shakeable**: Only import what you need

**Components Used**:
- Dialog (modals)
- Dropdown Menu
- Select
- Tabs
- Accordion
- Toast (via Sonner, built on Radix)

---

### Icons: Lucide React

**Decision**: Lucide React
**Alternatives Considered**: Heroicons, Phosphor Icons, React Icons
**Rationale**:
- **Consistent Style**: Outline icons, 2px stroke
- **Tree-Shakeable**: Import only icons you use
- **Customizable**: Size, color, stroke width props
- **TypeScript**: Full type definitions
- **Active Maintenance**: Community-driven fork of Feather Icons
- **File Size**: ~1KB per icon

**Version**: Latest

---

## State Management

### Client State: Zustand

**Decision**: Zustand for UI and user preference state
**Alternatives Considered**: Redux Toolkit, Jotai, Recoil, Context API
**Rationale**:
- **Lightweight**: ~1KB, minimal boilerplate
- **Simple API**: Easy to learn, no reducers needed
- **Performance**: No unnecessary re-renders
- **TypeScript**: Excellent type inference
- **DevTools**: Redux DevTools integration
- **Middleware**: Persist, immer, devtools built-in

**Use Cases**:
- UI state (modal open/close, nav state)
- User preferences (animations enabled, filters)
- Temporary data (form drafts)

---

### Server State: TanStack Query (React Query)

**Decision**: TanStack Query v5
**Alternatives Considered**: SWR, RTK Query, Apollo Client
**Rationale**:
- **Caching**: Automatic background refetching
- **Optimistic Updates**: Better UX for mutations
- **Pagination**: Built-in infinite scroll support
- **TypeScript**: Full type safety with tRPC (optional)
- **DevTools**: Excellent debugging experience
- **Framework Agnostic**: Not tied to Redux or GraphQL

**Use Cases**:
- Fetching wisdom cards (infinite scroll)
- Loading master profiles
- Challenge data
- User progress (future)

**Version**: 5.x

---

### Form State: React Hook Form

**Decision**: React Hook Form with Zod validation
**Alternatives Considered**: Formik, Final Form, native React state
**Rationale**:
- **Performance**: Uncontrolled inputs, minimal re-renders
- **Validation**: Zod integration for type-safe schemas
- **DX**: Simple API, less boilerplate than Formik
- **Bundle Size**: ~9KB gzipped
- **TypeScript**: Full type inference from Zod schemas

**Use Cases**:
- Challenge submission forms
- Journal entry creation
- User settings (future)

**Version**: Latest

---

## Data Layer

### Database: PostgreSQL

**Decision**: PostgreSQL via Vercel Postgres or Supabase
**Alternatives Considered**: MySQL, MongoDB, Firebase, PlanetScale
**Rationale**:
- **Relational**: Perfect for user data, progress tracking
- **JSONB**: Flexible for analytics, metadata
- **Performance**: Excellent query optimization
- **Ecosystem**: Mature, well-documented
- **Vercel Integration**: Seamless deployment

**Hosting Options**:
- **Vercel Postgres** (Preferred): Integrated, serverless, auto-scaling
- **Supabase**: More features (realtime, auth, storage)

---

### ORM: Drizzle ORM

**Decision**: Drizzle ORM
**Alternatives Considered**: Prisma, Kysely, raw SQL
**Rationale**:
- **Type Safety**: End-to-end TypeScript
- **Performance**: Minimal overhead, close to raw SQL
- **Migrations**: Type-safe migration system
- **Lightweight**: ~10KB, no runtime overhead
- **Serverless**: Perfect for edge runtime
- **DX**: Better than Prisma for serverless (no generate step)

**Schema Definition**:
```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow()
})
```

---

### CMS: Sanity

**Decision**: Sanity headless CMS
**Alternatives Considered**: Contentful, Strapi, Payload CMS
**Rationale**:
- **Structured Content**: Perfect for photographer profiles, wisdom cards
- **Real-time**: Instant content updates
- **GROQ**: Powerful query language
- **Portable Text**: Rich text with custom components
- **Image Pipeline**: Built-in image CDN (Sanity CDN)
- **Customizable**: Sanity Studio is fully customizable
- **Free Tier**: Generous limits for v1.0

**Content Types**:
- Master Photographers
- Wisdom Cards
- Daily Challenges
- Quotes

**Version**: Sanity v3

---

### Media Storage: Cloudinary

**Decision**: Cloudinary
**Alternatives Considered**: Sanity CDN, Imgix, AWS S3 + CloudFront
**Rationale**:
- **Transformations**: On-the-fly image resizing, cropping, format conversion
- **Optimization**: Automatic WebP, quality optimization
- **Responsive**: Generate responsive image sets automatically
- **CDN**: Global distribution, fast delivery
- **Free Tier**: Sufficient for v1.0 (25GB storage, 25GB bandwidth/month)
- **Next.js Integration**: Official loader for next/image

**Use Cases**:
- User-uploaded challenge photos
- Optimized delivery of master photographer images
- Audio file hosting (CDN)

---

## Testing Stack

### Unit Testing: Jest + React Testing Library

**Decision**: Jest with React Testing Library
**Alternatives Considered**: Vitest, Testing Library alone
**Rationale**:
- **Jest**: Industry standard, excellent mocking, snapshot testing
- **RTL**: Encourages accessibility-focused testing
- **Next.js Support**: Official Next.js Jest config
- **Coverage**: Built-in coverage reports

**Configuration**: `jest.config.js` with SWC transform

---

### E2E Testing: Playwright

**Decision**: Playwright
**Alternatives Considered**: Cypress, Puppeteer, Selenium
**Rationale**:
- **Speed**: Faster than Cypress
- **Multi-Browser**: Chrome, Firefox, Safari, Edge
- **Mobile Emulation**: Test mobile viewports
- **Debugging**: Time-travel debugging, video recording
- **Auto-Wait**: No flaky tests from timing issues
- **TypeScript**: Full type support
- **Parallel**: Run tests concurrently

**Use Cases**:
- Wisdom stream scrolling
- Master profile navigation
- Challenge submission flow
- Accessibility testing (with axe-core)

---

### Accessibility Testing: axe-core + Pa11y

**Decision**: axe-core (in Playwright) + Pa11y CI
**Alternatives Considered**: Lighthouse only
**Rationale**:
- **axe-core**: Most accurate, runs in E2E tests
- **Pa11y**: CI integration, automated audits
- **Complementary**: axe for components, Pa11y for full pages

**Integration**:
```typescript
// Playwright test
await expect(page).toBeAccessible() // via @axe-core/playwright
```

---

## DevOps & Deployment

### Hosting: Vercel

**Decision**: Vercel
**Alternatives Considered**: Netlify, AWS Amplify, Railway
**Rationale**:
- **Next.js Optimization**: Built by Next.js creators
- **Edge Network**: Global CDN, fast delivery
- **Serverless**: Auto-scaling API routes
- **Preview Deployments**: Every PR gets a URL
- **Analytics**: Web Vitals monitoring
- **Zero Config**: Deploy with git push

**Plan**: Pro ($20/mo for production features)

---

### CI/CD: GitHub Actions

**Decision**: GitHub Actions
**Alternatives Considered**: Vercel CI (basic), CircleCI, GitLab CI
**Rationale**:
- **Free**: Generous free tier for public repos
- **Integration**: Built into GitHub
- **Flexibility**: Custom workflows
- **Marketplace**: Reusable actions

**Workflows**:
- Run tests on PR
- Lighthouse CI performance checks
- Deploy to Vercel (via Vercel GitHub integration)

---

### Monitoring: Vercel Analytics + Sentry

**Decision**: Vercel Analytics for performance, Sentry for errors
**Alternatives Considered**: Google Analytics, New Relic, LogRocket
**Rationale**:
- **Vercel Analytics**: Web Vitals, no privacy concerns, built-in
- **Sentry**: Best-in-class error tracking, source maps, breadcrumbs
- **Privacy-Focused**: No tracking cookies, GDPR compliant

**Sentry Configuration**:
- Next.js SDK for client and server errors
- Source maps for production debugging
- Performance monitoring (optional)

---

## Developer Experience

### Package Manager: npm

**Decision**: npm (default with Node.js)
**Alternatives Considered**: pnpm, yarn
**Rationale**:
- **Default**: No additional install
- **Workspaces**: Supported (if needed for monorepo)
- **Performance**: Fast enough with modern npm (v8+)
- **Compatibility**: Universal

---

### Code Quality: ESLint + Prettier

**Decision**: ESLint with Next.js config + Prettier
**Alternatives Considered**: Biome, dprint
**Rationale**:
- **ESLint**: Catch bugs, enforce patterns
- **Prettier**: Consistent formatting, no debates
- **Next.js Config**: Optimized for Next.js/React

**Plugins**:
- `eslint-config-next`: Next.js recommended rules
- `eslint-plugin-jsx-a11y`: Accessibility linting
- `prettier-plugin-tailwindcss`: Sort Tailwind classes

---

### Git Hooks: Husky + lint-staged

**Decision**: Husky for git hooks, lint-staged for pre-commit
**Alternatives Considered**: pre-commit (Python), simple-git-hooks
**Rationale**:
- **Pre-commit**: Lint and format only staged files
- **Pre-push**: Run tests before push
- **Enforce Quality**: Can't commit broken code

**Configuration**:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## Third-Party Services

### Authentication: NextAuth.js (Future)

**Decision**: NextAuth.js v5 (future when user accounts needed)
**Alternatives Considered**: Clerk, Auth0, Supabase Auth
**Rationale**:
- **Open Source**: No vendor lock-in
- **Flexible**: Many providers (Google, email, etc.)
- **Edge Compatible**: Works with Vercel Edge
- **TypeScript**: Full type safety

**Providers**:
- Email (magic link)
- Google OAuth
- Apple (for iOS users)

---

### Email: Resend (Future)

**Decision**: Resend for transactional emails (future)
**Alternatives Considered**: SendGrid, Postmark, AWS SES
**Rationale**:
- **Developer Experience**: Best API design
- **React Email**: Send emails as React components
- **Vercel Integration**: Built by Vercel team
- **Free Tier**: 3,000 emails/month

**Use Cases**:
- Challenge reminders
- Streak notifications
- Welcome emails

---

## Performance Budget

### Bundle Size

- **Initial JS**: < 200KB (gzipped)
- **Initial CSS**: < 50KB (gzipped)
- **Total Page Weight**: < 1MB

**Strategy**:
- Code splitting by route
- Dynamic imports for GSAP, heavy components
- Tree-shaking unused code

### Runtime Performance

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **TTI**: < 3s (Time to Interactive on 3G)

**Tools**:
- Lighthouse CI (automated checks on PR)
- Vercel Analytics (real user metrics)
- Chrome DevTools (manual audits)

---

## Dependency Management

### Lock File

Use `package-lock.json` for deterministic installs

### Update Strategy

- **Security patches**: Immediate (via Dependabot)
- **Minor updates**: Monthly review
- **Major updates**: Quarterly, with testing

### Dependency Review

Evaluate new dependencies on:
- Bundle size impact (<10KB ideal, <50KB max)
- TypeScript support (required)
- Maintenance status (last updated <6 months)
- Tree-shakeable (preferred)

---

## Technology Risks & Mitigation

### Risk: Next.js 16 is Canary

**Mitigation**:
- Use stable App Router features only
- Pin exact version in package.json
- Test thoroughly before upgrading

### Risk: GSAP License for Commercial Use

**Mitigation**:
- Standard License is free for most use cases
- If commercialized, purchase Club GreenSock ($199/year)
- Alternative: Fall back to Framer Motion (MIT license)

### Risk: Vercel Vendor Lock-In

**Mitigation**:
- Next.js is open source, can deploy elsewhere
- Use Vercel-agnostic patterns (no Vercel-specific APIs)
- Maintain Docker deployment option (future)

### Risk: Sanity CMS Limits

**Mitigation**:
- Free tier: 3 users, 10GB bandwidth, 5GB assets (sufficient for v1.0)
- Paid tier: $99/mo if exceeded
- Alternative: Migrate to Strapi (self-hosted) if needed

---

## Technology Versions (Locked)

```json
{
  "dependencies": {
    "next": "16.0.0-canary.x",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^4.0.0",
    "gsap": "^3.12.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.17.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "drizzle-orm": "^0.29.0",
    "@sanity/client": "^6.10.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@playwright/test": "^1.40.0",
    "@axe-core/playwright": "^4.8.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

---

**Last Updated**: 2025-12-02
**Version**: 1.0.0
