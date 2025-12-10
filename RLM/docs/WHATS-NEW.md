# What's New in RLM

This document tracks all major version releases and changes to the RLM framework.

---

# v2.7 - Research-Aligned Enhancements

**Release Date**: December 10, 2025

This release enhances the RLM methodology with research-driven improvements including prompt patterns, behavioral economics, cognitive psychology principles, and a test mode for methodology validation.

## Summary of v2.7 Changes

### 8 Enhancements Implemented

| # | Enhancement | Category | Files |
|---|-------------|----------|-------|
| 1 | Prompt Pattern Library | Agent Enhancement | 4 new pattern files |
| 2 | API Hook Pattern for Agents | Agent Enhancement | 6 agent files updated |
| 3 | 3-Tier Context Management | Core Infrastructure | CC-ORCHESTRATION.md updated |
| 4 | Behavioral Economics Integration | Design Enhancement | 2 new files, designer.md updated |
| 5 | Cognitive Psychology Principles | Design Enhancement | ux-research-template.md updated |
| 6 | Enhanced PRD Template v2 | Template Enhancement | New PRD-template-v2.md |
| 7 | Test Mode Command | Tooling | New cc-test-run.md command |
| 8 | Configuration Updates | Core Infrastructure | cc-config.json updated |

---

### Enhancement #1: Prompt Pattern Library

Four reusable reasoning patterns for structured problem-solving in `RLM/prompts/patterns/`:

| Pattern | Purpose | Used By |
|---------|---------|---------|
| `root-cause-analysis.md` | 5-Whys bug investigation framework | Coder, Tester |
| `decision-matrix.md` | Weighted scoring for technology selection | Architect |
| `comparative-analysis.md` | Structured comparison of alternatives | Architect, Research |
| `problem-decomposition.md` | 7-step complex task breakdown | Coder |

**Usage**: Agents reference patterns when applicable tasks arise. For example, when the Coder agent encounters a bug, it applies the root-cause-analysis pattern automatically.

---

### Enhancement #2: API Hook Pattern for Sub-Agents

All 6 sub-agents now have proactive trigger descriptions that specify when they should be used automatically:

**Before**:
```yaml
description: "Performs web research and competitive analysis"
```

**After**:
```yaml
description: "Use this agent PROACTIVELY when: (1) user mentions competitors,
market research, or asks 'what do others do?', (2) evaluating unfamiliar
technologies or APIs, (3) validating business assumptions during discovery..."
```

**Agents Updated**:
- `.claude/agents/research.md` - Triggers on competitor/market mentions
- `.claude/agents/architect.md` - Triggers on technology decisions
- `.claude/agents/designer.md` - Triggers on UI feature start
- `.claude/agents/coder.md` - Triggers on build/implement requests
- `.claude/agents/tester.md` - Triggers on coverage/test issues
- `.claude/agents/reviewer.md` - Triggers before commits

---

### Enhancement #3: 3-Tier Context Management

Enhanced context management protocol in `RLM/prompts/CC-ORCHESTRATION.md`:

**Tier 1: REDUCE** (Minimize context loaded)
- Selective file reading (30% token savings)
- Summary files over full documents
- Task-specific config loading

**Tier 2: DELEGATE** (Offload high-token work)
- Sub-agent delegation matrix
- Context isolation protocol
- Summary-only returns (< 300 words)

**Tier 3: MANAGE** (Persistent state & recovery)
- Checkpoint system at 50%/75%/90%/95% thresholds
- Smart truncation tiers (protected/summarize/truncate)
- Context bundle format for recovery
- Context audit command

**New Command**:
```bash
/cc-debug context-audit    # Analyze context usage and optimization opportunities
```

---

### Enhancement #4: Behavioral Economics Integration

Designer agent now applies 7 behavioral economics principles from `RLM/templates/behavioral-economics-checklist.md`:

| Principle | Application | Example |
|-----------|-------------|---------|
| **Choice Architecture** | Design defaults to guide optimal choices | Default to recommended plan |
| **Prospect Theory** | Frame messaging as loss/gain | "Don't lose your saved data" |
| **Anchoring** | Strategic pricing presentation | Show crossed-out original price |
| **Social Proof** | Display genuine user activity | "Join 50,000+ teams" |
| **Endowment Effect** | Create ownership through personalization | Name workspace on signup |
| **Scarcity/Urgency** | Use only for genuine constraints | Real countdown timers only |
| **Cognitive Load** | Progressive disclosure | Hide advanced options initially |

**Dark Pattern Avoidance**: Checklist includes explicit patterns to NEVER use (fake timers, hidden costs, difficult unsubscribe, etc.)

**Files Created**:
- `RLM/templates/behavioral-economics-checklist.md`

**Files Updated**:
- `.claude/agents/designer.md` - Added behavioral economics section

---

### Enhancement #5: Cognitive Psychology Principles

UX research template enhanced with cognitive psychology laws in `RLM/templates/ux-research-template.md`:

| Law | Definition | UX Application |
|-----|------------|----------------|
| **Fitts's Law** | Time to target = f(distance x size) | Min 44x44px targets, near thumb zones |
| **Hick's Law** | Decision time = log2(n+1) choices | Max 7+/-2 choices per screen |
| **Miller's Law** | Working memory holds 7+/-2 items | Group into sections, breadcrumbs |
| **Jakob's Law** | Users prefer familiar patterns | Follow platform conventions |
| **Peak-End Rule** | Judge experience by peaks and endings | Polish onboarding completion |
| **Von Restorff Effect** | Different items are remembered | Visual hierarchy for CTAs |

**Additional Topics**:
- Cognitive Load Theory (Intrinsic/Extraneous/Germane)
- Memory & Attention Principles
- Emotional Design guidelines
- Persuasion Patterns (ethical application)
- Dark Pattern Avoidance checklist

---

### Enhancement #6: Enhanced PRD Template v2

New 15-section comprehensive PRD structure in `RLM/templates/PRD-template-v2.md`:

| # | Section | Key Contents |
|---|---------|--------------|
| 1 | Executive Summary | Vision, goals, success metrics |
| 2 | Product Overview | Problem, solution, target users |
| 3 | User Personas | Detailed personas with JTBD |
| 4 | Functional Requirements | User stories by journey |
| 5 | Non-Functional Requirements | Performance, security, scalability |
| 6 | Technology Stack | Recommendations with confidence levels |
| 7 | System Architecture | Diagrams and component descriptions |
| 8 | Data Models | Entity relationships, schemas |
| 9 | User Experience Flows | Key user journeys |
| 10 | Security & Compliance | Requirements, audit logging |
| 11 | Integration Requirements | Third-party services |
| 12 | Testing Strategy | Test types and coverage |
| 13 | Deployment & Operations | Infrastructure, monitoring |
| 14 | Development Phases | Milestones and deliverables |
| 15 | Risks & Mitigation | Risk matrix with mitigations |

**Design Requirements Section**: Includes design philosophy, animation tier, framework, accessibility level.

---

### Enhancement #7: Test Mode Command

New `/cc-test-run` command for isolated methodology testing:

```bash
/cc-test-run [project-name]                     # Interactive mode
/cc-test-run [project-name] --from-prd path/    # Start from existing PRD
/cc-test-run [project-name] --idea "description" # Provide idea inline
```

**What It Does**:
1. Creates isolated directory: `test_projects/[name]-[timestamp]/`
2. Copies RLM structure (prompts, agents, templates)
3. Runs `/cc-full` in the isolated directory
4. Collects metrics: tokens, time, lines of code, test coverage
5. Generates comparison report if multiple instances exist

**Files Created**:
- `.claude/commands/cc-test-run.md`

---

### Enhancement #8: Configuration Updates

New sections added to `RLM/progress/cc-config.json`:

```json
{
  "enhancements": {
    "prompt_patterns": {
      "enabled": true,
      "auto_select": true,
      "patterns_path": "RLM/prompts/patterns/",
      "available_patterns": [
        "root-cause-analysis",
        "decision-matrix",
        "comparative-analysis",
        "problem-decomposition"
      ]
    },
    "behavioral_economics": {
      "enabled": true,
      "checklist_in_design": true,
      "checklist_path": "RLM/templates/behavioral-economics-checklist.md"
    },
    "cognitive_psychology": {
      "enabled": true,
      "validate_in_qa": true,
      "principles": ["fitts_law", "hicks_law", "millers_law", "jakobs_law", "peak_end_rule", "von_restorff_effect"]
    }
  },
  "test_mode": {
    "enabled": false,
    "output_directory": "test_projects/",
    "collect_metrics": true,
    "metrics_to_collect": ["tokens_used", "execution_time", "lines_of_code", "test_coverage", "files_created"]
  }
}
```

---

## Files Created (v2.7)

| File | Purpose |
|------|---------|
| `.claude/commands/cc-test-run.md` | Test mode command |
| `RLM/prompts/patterns/root-cause-analysis.md` | Bug investigation pattern |
| `RLM/prompts/patterns/decision-matrix.md` | Technology selection pattern |
| `RLM/prompts/patterns/comparative-analysis.md` | Comparison pattern |
| `RLM/prompts/patterns/problem-decomposition.md` | Task breakdown pattern |
| `RLM/templates/behavioral-economics-checklist.md` | Product design checklist |
| `RLM/templates/PRD-template-v2.md` | Enhanced PRD structure |

## Files Updated (v2.7)

| File | Changes |
|------|---------|
| `.claude/agents/research.md` | Proactive trigger description |
| `.claude/agents/architect.md` | Proactive trigger + pattern references |
| `.claude/agents/designer.md` | Proactive trigger + behavioral economics section |
| `.claude/agents/coder.md` | Proactive trigger + pattern references |
| `.claude/agents/tester.md` | Proactive trigger + pattern references |
| `.claude/agents/reviewer.md` | Proactive trigger description |
| `RLM/prompts/CC-ORCHESTRATION.md` | 3-tier context management (~200 lines) |
| `RLM/templates/ux-research-template.md` | Cognitive psychology section |
| `RLM/progress/cc-config.json` | Enhancement + test_mode settings |
| `CLAUDE.md` | v2.7 documentation |
| `RLM/docs/WHATS-NEW.md` | This release notes |
| `RLM/docs/CLAUDE-CODE-GUIDE.md` | v2.7 guide updates |

---

## Migration from v2.6

No migration required. v2.7 is additive:
- All v2.6 features continue to work
- New prompt patterns available automatically
- Agents use enhanced descriptions
- Behavioral economics optional (enable in config)
- Test mode available via `/cc-test-run`

**Recommended Actions**:
1. Review new prompt patterns in `RLM/prompts/patterns/`
2. Enable behavioral economics if doing UI work
3. Try `/cc-test-run` to validate methodology
4. Review cognitive psychology principles in UX research

---

# v2.6 - Enhanced Progress, Debugging & IDE Parity

**Release Date**: December 2025

This release adds comprehensive progress tracking, context management, debugging tools, and feature parity across all development environments.

## Summary of v2.6 Changes

### 9 Enhancements Implemented

| # | Enhancement | Category |
|---|-------------|----------|
| 1 | IDE/Copilot Feature Parity | Parity & Automation |
| 2 | Auto-Detected Design Agent | Integration |
| 3 | Token/Progress Reporting | Core Infrastructure |
| 4 | Context Window Management | Integration |
| 5 | Automated Modes for Non-CC Methods | Parity & Automation |
| 6 | Integrated Review/Verify | Integration |
| 7 | Checkpoint System | Core Infrastructure |
| 8 | Global Debug Command | Core Infrastructure |
| 9 | Auto Project Research | Core Infrastructure |

### Key Features

**Token/Progress Reporting**:
- Real-time progress visualization with 5-step model
- Token tracking per task and session
- Efficiency ratings (Excellent/Good/Fair/Poor)
- Configurable modes (realtime, silent, both)

**Checkpoint System**:
- Generation-based tracking prevents duplicate tasks
- Incremental feature detection
- Resume capability at any point

**Global Debug Command**:
- `/cc-debug` for state reconciliation
- 10 issue types detected
- Interactive and auto-fix modes

**Context Window Management**:
- Auto-checkpoint at 50%/75%/90% thresholds
- Smart truncation with tier system
- Phase transition protocol

---

# v2.5 - Complete Pipeline Integration

**Release Date**: December 2025

This release integrates design, verification, and quality phases into the complete `/cc-full` automation pipeline, creating a unified 9-phase workflow.

## Summary of v2.5 Changes

### Complete 9-Phase Pipeline

```
Phase 1: DISCOVER      -> PRD with design requirements
Phase 2: DESIGN SYSTEM -> Design tokens, component library
Phase 3: SPECS         -> Feature specifications, architecture
Phase 4: FEATURE DESIGN -> UI/UX specs for each feature
Phase 5: TASKS         -> Fine-grained tasks with UI requirements
Phase 6: IMPLEMENT     -> Parallel TDD with design tokens
Phase 7: QUALITY       -> Design QA + Code Review + Tests
Phase 8: VERIFY        -> E2E tests per feature
Phase 9: REPORT        -> Complete summary
```

### Key Features

**Verifier Sub-Agent**:
- E2E test generation from acceptance criteria
- Functional testing with Playwright
- Accessibility testing with axe-core
- Visual regression with screenshots
- Auto bug task creation on failure

**Two Entry Points**:
- `/cc-full [idea]` - Start from Phase 1
- `/cc-full --from-prd` - Start from Phase 2

**Skip Options**:
- `--skip-design-research`
- `--skip-feature-design`
- `--skip-design-qa`
- `--skip-verification`

---

# v2.4 - Comprehensive UI/UX Engineering

**Release Date**: November 2024

This release adds full UI/UX engineering capabilities with a dedicated Designer agent, design systems, tokens, and a 117-point design QA process.

## Summary of v2.4 Changes

### Designer Agent Features

| Feature | Description |
|---------|-------------|
| Design System Generation | Complete systems with colors, typography, spacing, components |
| UX Research | Web-based research -> personas, journey maps, competitive analysis |
| Component Specifications | Detailed specs with all 8 states, accessibility, code snippets |
| Design Tokens | Framework-agnostic tokens with exports to 6 frameworks |
| Design QA | 117-point checklist with >=90% pass requirement |
| Animation Design | Three tiers: MINIMAL, MODERATE, RICH (GSAP) |

### Design Philosophy Options

| Philosophy | When To Use | Characteristics |
|------------|-------------|-----------------|
| **CREATIVE** | Consumer apps, marketing sites | Bold colors, unique layouts |
| **CONSISTENT** | B2B SaaS, enterprise | Accessible, familiar patterns |

### 8 Component States (Required)

All interactive components must implement:
1. Default, 2. Hover, 3. Focus, 4. Active, 5. Disabled, 6. Loading, 7. Error, 8. Empty

---

# v2.3 - GitHub Copilot Integration

**Release Date**: November 2024

This release adds GitHub Copilot integration templates for projects generated by RLM.

## Summary of v2.3 Changes

### Copilot Features

| Feature | Files |
|---------|-------|
| Custom Instructions | `.github/copilot-instructions.md` |
| AGENTS.md | Project root coding agent instructions |
| Custom Agents | `.github/agents/*.agent.md` |
| Prompt Files | `.github/prompts/*.prompt.md` |
| Task-to-Issue Workflow | `.github/workflows/rlm-task-to-issue.yml` |

---

# v2.2 - Full Automation with Parallel Sub-Agents

**Release Date**: November 2024

This release completes the Claude Code enhanced workflow with full automation and parallel sub-agent spawning.

## Summary of v2.2 Changes

### Key Features

| Feature | Description |
|---------|-------------|
| `/cc-full [idea]` | Complete pipeline: idea -> verified code |
| Parallel Spawning | Up to 10 concurrent coder sub-agents |
| Automation Levels | AUTO, SUPERVISED, MANUAL |
| Auto Context Priming | All `/cc-*` commands auto-load context |
| Token Reporting | Automatic warnings at 50%/75%/90% |
| Configuration | `/cc-config` for runtime customization |

---

# v2.1 - Claude Code Enhanced Mode

**Release Date**: November 2024

This release introduces Claude Code-specific workflow with sub-agent architecture.

## Summary of v2.1 Changes

### Sub-Agent Architecture

| Agent | Purpose |
|-------|---------|
| Research | Web research, competitor analysis |
| Architect | Technology decisions, ADRs |
| Coder | TDD implementation |
| Tester | Test writing, coverage |
| Reviewer | Code review, security |

### Key Benefits

- Context isolation (0% token pollution)
- Agent specialization
- ~40-60% context reduction

---

# v2.0 - Enhanced RLM Framework

**Release Date**: November 2024

This release significantly enhances the RLM framework with modern prompt engineering techniques.

## Summary of v2.0 Changes

### Discovery Phase Enhancements

- Industry detection (10 categories)
- Industry-specific questions
- Decision framework (Security > UX > Scalability > Maintainability > Cost)
- 5 Whys analysis
- SWOT analysis

### PRD Template Enhancements

- Technology stack recommendations with confidence levels
- System architecture diagrams
- Multi-tenancy strategy
- Compliance & security sections

### Agent Enhancements

| Agent | New Features |
|-------|--------------|
| Master Architect | Chain-of-Thought, tech matrix, anti-patterns |
| Implementation | 5-step problem-solving, bug investigation |
| Research | Competitive analysis, TAM/SAM/SOM, JTBD |

### New Templates

| Template | Purpose |
|----------|---------|
| `decision-record-template.md` | Architecture Decision Records |
| `assumption-log-template.md` | Assumption tracking |
| `tech-comparison-template.md` | Technology evaluation |

---

## Version History Summary

| Version | Date | Key Features |
|---------|------|--------------|
| v2.7 | Dec 2025 | Prompt patterns, behavioral economics, cognitive psychology, test mode |
| v2.6 | Dec 2025 | Progress reporting, debugging, checkpoints, IDE parity |
| v2.5 | Dec 2025 | 9-phase pipeline, verifier agent, quality phase |
| v2.4 | Nov 2024 | Designer agent, design systems, 117-point QA |
| v2.3 | Nov 2024 | GitHub Copilot integration |
| v2.2 | Nov 2024 | Full automation, parallel sub-agents |
| v2.1 | Nov 2024 | Sub-agent architecture |
| v2.0 | Nov 2024 | Enhanced discovery, PRD templates |

---

## Acknowledgments

Research sources that informed v2.7 enhancements:
- Advanced Prompt Templates (50+ production-ready templates)
- Claude Code Sub-Agent Architecture research
- Elite Context Engineering Protocols
- Behavioral Economics for Product Design
- UI/UX Expert Agent research
- Master AI Agent Prompt for PRD Generation
