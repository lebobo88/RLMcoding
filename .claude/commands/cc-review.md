# Code Review with Reviewer Sub-Agent

You are initiating Claude Code review mode. This command delegates code review to the Reviewer Sub-Agent for comprehensive quality analysis.

## Automatic Context Priming

This command automatically loads:
- `RLM/specs/constitution.md` - Coding standards and quality requirements
- `RLM/specs/features/` - Feature specifications for context
- `RLM/progress/reviews/` - Previous review reports (if exist)
- `RLM/progress/cc-config.json` - Configuration settings
- Anti-pattern documentation from Architect agent

## Automatic Token Reporting

Token usage is tracked automatically:
- Each Reviewer sub-agent call logged silently
- **50% budget**: Warning displayed, continue review
- **75% budget**: "Consider finalizing current review report"
- **90% budget**: Auto-save context, complete review summary only

## Arguments

`$ARGUMENTS` can be:
- `[file path]` - Review specific file
- `staged` - Review git staged changes
- `branch [name]` - Review branch changes
- `pr [number]` - Review pull request
- Empty - Review recent changes

## Workflow

### Step 1: Determine Review Scope

If file path provided:
- Review specific file

If `staged`:
- Get staged files: `git diff --cached --name-only`
- Review all staged changes

If `branch [name]`:
- Get changed files: `git diff main...[branch] --name-only`
- Review branch changes

If `pr [number]`:
- Get PR files via GitHub CLI
- Review PR changes

If empty:
- Get recent changes: `git diff HEAD~5 --name-only`
- Review recent work

### Step 2: Gather Files for Review
Collect:
- Changed/target files
- Related test files
- Relevant spec files for context

### Step 3: Delegate to Reviewer Sub-Agent
Use the Task tool to spawn the Reviewer Sub-Agent:
- **subagent_type**: Use Task tool with `reviewer` prompt referencing `.claude/agents/reviewer.md`
- **prompt**: Include:
  ```
  Files to Review:
  - [file1.ts]
  - [file2.ts]

  Review Focus:
  - Security vulnerabilities
  - Performance issues
  - Code quality
  - Test coverage

  Context:
  - Feature: [FTR-XXX if applicable]
  - Task: [TASK-XXX if applicable]
  ```

### Step 4: Synthesize Review
Collect sub-agent findings and organize:

```markdown
# Code Review Summary

## Review Scope
- Files Reviewed: X
- Lines Changed: X

## Issues by Severity

### Critical (Must Fix Before Merge)
[Issues that block merge]

### High (Should Fix)
[Significant issues]

### Medium (Recommended)
[Quality improvements]

### Low (Nice to Have)
[Style/minor suggestions]

## Security Scan
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Output encoding correct
- [ ] Auth checks in place

## Test Coverage
- [ ] New code has tests
- [ ] Edge cases covered
- [ ] Error cases handled

## Approval Status
[ ] APPROVED - Ready to merge
[ ] CHANGES REQUESTED - See issues above
[ ] NEEDS DISCUSSION - Architectural concerns
```

### Step 5: Report Token Usage
Log review session metrics.

## Pre-Commit Integration

This command can be triggered automatically via `.claude/hooks/pre-commit.md` to review changes before every commit.

## Context Efficiency Notes

- Reviewer sub-agent receives only files under review
- Detailed analysis happens in isolated context
- Primary agent receives summarized findings
- Full review saved to `RLM/progress/reviews/`
