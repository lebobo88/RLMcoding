# RLM User Guide

## Complete Walkthrough: From Discovery to Production

This guide walks you through using the RLM (Research-Lead-Manage) system from initial idea discovery through implementation to production deployment.

---

## Part 0: AI-Powered Discovery (New!)

Before writing any code, use the RLM discovery process to transform your raw idea into production-ready specifications. This works with **any AI coding agent in any IDE**.

### Why Discovery First?

| Without Discovery | With Discovery |
|-------------------|----------------|
| Vague requirements | Clear, structured specs |
| Missed edge cases | Comprehensive acceptance criteria |
| Rework and confusion | Smooth implementation |
| AI agents guess what you want | AI agents know exactly what to build |

### Starting Discovery

#### Option 1: Claude Code Slash Command
```bash
/discover Build a task management app with AI prioritization
```

#### Option 2: PowerShell Script (Any IDE)
```powershell
./RLM/commands/rlm-discover.ps1 --idea "Your project idea"
```

#### Option 3: Direct Agent Prompt (Any AI Agent)
```
Read RLM/agents/research-agent.md and help me discover specs for:
[Your project idea here]
```

### The Discovery Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Your Idea     │────▶│  AI Research    │────▶│   Questions     │
│  (raw concept)  │     │  (competitors,  │     │  (by priority)  │
│                 │     │   best practices)│     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                        ┌─────────────────┐              │
                        │  Your Answers   │◀─────────────┘
                        │                 │
                        └────────┬────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Constitution   │     │  Feature Specs  │     │  Architecture   │
│  (standards)    │     │  (user stories) │     │  (tech design)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Ready for      │
                        │  rlm-build!     │
                        └─────────────────┘
```

### Discovery Phases

#### Phase 1: Idea Parsing
The Research Agent analyzes your raw idea to:
- Extract the core problem being solved
- Identify key features mentioned
- Recognize implicit requirements
- Map to known problem domains

#### Phase 2: AI-Powered Research
The agent conducts comprehensive research:
- **Web Search**: Competitors, best practices, industry standards
- **Codebase Analysis**: If extending existing code, understand the architecture
- **Technology Research**: Evaluate frameworks, libraries, and approaches
- **Gap Identification**: Find what's missing from your idea

#### Phase 3: Clarifying Questions
Questions are asked incrementally by priority:

| Priority | Category | Purpose |
|----------|----------|---------|
| **Critical** | Business | Core goals, users, success metrics |
| **High** | Technical | Scale, integrations, constraints |
| **High** | Data | Storage, compliance, privacy |
| **Medium** | Security | Auth, encryption, audit |
| **Medium** | UX | Platforms, accessibility |

**Tip**: Answer questions thoughtfully - they directly shape your specifications.

#### Phase 4: Specification Generation
After you answer questions, the agent creates:

```
RLM/specs/
├── constitution.md           # Project standards & principles
├── features/
│   └── FTR-001/
│       └── spec.md          # Feature with user stories & acceptance criteria
├── architecture/
│   └── overview.md          # Tech stack, system design, APIs
└── epics/
    └── breakdown.md         # Sprint planning & task breakdown
```

#### Phase 5: Handoff to Implementation
The discovery session is saved to `RLM/research/sessions/[session-id]/`:
- `idea.md` - Parsed requirements
- `findings.md` - Research results
- `questions.md` - Q&A log
- `recommendations.md` - Tech recommendations
- `handoff.md` - Master Architect handoff

### Discovery in Different IDEs

| IDE | Discovery Method |
|-----|------------------|
| **Claude Code** | `/discover [idea]` |
| **Cursor** | Add to `.cursorrules` or use terminal |
| **Windsurf** | Add to `.windsurfrules` or Cascade |
| **VS Code + Copilot** | Use `@workspace` with discovery prompt |
| **Aider** | `aider --read RLM/agents/research-agent.md` |
| **Continue.dev** | Custom `/discover` slash command |
| **JetBrains AI** | Custom prompts in settings |

See [IDE Integration Guide](IDE-INTEGRATION.md) for detailed setup.

### Example Discovery Session

```
User: /discover Build a habit tracking app with social accountability

AI: I'll help you discover specifications for this habit tracking app.
    Let me first research the space...

    [Conducts web research on habit apps, finds competitors like Habitica,
     Streaks, researches gamification best practices...]

AI: I've completed initial research. Here are my findings:
    - Top competitors: Habitica, Streaks, Habitify
    - Key differentiator opportunity: Social accountability features
    - Recommended tech: React Native (cross-platform), Firebase (real-time)

    Now I have some clarifying questions:

    **Business (Critical)**
    1. What is the primary goal - personal use, team productivity, or social network?
    2. Who is your target user - individuals, teams, or communities?
    3. What does success look like - DAU, habit completion rate, other?

User: Personal use with friend groups. Target is millennials. Success = daily
      active users and 7-day streak completion rate.

AI: Great context! Follow-up questions:

    **Technical (High)**
    1. Expected scale - how many users in year 1?
    2. Mobile-first or web-first?
    3. Do you need push notifications?

User: 10K users year 1. Mobile-first with web dashboard. Yes to push notifications.

AI: [Continues with remaining questions...]

AI: I now have enough information to generate specifications. Creating:
    - RLM/specs/constitution.md
    - RLM/specs/features/FTR-001-habit-tracking/spec.md
    - RLM/specs/architecture/overview.md
    - RLM/specs/epics/breakdown.md

    Specifications created! Review them and run:
    ./RLM/commands/rlm-build.sh --mode supervised
```

### After Discovery

1. **Review specs** in `RLM/specs/` - ensure they match your vision
2. **Refine if needed** - edit specs or run `/discover` again with more context
3. **Start implementation**:
   ```bash
   ./RLM/commands/rlm-build.sh --mode supervised
   ```
4. **AI agents build** your feature using TDD based on your specs

---

## Part 1: Initial Setup

### Step 1: Install RLM in Your Project

```bash
# Clone your project (or create new)
git clone https://github.com/your-org/your-project.git
cd your-project

# Download RLM system
curl -L https://github.com/your-org/rlm-system/archive/main.zip -o rlm.zip
unzip rlm.zip -d RLM/
rm rlm.zip

# Initialize RLM
chmod +x RLM/commands/*.sh
./RLM/commands/rlm-init.sh --ide cursor --tech-stack node --github-repo your-org/your-project
```

**What This Does:**
- Creates complete `RLM/` directory structure
- Generates configuration files
- Sets up Git hooks for automation
- Creates agent prompt files
- Initializes tracking databases

### Step 2: Configure Your Environment

```bash
# Create .env file
cat > .env << EOF
# GitHub Integration
RLM_GITHUB_TOKEN=ghp_your_token_here
RLM_GITHUB_REPO=your-org/your-project
RLM_GITHUB_BRANCH=main

# AI Configuration
RLM_AI_MODEL=claude-sonnet-4
RLM_AI_API_KEY=sk-your-api-key
RLM_AI_TEMPERATURE=0.2

# Automation Settings
RLM_DEFAULT_MODE=supervised
RLM_PARALLEL_TASKS=4
RLM_AUTO_COMMIT=true
EOF

# Source environment
source .env
```

### Step 3: Create Project Constitution

Your project's constitution defines coding standards, testing requirements, and architectural principles that all AI agents must follow.

```bash
# Open your IDE
cursor .

# Edit RLM/specs/constitution.md
```

**Example Constitution:**
```markdown
# Project Constitution

## Development Principles
1. **Test-Driven Development**: Write tests before implementation
2. **Clean Code**: Follow SOLID principles and DRY
3. **Security First**: Validate all inputs, sanitize all outputs
4. **Performance Conscious**: Optimize for speed and efficiency

## Coding Standards
- Language: TypeScript with strict mode
- Style: Prettier with 2-space indentation
- Linting: ESLint with recommended rules
- Comments: JSDoc for all public functions

## Testing Requirements
- Minimum coverage: 80%
- Unit tests: All business logic
- Integration tests: All API endpoints
- E2E tests: Critical user flows

## Architecture Principles
- Layered architecture: Routes → Controllers → Services → Repository
- Dependency injection for testability
- Immutable data structures where possible
- Event-driven for cross-service communication

## Security Standards
- Authentication: JWT with refresh tokens
- Authorization: Role-based access control (RBAC)
- Input validation: Zod schemas
- SQL injection prevention: Parameterized queries
- XSS protection: Content Security Policy

## Performance Targets
- API response time: < 200ms (p95)
- Database queries: < 50ms
- Frontend bundle: < 500KB gzipped
- Core Web Vitals: All green
```

---

## Part 2: Product Management Workflow (Web App)

### Step 1: Define Epic and Requirements

In your product management web app (or GitHub directly for MVP):

Create `RLM/specs/requirements/epic-001-user-auth.md`:
```markdown
# Epic: User Authentication System

## Business Goal
Enable users to securely register, log in, and manage their accounts.

## Success Metrics
- 95% login success rate
- < 2 second authentication flow
- Zero security breaches
- 80% user satisfaction score

## User Personas
1. **New User**: Needs easy registration
2. **Returning User**: Needs quick login
3. **Admin**: Needs user management

## High-Level Requirements
1. Email/password registration
2. Secure login with JWT
3. Password reset flow
4. Multi-factor authentication (MFA)
5. OAuth integration (Google, GitHub)

## Priority: P0 (Critical)
## Target Release: Sprint 3
## Dependencies: None
```

### Step 2: Break Down into Features

Create `RLM/specs/features/FTR-001-login/spec.md`:
```markdown
# Feature: User Login

## Overview
Implement secure user login with email/password authentication.

## User Stories
**US-001**: As a registered user, I want to log in with my email and password

**Acceptance Criteria:**
- Email and password fields are present
- Validation shows inline errors
- Successful login redirects to dashboard
- Failed login shows clear error message
- "Remember me" option extends session

**US-002**: As a security-conscious user, I want my login attempts rate-limited

**Acceptance Criteria:**
- Maximum 5 attempts per 15 minutes
- Lockout message shows time remaining
- Lockout resets after timeout
- Admin can manually unlock accounts

## Technical Specifications
- Method: POST
- Endpoint: /api/auth/login
- Request Body: `{ email: string, password: string, rememberMe?: boolean }`
- Response: `{ token: string, refreshToken: string, user: UserDTO }`
- Status Codes: 200 (success), 401 (invalid), 429 (rate limit)

## Security Requirements
- Password hashing: bcrypt with cost 12
- JWT signing: HS256 algorithm
- Token expiry: 24 hours (7 days with rememberMe)
- Refresh token: 30 days
- Rate limiting: IP + email based

## Performance Requirements
- Response time: < 100ms (p95)
- Database queries: 1 read for user lookup
- Concurrent logins: Support 1000/second

## Testing Requirements
- Unit tests: Validation, hashing, token generation
- Integration tests: Full login flow
- E2E tests: Login via UI
- Security tests: Brute force, SQL injection, XSS
```

### Step 3: Push to GitHub

```bash
# Commit specifications
git add RLM/specs/
git commit -m "feat: Add user authentication specifications"
git push origin main
```

---

## Part 3: Local Development Workflow

### Step 1: Sync Latest Specifications

Developer pulls latest instructions from PM:

```bash
./RLM/commands/rlm-sync.sh pull
```

**Output:**
```
🔄 RLM Sync: Pulling from GitHub
✓ Fetched latest from main branch
✓ Downloaded 1 new requirement: epic-001-user-auth.md
✓ Downloaded 1 new feature: FTR-001-login/spec.md
✓ Updated agent profiles
✓ Sync complete

📋 Summary:
- New epics: 1
- New features: 1
- Updated tasks: 0
```

### Step 2: Review What's Pending

```bash
./RLM/commands/rlm-report.sh summary
```

**Output:**
```
📊 RLM Progress Report
Generated: 2025-01-15 10:30 UTC

🎯 Current Sprint: Sprint 3
📅 Days Remaining: 8

📈 Progress
- Total Tasks: 12
- Completed: 3 (25%)
- In Progress: 2 (17%)
- Blocked: 1 (8%)
- Pending: 6 (50%)

⚡ Velocity: 4.2 tasks/day
🎯 Projected Completion: 2025-01-17

🔴 Blockers (1):
- TASK-003: Database timeout in tests (Severity: High)

✅ Recently Completed (3):
- TASK-001: Project setup and configuration
- TASK-002: Database schema design
- TASK-004: CI/CD pipeline configuration

📋 Next Up:
- TASK-005: Implement login API endpoint
- TASK-006: Create authentication service
- TASK-007: Add JWT token generation
```

### Step 3: Optimize Context (New!)

Before running builds, optimize your context for maximum efficiency:

```bash
# Analyze current context usage
./RLM/commands/utils/context-manager.sh analyze

# Optimize (clean old files, archive completed tasks)
./RLM/commands/utils/context-manager.sh optimize

# Create context bundle (for state management)
./RLM/commands/utils/context-manager.sh bundle
```

**What This Does:**
- Analyzes context size and complexity
- Removes old, unnecessary files
- Creates state snapshot for later restoration
- **Saves up to 86% on tokens!**

### Step 4: Run Automated Implementation

#### Option A: Fully Automated (Auto Mode)
```bash
./RLM/commands/rlm-build.sh --mode auto
```

AI agents will:
1. Read all specifications from `RLM/specs/`
2. Create implementation plan
3. Break down into tasks
4. Implement code with TDD
5. Run tests and fix issues
6. Commit completed work
7. Report progress

#### Option B: Supervised Mode (Recommended)
```bash
./RLM/commands/rlm-build.sh --mode supervised
```

AI agents will:
1. Show you the implementation plan
2. Ask for approval at key decision points
3. Implement after approval
4. Show you code before committing
5. Allow you to override or refine

**Example Interaction:**
```
🤖 Master Architect Agent:
I've analyzed FTR-001-login specification.

📋 Proposed Implementation Plan:

1. Architecture Tasks:
   - Design JWT token structure
   - Define API contract (OpenAPI spec)
   - Design data model (User table updates)
   - Plan rate limiting strategy

2. Implementation Tasks:
   - TASK-005: Create auth routes
   - TASK-006: Implement auth service
   - TASK-007: Add JWT utilities
   - TASK-008: Create auth middleware
   - TASK-009: Add rate limiting

3. Testing Tasks:
   - TASK-010: Unit tests for auth service
   - TASK-011: Integration tests for login API
   - TASK-012: E2E tests for login flow

Estimated total effort: 18 hours
Estimated completion: 2025-01-17 EOD

❓ Approve this plan? (yes/no/modify):
```

You respond: `yes`

```
✅ Plan approved. Starting implementation...

🤖 Implementation Agent:
Starting TASK-005: Create auth routes

Step 1/5: Writing tests
- Created tests/auth-routes.test.ts
- Added 12 test cases covering all scenarios
- All tests currently failing (expected)

Step 2/5: Implementing routes
- Created src/routes/auth.ts
- Added POST /api/auth/login endpoint
- Added request validation middleware
- Added rate limiting middleware

Step 3/5: Running tests
- 10/12 tests passing
- 2 tests failing: rate limit reset logic

Step 4/5: Fixing failures
- Updated rate limiter configuration
- Fixed reset timer logic
- All 12 tests now passing ✓

Step 5/5: Code quality checks
- Linter: 0 errors, 0 warnings ✓
- Type checking: No errors ✓
- Test coverage: 95% ✓
- Security scan: No vulnerabilities ✓

✅ TASK-005 completed successfully

📝 Commit message:
feat(auth): Add login route with validation and rate limiting

- Implements POST /api/auth/login endpoint
- Adds Zod schema validation
- Implements rate limiting (5 attempts/15min)
- Achieves 95% test coverage

🔄 Moving to next task: TASK-006...
```

#### Option C: Manual Mode (Maximum Control)
```bash
./RLM/commands/rlm-build.sh --task TASK-005 --mode manual
```

Step through each task manually with agent assistance.

#### Option D: Background Execution (New! 🚀)
```bash
# Start agent in background - no waiting!
./RLM/commands/utils/background-agent.sh start implementation-agent TASK-005 auto

# Check status anytime
./RLM/commands/utils/background-agent.sh status bg-1234567890

# Continue with other work while agent runs
```

**Benefits:**
- Run multiple agents in parallel
- No terminal occupation
- Autonomous execution
- File-based progress reporting

### Step 4: Monitor Progress

Open a separate terminal to watch real-time progress:

```bash
# Watch status updates
watch -n 5 ./RLM/commands/rlm-report.sh summary

# Or tail the log
tail -f RLM/progress/logs/TASK-005.md
```

### Step 5: Handle Blockers

If an agent encounters a blocker, it will:
1. Document the issue in `RLM/issues/open/`
2. Update task status to "blocked"
3. Stop execution
4. Push issue to GitHub for PM review

**Example Issue:**
```markdown
# Issue: Third-party OAuth library incompatible with TypeScript 5

## Severity: High
## Blocking: TASK-009 (OAuth integration)

## Description
The @oauth/client library we planned to use doesn't have TypeScript 5 type definitions.

## Attempted Solutions
1. Tried @types/oauth__client - doesn't exist
2. Tried upgrading library - no TS5 version available
3. Tried alternative library @auth/core - different API

## Recommendations
1. **Option A**: Downgrade to TypeScript 4.9 (risky)
2. **Option B**: Write custom OAuth implementation (8-10 hours)
3. **Option C**: Use @auth/core and update architecture (4-6 hours)

## Preferred: Option C
Recommend using @auth/core as it's more actively maintained and has better TS support.

## Required Decision
Product Manager or Architect approval needed.
```

### Step 6: Push Progress Back to PM

```bash
./RLM/commands/rlm-sync.sh push
```

**What Gets Pushed:**
- Completed task logs
- Updated status.json
- Issue reports
- Code changes (via normal Git)
- Test results
- Coverage reports

---

## Part 4: Product Manager Review

PM receives notification (webhook or scheduled check) and reviews:

### In the Web App:
1. **Progress Dashboard** shows:
   - Tasks completed today
   - Current velocity
   - Blockers requiring attention
   - Test coverage trends

2. **Issue Review**:
   - Review ISSUE-001 about OAuth library
   - Make decision: "Approve Option C"
   - Add comment: "Good analysis. Proceed with @auth/core"

3. **Update Instructions**:
   - Create new task for OAuth migration
   - Update architecture spec
   - Push updated instructions to GitHub

```bash
# PM pushes updated instructions
git add RLM/specs/architecture/auth/oauth-design.md
git add RLM/tasks/active/TASK-009-updated.md
git commit -m "resolve: Approve @auth/core for OAuth integration"
git push origin main
```

---

## Part 5: Continuous Iteration

Developer syncs and continues:

```bash
# Pull latest instructions (including issue resolution)
./RLM/commands/rlm-sync.sh pull

# Resume implementation with updated guidance
./RLM/commands/rlm-build.sh --mode supervised
```

Agents see the resolution and continue:
```
🤖 Implementation Agent:
✅ Issue ISSUE-001 resolved
📋 Updated instructions received
🔄 Resuming TASK-009 with new approach...

Switching to @auth/core library:
1. Installing dependencies
2. Updating architecture to match new API
3. Rewriting OAuth integration
4. Updating tests

[Continues implementation...]
```

---

## Part 6: Testing and Quality Assurance

### Run Comprehensive Tests

```bash
# Run all tests with auto-fix
./RLM/commands/rlm-test.sh all --fix
```

**What Happens:**
1. **Testing Agent** runs full test suite
2. If tests fail, agent analyzes failures
3. Agent attempts automated fixes
4. Re-runs tests to verify
5. Reports results

**Output:**
```
🧪 RLM Test Suite
Running: All Tests (unit, integration, e2e)

📊 Results:
✓ Unit Tests: 156/156 passing (100%)
✓ Integration Tests: 42/45 passing (93%)
✗ E2E Tests: 8/10 passing (80%)

📉 Coverage:
- Statements: 87% (target: 80%) ✓
- Branches: 83% (target: 80%) ✓
- Functions: 91% (target: 80%) ✓
- Lines: 86% (target: 80%) ✓

🔧 Auto-Fix Results:
✓ Fixed 3 integration test failures
✗ 2 E2E tests require manual intervention

📋 Remaining Failures:
1. test/e2e/login-flow.test.ts:45
   - "Login with remember me"
   - Issue: Session cookie not persisting
   - Recommendation: Check cookie settings in test environment

2. test/e2e/rate-limit.test.ts:23
   - "Rate limit across multiple IPs"
   - Issue: Redis connection timeout in test
   - Recommendation: Increase Redis timeout or use mock

💾 Detailed report: RLM/progress/reports/test-report-2025-01-15.html
```

### Generate Coverage Report

```bash
./RLM/commands/rlm-test.sh coverage
open coverage/index.html
```

---

## Part 7: Deployment

### Automated Deployment Pipeline

```bash
# Deploy to staging
./RLM/commands/rlm-deploy.sh --env staging

# Run smoke tests
./RLM/commands/rlm-test.sh e2e --env staging

# Deploy to production (with approval)
./RLM/commands/rlm-deploy.sh --env production --require-approval
```

**CI/CD Integration** (GitHub Actions):
```yaml
# .github/workflows/rlm-agent.yaml
name: RLM Agent Workflow

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sync-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Sync RLM specifications
        run: ./RLM/commands/rlm-sync.sh pull
        env:
          RLM_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Run RLM automated build
        run: ./RLM/commands/rlm-build.sh --mode auto
        env:
          RLM_AI_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      
      - name: Run tests
        run: ./RLM/commands/rlm-test.sh all --ci
      
      - name: Push progress
        run: ./RLM/commands/rlm-sync.sh push
        env:
          RLM_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Generate report
        run: ./RLM/commands/rlm-report.sh detailed --output ci-report.md
      
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: rlm-report
          path: ci-report.md
```

---

## Part 8: Reporting and Analytics

### Daily Standup Report

```bash
./RLM/commands/rlm-report.sh detailed --since "24 hours ago"
```

**Output:**
```markdown
# RLM Daily Progress Report
**Date:** 2025-01-15
**Period:** Last 24 hours

## 📊 Summary
- **Completed:** 4 tasks
- **In Progress:** 2 tasks
- **Blocked:** 0 tasks
- **Velocity:** 4.0 tasks/day (↑ from 3.5)

## ✅ Completed Yesterday
### TASK-005: Create auth routes
- **Agent:** Implementation Agent
- **Duration:** 2.5 hours
- **Tests:** 12/12 passing
- **Coverage:** 95%

### TASK-006: Implement auth service  
- **Agent:** Implementation Agent
- **Duration:** 3.0 hours
- **Tests:** 18/18 passing
- **Coverage:** 92%

### TASK-007: Add JWT utilities
- **Agent:** Implementation Agent
- **Duration:** 1.5 hours
- **Tests:** 8/8 passing
- **Coverage:** 100%

### TASK-008: Create auth middleware
- **Agent:** Implementation Agent
- **Duration:** 2.0 hours
- **Tests:** 10/10 passing
- **Coverage:** 94%

## 🚧 In Progress
### TASK-009: OAuth integration
- **Agent:** Implementation Agent
- **Progress:** 60%
- **Started:** 2025-01-15 14:00
- **Est. Completion:** 2025-01-15 18:00

### TASK-010: Unit tests for auth
- **Agent:** Testing Agent
- **Progress:** 30%
- **Started:** 2025-01-15 16:00
- **Est. Completion:** 2025-01-15 19:00

## 📈 Metrics
- **Code Written:** 1,247 lines
- **Tests Written:** 48 test cases
- **Code Removed:** 83 lines (refactoring)
- **Net Change:** +1,164 lines
- **Commits:** 12
- **Average Commit Size:** 103 lines

## 🎯 Today's Goals
- [ ] Complete TASK-009 (OAuth)
- [ ] Complete TASK-010 (Tests)
- [ ] Start TASK-011 (Integration tests)
- [ ] Review and merge PR #42

## 🚀 Tomorrow's Plan
- TASK-011: Integration tests
- TASK-012: E2E tests
- Begin FTR-002 (Password reset)
```

### Sprint Retrospective

```bash
./RLM/commands/rlm-report.sh metrics --since "2 weeks ago" --output sprint-retro.html
```

Generates interactive dashboard with:
- Velocity trends
- Test coverage over time
- Issue resolution time
- Agent performance
- Code quality metrics

---

## Part 9: Advanced Usage

### Parallel Task Execution

```bash
# Run multiple tasks in parallel
./RLM/commands/rlm-build.sh --parallel --tasks "TASK-005,TASK-006,TASK-007"
```

### Custom Agent Creation

Create `RLM/agents/custom/security-auditor.md`:
```markdown
# Security Auditor Agent

You are a specialized security auditor focusing on web application vulnerabilities.

## Responsibilities
- Review code for security vulnerabilities
- Perform static analysis security testing (SAST)
- Check for OWASP Top 10 vulnerabilities
- Verify input validation and sanitization
- Audit authentication and authorization logic

## Tools
- Semgrep for static analysis
- npm audit for dependency vulnerabilities
- Custom security checks

## Process
1. Scan codebase for security patterns
2. Identify potential vulnerabilities
3. Rate severity (Critical/High/Medium/Low)
4. Suggest fixes
5. Generate security report
```

Run it:
```bash
./RLM/commands/rlm-build.sh --agent security-auditor --scan-all
```

---

## Part 10: Troubleshooting

### Common Issues

#### Issue: Sync Conflicts
```bash
# If sync fails due to conflicts
./RLM/commands/rlm-sync.sh pull --force

# Manual conflict resolution
git status
# Resolve conflicts in RLM/specs/
git add RLM/
git commit -m "resolve: Merge PM updates"
```

#### Issue: Agent Gets Stuck
```bash
# Check agent logs
tail -f RLM/progress/logs/current.log

# Kill stuck agent
pkill -f "rlm-build"

# Restart with more verbose logging
./RLM/commands/rlm-build.sh --mode manual --verbose
```

#### Issue: Tests Failing
```bash
# Debug failing tests
./RLM/commands/rlm-test.sh unit --verbose --no-fix

# Get AI analysis of failures
./RLM/commands/rlm-test.sh unit --analyze

# Manual fix and retry
# [fix tests]
./RLM/commands/rlm-test.sh unit
```

---

## Summary

The RLM system enables a complete automated development workflow:

1. **PM defines** specifications in web app
2. **GitHub syncs** instructions to local environment
3. **AI agents implement** features automatically (with Elite Context Engineering!)
4. **Tests validate** everything works
5. **Progress flows back** to PM for review
6. **Iterate** until complete

All with:
- ✅ Minimal manual intervention
- ✅ Comprehensive testing
- ✅ Full traceability
- ✅ **86% token savings** with Elite Context Engineering
- ✅ **Complete cost visibility** with token tracking
- ✅ **Parallel execution** with background agents

## Next Steps

1. Initialize RLM: `./RLM/commands/rlm-init.sh`
2. Create your constitution: Edit `RLM/specs/constitution.md`
3. **Optimize context**: `./RLM/commands/utils/context-manager.sh optimize`
4. Define your first feature: Create `RLM/specs/features/FTR-001/spec.md`
5. Run your first build: `./RLM/commands/rlm-build.sh --mode supervised`
6. **Review token usage**: `./RLM/commands/utils/token-tracker.sh report`
7. Review the results: `./RLM/commands/rlm-report.sh summary`

Welcome to automated AI-driven development with Elite Context Engineering! 🚀

## Advanced Features

### Elite Context Engineering
Learn how to save 86% on tokens:
- **[Elite Context Engineering Guide](ELITE-CONTEXT-ENGINEERING.md)**

### Token & Cost Management
Track and optimize AI costs:
- **[Token Tracking Guide](TOKEN-TRACKING.md)**