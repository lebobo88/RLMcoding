# RLM Troubleshooting Guide

## Quick Fixes

| Problem | Quick Solution |
|---------|---------------|
| AI doesn't know RLM | "Read RLM/START-HERE.md first" |
| No PRD exists | Run `/discover` |
| No specs exist | Run `/create-specs` |
| No tasks exist | Run `/create-tasks` |
| Can't resume | Check `RLM/progress/status.json` |

---

## Common Issues

### AI Doesn't Understand RLM

**Symptoms:**
- AI asks "What is RLM?"
- AI doesn't follow the workflow
- AI ignores prompt instructions

**Solutions:**

1. Tell the AI to read the entry point:
   ```
   Read RLM/START-HERE.md and understand the RLM method
   ```

2. Be explicit about reading prompts:
   ```
   Read the ENTIRE file RLM/prompts/01-DISCOVER.md, then follow its instructions exactly
   ```

3. For stubborn AIs, copy the prompt content directly into chat

---

### PRD is Missing or Incomplete

**Symptoms:**
- `/create-specs` says PRD not found
- Specs generated are shallow
- AI asks for missing information

**Solutions:**

1. Run discovery:
   ```
   /discover [your project idea]
   ```

2. Check PRD location:
   - Expected: `RLM/specs/PRD.md`
   - If elsewhere, specify path: `/create-specs path/to/prd.md`

3. Validate PRD has required sections:
   - User Stories with acceptance criteria
   - Functional Requirements
   - Non-Functional Requirements

---

### Tasks Are Too Large

**Symptoms:**
- Tasks take more than 4 hours
- Tasks have multiple unrelated changes
- Hard to track progress

**Solutions:**

1. Request finer granularity:
   ```
   Read RLM/prompts/03-CREATE-TASKS.md and break down features into
   smaller tasks. Each task should take 1-4 hours maximum.
   ```

2. Manually split large tasks:
   - Edit task file in `RLM/tasks/active/`
   - Create additional TASK-XXX files

3. Use the authentication example as reference:
   - "Implement authentication" = BAD (too large)
   - 15+ small tasks = GOOD (each focused)

---

### Cannot Resume Session

**Symptoms:**
- `/implement resume` says no session found
- Previous progress lost
- State seems corrupted

**Solutions:**

1. Check status file:
   ```
   Read RLM/progress/status.json and tell me the current state
   ```

2. Look for session logs:
   ```
   List files in RLM/progress/logs/ and show the most recent
   ```

3. Manual recovery:
   - Find last completed task in logs
   - Update status.json manually
   - Continue from next task

4. Start fresh if needed:
   - All tasks still exist in `RLM/tasks/active/`
   - Only progress tracking was lost

---

### Tests Not Written First

**Symptoms:**
- AI writes implementation before tests
- TDD cycle not followed
- Tests added as afterthought

**Solutions:**

1. Emphasize TDD:
   ```
   You MUST follow TDD. Write the test FIRST, verify it fails,
   THEN write implementation. Do not proceed until test exists.
   ```

2. Use MANUAL mode:
   - Pauses at each step
   - You approve test before implementation

3. Check constitution:
   - `RLM/specs/constitution.md` should mandate TDD
   - Update if necessary

---

### AI Scope Creeps

**Symptoms:**
- AI adds unrequested features
- Implementation extends beyond task
- "Improvements" not in spec

**Solutions:**

1. Refer to task scope:
   ```
   Focus ONLY on what's in TASK-XXX.md. Do not add anything
   not in the acceptance criteria.
   ```

2. Use SUPERVISED mode:
   - Review each change before proceeding

3. Keep tasks focused:
   - One responsibility per task
   - Clear acceptance criteria

---

### Dependencies Not Met

**Symptoms:**
- AI starts task but code fails
- Missing types/interfaces from other tasks
- Import errors

**Solutions:**

1. Check task dependencies:
   - Open task file
   - See "Dependencies" field
   - Complete those first

2. View dependency graph in INDEX:
   ```
   Read RLM/tasks/INDEX.md and show the dependency graph
   ```

3. Reorder tasks:
   - Start with tasks showing "Dependencies: None"
   - Work down the dependency tree

---

### Quality Checks Fail

**Symptoms:**
- Linting errors
- Type errors
- Test failures after implementation

**Solutions:**

1. Run checks explicitly:
   ```
   Run linting and type checking. Fix all errors before proceeding.
   ```

2. Check constitution alignment:
   - Code may not match project standards
   - Review `RLM/specs/constitution.md`

3. For persistent test failures:
   ```
   Read RLM/prompts/07-TEST.md and fix the failing tests
   ```

---

### Wrong Files Created

**Symptoms:**
- Files in wrong directories
- Naming doesn't match convention
- Structure doesn't match project

**Solutions:**

1. Reference constitution:
   ```
   Review RLM/specs/constitution.md for file organization rules
   and ensure all files follow the conventions
   ```

2. Check existing structure:
   ```
   Look at existing files in the project and match their organization
   ```

3. Be explicit:
   ```
   Create the file at exactly: src/features/auth/login.ts
   ```

---

### Session State Corrupted

**Symptoms:**
- status.json has errors
- Inconsistent task states
- Duplicate or missing entries

**Solutions:**

1. Validate JSON:
   ```json
   {
     "lastUpdate": "2024-01-15T10:30:00Z",
     "tasks": {
       "TASK-001": { "status": "completed" }
     }
   }
   ```

2. Rebuild from files:
   - Count tasks in `active/` → pending
   - Count tasks in `completed/` → completed
   - Count tasks in `blocked/` → blocked

3. Reset if needed:
   ```json
   {
     "lastUpdate": "[now]",
     "currentTask": null,
     "tasks": {}
   }
   ```

---

### AI Forgets Context

**Symptoms:**
- AI asks about things already discussed
- Doesn't remember PRD content
- Loses track of current task

**Solutions:**

1. Refresh context explicitly:
   ```
   Read RLM/specs/constitution.md, then RLM/tasks/active/TASK-XXX.md,
   then continue implementation
   ```

2. Keep context in view:
   - Don't clear chat unnecessarily
   - Reference files frequently

3. Use session logs:
   - Previous decisions are logged
   - Ask AI to read logs for context

---

## Prevention Tips

### Before Starting
- [ ] PRD is complete with all sections
- [ ] Constitution defines tech stack and standards
- [ ] Tasks are small (1-4 hours)
- [ ] Dependencies are mapped

### During Implementation
- [ ] Use SUPERVISED mode until familiar
- [ ] Run tests after each change
- [ ] Review generated code
- [ ] Check progress regularly

### When Stopping
- [ ] Note current task and state
- [ ] Verify status.json is updated
- [ ] Don't stop mid-task if possible

---

## Getting More Help

1. **Re-read the prompts**: `RLM/prompts/*.md` contain detailed instructions
2. **Check templates**: `RLM/templates/` show expected formats
3. **Review START-HERE**: `RLM/START-HERE.md` has the workflow overview
4. **Ask the AI**: "Read RLM/docs/USER-GUIDE.md and help me with [issue]"
