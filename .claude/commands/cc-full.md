# Full Automation Pipeline: Idea to Code (v2.5)

You are initiating Claude Code **full automation mode**. This command runs the complete RLM pipeline from idea to working code with minimal user intervention.

## Arguments

`$ARGUMENTS` should be the project idea/description.

If empty, prompt: "Describe your project idea to begin full automation."

## Automatic Context Priming

This command initializes with:
- Elite Context Engineering protocols
- Industry detection framework
- All RLM templates and agents
- Design system configuration

## Pipeline Overview (v2.5)

```
/cc-full [idea]
│
├─► Phase 1: DISCOVER
│   ├─► Spawn Research Sub-Agent (competitor analysis)
│   ├─► Primary Agent asks clarifying questions (3 rounds)
│   │   └─► Includes design questions (philosophy, animation tier, framework)
│   └─► Generate PRD → RLM/specs/PRD.md
│
├─► Phase 2: DESIGN SYSTEM
│   ├─► Spawn Designer Sub-Agent (UX research - optional based on config)
│   ├─► Generate design system → RLM/specs/design/design-system.md
│   └─► Generate tokens → RLM/specs/design/tokens/
│
├─► Phase 3: SPECS
│   ├─► Spawn Architect Sub-Agent (tech decisions)
│   ├─► Generate feature specifications
│   └─► Generate architecture → RLM/specs/architecture/
│
├─► Phase 4: FEATURE DESIGN
│   ├─► For each feature: Spawn Designer Sub-Agent
│   └─► Generate feature design specs → RLM/specs/features/FTR-XXX/design-spec.md
│
├─► Phase 5: TASKS
│   ├─► Analyze features and dependencies
│   ├─► Create fine-grained tasks (includes UI/UX requirements)
│   └─► Generate task files → RLM/tasks/active/
│
├─► Phase 6: IMPLEMENT
│   ├─► Spawn N Coder Sub-Agents IN PARALLEL
│   ├─► TDD implementation for all tasks
│   └─► Coder uses design tokens and implements all 8 states
│
├─► Phase 7: QUALITY
│   ├─► Spawn Designer Sub-Agent → Design QA (117-point checklist)
│   ├─► Spawn Reviewer Sub-Agent → Code review
│   └─► Spawn Tester Sub-Agent → Test coverage
│
├─► Phase 8: VERIFY
│   ├─► For each completed feature: Spawn Verifier Sub-Agent
│   ├─► Generate E2E tests from acceptance criteria
│   └─► Run functional + accessibility + visual tests
│
└─► Phase 9: REPORT
    ├─► Generate progress report
    ├─► Display token usage summary
    ├─► Design QA score
    └─► List any incomplete items
```

## Two Entry Points

### Path 1: From Zero (No PRD)
```
/cc-full [idea]
└─► Starts at Phase 1: DISCOVER
```

### Path 2: From PRD
```
/cc-full --from-prd
└─► Skips Phase 1, starts at Phase 2: DESIGN SYSTEM
    (Assumes RLM/specs/PRD.md exists)
```

## Execution Flow

### Phase 1: Discovery
```
Execute /cc-discover [idea]
├─► Research sub-agent gathers market/competitor info
├─► Ask user 12+ questions (3 rounds of 4+)
│   ├─► Round 1: Business goals, users, MVP scope, success metrics
│   ├─► Round 2: Scale, integrations, tech constraints, data requirements
│   └─► Round 3: Auth, platforms, compliance, UX, DESIGN PREFERENCES
│       ├─► Design Philosophy: CREATIVE or CONSISTENT?
│       ├─► Animation Tier: MINIMAL, MODERATE, or RICH?
│       └─► Target CSS Framework: Tailwind, MUI, Chakra, etc.?
├─► Generate PRD with design requirements
└─► Checkpoint: "PRD generated. Continue to design system?"
    ├─► AUTO mode: Continue automatically
    └─► SUPERVISED mode: Wait for user approval
```

### Phase 2: Design System
```
Execute /cc-design system
├─► Read PRD design requirements
├─► Optional: /cc-design research (if config.design.research_first = true)
│   └─► UX research, personas, journey maps
├─► Designer sub-agent creates design system
│   ├─► Design tokens (colors, typography, spacing, shadows)
│   ├─► Component library specifications
│   ├─► Animation guidelines per tier
│   └─► Accessibility requirements (WCAG 2.1 AA/AAA)
├─► Generate framework-specific token exports
└─► Checkpoint: "Design system created. Continue to specs?"
```

### Phase 3: Spec Generation
```
Execute /cc-create-specs
├─► Architect sub-agent designs system
├─► Generate feature specifications
├─► Generate architecture documentation
└─► Checkpoint: "Specs generated. Continue to feature design?"
```

### Phase 4: Feature Design
```
For each feature FTR-XXX:
├─► Execute /cc-design feature FTR-XXX
│   ├─► Designer sub-agent creates UI/UX spec
│   ├─► User flows and wireframes
│   ├─► Component inventory
│   ├─► Screen layouts
│   └─► Interaction patterns
└─► Checkpoint: "Feature designs complete. Continue to tasks?"
```

### Phase 5: Task Creation
```
Execute /cc-create-tasks
├─► Analyze all feature specs AND design specs
├─► Create dependency graph
├─► Generate task files with UI/UX requirements
│   ├─► Links to design spec
│   ├─► Component states to implement
│   ├─► Design tokens to use
│   └─► Accessibility requirements
└─► Checkpoint: "XX tasks created. Start implementation?"
```

### Phase 6: Implementation (Parallel)
```
Execute /cc-implement all
│
├─► Load configuration: parallel_limit (default: 5)
├─► Sort tasks by dependency order
│
├─► Batch 1 (parallel):
│   ├─► Task tool → Coder Sub-Agent → TASK-001
│   ├─► Task tool → Coder Sub-Agent → TASK-002
│   ├─► Task tool → Coder Sub-Agent → TASK-003
│   ├─► Task tool → Coder Sub-Agent → TASK-004
│   └─► Task tool → Coder Sub-Agent → TASK-005
│   │
│   └─► Each Coder:
│       ├─► Loads design tokens
│       ├─► Implements all 8 component states
│       ├─► Uses animation tier guidelines
│       └─► Ensures accessibility compliance
│
├─► Wait for batch completion
├─► Run tests for completed tasks
│
├─► Batch N (parallel):
│   └─► ... remaining tasks
│
└─► Checkpoint: "Implementation complete. Continue to quality?"
```

### Phase 7: Quality
```
Execute quality checks in parallel:
│
├─► /cc-design qa all
│   └─► Designer sub-agent runs 117-point checklist
│       ├─► Visual Consistency (20 pts)
│       ├─► Accessibility (25 pts)
│       ├─► Component States (18 pts)
│       ├─► Responsive Design (18 pts)
│       ├─► Animation/Motion (12 pts)
│       ├─► Error Handling (12 pts)
│       └─► Performance (12 pts)
│       └─► PASS threshold: ≥105/117 (90%)
│
├─► /cc-review
│   └─► Reviewer sub-agent checks code quality
│       ├─► Security vulnerabilities
│       ├─► Code patterns
│       ├─► Design token usage
│       └─► Accessibility implementation
│
└─► /cc-test
    └─► Tester sub-agent checks coverage
        ├─► Unit test coverage
        ├─► Integration tests
        └─► Component state tests
│
└─► Checkpoint: "Quality checks complete. Continue to verification?"
    ├─► If Design QA < 90%: "Design QA failed (XX%). Fix issues before verify?"
    └─► If Review has criticals: "Critical issues found. Fix before verify?"
```

### Phase 8: Verification
```
For each completed feature FTR-XXX:
├─► Execute /cc-verify FTR-XXX
│   └─► Verifier sub-agent:
│       ├─► Generate Playwright E2E tests from acceptance criteria
│       ├─► Run functional tests (user flows)
│       ├─► Run accessibility tests (axe-core, WCAG 2.1 AA)
│       └─► Run visual regression tests (screenshots)
│
├─► If PASS:
│   └─► Mark feature as verified
│
├─► If FAIL:
│   ├─► Create bug tasks in RLM/tasks/active/
│   ├─► Mark feature as verification-failed
│   └─► Checkpoint: "Feature FTR-XXX verification failed. Fix and retry?"
│
└─► Checkpoint: "Verification complete."
```

### Phase 9: Report
```
Generate final report:
├─► Tasks completed: XX/XX
├─► Features verified: XX/XX
├─► Test coverage: XX%
├─► Design QA score: XX/117 (XX%)
├─► Token usage: XXX,XXX total
├─► Time elapsed: X hours
└─► Any blockers or manual items needed
```

## Automation Levels

| Level | Behavior | Checkpoints |
|-------|----------|-------------|
| **AUTO** | Runs entire pipeline | Only stops on errors or QA failures |
| **SUPERVISED** | Pauses at each phase | User approves each phase |
| **MANUAL** | Step-by-step | User controls each action |

Default: **SUPERVISED** (safest for new projects)

To set level:
```
/cc-full [idea] --auto
/cc-full [idea] --supervised
/cc-full [idea] --manual
```

## Automatic Token Reporting

Throughout the pipeline:
- Silent logging after each sub-agent call
- **50%**: "Token usage at 50%. Proceeding..."
- **75%**: "Token usage at 75%. Consider consolidating remaining work."
- **90%**: "Token usage at 90%. Saving context bundle. May need to resume in new session."
- **Session end**: Full token usage breakdown by phase and agent

## Error Handling

If any phase fails:
1. Save context bundle immediately
2. Log error details to `RLM/progress/logs/errors/`
3. Invoke problem-solving framework
4. Attempt recovery or escalate to user

```
Error in Phase 6 (Implement):
├─► Context bundle saved: RLM/progress/bundles/[session-id].json
├─► Error logged: RLM/progress/logs/errors/[timestamp].md
├─► Recovery attempt...
│   ├─► SUCCESS: Continue pipeline
│   └─► FAILED: "Pipeline paused at implementation. Error: [details]"
└─► Resume with: /cc-full resume
```

## Resume Capability

If pipeline was interrupted:
```
/cc-full resume
├─► Read context bundle
├─► Identify last completed phase
├─► Continue from next phase
└─► Or: /cc-full resume --from=design (restart from specific phase)

Available --from options:
├─► discover
├─► design-system
├─► specs
├─► feature-design
├─► tasks
├─► implement
├─► quality
├─► verify
└─► report
```

## Output Summary

After full pipeline completion:
```
RLM/
├── specs/
│   ├── PRD.md                ✓ Generated
│   ├── constitution.md       ✓ Generated
│   ├── features/             ✓ X features
│   │   └── FTR-XXX/
│   │       ├── spec.md       ✓ Feature spec
│   │       └── design-spec.md ✓ Design spec
│   ├── architecture/         ✓ Complete
│   └── design/               ✓ Design system (v2.5)
│       ├── design-system.md  ✓ Design system
│       ├── research/         ✓ UX research (if enabled)
│       ├── tokens/           ✓ Design tokens
│       │   ├── tokens.json
│       │   └── [framework exports]
│       └── components/       ✓ Component specs
├── tasks/
│   ├── active/               (empty - all completed)
│   └── completed/            ✓ XX tasks
├── progress/
│   ├── token-usage/          ✓ Session logged
│   ├── design-qa/            ✓ QA reports (v2.5)
│   ├── verification/         ✓ E2E test reports (v2.5)
│   └── logs/                 ✓ Activity log
└── [project code]            ✓ Implemented with design tokens
```

## Configuration

Pipeline respects settings from `RLM/progress/cc-config.json`:
```json
{
  "parallel_limit": 5,
  "automation_level": "supervised",
  "token_warning_threshold": 0.5,
  "auto_bundle_threshold": 0.9,
  "design": {
    "philosophy": "CONSISTENT",
    "animation_tier": "MODERATE",
    "accessibility_level": "AA",
    "framework": "tailwind",
    "research_first": false,
    "qa_threshold": 0.9
  },
  "verification": {
    "enabled": true,
    "accessibility_tests": true,
    "visual_regression": true
  }
}
```

Modify with `/cc-config [setting] [value]`.

## Skip Options

To skip optional phases:
```
/cc-full [idea] --skip-design-research    # Skip UX research
/cc-full [idea] --skip-feature-design     # Skip feature design specs
/cc-full [idea] --skip-design-qa          # Skip design QA
/cc-full [idea] --skip-verification       # Skip E2E verification
```

## Phase Dependencies

```
Phase 1 (Discover) ──────────────────────────────────────┐
         │                                               │
         ▼                                               │
Phase 2 (Design System) ◄── Requires PRD                 │
         │                                               │
         ▼                                               │
Phase 3 (Specs) ◄── Can run parallel with Phase 2       │
         │                                               │
         ▼                                               │
Phase 4 (Feature Design) ◄── Requires Specs + Design    │
         │                                               │
         ▼                                               │
Phase 5 (Tasks) ◄── Requires Feature Design             │
         │                                               │
         ▼                                               │
Phase 6 (Implement) ◄── Requires Tasks                  │
         │                                               │
         ▼                                               │
Phase 7 (Quality) ◄── Requires Implementation           │
         │                                               │
         ▼                                               │
Phase 8 (Verify) ◄── Requires Quality Pass              │
         │                                               │
         ▼                                               │
Phase 9 (Report) ◄── Final Summary ─────────────────────┘
```
