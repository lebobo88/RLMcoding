# What's New in RLM

---

# v2.5 - Complete Pipeline Integration

**Release Date**: December 2024

This release integrates design, verification, and quality phases into the complete `/cc-full` automation pipeline, creating a unified 9-phase workflow from idea to verified production code.

## Summary of v2.5 Changes

### Complete 9-Phase Pipeline

The `/cc-full` command now runs all phases automatically:

```
Phase 1: DISCOVER      → PRD with design requirements
Phase 2: DESIGN SYSTEM → Design tokens, component library
Phase 3: SPECS         → Feature specifications, architecture
Phase 4: FEATURE DESIGN → UI/UX specs for each feature
Phase 5: TASKS         → Fine-grained tasks with UI requirements
Phase 6: IMPLEMENT     → Parallel TDD with design tokens
Phase 7: QUALITY       → Design QA + Code Review + Tests
Phase 8: VERIFY        → E2E tests per feature
Phase 9: REPORT        → Complete summary
```

### New Verifier Sub-Agent

| Feature | Description |
|---------|-------------|
| **E2E Test Generation** | Generates Playwright tests from acceptance criteria |
| **Functional Tests** | User flows, forms, navigation, data |
| **Accessibility Tests** | axe-core integration, WCAG 2.1 AA compliance |
| **Visual Regression** | Screenshot comparison for UI states |
| **Bug Task Creation** | Auto-creates bug tasks when verification fails |

### Two Entry Points

| Entry Point | Command | Starts At |
|-------------|---------|-----------|
| From Zero | `/cc-full [idea]` | Phase 1: Discover |
| From PRD | `/cc-full --from-prd` | Phase 2: Design System |

### Quality Phase (Combined)

Phase 7 now combines three quality checks that can run in parallel:

| Check | Sub-Agent | Output |
|-------|-----------|--------|
| Design QA | Designer | 117-point checklist, ≥90% required |
| Code Review | Reviewer | Security, patterns, design compliance |
| Test Coverage | Tester | Unit, integration, component state tests |

### Skip Options

```bash
/cc-full [idea] --skip-design-research    # Skip UX research
/cc-full [idea] --skip-feature-design     # Skip feature design specs
/cc-full [idea] --skip-design-qa          # Skip design QA
/cc-full [idea] --skip-verification       # Skip E2E verification
```

### Resume Options

```bash
/cc-full resume                    # Resume from last completed phase
/cc-full resume --from=design-system  # Restart from specific phase
/cc-full resume --from=implement      # Restart from implementation
```

### Files Modified (v2.5)

| File | Changes |
|------|---------|
| `.claude/commands/cc-full.md` | Complete rewrite with 9 phases |
| `RLM/prompts/CC-ORCHESTRATION.md` | Added all 9 phases, Verifier agent |
| `RLM/START-HERE.md` | Updated workflow diagram, v2.5 features |
| `RLM/docs/QUICK-REFERENCE.md` | Complete rewrite with phases |
| `RLM/docs/USER-GUIDE.md` | Added design workflow section |
| `RLM/docs/CLAUDE-CODE-GUIDE.md` | Updated to v2.5 |
| `CLAUDE.md` | Updated workflow documentation |

### New Configuration Options

Added to `RLM/progress/cc-config.json`:

```json
{
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

### Feature Lifecycle (Updated)

```
in_progress → verification-pending → verified
                      ↓
              verification-failed
                      ↓
              (bug tasks created, fix and retry)
```

### Migration from v2.4

No migration required. v2.5 is additive:
- All v2.4 features continue to work
- Existing projects can use `/cc-full` for complete automation
- Individual commands still work independently
- Verification is optional via `--skip-verification`

---

# v2.4 - Comprehensive UI/UX Engineering

**Release Date**: November 2024

This release adds full UI/UX engineering capabilities with a dedicated Designer agent, design systems, tokens, and a 117-point design QA process.

## Summary of v2.4 Changes

### Designer Agent

| Feature | Description |
|---------|-------------|
| **Design System Generation** | Complete design systems with colors, typography, spacing, components |
| **UX Research** | Web-based research → personas, journey maps, competitive analysis |
| **Component Specifications** | Detailed specs with all 8 states, accessibility, code snippets |
| **Design Tokens** | Framework-agnostic tokens with exports to 6 frameworks |
| **Design QA** | 117-point checklist with ≥90% pass requirement |
| **Animation Design** | Three tiers: MINIMAL, MODERATE, RICH (GSAP) |

### Design Philosophy Options

| Philosophy | When To Use | Characteristics |
|------------|-------------|-----------------|
| **CREATIVE** | Consumer apps, marketing sites, creative industries | Bold colors, unique layouts, custom animations |
| **CONSISTENT** | B2B SaaS, enterprise, healthcare, finance | Accessible, familiar patterns, usability-focused |

### Animation Tiers

| Tier | Technologies | Duration Range |
|------|--------------|----------------|
| **MINIMAL** | CSS transitions only | 100-200ms |
| **MODERATE** | Framer Motion | 150-400ms |
| **RICH** | GSAP ScrollTrigger | 200-1000ms |

### 8 Component States (Required)

All interactive components must implement:
1. Default - Resting appearance
2. Hover - Mouse over (desktop)
3. Focus - Keyboard focus (visible 2px ring)
4. Active - Being clicked/pressed
5. Disabled - Non-interactive
6. Loading - Async operation in progress
7. Error - Validation/operation failure
8. Empty - No content/data

### Framework Token Exports

| Framework | Export File |
|-----------|-------------|
| Tailwind CSS | `tailwind.config.js` |
| Material UI | `mui-theme.ts` |
| Chakra UI | `chakra-theme.ts` |
| Bootstrap | `_variables.scss` |
| Ant Design | `antd-theme.ts` |
| CSS Variables | `css-variables.css` |

### New Commands (v2.4)

| Command | Purpose |
|---------|---------|
| `/cc-design system` | Generate complete design system from PRD |
| `/cc-design research` | UX research with personas & journey maps |
| `/cc-design component [name]` | Create component specification |
| `/cc-design feature [FTR-XXX]` | Create feature design specification |
| `/cc-design qa [scope]` | Run 117-point design QA checklist |
| `/cc-design tokens export [framework]` | Export tokens for specific framework |
| `/prime-design [scope]` | Load design context for UI development |

### Files Created (v2.4)

**Agents (2 files)**:
- `RLM/agents/design-agent.md` - Full design agent prompt
- `.claude/agents/designer.md` - Claude Code sub-agent

**Templates (6 files)**:
- `RLM/templates/design-system-template.md`
- `RLM/templates/ux-research-template.md`
- `RLM/templates/design-qa-checklist.md`
- `RLM/templates/design-tokens-template.md`
- `RLM/templates/component-spec-template.md`
- `RLM/templates/feature-design-spec-template.md`

**Commands (2 files)**:
- `.claude/commands/cc-design.md`
- `.claude/commands/prime-design.md`

**Documentation (3 files)**:
- `RLM/docs/UI-FRAMEWORK-REFERENCE.md`
- `RLM/docs/DESIGN-PATTERNS-LIBRARY.md`
- `RLM/docs/ACCESSIBILITY-GUIDE.md`

### Files Modified (v2.4)

| File | Changes |
|------|---------|
| `RLM/prompts/01-DISCOVER.md` | Added Round 4 design questions (13-18) |
| `RLM/templates/PRD-TEMPLATE.md` | Added sections 18-20 for design |
| `RLM/templates/spec-template.md` | Added UI/UX Requirements section |
| `RLM/templates/CONSTITUTION-TEMPLATE.md` | Added Section 13: Design Standards |
| `RLM/templates/task-template.md` | Added UI/UX requirements and design DoD |
| `RLM/prompts/CC-ORCHESTRATION.md` | Added Designer to delegation table |
| `.claude/agents/coder.md` | Added design token usage protocol |
| `.claude/agents/reviewer.md` | Added design review capabilities |
| `CLAUDE.md` | Added v2.4 design workflow documentation |
| `RLM/docs/CLAUDE-CODE-GUIDE.md` | Added Designer agent and design commands |

### Design Workflow Integration

Design is now integrated into the main RLM workflow:

1. **Discovery** (`/discover`) → Asks design questions (philosophy, animation, framework)
2. **Design System** (`/cc-design system`) → Generates design system from PRD
3. **UX Research** (`/cc-design research`) → Web research → personas & journeys
4. **Component Specs** (`/cc-design component`) → Detailed component specifications
5. **Implementation** (`/implement`) → Uses design tokens, implements all states
6. **Design QA** (`/cc-design qa`) → 117-point checklist, ≥90% pass required

### 117-Point Design QA Categories

| Category | Points | Focus Areas |
|----------|--------|-------------|
| Visual Design | 20 | Colors, typography, spacing, alignment |
| Accessibility | 25 | WCAG, keyboard, screen reader, contrast |
| Responsive | 18 | Breakpoints, mobile-first, touch targets |
| Interaction | 18 | States, feedback, animations |
| Performance | 12 | Images, fonts, animations |
| Cross-Browser | 12 | Browser support, fallbacks |
| Design System | 12 | Token usage, consistency |

**Pass Criteria**: ≥90% overall, no category below 80%, accessibility ≥90%

### Migration from v2.3

No migration required. v2.4 is additive:
- All v2.3 features continue to work
- Design commands are optional - projects work without them
- Existing projects can run `/cc-design system` to add design capabilities

---

# v2.3 - GitHub Copilot Integration

**Release Date**: November 2024

This release adds GitHub Copilot integration templates for projects generated by RLM, enabling Copilot's autonomous coding capabilities within the RLM workflow.

## Summary of v2.3 Changes

### GitHub Copilot Templates

RLM now includes templates that enable GitHub Copilot features in generated projects:

| Template Type | Count | Purpose |
|---------------|-------|---------|
| **Custom Instructions** | 1 | Repository-wide RLM methodology guidance |
| **AGENTS.md** | 1 | Coding agent instructions |
| **Custom Agents** | 5 | Specialized agent profiles (coder, tester, reviewer, architect, research) |
| **Prompt Files** | 10 | Reusable RLM workflow prompts |
| **GitHub Actions** | 1 | Automated task→issue conversion |

### Copilot Features Supported

| Feature | Description | Requires |
|---------|-------------|----------|
| **Copilot Coding Agent** | Assign issues to Copilot for autonomous implementation | Copilot Pro+/Enterprise |
| **Custom Agents** | Define specialized RLM agent personas | Copilot with agent support |
| **Custom Instructions** | `.github/copilot-instructions.md` for repo-wide guidance | Any Copilot tier |
| **Prompt Files** | Reusable prompts in `.github/prompts/` | Copilot Chat |
| **AGENTS.md Support** | Coding agent reads project-level instructions | Copilot coding agent |

### Files Created (v2.3)

**Templates (2 files)**:
- `RLM/templates/copilot/copilot-instructions.md.template`
- `RLM/templates/copilot/AGENTS.md.template`

**Custom Agents (5 files)**:
- `RLM/templates/copilot/agents/rlm-coder.agent.md`
- `RLM/templates/copilot/agents/rlm-tester.agent.md`
- `RLM/templates/copilot/agents/rlm-reviewer.agent.md`
- `RLM/templates/copilot/agents/rlm-architect.agent.md`
- `RLM/templates/copilot/agents/rlm-research.agent.md`

**Prompt Files (10 files)**:
- `RLM/templates/copilot/prompts/rlm-discover.prompt.md`
- `RLM/templates/copilot/prompts/rlm-create-specs.prompt.md`
- `RLM/templates/copilot/prompts/rlm-create-tasks.prompt.md`
- `RLM/templates/copilot/prompts/rlm-implement.prompt.md`
- `RLM/templates/copilot/prompts/rlm-implement-all.prompt.md`
- `RLM/templates/copilot/prompts/rlm-test.prompt.md`
- `RLM/templates/copilot/prompts/rlm-review.prompt.md`
- `RLM/templates/copilot/prompts/rlm-fix-bug.prompt.md`
- `RLM/templates/copilot/prompts/rlm-prime-feature.prompt.md`
- `RLM/templates/copilot/prompts/rlm-prime-task.prompt.md`

**Workflows (1 file)**:
- `RLM/templates/copilot/workflows/rlm-task-to-issue.yml`

### How It Works

When RLM generates a new project:

1. Templates are copied to the project:
   - `copilot-instructions.md.template` → `.github/copilot-instructions.md`
   - `AGENTS.md.template` → `AGENTS.md`
   - `agents/*.agent.md` → `.github/agents/`
   - `prompts/*.prompt.md` → `.github/prompts/`
   - `workflows/*.yml` → `.github/workflows/`

2. Template variables are replaced:
   - `{{PROJECT_NAME}}` from PRD
   - `{{PROJECT_DESCRIPTION}}` from PRD
   - `{{TECH_STACK_SUMMARY}}` from constitution

3. Users can then:
   - Use Copilot Chat with RLM prompts
   - Assign issues to Copilot coding agent
   - Leverage custom agents for specialized tasks

### Using Copilot Coding Agent with RLM

1. Enable Copilot coding agent on GitHub repository
2. Create/push task files to `RLM/tasks/active/`
3. GitHub Actions workflow creates issues automatically
4. Open an issue and click "Assign to Copilot"
5. Copilot autonomously implements and creates a PR
6. Review and merge the PR

### Migration from v2.2

No migration required. v2.3 is additive:
- All v2.2 features continue to work
- Copilot templates are optional - projects work without them
- Existing projects can manually copy templates to enable Copilot features

---

# v2.2 - Full Automation with Parallel Sub-Agents

**Release Date**: November 2024

This release completes the Claude Code enhanced workflow with full automation, parallel sub-agent spawning, and automatic context/token management.

## Summary of v2.2 Changes

### Full Automation Pipeline

| Feature | Description |
|---------|-------------|
| **`/cc-full [idea]`** | Complete pipeline: idea → PRD → specs → tasks → parallel implementation |
| **Two Entry Points** | `/cc-discover` (from zero) or `/cc-create-specs` (from PRD) |
| **Automation Levels** | AUTO (full autonomy), SUPERVISED (checkpoints), MANUAL (step-by-step) |

### Parallel Sub-Agent Spawning

| Feature | Description |
|---------|-------------|
| **Concurrent Execution** | Up to 10 coder sub-agents implementing tasks simultaneously |
| **Dependency Awareness** | Tasks batched respecting dependency graph |
| **Single Message Spawning** | All batch Task tool calls in one response for true parallelism |
| **Token-Aware Batching** | Batch size reduces at 75% budget, stops at 90% |
| **Failure Isolation** | One task failure doesn't block others in batch |

### Automatic Context Priming

All `/cc-*` commands now auto-load required context:
- No manual `/prime-*` commands needed
- Each command loads only relevant files
- Configuration from `RLM/progress/cc-config.json`

### Automatic Token Reporting

| Threshold | Behavior |
|-----------|----------|
| **50%** | Warning displayed, continue normally |
| **75%** | Critical warning, suggest wrapping up |
| **90%** | Auto-save context bundle, complete current batch only |

### Configuration System

New `/cc-config` command for runtime customization:

```bash
/cc-config parallel_limit 8       # Concurrent sub-agents (1-10)
/cc-config automation_level auto  # Full autonomy
/cc-config warning_threshold 0.5  # Warn at 50% budget
```

### New Commands (v2.2)

| Command | Purpose |
|---------|---------|
| `/cc-create-specs` | Generate specs from PRD (Path 2 entry point) |
| `/cc-create-tasks` | Break features into implementation tasks |
| `/cc-full [idea]` | Complete automation pipeline |
| `/cc-config` | Workflow configuration management |

### Files Created (v2.2)

**New Slash Commands (4 files)**:
- `.claude/commands/cc-create-specs.md`
- `.claude/commands/cc-create-tasks.md`
- `.claude/commands/cc-full.md`
- `.claude/commands/cc-config.md`

**Configuration (1 file)**:
- `RLM/progress/cc-config.json`

### Files Modified (v2.2)

| File | Changes |
|------|---------|
| `.claude/commands/cc-implement.md` | Added parallel spawning support |
| `.claude/commands/cc-discover.md` | Added automatic context priming |
| `.claude/commands/cc-architect.md` | Added automatic context priming |
| `.claude/commands/cc-test.md` | Added automatic context priming |
| `.claude/commands/cc-review.md` | Added automatic context priming |
| `.claude/commands/cc-background.md` | Added automatic context priming |
| `.claude/hooks/token-reporter.md` | Added automatic threshold warnings |
| `RLM/prompts/CC-ORCHESTRATION.md` | Added parallel spawning rules |
| `RLM/docs/CLAUDE-CODE-GUIDE.md` | Updated for v2.2 features |

### Migration from v2.1

No migration required. v2.2 is additive:
- All v2.1 commands continue to work
- `/prime-*` commands still available for manual use
- `/cc-tokens` still available for manual checks
- New commands add automation options

---

# v2.1 - Claude Code Enhanced Mode

**Release Date**: November 2024

This release introduces a Claude Code-specific workflow with sub-agent architecture for context efficiency and task specialization.

## Summary of v2.1 Changes

### Sub-Agent Architecture

| Agent | File | Purpose |
|-------|------|---------|
| **Research** | `.claude/agents/research.md` | Web research, competitor analysis, documentation fetching |
| **Architect** | `.claude/agents/architect.md` | Technology decisions, architecture design, ADR generation |
| **Coder** | `.claude/agents/coder.md` | TDD implementation, code generation |
| **Tester** | `.claude/agents/tester.md` | Test writing, coverage analysis, bug investigation |
| **Reviewer** | `.claude/agents/reviewer.md` | Code review, quality checks, security scanning |

**Key Benefits**:
- **Context Isolation**: Sub-agents have 0% token pollution to primary context
- **Specialization**: Each agent focused on specific domain
- **Efficiency**: ~40-60% context reduction via delegation

### New Slash Commands

| Command | Purpose | Delegates To |
|---------|---------|--------------|
| `/cc-discover [idea]` | Enhanced discovery with delegated research | Research Agent |
| `/cc-architect` | Architecture design with isolated context | Architect Agent |
| `/cc-implement [task]` | TDD implementation with code sub-agent | Coder Agent |
| `/cc-test [scope]` | Testing with dedicated tester agent | Tester Agent |
| `/cc-review [scope]` | Code review before commit | Reviewer Agent |
| `/cc-background [task]` | Spawn autonomous background agent | Background process |
| `/cc-tokens` | Display token usage summary | - |

### Context Priming Commands

| Command | Purpose |
|---------|---------|
| `/prime-feature [FTR-XXX]` | Load feature context for development |
| `/prime-bug` | Load bug investigation frameworks |
| `/prime-task [TASK-XXX]` | Load single task context for TDD |
| `/prime-review` | Load review checklists and anti-patterns |

### Token Usage Reporting

Continuous tracking of token consumption:
- Per-call metrics: agent type, task context, input/output tokens
- Per-session aggregation by agent type
- Efficiency metrics and cost estimation
- Historical trending via `/cc-tokens history`

### Hooks System

| Hook | Trigger | Action |
|------|---------|--------|
| `pre-commit.md` | Before git commit | Run reviewer sub-agent |
| `post-task.md` | After task completion | Update progress, notify |
| `on-error.md` | On implementation error | Invoke problem-solving framework |
| `context-bundle.md` | Session checkpoint | Save context bundle for resume |
| `token-reporter.md` | After sub-agent call | Log token usage metrics |

### Files Created (v2.1)

**Sub-Agents (5 files)**:
- `.claude/agents/research.md`
- `.claude/agents/architect.md`
- `.claude/agents/coder.md`
- `.claude/agents/tester.md`
- `.claude/agents/reviewer.md`

**Slash Commands (11 files)**:
- `.claude/commands/cc-discover.md`
- `.claude/commands/cc-architect.md`
- `.claude/commands/cc-implement.md`
- `.claude/commands/cc-test.md`
- `.claude/commands/cc-review.md`
- `.claude/commands/cc-background.md`
- `.claude/commands/cc-tokens.md`
- `.claude/commands/prime-feature.md`
- `.claude/commands/prime-bug.md`
- `.claude/commands/prime-task.md`
- `.claude/commands/prime-review.md`

**Hooks (6 files)**:
- `.claude/hooks.json`
- `.claude/hooks/pre-commit.md`
- `.claude/hooks/post-task.md`
- `.claude/hooks/on-error.md`
- `.claude/hooks/context-bundle.md`
- `.claude/hooks/token-reporter.md`

**Documentation (2 files)**:
- `RLM/prompts/CC-ORCHESTRATION.md`
- `RLM/docs/CLAUDE-CODE-GUIDE.md`

### Migration from v2.0

No migration required. v2.1 is additive:
- Original `/discover`, `/create-specs`, etc. still work (IDE-agnostic)
- New `/cc-*` commands available for Claude Code users
- Use standard commands for any AI; use `/cc-*` for enhanced Claude Code workflow

---

# v2.0 - Enhanced RLM Framework

**Release Date**: November 2024

This release significantly enhances the RLM framework with modern prompt engineering techniques, opinionated technology guidance, and structured decision-making frameworks.

---

## Summary of v2.0 Changes

### Discovery Phase Enhancements

| Feature | Description |
|---------|-------------|
| **Industry Detection** | Automatically identifies project type (SaaS B2B/B2C, E-commerce, FinTech, HealthTech, EdTech, Marketplace, etc.) |
| **Industry-Specific Questions** | Asks targeted questions based on detected industry |
| **Decision Framework** | Prioritized decision-making (Security > UX > Scalability > Maintainability > Cost) |
| **5 Whys Analysis** | Root cause validation for complex problems |
| **SWOT Analysis** | Competitive positioning template |

### PRD Template Enhancements

| New Section | Description |
|-------------|-------------|
| **Technology Stack Recommendation** | Complete stack with confidence levels and alternatives |
| **System Architecture** | Text-based architecture diagrams |
| **Multi-Tenancy Strategy** | SaaS patterns (shared DB, schema-per-tenant, DB-per-tenant) |
| **Compliance & Security** | Industry-specific compliance (GDPR, HIPAA, PCI-DSS, SOC 2) |
| **Enhanced NFRs** | Specific benchmarks (Core Web Vitals, response times) |

### Agent Enhancements

#### Master Architect Agent
- **Chain-of-Thought Decision Process** - 5-step structured reasoning
- **Confidence Levels** - HIGH/MEDIUM/LOW for all recommendations
- **Technology Selection Matrix** - Opinionated guidance for frameworks, databases, APIs
- **Anti-Pattern Documentation** - 18 anti-patterns to avoid

#### Implementation Agent
- **5-Step Problem-Solving Framework** - Structured approach when stuck
- **Bug Investigation Framework** - 4-phase debugging methodology
- **Debugging Techniques Reference** - Performance, race conditions, memory, API issues

#### Research Agent
- **Competitive Analysis Matrix** - Structured competitor comparison
- **TAM/SAM/SOM Estimation** - Market size calculation guidance
- **Jobs-to-Be-Done Framework** - User motivation analysis
- **User Persona Validation** - Assumption tracking and verification

### New Templates

| Template | Purpose |
|----------|---------|
| `decision-record-template.md` | Architecture Decision Records (ADRs) with weighted comparison matrix |
| `assumption-log-template.md` | Track assumptions with confidence, impact, and validation methods |
| `tech-comparison-template.md` | Weighted technology evaluation with detailed analysis |

---

## Detailed Changes

### 1. Discovery Phase (`01-DISCOVER.md`)

**Before**: Basic 3-round question format without structured reasoning.

**After**:
- Industry detection with 10 industry categories
- Decision-making framework (Security > UX > Scalability > Maintainability > Cost)
- Industry-specific questions for SaaS, E-commerce, FinTech, HealthTech, EdTech, Marketplace
- 5 Whys root cause analysis
- SWOT analysis template
- Opinionated technology selection criteria

**Example Industry Detection**:
```markdown
| Industry | Indicators | Key Considerations |
|----------|------------|-------------------|
| SaaS B2B | Multi-tenant, subscriptions, teams | Multi-tenancy patterns, billing, SSO |
| E-commerce | Products, cart, checkout | Payment processing, inventory, shipping |
| FinTech | Payments, banking, trading | PCI-DSS, audit trails, encryption |
```

### 2. PRD Template (`PRD-TEMPLATE.md`)

**Before**: 13 sections covering basics.

**After**: 17 sections including:
- Section 14: Technology Stack Recommendation with confidence levels
- Section 15: System Architecture with ASCII diagrams
- Section 16: Multi-Tenancy Strategy (3 patterns)
- Section 17: Compliance & Security with audit logging

**Example Technology Recommendation**:
```markdown
| Layer | Technology | Rationale | Confidence | Alternatives |
|-------|------------|-----------|------------|--------------|
| Frontend | Next.js 14+ | SSR/SSG for SEO | HIGH | SvelteKit, Remix |
| Database | PostgreSQL 16+ | ACID, JSON support | HIGH | MySQL, MongoDB |
```

### 3. Master Architect Agent (`master-architect.md`)

**New Features**:
- Chain-of-Thought decision process with 5 steps
- Confidence levels for all recommendations
- Complete technology selection matrix
- Anti-pattern documentation (18 patterns)
- Example CoT reasoning for database selection

**Decision Process**:
1. Understand Context
2. Identify Options
3. Evaluate Trade-offs
4. Decide with Rationale
5. Document for Future (ADR)

### 4. Implementation Agent (`implementation-agent.md`)

**New Features**:
- 5-step problem-solving framework
- Bug investigation framework (Reproduce → Hypothesize → Eliminate → Fix)
- Debugging techniques for common issues

**Problem-Solving Steps**:
1. Clarify the Core Issue
2. Identify Relevant Factors
3. Analyze Each Factor
4. Synthesize Insights
5. Recommend Action with Risk Mitigation

### 5. Research Agent (`research-agent.md`)

**New Features**:
- Competitive analysis matrix template
- TAM/SAM/SOM estimation guidance
- Jobs-to-Be-Done framework
- User persona validation methodology
- Assumption tracking

---

## Migration Guide

### For Existing Projects

No migration required. The enhancements are additive:

1. **Re-run Discovery** (optional): Run `/discover` again to get industry-specific questions and tech recommendations
2. **Update PRD** (optional): Add the new sections (14-17) to existing PRDs
3. **Use New Templates**: Start using ADRs for architectural decisions

### For New Projects

The new features are automatically used when you:
1. Run `/discover [idea]`
2. Answer the enhanced question rounds
3. Review the generated PRD with tech recommendations

---

## Breaking Changes

**None.** All changes are backwards compatible.

---

## Files Changed

### Modified
| File | Changes |
|------|---------|
| `RLM/prompts/01-DISCOVER.md` | Industry detection, decision framework, tech guidance |
| `RLM/templates/PRD-TEMPLATE.md` | 4 new sections, enhanced NFRs |
| `RLM/agents/master-architect.md` | CoT, tech matrix, anti-patterns |
| `RLM/agents/implementation-agent.md` | Problem-solving, bug investigation |
| `RLM/agents/research-agent.md` | Competitive analysis, market research |
| `RLM/START-HERE.md` | v2.0 features documentation |
| `CLAUDE.md` | Updated agent descriptions, new templates |

### Created
| File | Purpose |
|------|---------|
| `RLM/templates/decision-record-template.md` | ADR format |
| `RLM/templates/assumption-log-template.md` | Assumption tracking |
| `RLM/templates/tech-comparison-template.md` | Technology evaluation |
| `RLM/docs/WHATS-NEW.md` | This changelog |

---

## Acknowledgments

These enhancements were developed based on research from:
- Advanced Prompt Templates (50+ production-ready templates)
- Master AI Agent Prompt for PRD Generation
- Master-AI-Agent-PRD-Generation-System (comprehensive framework)

The goal was to bring modern prompt engineering best practices into the RLM workflow.
