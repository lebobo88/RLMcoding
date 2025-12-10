# Claude Code Orchestration Protocol (v2.5)

This document defines how the Primary Agent orchestrates sub-agents for context-efficient RLM workflow execution.

## Core Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER                                        │
│                                │                                         │
│                                ▼                                         │
│                       ┌────────────────┐                                 │
│                       │  PRIMARY AGENT │                                 │
│                       │  (Orchestrator)│                                 │
│                       └───────┬────────┘                                 │
│                               │                                          │
│  ┌──────────┬──────────┬──────┼──────┬──────────┬──────────┬──────────┐ │
│  ▼          ▼          ▼      ▼      ▼          ▼          ▼          ▼ │
│┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐  │
││Research││Architect││Designer││ Coder  ││ Tester ││Reviewer││Verifier│  │
││Sub-Agt ││Sub-Agt ││Sub-Agt ││Sub-Agt ││Sub-Agt ││Sub-Agt ││Sub-Agt │  │
│└───┬────┘└───┬────┘└───┬────┘└───┬────┘└───┬────┘└───┬────┘└───┬────┘  │
│    │         │         │         │         │         │         │        │
│    └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘        │
│                                  │                                       │
│                                  ▼                                       │
│                            [File System]                                 │
│                       Results written to files                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## The Golden Rule

**Sub-Agents report to the Primary Agent, NOT to the User.**

Information Flow:
1. User prompts Primary Agent
2. Primary Agent determines delegation need
3. Primary Agent prompts Sub-Agent with context payload
4. Sub-Agent executes and writes results to files
5. Sub-Agent reports summary to Primary Agent
6. Primary Agent synthesizes and reports to User

## Delegation Rules

### When to Delegate to Sub-Agents

| Task Type | Delegate? | Sub-Agent | Reason |
|-----------|-----------|-----------|--------|
| Web research | YES | Research | High token usage, isolated context |
| Code generation | YES | Coder | Focused work, doesn't pollute primary |
| Test writing | YES | Tester | Separate concern from implementation |
| Code review | YES | Reviewer | Isolated analysis |
| Architecture design | YES | Architect | Deep analysis without context pollution |
| **Design system creation** | YES | **Designer** | UX research, visual design, tokens |
| **Component specifications** | YES | **Designer** | Detailed state/accessibility specs |
| **Design QA** | YES | **Designer** | Visual quality, accessibility audit |
| **Feature design specs** | YES | **Designer** | UI/UX wireframes, user flows |
| **E2E verification** | YES | **Verifier** | Playwright tests, accessibility, visual |
| Simple file reads | NO | - | Faster to do directly |
| User clarifications | NO | - | Primary Agent responsibility |
| Progress reporting | NO | - | Primary Agent responsibility |
| Final synthesis | NO | - | Primary Agent responsibility |

### Delegation Decision Tree

```
Is this task:
├── High-token? (research, heavy codegen)
│   └── YES → Delegate to Sub-Agent
├── Specialized? (testing, review, architecture)
│   └── YES → Delegate to Sub-Agent
├── Long-running? (build, test suite)
│   └── YES → Consider Background Agent
├── User-facing? (questions, reports)
│   └── NO → Primary Agent handles
└── Context-sensitive? (decisions needing full history)
    └── NO → Primary Agent handles
```

## Context Payload Protocol

When delegating to a sub-agent, the Primary Agent must prepare a context payload:

### Required Context

```markdown
## Task for [Agent Name]

### Objective
[Clear statement of what the sub-agent should accomplish]

### Context
[Relevant background information]

### Inputs
- [File paths to read]
- [Specific data needed]

### Constraints
- [Any limitations or requirements]

### Output Requirements
- [Expected output format]
- [Where to write results]
- [Summary format for return to Primary]
```

### Example: Research Delegation

```markdown
## Task for Research Sub-Agent

### Objective
Research authentication best practices for SaaS applications.

### Context
We're building a B2B SaaS product that needs enterprise-grade auth.
Target: 10,000 users, multi-tenant architecture.

### Inputs
- Review RLM/specs/PRD.md sections on security requirements
- Research OAuth 2.0, SAML, and SSO providers

### Constraints
- Focus on solutions supporting SCIM provisioning
- Consider SOC 2 compliance requirements
- Budget: $500/month for auth services

### Output Requirements
- Write detailed analysis to RLM/specs/research/auth-options.md
- Return 3-5 sentence summary with top recommendation
- Include comparison matrix of top 3 options
```

## Token Budget Awareness

### Primary Agent Responsibilities

1. **Track Cumulative Usage**: Monitor total tokens across all sub-agent calls
2. **Budget Allocation**: Estimate tokens needed before delegation
3. **Throttling**: Reduce sub-agent calls if approaching limits
4. **Reporting**: Use `/cc-tokens` to check usage

### Budget Thresholds

| Threshold | Action |
|-----------|--------|
| 50% | Continue normally, awareness note |
| 75% | Consolidate remaining work, avoid new research |
| 90% | Complete only critical tasks, save context bundle |
| 95% | Stop and save, report to user |

### Efficiency Strategies

1. **Batch Similar Tasks**: Group related sub-agent calls
2. **Reuse Research**: Don't re-research same topics
3. **Summarize Aggressively**: Sub-agents return summaries, not full output
4. **Write to Files**: Detailed output goes to files, not context

## 3-Tier Context Management Protocol (v2.6)

Efficient context management is critical for large projects. Apply this tiered strategy:

### Tier 1: REDUCE (Minimize Context Loaded)

**Goal**: Load only what's needed, avoid context bloat from the start.

| Strategy | Implementation | Token Savings |
|----------|----------------|---------------|
| **Selective File Reading** | Read specific sections, not entire files | ~30% |
| **Minimal MCP Loading** | Don't autoload all MCP servers | ~12% |
| **Config Files per Task** | Use task-specific configs | ~8% |
| **Summary Files** | Read summaries, not full docs | ~25% |

**File Reading Priority**:
```
ALWAYS LOAD (< 500 tokens):
├── Current task file (TASK-XXX.md)
├── Constitution (coding standards)
└── Active feature spec summary

LOAD IF UI TASK (< 300 tokens):
├── Design tokens (tokens.json)
└── Component spec (if exists)

LOAD ON DEMAND (only when needed):
├── Full PRD (read specific sections)
├── Architecture docs
└── Previous session context
```

**Anti-Pattern Detection**:
```
WARNING: Context bloat detected
├── > 10 files loaded at once
├── > 50KB of context in single prompt
├── Full file reads when sections would suffice
└── Repeated reads of same file in session
```

### Tier 2: DELEGATE (Offload High-Token Work)

**Goal**: Sub-agents handle token-heavy operations without polluting primary context.

**Delegation Matrix**:
| Task Type | Token Cost | Delegate? | Sub-Agent |
|-----------|------------|-----------|-----------|
| Web scraping | 5,000-20,000 | YES | Research |
| Documentation fetching | 3,000-15,000 | YES | Research |
| Full codebase analysis | 10,000-50,000 | YES | Architect |
| Design system creation | 5,000-15,000 | YES | Designer |
| Code implementation | 3,000-10,000 | YES | Coder |
| Test suite generation | 3,000-8,000 | YES | Tester |
| Security scanning | 2,000-5,000 | YES | Reviewer |

**Sub-Agent Context Isolation**:
```
Primary Agent Context:
├── Task context (~2,000 tokens)
├── User conversation (~1,000 tokens)
└── System prompts (~500 tokens)
│
└── Spawns Coder Sub-Agent:
    ├── Fresh context window
    ├── Task payload (~1,500 tokens)
    ├── Implementation work (~8,000 tokens)
    └── Returns: 200-word summary (~300 tokens)

Result: 8,000+ tokens of code work
        NOT added to primary context
```

**Delegation Protocol**:
1. Primary prepares minimal context payload
2. Sub-agent operates in isolated context
3. Sub-agent writes detailed output to files
4. Sub-agent returns summary (< 300 words) to Primary
5. Primary reads files only if needed for next step

### Tier 3: MANAGE (Persistent State & Recovery)

**Goal**: Handle context overflow gracefully with checkpoints and bundles.

**Checkpoint System**:
```
Token Usage Thresholds:
│
├── 50% (50,000 tokens)
│   └── Action: Warning logged, continue normally
│
├── 75% (75,000 tokens)
│   └── Actions:
│       ├── Save checkpoint to RLM/progress/checkpoint.json
│       ├── Activate smart truncation (Tier 3 items first)
│       └── Reduce parallel batch size to 3
│
├── 90% (90,000 tokens)
│   └── Actions:
│       ├── Save full context bundle
│       ├── Complete current task only
│       └── Force pause with resume instructions
│
└── 95% (95,000 tokens)
    └── Actions:
        ├── Emergency bundle save
        ├── Stop all work immediately
        └── Report to user with /cc-implement resume instructions
```

**Smart Truncation Tiers** (applied at 75% token usage):

```
TIER 1 - NEVER TRUNCATE (Protected):
├── Current task specification
├── Constitution (coding standards)
├── Active feature spec
├── Recent errors/decisions (last 5)
└── Key decisions log

TIER 2 - SUMMARIZE IF NEEDED:
├── Completed task summaries (keep last 3)
├── Previous session context
├── Design tokens (core subset only)
└── Research findings (key points only)

TIER 3 - TRUNCATE FIRST:
├── Historical logs (> 1 hour old)
├── Verbose tool outputs
├── Exploration context (file listings, searches)
└── Full file contents (use summaries)
```

**Context Bundle Format**:
```json
{
  "bundle_id": "session-2024-01-15-143000",
  "created_at": "2024-01-15T14:30:00Z",
  "token_usage": {
    "at_bundle": 92000,
    "limit": 100000
  },
  "state": {
    "phase": "implement",
    "completed_tasks": ["TASK-001", "TASK-002", "TASK-003"],
    "in_progress_task": "TASK-004",
    "remaining_tasks": ["TASK-005", "TASK-006", "TASK-007"],
    "design_qa_score": null,
    "test_coverage": null
  },
  "context": {
    "current_task": { /* minimal task context */ },
    "decisions_log": [ /* key decisions made */ ],
    "errors_encountered": [ /* recent errors */ ],
    "user_preferences": { /* extracted from conversation */ }
  },
  "resume_instructions": "Run /cc-implement resume to continue from TASK-004"
}
```

**Recovery Protocol**:
```
User runs: /cc-implement resume
│
├─► Read latest bundle from RLM/progress/bundles/
│
├─► Restore state:
│   ├─► Set phase to bundle.state.phase
│   ├─► Mark completed tasks
│   └─► Load current task context
│
├─► Apply decisions log (avoid re-asking resolved questions)
│
└─► Continue from in_progress_task
```

### Context Audit Command

Add to `/cc-debug` for context analysis:

```
/cc-debug context-audit

Output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXT AUDIT REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Usage: 45,230 / 100,000 tokens (45.2%)

Breakdown by Category:
├── System prompts:     2,500 tokens (5.5%)
├── User conversation:  8,200 tokens (18.1%)
├── File contents:     22,100 tokens (48.9%)
├── Tool outputs:      10,430 tokens (23.1%)
└── Sub-agent returns:  2,000 tokens (4.4%)

Optimization Opportunities:
├── [HIGH] 3 files read in full that could use summaries
├── [MED] 2 tool outputs could be truncated
└── [LOW] Consider delegating remaining analysis

Recommendation: Continue normally (below 50% threshold)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Efficiency Metrics

Track these context efficiency metrics:

| Metric | Target | Calculation |
|--------|--------|-------------|
| Delegation Ratio | > 60% | Sub-agent tokens / Total tokens |
| Context Reuse | > 40% | Cached reads / Total reads |
| Truncation Rate | < 10% | Truncated content / Total content |
| Bundle Recovery | > 95% | Successful resumes / Total resumes |
| Tokens per Task | < 10,000 | Total tokens / Tasks completed |

## Workflow Orchestration (v2.5 Complete Pipeline)

The complete `/cc-full` pipeline consists of 9 phases:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE RLM PIPELINE (v2.5)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Phase 1: DISCOVER ──────► Phase 2: DESIGN SYSTEM                       │
│      │                          │                                        │
│      │    ┌─────────────────────┘                                        │
│      │    │                                                              │
│      ▼    ▼                                                              │
│  Phase 3: SPECS ─────────► Phase 4: FEATURE DESIGN                      │
│      │                          │                                        │
│      │    ┌─────────────────────┘                                        │
│      │    │                                                              │
│      ▼    ▼                                                              │
│  Phase 5: TASKS ─────────► Phase 6: IMPLEMENT (parallel)                │
│                                 │                                        │
│                                 ▼                                        │
│                         Phase 7: QUALITY                                 │
│                          (Design QA + Review + Test)                     │
│                                 │                                        │
│                                 ▼                                        │
│                         Phase 8: VERIFY                                  │
│                          (E2E per feature)                               │
│                                 │                                        │
│                                 ▼                                        │
│                         Phase 9: REPORT                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Discovery

```
Primary Agent receives /cc-discover [idea]
│
├─► Spawn Research Sub-Agent
│   └─► Research competitors, market, technology
│       └─► Write to RLM/specs/research/
│           └─► Return summary to Primary
│
├─► Primary analyzes + asks user questions
│   └─► Includes design questions:
│       ├─► Design Philosophy: CREATIVE or CONSISTENT?
│       ├─► Animation Tier: MINIMAL, MODERATE, or RICH?
│       └─► Target CSS Framework?
│
├─► Spawn Architect Sub-Agent
│   └─► Technology recommendations
│       └─► Write to RLM/specs/architecture/
│           └─► Return recommendations to Primary
│
└─► Primary synthesizes PRD
    └─► Write to RLM/specs/PRD.md (includes design requirements)
```

### Phase 2: Design System

```
Primary Agent receives /cc-design system
│
├─► Read PRD design requirements
│
├─► Optional: Spawn Research Sub-Agent (if research_first = true)
│   └─► UX research, competitor design analysis
│       └─► Write to RLM/specs/design/research/
│
├─► Spawn Designer Sub-Agent
│   └─► Create design system based on PRD
│       ├─► Design tokens (colors, typography, spacing)
│       ├─► Component library specifications
│       ├─► Animation guidelines per tier
│       └─► Accessibility requirements
│
├─► Generate framework-specific token exports
│   └─► Write to RLM/specs/design/tokens/
│       ├─► tokens.json (source of truth)
│       ├─► tailwind.config.partial.js
│       ├─► mui-theme.ts
│       └─► variables.css
│
└─► Return summary to Primary
```

### Phase 3: Spec Generation

```
Primary Agent receives /cc-create-specs
│
├─► Spawn Architect Sub-Agent
│   └─► System architecture design
│       └─► Write to RLM/specs/architecture/
│
├─► Generate feature specifications
│   └─► Write to RLM/specs/features/FTR-XXX/spec.md
│
└─► Return summary to Primary
```

### Phase 4: Feature Design

```
Primary Agent receives /cc-design feature FTR-XXX (for each feature)
│
├─► Load feature spec and design system
│
├─► Spawn Designer Sub-Agent
│   └─► Create UI/UX specification
│       ├─► User flow diagrams
│       ├─► Screen layouts (ASCII wireframes)
│       ├─► Component inventory
│       ├─► Interaction patterns
│       └─► Accessibility requirements
│
├─► Write to RLM/specs/features/FTR-XXX/design-spec.md
│
└─► Return summary to Primary
```

### Phase 5: Task Creation

```
Primary Agent receives /cc-create-tasks
│
├─► Analyze all feature specs AND design specs
│
├─► Create dependency graph
│
├─► Generate task files with UI/UX requirements
│   ├─► Links to design spec
│   ├─► Component states to implement (8 states)
│   ├─► Design tokens to use
│   └─► Accessibility requirements
│
├─► Write to RLM/tasks/active/TASK-XXX.md
│
└─► Return task count to Primary
```

### Phase 6: Implementation (Single Task)

```
Primary Agent receives /cc-implement TASK-XXX
│
├─► Load task context (minimal)
│   ├─► Task file
│   ├─► Design spec (if UI task)
│   └─► Design tokens
│
├─► Spawn Coder Sub-Agent
│   └─► TDD implementation
│       ├─► Load design tokens
│       ├─► Implement all 8 component states (if UI)
│       ├─► Use animation tier guidelines
│       ├─► Ensure accessibility compliance
│       └─► Write code to project
│           └─► Return completion status
│
├─► Spawn Tester Sub-Agent (if needed)
│   └─► Additional test coverage
│       └─► Return coverage report
│
├─► Update progress tracking
│
└─► Report to user
```

### Phase 6: Implementation (Parallel - All Tasks)

```
Primary Agent receives /cc-implement all
│
├─► Load config: parallel_limit from cc-config.json (default: 5)
│
├─► Analyze all tasks in RLM/tasks/active/
│   └─► Sort by dependencies
│       └─► Group into dependency-respecting batches
│
├─► BATCH 1: Spawn multiple Coder Sub-Agents IN SINGLE MESSAGE
│   ├─► Task tool call 1: Coder → TASK-001
│   ├─► Task tool call 2: Coder → TASK-003
│   ├─► Task tool call 3: Coder → TASK-005
│   ├─► Task tool call 4: Coder → TASK-007
│   └─► Task tool call 5: Coder → TASK-009
│   │
│   └─► Each Coder:
│       ├─► Loads design tokens (if UI task)
│       ├─► Implements all 8 component states
│       ├─► Uses animation tier guidelines
│       └─► Ensures accessibility compliance
│
├─► Wait for all batch 1 to complete
│   └─► Collect results: SUCCESS/BLOCKED/FAILED
│
├─► Update progress tracking
│   ├─► Move completed to RLM/tasks/completed/
│   ├─► Move blocked to RLM/tasks/blocked/
│   └─► Log any failures
│
├─► CHECK: Token budget threshold
│   ├─► < 75%: Continue to next batch
│   ├─► 75-90%: Warn user, suggest completing current work
│   └─► > 90%: Auto-bundle context, stop spawning
│
├─► BATCH 2: Spawn next wave (tasks whose deps are now satisfied)
│   └─► Repeat parallel spawning pattern
│
└─► Report batch summary to user
```

### Phase 7: Quality

```
Primary Agent executes quality checks (can run in parallel):
│
├─► /cc-design qa all
│   └─► Spawn Designer Sub-Agent
│       └─► Run 117-point checklist
│           ├─► Visual Consistency (20 pts)
│           ├─► Accessibility (25 pts)
│           ├─► Component States (18 pts)
│           ├─► Responsive Design (18 pts)
│           ├─► Animation/Motion (12 pts)
│           ├─► Error Handling (12 pts)
│           └─► Performance (12 pts)
│       └─► Write to RLM/progress/design-qa/
│       └─► PASS threshold: ≥105/117 (90%)
│
├─► /cc-review
│   └─► Spawn Reviewer Sub-Agent
│       └─► Security + quality + design compliance
│           ├─► Security vulnerabilities
│           ├─► Code patterns
│           ├─► Design token usage
│           └─► Accessibility implementation
│       └─► Write to RLM/progress/reviews/
│
└─► /cc-test
    └─► Spawn Tester Sub-Agent
        └─► Coverage analysis
            ├─► Unit test coverage
            ├─► Integration tests
            └─► Component state tests
        └─► Return coverage report
```

### Phase 8: Verification

```
Primary Agent receives /cc-verify FTR-XXX (for each completed feature)
│
├─► Load feature spec and acceptance criteria
│
├─► Spawn Verifier Sub-Agent
│   └─► Generate Playwright E2E tests from acceptance criteria
│   └─► Run test suite:
│       ├─► Functional tests (user flows)
│       ├─► Accessibility tests (axe-core, WCAG 2.1 AA)
│       └─► Visual regression tests (screenshots)
│
├─► Write to RLM/progress/verification/FTR-XXX-[timestamp].md
│
├─► If PASS:
│   └─► Mark feature as verified
│
├─► If FAIL:
│   ├─► Create bug tasks in RLM/tasks/active/TASK-XXX-BUG-NNN.md
│   ├─► Mark feature as verification-failed
│   └─► Report failures to Primary
│
└─► Return verification status to Primary
```

### Phase 9: Report

```
Primary Agent generates final report:
│
├─► Aggregate all phase results
│
├─► Generate summary:
│   ├─► Tasks completed: XX/XX
│   ├─► Features verified: XX/XX
│   ├─► Test coverage: XX%
│   ├─► Design QA score: XX/117 (XX%)
│   ├─► Token usage: XXX,XXX total
│   ├─► Time elapsed: X hours
│   └─► Any blockers or manual items needed
│
└─► Write to RLM/progress/reports/[session-id].md
```

## Parallel Spawning Rules

### Configuration

Parallel behavior controlled by `RLM/progress/cc-config.json`:

```json
{
  "parallel": {
    "limit": 5,
    "max_limit": 10
  }
}
```

### Critical Rules for Parallel Spawning

1. **Single Message Requirement**: All Task tool calls for a batch MUST be in a single response
   ```
   ✅ CORRECT: One message with 5 Task tool calls
   ❌ WRONG: 5 separate messages with 1 Task tool call each
   ```

2. **Dependency Respect**: Never spawn tasks whose dependencies are incomplete
   ```
   TASK-002 depends on TASK-001
   ├─► Batch 1: Spawn TASK-001 (no deps)
   ├─► Wait for completion
   └─► Batch 2: Now spawn TASK-002 (deps satisfied)
   ```

3. **Parallel Limit**: Never exceed `parallel_limit` from config
   ```
   parallel_limit = 5
   Tasks available = 10
   ├─► Batch 1: 5 tasks (at limit)
   └─► Batch 2: 5 tasks (remaining)
   ```

4. **Token Awareness**: Reduce batch size when approaching budget thresholds
   ```
   At 75% budget:
   ├─► parallel_limit = 5 → reduce to 3
   └─► Prioritize highest-priority tasks

   At 90% budget:
   ├─► Stop spawning new batches
   └─► Auto-save context bundle for resume
   ```

5. **Failure Isolation**: One task failure doesn't affect others in batch
   ```
   Batch 1 results:
   ├─► TASK-001: SUCCESS ✓
   ├─► TASK-003: FAILED ✗ → Log, move to blocked
   ├─► TASK-005: SUCCESS ✓
   └─► Continue with next batch (TASK-003 logged for retry)
   ```

### Dependency Analysis

Before spawning, analyze task dependencies:

```
Input: All tasks in RLM/tasks/active/
│
├─► Parse each task file for "Dependencies:" section
│
├─► Build dependency graph
│   TASK-001: no deps
│   TASK-002: depends on TASK-001
│   TASK-003: no deps
│   TASK-004: depends on TASK-002, TASK-003
│
├─► Identify ready tasks (no pending deps)
│   Ready: [TASK-001, TASK-003]
│
└─► Batch ready tasks up to parallel_limit
```

### Batch Processing Flow

```
function processBatches(tasks):
    completed = []
    while tasks.hasReadyTasks():
        batch = tasks.getReadyTasks(limit=parallel_limit)

        if tokenBudget > 90%:
            saveBundleAndStop()
            return

        if tokenBudget > 75%:
            batch = batch.slice(0, 3)  # Reduce batch size

        results = spawnAllInSingleMessage(batch)

        for result in results:
            if result.status == SUCCESS:
                moveToCompleted(result.task)
                completed.push(result.task)
            elif result.status == BLOCKED:
                moveToBlocked(result.task)
            else:
                logError(result.task)

        tasks.updateDependencies(completed)

    return summary
```

### Two Entry Points

The pipeline supports two entry points:

```
PATH 1: FROM ZERO (No PRD)
┌─────────────────────────────────┐
│ /cc-full [idea]                 │
│ OR /cc-discover [idea]          │
│                                 │
│ Starts at Phase 1: DISCOVER     │
│ → Phase 2: DESIGN SYSTEM        │
│ → Phase 3: SPECS                │
│ → ... (all phases)              │
└─────────────────────────────────┘

PATH 2: FROM PRD
┌─────────────────────────────────┐
│ /cc-full --from-prd             │
│ OR /cc-create-specs             │
│                                 │
│ Requires: RLM/specs/PRD.md      │
│                                 │
│ Starts at Phase 2: DESIGN SYSTEM│
│ → Phase 3: SPECS                │
│ → ... (all phases)              │
└─────────────────────────────────┘
```

## Error Handling

### Sub-Agent Failure

If a sub-agent encounters an error:
1. Sub-agent reports error details to Primary
2. Primary invokes `on-error` hook
3. Problem-solving framework applied
4. Retry with adjusted context or escalate to user

### Context Overflow

If primary context is filling:
1. Save context bundle via `context-bundle` hook
2. Report to user with resume instructions
3. Optionally spawn background agent to continue

## Background Agent Protocol

For long-running autonomous work:

```
Primary Agent spawns Background Agent
│
├─► Background runs independently
│   └─► Executes plan
│       └─► Writes to report file
│
├─► Primary continues other work
│
└─► On completion:
    └─► Background writes completion status
        └─► Primary notified on next interaction
```

## Anti-Patterns to Avoid

1. **Sub-Agent Recursion**: Sub-agents cannot spawn other sub-agents
2. **Over-Delegation**: Don't delegate simple tasks (< 500 tokens)
3. **Under-Context**: Always provide sufficient context payload
4. **Direct User Communication**: Sub-agents never address user
5. **Unbounded Delegation**: Always set output expectations
6. **Context Pollution**: Don't bring full sub-agent output into primary

## Metrics and Monitoring

Track these metrics for optimization:
- Tokens per task completed
- Sub-agent success rate
- Context utilization percentage
- Delegation ratio (sub-agent tokens / total)
- Average response time per agent type

Use `/cc-tokens report` for detailed analysis.
