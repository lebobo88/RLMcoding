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
