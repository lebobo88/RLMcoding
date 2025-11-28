# Context Primer: Code Review Preparation

You are priming context for code review mode. This loads quality checklists and anti-patterns for effective review.

## Purpose

Load review frameworks and quality standards without loading the actual code (code loaded separately during review).

## Arguments

`$ARGUMENTS` can be:
- `security` - Security-focused review
- `performance` - Performance-focused review
- `quality` - General quality review (default)
- Empty - Full review mode

## Context Loading Protocol

### Step 1: Load Review Checklist
```markdown
## Code Review Checklist

### Security (Critical)
- [ ] No hardcoded secrets/credentials
- [ ] Input validation on user inputs
- [ ] Output encoding for XSS prevention
- [ ] Parameterized queries (no SQL injection)
- [ ] Auth checks on protected routes
- [ ] Authorization for data access
- [ ] Secure session management
- [ ] No sensitive data in logs

### Performance (High Priority)
- [ ] No N+1 query patterns
- [ ] Appropriate database indexes
- [ ] Efficient algorithms (O complexity)
- [ ] Lazy loading where appropriate
- [ ] Caching for repeated operations
- [ ] Bundle size considered
- [ ] No memory leaks

### Code Quality (Medium Priority)
- [ ] Functions < 50 lines
- [ ] Single responsibility
- [ ] Descriptive names
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Types are correct
- [ ] Tests exist for new code

### Style (Low Priority)
- [ ] Consistent formatting
- [ ] Imports organized
- [ ] No dead code
- [ ] Comments where needed
```

### Step 2: Load Anti-Patterns Reference
```markdown
## Anti-Patterns to Flag

### Architecture
1. **God Object** - Class/module doing too much
2. **Spaghetti Code** - Unclear control flow
3. **Golden Hammer** - Wrong tool for job
4. **Premature Optimization** - Complexity without need

### Code Quality
5. **Copy-Paste** - Duplicated logic
6. **Magic Numbers** - Unexplained constants
7. **Deep Nesting** - Too many levels
8. **Long Methods** - Functions > 50 lines

### Error Handling
9. **Catch-All** - Swallowing exceptions
10. **Silent Failure** - No error feedback
11. **Stringly Typed** - Using strings for types

### State Management
12. **Global State** - Unpredictable mutations
13. **Prop Drilling** - Passing through layers
14. **Stale Closures** - Capturing old values

### Security
15. **Trust All Input** - Missing validation
16. **Security by Obscurity** - Weak protection
17. **Overly Permissive** - Too broad access
18. **Logging Secrets** - Sensitive data exposed
```

### Step 3: Load Review Standards
From `RLM/specs/constitution.md`, extract:
- Code style requirements
- Testing expectations
- Documentation standards
- Commit message format

### Step 4: Present Review Mode
Based on `$ARGUMENTS` focus:

```markdown
## Code Review Mode Active

**Focus**: [Security|Performance|Quality|Full]

### Review Framework Loaded
- Checklist: [X] items for [focus] review
- Anti-Patterns: [X] patterns to watch for
- Standards: Project constitution loaded

### Severity Levels
- **Critical**: Must fix before merge
- **High**: Should fix
- **Medium**: Recommended
- **Low**: Nice to have

### Review Process
1. Identify files to review
2. Check against loaded criteria
3. Document findings by severity
4. Provide actionable recommendations

---
Ready to review. Use `/cc-review [scope]` to start reviewing code.
Or share files/changes to review now.
```

## Context Efficiency

This primer loads review frameworks (~500 tokens) without code.

Code loaded on-demand during actual review, keeping base context minimal.
