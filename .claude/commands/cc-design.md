# /cc-design Command

## Purpose
Execute design workflow tasks including design system creation, component specifications, UX research, and design QA.

## Usage

```
/cc-design [subcommand] [arguments]
```

### Subcommands

| Command | Description |
|---------|-------------|
| `/cc-design system` | Create or update the full design system |
| `/cc-design research` | Perform UX research and create personas/journeys |
| `/cc-design component [name]` | Create specification for a component |
| `/cc-design feature [FTR-XXX]` | Create design spec for a feature |
| `/cc-design qa [scope]` | Run design QA checklist |
| `/cc-design tokens` | Generate/update design tokens |

---

## Execution Protocol

### Pre-flight Checks

Before executing any design command:

1. **Check PRD exists**: Read `RLM/specs/PRD.md` for design philosophy and brand context
2. **Check Constitution**: Read `RLM/specs/constitution.md` for tech stack (CSS framework)
3. **Identify Design Philosophy**: CREATIVE or CONSISTENT
4. **Identify Animation Tier**: MINIMAL, MODERATE, or RICH
5. **Identify Target Framework**: Tailwind, Material UI, Chakra, Bootstrap, Ant Design

---

## /cc-design system

### Purpose
Create or update the complete design system for the project.

### Steps

1. **Load Context**
   ```
   Read: RLM/specs/PRD.md (Sections 18-19: Design System, Brand Guidelines)
   Read: RLM/specs/constitution.md (Tech stack, framework)
   ```

2. **Spawn Designer Sub-Agent** (if UX research needed first)
   ```
   Task: Perform UX research
   - Competitor design analysis
   - Industry UX patterns
   - User behavior research
   Output: RLM/specs/design/research/
   ```

3. **Spawn Designer Sub-Agent** for Design System
   ```
   Task: Create design system based on:
   - Design philosophy from PRD
   - Brand personality
   - Animation tier
   - Target framework

   Output:
   - RLM/specs/design/design-system.md
   - RLM/specs/design/tokens/tokens.json
   - RLM/specs/design/tokens/[framework-specific exports]
   ```

4. **Validate Output**
   - All colors have contrast ratios documented
   - Typography scale is harmonious
   - Spacing system is consistent
   - Component states defined
   - Accessibility requirements specified

5. **Report to User**
   ```
   ## Design System Created

   ### Artifacts:
   - Design System: RLM/specs/design/design-system.md
   - Design Tokens: RLM/specs/design/tokens/

   ### Key Decisions:
   - Philosophy: [CREATIVE/CONSISTENT]
   - Animation Tier: [MINIMAL/MODERATE/RICH]
   - Framework: [Framework name]

   ### Next Steps:
   - Review design system
   - Run /cc-design component [name] for specific components
   - Run /cc-design feature FTR-XXX for feature designs
   ```

---

## /cc-design research

### Purpose
Perform UX research to inform design decisions.

### Steps

1. **Load Product Context**
   ```
   Read: RLM/specs/PRD.md
   Extract: Problem statement, target users, success metrics
   ```

2. **Spawn Research Sub-Agent**
   ```
   Task: Perform UX research
   - Market research: Industry trends, demographics
   - Competitive UX analysis: Top 5 competitors' interfaces
   - User behavior: Studies, surveys, forum analysis
   - Pain point discovery: Reviews, complaints, feedback

   Output research findings with sources
   ```

3. **Spawn Designer Sub-Agent**
   ```
   Task: Synthesize research into UX artifacts
   - Create 2-3 evidence-based personas
   - Map user journeys with research citations
   - Document competitive positioning
   - Identify opportunity areas

   Output: RLM/specs/design/research/
   - personas.md
   - journey-maps.md
   - competitive-analysis.md
   - opportunities.md
   ```

4. **Report to User**
   ```
   ## UX Research Complete

   ### Key Findings:
   1. [Finding with source]
   2. [Finding with source]
   3. [Finding with source]

   ### Personas Created:
   - [Persona 1]: [Brief description]
   - [Persona 2]: [Brief description]

   ### Top Opportunities:
   - [Opportunity 1]
   - [Opportunity 2]

   ### Artifacts:
   - RLM/specs/design/research/personas.md
   - RLM/specs/design/research/journey-maps.md
   - RLM/specs/design/research/competitive-analysis.md
   ```

---

## /cc-design component [name]

### Purpose
Create detailed specification for a specific component.

### Steps

1. **Load Design System**
   ```
   Read: RLM/specs/design/design-system.md
   Read: RLM/specs/design/tokens/tokens.json
   ```

2. **Spawn Designer Sub-Agent**
   ```
   Task: Create component specification for [name]
   - Purpose and use cases
   - Visual design (ASCII wireframe)
   - All 8 states (default, hover, focus, active, disabled, loading, error, empty)
   - Responsive behavior
   - Accessibility requirements
   - Design tokens to use
   - Code snippet (if common pattern)

   Output: RLM/specs/design/components/[name].md
   ```

3. **Report to User**
   ```
   ## Component Specification: [Name]

   ### Created: RLM/specs/design/components/[name].md

   ### Summary:
   - Purpose: [Brief description]
   - Variants: [List variants]
   - States: All 8 states defined

   ### Accessibility:
   - Role: [ARIA role]
   - Keyboard: [Key interactions]

   ### Implementation Notes:
   - [Any special considerations]
   ```

---

## /cc-design feature [FTR-XXX]

### Purpose
Create design specification for a feature.

### Steps

1. **Load Feature Context**
   ```
   Read: RLM/specs/features/FTR-XXX/spec.md
   Read: RLM/specs/design/design-system.md
   Read: RLM/specs/design/research/personas.md (if exists)
   ```

2. **Spawn Designer Sub-Agent**
   ```
   Task: Create feature design specification
   - User flow diagrams
   - Screen layouts (ASCII wireframes)
   - Component requirements
   - Interaction design
   - Responsive behavior
   - Accessibility requirements
   - Empty/loading/error states
   - Design tokens used

   Output: RLM/specs/features/FTR-XXX/design-spec.md
   ```

3. **Report to User**
   ```
   ## Feature Design: [Feature Name]

   ### Created: RLM/specs/features/FTR-XXX/design-spec.md

   ### Screens:
   1. [Screen 1]: [Purpose]
   2. [Screen 2]: [Purpose]

   ### Components Needed:
   - [Component list]

   ### Accessibility Highlights:
   - [Key requirements]

   ### Next Steps:
   - Review design spec
   - Create tasks for implementation
   ```

---

## /cc-design qa [scope]

### Purpose
Run design QA checklist on implemented features.

### Arguments
- `[scope]`: Feature ID (FTR-XXX), component name, or "all"

### Steps

1. **Load Design References**
   ```
   Read: RLM/specs/design/design-system.md
   Read: RLM/specs/design/[relevant specs]
   Read: Implementation files for [scope]
   ```

2. **Spawn Designer Sub-Agent**
   ```
   Task: Run design QA checklist
   - Visual Quality (20 points)
   - Accessibility (25 points)
   - Responsive Design (18 points)
   - Interaction Design (18 points)
   - Performance (12 points)
   - Cross-Browser (12 points)
   - Design System Compliance (12 points)

   Output: RLM/progress/design-qa/[scope]-qa.md
   ```

3. **Report to User**
   ```
   ## Design QA: [Scope]

   ### Result: [PASS / PARTIAL / FAIL]
   ### Score: [X]/117

   ### Category Breakdown:
   | Category | Score | Status |
   |----------|-------|--------|
   | Visual | X/20 | ✓/✗ |
   | Accessibility | X/25 | ✓/✗ |
   | ... | ... | ... |

   ### Critical Issues:
   - [Issue 1]: [Location] - [Fix]
   - [Issue 2]: [Location] - [Fix]

   ### Report: RLM/progress/design-qa/[scope]-qa.md
   ```

---

## /cc-design tokens

### Purpose
Generate or update design tokens from design system.

### Steps

1. **Load Design System**
   ```
   Read: RLM/specs/design/design-system.md
   Read: RLM/specs/constitution.md (target framework)
   ```

2. **Generate Tokens**
   ```
   Create/Update:
   - RLM/specs/design/tokens/tokens.json (source of truth)
   - Framework-specific exports based on constitution
   ```

3. **Report to User**
   ```
   ## Design Tokens Updated

   ### Source: RLM/specs/design/tokens/tokens.json

   ### Exports Generated:
   - [x] tokens.json
   - [x] tailwind.config.partial.js (if Tailwind)
   - [x] variables.css (CSS custom properties)
   - [x] [other framework export]

   ### Token Summary:
   - Colors: X tokens
   - Typography: X tokens
   - Spacing: X tokens
   - Effects: X tokens
   ```

---

## Pipeline Integration

### After /cc-discover
```
/cc-discover [idea]
   ↓
PRD includes design philosophy, brand personality
   ↓
/cc-design research (optional, for deeper UX insights)
   ↓
/cc-design system (create design system)
```

### After /cc-create-specs
```
/cc-create-specs
   ↓
Feature specs created
   ↓
/cc-design feature FTR-XXX (for each feature)
```

### Before /cc-review
```
/cc-implement TASK-XXX
   ↓
Implementation complete
   ↓
/cc-design qa FTR-XXX (design QA)
   ↓
/cc-review (code review)
```

---

## Configuration

Design settings in `RLM/progress/cc-config.json`:

```json
{
  "design": {
    "philosophy": "CREATIVE|CONSISTENT",
    "animation_tier": "MINIMAL|MODERATE|RICH",
    "accessibility_level": "AA|AAA",
    "framework": "tailwind|mui|chakra|bootstrap|antd|css",
    "behavioral_economics": true|false
  }
}
```

---

## Error Handling

| Error | Recovery |
|-------|----------|
| No PRD found | Run /cc-discover first |
| No design system | Run /cc-design system first |
| Feature not found | Check feature ID, run /cc-create-specs |
| Missing design tokens | Run /cc-design tokens |

---

## Examples

```bash
# Create full design system
/cc-design system

# Perform UX research first
/cc-design research

# Create button component spec
/cc-design component button

# Design the authentication feature
/cc-design feature FTR-001

# Run design QA on dashboard
/cc-design qa FTR-002

# Update design tokens
/cc-design tokens
```
