# /prime-design Command

## Purpose
Load minimal design context for development and review tasks. Primes the conversation with design system essentials, tokens, and component patterns.

## Usage

```
/prime-design [scope]
```

### Scopes

| Scope | Description |
|-------|-------------|
| (none) | Load core design system context |
| `component [name]` | Load specific component specification |
| `feature [FTR-XXX]` | Load feature design specification |
| `tokens` | Load design tokens only |
| `accessibility` | Load accessibility requirements |

---

## Execution Protocol

### /prime-design (Core Context)

Load essential design context for general development:

1. **Read Design System Summary**
   ```
   File: RLM/specs/design/design-system.md
   Sections to extract:
   - Design Philosophy (CREATIVE/CONSISTENT)
   - Color System (primary, semantic, neutrals)
   - Typography Scale
   - Spacing Scale
   - Component State Matrix
   - Accessibility Standards
   ```

2. **Read Active Design Tokens**
   ```
   File: RLM/specs/design/tokens/tokens.json
   Extract: Core token values for quick reference
   ```

3. **Output Context Bundle**
   ```markdown
   ## Design Context Loaded

   ### Philosophy: [CREATIVE/CONSISTENT]
   ### Animation Tier: [MINIMAL/MODERATE/RICH]
   ### Framework: [Framework name]

   ### Quick Reference:

   **Colors:**
   - Primary: [hex values]
   - Semantic: success, warning, error, info
   - Text: gray-800 (primary), gray-500 (secondary)

   **Typography:**
   - Font: [Font family]
   - Scale: xs(12) sm(14) base(16) lg(18) xl(20) 2xl(24)

   **Spacing:**
   - Base: 8px (0.5rem)
   - Scale: 2(8) 4(16) 6(24) 8(32) 12(48)

   **Radius:**
   - sm(4) md(8) lg(12) xl(16) full(9999)

   **Component States Required:**
   Default, Hover, Focus, Active, Disabled, Loading, Error, Empty

   **Accessibility:**
   - Contrast: 4.5:1 text, 3:1 UI
   - Touch targets: 44×44px min
   - Focus: 2px ring, visible indicator
   ```

---

### /prime-design component [name]

Load specific component context:

1. **Read Component Spec**
   ```
   File: RLM/specs/design/components/[name].md
   ```

2. **Output Component Context**
   ```markdown
   ## Component Context: [Name]

   ### Purpose
   [Component purpose]

   ### Variants
   [Available variants]

   ### States (All 8)
   | State | Treatment |
   |-------|-----------|
   | Default | [description] |
   | Hover | [description] |
   | Focus | [description] |
   | Active | [description] |
   | Disabled | [description] |
   | Loading | [description] |
   | Error | [description] |
   | Empty | [description] |

   ### Tokens Used
   [List of design tokens]

   ### Accessibility
   - Role: [ARIA role]
   - Keyboard: [interactions]

   ### Code Reference
   [Code snippet if available]
   ```

---

### /prime-design feature [FTR-XXX]

Load feature design context:

1. **Read Feature Design Spec**
   ```
   File: RLM/specs/features/FTR-XXX/design-spec.md
   ```

2. **Read Related Components**
   ```
   Parse: Components used in feature
   Load: Component specs for each
   ```

3. **Output Feature Context**
   ```markdown
   ## Feature Design Context: [Feature Name]

   ### User Flow
   [Flow summary]

   ### Screens
   1. [Screen 1]: [Purpose]
   2. [Screen 2]: [Purpose]

   ### Components Used
   | Component | Variant | Location |
   |-----------|---------|----------|
   | [name] | [variant] | [where] |

   ### Key Interactions
   - [Interaction 1]
   - [Interaction 2]

   ### Accessibility Requirements
   - [Requirement 1]
   - [Requirement 2]

   ### States to Implement
   - Loading: [description]
   - Empty: [description]
   - Error: [description]

   ### Design Tokens
   [Key tokens for this feature]
   ```

---

### /prime-design tokens

Load design tokens only (for styling tasks):

1. **Read Tokens**
   ```
   File: RLM/specs/design/tokens/tokens.json
   ```

2. **Output Token Reference**
   ```markdown
   ## Design Tokens Reference

   ### Colors
   ```json
   {
     "primary": { "50": "#eff6ff", "500": "#3b82f6", "900": "#1e3a8a" },
     "success": "#10b981",
     "warning": "#f59e0b",
     "error": "#ef4444"
   }
   ```

   ### Typography
   | Name | Size | Weight | Use |
   |------|------|--------|-----|
   | xs | 0.75rem | 400 | Captions |
   | sm | 0.875rem | 400 | Small text |
   | base | 1rem | 400 | Body |
   | lg | 1.125rem | 400 | Large body |

   ### Spacing
   | Token | Value | Pixels |
   |-------|-------|--------|
   | 1 | 0.25rem | 4px |
   | 2 | 0.5rem | 8px |
   | 4 | 1rem | 16px |
   | 8 | 2rem | 32px |

   ### Shadows
   | Name | Value |
   |------|-------|
   | sm | 0 1px 2px... |
   | md | 0 4px 6px... |
   | lg | 0 10px 15px... |

   ### Animation
   | Duration | Easing |
   |----------|--------|
   | 150ms (fast) | ease-out |
   | 200ms (normal) | ease-in-out |
   | 300ms (slow) | ease-in-out |
   ```

---

### /prime-design accessibility

Load accessibility requirements:

1. **Read Accessibility Sections**
   ```
   File: RLM/specs/design/design-system.md (Section 7)
   File: RLM/docs/ACCESSIBILITY-GUIDE.md (if exists)
   ```

2. **Output Accessibility Context**
   ```markdown
   ## Accessibility Requirements

   ### Target Level: [AA/AAA]

   ### Color Contrast
   - Normal text: 4.5:1 minimum
   - Large text (18px+): 3:1 minimum
   - UI components: 3:1 minimum

   ### Keyboard Navigation
   - All interactive elements must be focusable
   - Tab order must be logical
   - No keyboard traps
   - Focus indicator: 2px solid ring

   ### Screen Readers
   - Semantic HTML required
   - ARIA labels for icons, images
   - aria-live for dynamic content
   - Error messages announced

   ### Touch Targets
   - Minimum: 44×44px
   - Adequate spacing between targets

   ### Motion
   - Respect prefers-reduced-motion
   - No auto-playing animations
   - No seizure-inducing flashing

   ### Focus Indicator CSS
   ```css
   :focus-visible {
     outline: 2px solid var(--color-primary-500);
     outline-offset: 2px;
   }
   ```

   ### Checklist
   - [ ] Color contrast verified
   - [ ] Keyboard navigation works
   - [ ] Screen reader tested
   - [ ] Touch targets adequate
   - [ ] Reduced motion supported
   ```

---

## When to Use

| Task | Prime Command |
|------|---------------|
| General development | `/prime-design` |
| Building a specific component | `/prime-design component [name]` |
| Implementing a feature UI | `/prime-design feature FTR-XXX` |
| Styling/theming work | `/prime-design tokens` |
| Accessibility audit | `/prime-design accessibility` |
| Code review (design aspects) | `/prime-design` or specific scope |

---

## Error Handling

| Error | Message | Recovery |
|-------|---------|----------|
| No design system | "Design system not found. Run /cc-design system first." | Run /cc-design system |
| Component not found | "Component spec not found: [name]" | Run /cc-design component [name] |
| Feature not found | "Feature design spec not found: FTR-XXX" | Run /cc-design feature FTR-XXX |
| No tokens | "Design tokens not found." | Run /cc-design tokens |
