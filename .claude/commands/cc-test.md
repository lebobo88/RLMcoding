# Testing with Tester Sub-Agent

You are initiating Claude Code testing mode. This command delegates test writing and coverage analysis to the Tester Sub-Agent.

## Automatic Context Priming

This command automatically loads:
- `RLM/specs/constitution.md` - Testing standards and requirements
- `RLM/specs/features/` - Feature specifications for expected behavior
- `RLM/progress/coverage/` - Previous coverage reports (if exist)
- `RLM/progress/cc-config.json` - Configuration settings
- Relevant test files based on scope

## Automatic Token Reporting

Token usage is tracked automatically:
- Each Tester sub-agent call logged silently
- **50% budget**: Warning displayed, continue testing
- **75% budget**: "Consider completing current test file and reporting"
- **90% budget**: Auto-save context, finalize test report only

## Arguments

`$ARGUMENTS` can be:
- `[component/file path]` - Test specific component
- `coverage` - Analyze and improve coverage
- `fix` - Fix failing tests
- Empty - Run all tests and report

## Workflow

### Step 1: Determine Testing Scope

If path provided:
- Target specific file/component for testing

If `coverage`:
- Run coverage analysis
- Identify gaps
- Generate tests for uncovered code

If `fix`:
- Run tests to identify failures
- Analyze and fix failing tests

If empty:
- Run full test suite
- Report results

### Step 2: Gather Context
Read relevant files:
- Source code to be tested
- Existing test files
- `RLM/specs/constitution.md` for testing standards
- `RLM/specs/features/` for expected behavior

### Step 3: Delegate to Tester Sub-Agent
Use the Task tool to spawn the Tester Sub-Agent:
- **subagent_type**: Use Task tool with `tester` prompt referencing `.claude/agents/tester.md`
- **prompt**: Include:
  ```
  Target: [File/component path]
  Mode: [unit|integration|e2e|coverage]
  Existing Tests: [Path to test files]

  Requirements:
  1. Analyze current coverage
  2. Identify missing test cases
  3. Write comprehensive tests
  4. Report coverage improvement
  ```

### Step 4: Run Tests
Execute test suite:
```bash
npm test                    # Unit tests
npm run test:integration    # Integration tests
npm run test:e2e           # E2E tests
npm run test:coverage      # Coverage report
```

### Step 5: Report Results
Generate test report:

```markdown
# Test Report: [Date/Time]

## Summary
- Total Tests: XX
- Passed: XX
- Failed: XX
- Skipped: XX
- Coverage: XX%

## Coverage by Area
| Component | Lines | Branches | Functions |
|-----------|-------|----------|-----------|
| [name]    | XX%   | XX%      | XX%       |

## Failed Tests
- [Test name]: [Failure reason]

## New Tests Added
- [Test file]: [X tests covering Y scenarios]

## Recommendations
- [Areas needing more coverage]
```

### Step 6: Report Token Usage
Log testing session metrics.

## Test Types Reference

| Type | Command | Use Case |
|------|---------|----------|
| Unit | `npm test` | Business logic, utilities |
| Integration | `npm run test:integration` | API routes, DB operations |
| E2E | `npm run test:e2e` | Critical user flows |
| Coverage | `npm run test:coverage` | Coverage analysis |

## Context Efficiency Notes

- Tester sub-agent focuses only on testing concerns
- Implementation details stay in coder sub-agent context
- Test strategy decisions don't pollute primary context
- Coverage reports saved to `RLM/progress/coverage/`
