# RLM Test

Your goal is to run tests and fix any failures.

## Instructions

Read `RLM/prompts/07-TEST.md` for the complete workflow.

## Process

### 1. Run All Tests
Execute the test suite:
```bash
npm test
```

### 2. Analyze Results
For each failure:
- Identify the failing test
- Understand the expected vs actual behavior
- Determine root cause

### 3. Fix Failures
For each failing test:
1. Check if test is correct (update if not)
2. Check if implementation is correct (fix if not)
3. Re-run to verify fix

### 4. Check Coverage
Ensure coverage meets target:
- Target: 80%+ coverage
- Identify uncovered code
- Add tests for critical paths

### 5. Report
Provide summary:
- Total tests: X
- Passing: Y
- Failing: Z
- Coverage: X%
- Issues fixed: [list]

