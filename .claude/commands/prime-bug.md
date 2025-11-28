# Context Primer: Bug Investigation

You are priming context for bug investigation mode. This loads problem-solving frameworks and debugging approaches.

## Purpose

Load context optimized for debugging and bug fixing, including systematic investigation frameworks.

## Arguments

`$ARGUMENTS` can be:
- Bug description
- File path where bug occurs
- Error message
- Empty (general bug investigation mode)

## Context Loading Protocol

### Step 1: Load Problem-Solving Framework
Initialize with the 5-step framework:

```markdown
## Problem-Solving Framework

1. **Clarify the Core Issue**
   - What exactly is happening vs. what should happen?
   - Can I reproduce it consistently?
   - What are the symptoms vs. root cause?

2. **Identify Relevant Factors**
   - What changed recently?
   - What components are involved?
   - What external dependencies exist?

3. **Analyze Each Factor**
   - Test hypotheses systematically
   - Isolate variables
   - Check logs and error messages

4. **Synthesize Insights**
   - What does the evidence show?
   - What patterns emerge?
   - What's the most likely cause?

5. **Recommend Action**
   - Proposed fix
   - Risk assessment
   - Test plan to verify
```

### Step 2: Load Bug Investigation Framework
```markdown
## Bug Investigation Phases

### Phase 1: Reproduce
- Create minimal reproduction case
- Document exact steps
- Identify consistent vs. intermittent

### Phase 2: Hypothesize
- Form 2-3 theories about cause
- Rank by likelihood
- Identify tests for each

### Phase 3: Eliminate
- Test each hypothesis
- Rule out false leads
- Narrow to root cause

### Phase 4: Fix
- Implement targeted fix
- Write regression test
- Verify fix doesn't break other things
```

### Step 3: Load Debugging Reference
```markdown
## Common Debugging Techniques

### Performance Issues
- Profile with dev tools
- Check N+1 queries
- Review render cycles
- Analyze bundle size

### Race Conditions
- Add logging with timestamps
- Review async operations
- Check state management
- Test with artificial delays

### Memory Issues
- Use memory profiler
- Check for event listener leaks
- Review closure patterns
- Test with large data sets

### API Issues
- Check network tab
- Verify request/response format
- Test with curl/Postman
- Review error handling
```

### Step 4: Gather Bug Context
If specific bug info provided in `$ARGUMENTS`:
- Read the relevant source file
- Read related test files
- Check recent git changes to that area

### Step 5: Present Investigation Mode
```markdown
## Bug Investigation Mode Active

**Reported Issue**: [from arguments or "Not specified"]

### Loaded Frameworks
- 5-Step Problem-Solving
- Bug Investigation (Reproduce → Hypothesize → Eliminate → Fix)
- Debugging Techniques Reference

### Next Steps
1. Describe the bug symptoms
2. I'll help systematically investigate
3. We'll isolate and fix the root cause

---
Ready to investigate. Describe the bug or share error messages.
```

## Context Efficiency

This primer loads investigation frameworks (~400 tokens) instead of:
- Full codebase context
- All test files
- Complete history

Bug-specific files loaded on-demand during investigation.
