# RLM Project Structure

This document defines the complete directory structure for the RLM (Research-Lead-Manage) AI Agent Development System.

## Complete Directory Tree

```
project-root/
├── RLM/                                      # Main RLM system directory
│   │
│   ├── config/                               # System configuration
│   │   ├── project-config.json               # Project-wide settings
│   │   ├── agent-profiles.json               # AI agent configurations
│   │   ├── ide-settings.json                 # IDE-specific settings
│   │   ├── github-config.json                # GitHub integration config
│   │   └── ci-config.yaml                    # CI/CD pipeline configuration
│   │
│   ├── specs/                                # All specifications
│   │   ├── constitution.md                   # Project principles & standards
│   │   │
│   │   ├── requirements/                     # Business requirements
│   │   │   ├── epic-001-user-auth.md
│   │   │   ├── epic-002-dashboard.md
│   │   │   └── ...
│   │   │
│   │   ├── features/                         # Feature specifications
│   │   │   ├── FTR-001-login/
│   │   │   │   ├── spec.md                   # Feature specification
│   │   │   │   ├── acceptance-criteria.md     # Acceptance tests
│   │   │   │   └── user-stories.md           # User stories
│   │   │   ├── FTR-002-dashboard/
│   │   │   └── ...
│   │   │
│   │   └── architecture/                     # Technical architecture
│   │       ├── system-design.md              # Overall system architecture
│   │       ├── tech-stack.md                 # Technology decisions
│   │       ├── data-model.md                 # Database schema
│   │       ├── api-spec.json                 # OpenAPI/Swagger spec
│   │       ├── security-design.md            # Security architecture
│   │       ├── deployment-architecture.md    # Infrastructure design
│   │       └── features/                     # Feature-specific architecture
│   │           ├── FTR-001-login/
│   │           │   ├── design.md
│   │           │   ├── api-endpoints.md
│   │           │   └── data-flow.md
│   │           └── ...
│   │
│   ├── tasks/                                # Task management
│   │   ├── active/                           # Currently in progress
│   │   │   ├── TASK-001.md
│   │   │   ├── TASK-002.md
│   │   │   └── ...
│   │   ├── completed/                        # Finished tasks
│   │   │   ├── TASK-XXX.md
│   │   │   └── ...
│   │   └── blocked/                          # Blocked tasks
│   │       ├── TASK-YYY.md
│   │       └── ...
│   │
│   ├── progress/                             # Progress tracking
│   │   ├── logs/                             # Detailed logs
│   │   │   ├── TASK-001.md
│   │   │   ├── TASK-002.md
│   │   │   └── ...
│   │   ├── status.json                       # Current status snapshot
│   │   ├── metrics.json                      # Performance metrics
│   │   ├── velocity.json                     # Team velocity data
│   │   └── reports/                          # Generated reports
│   │       ├── daily/
│   │       ├── weekly/
│   │       └── sprint/
│   │
│   ├── issues/                               # Issue tracking
│   │   ├── open/                             # Active issues
│   │   │   ├── ISSUE-001.md
│   │   │   ├── ISSUE-002.md
│   │   │   └── ...
│   │   └── resolved/                         # Resolved issues
│   │       ├── ISSUE-XXX.md
│   │       └── ...
│   │
│   ├── agents/                               # Agent prompt files
│   │   ├── master-architect.md               # Architecture agent
│   │   ├── implementation-agent.md           # Development agent
│   │   ├── testing-agent.md                  # QA agent
│   │   ├── devops-agent.md                   # DevOps agent
│   │   ├── security-agent.md                 # Security agent
│   │   ├── documentation-agent.md            # Docs agent
│   │   └── custom/                           # Project-specific agents
│   │       └── ...
│   │
│   ├── commands/                             # Automation scripts
│   │   ├── rlm-init.sh                       # Initialize system
│   │   ├── rlm-sync.sh                       # GitHub sync
│   │   ├── rlm-build.sh                      # Automated build
│   │   ├── rlm-test.sh                       # Test execution
│   │   ├── rlm-report.sh                     # Report generation
│   │   ├── rlm-deploy.sh                     # Deployment automation
│   │   ├── utils/                            # Utility scripts
│   │   │   ├── git-helpers.sh
│   │   │   ├── agent-invoker.sh
│   │   │   ├── progress-tracker.sh
│   │   │   └── report-generator.sh
│   │   └── hooks/                            # Git hooks
│   │       ├── pre-commit
│   │       ├── post-commit
│   │       └── pre-push
│   │
│   ├── templates/                            # Document templates
│   │   ├── spec-template.md                  # Feature spec template
│   │   ├── task-template.md                  # Task template
│   │   ├── issue-template.md                 # Issue template
│   │   ├── architecture-template.md          # Architecture doc template
│   │   ├── test-plan-template.md             # Test plan template
│   │   └── report-template.md                # Report template
│   │
│   ├── knowledge/                            # Project knowledge base
│   │   ├── decisions/                        # Architecture Decision Records (ADRs)
│   │   │   ├── ADR-001-choice-of-framework.md
│   │   │   ├── ADR-002-database-selection.md
│   │   │   └── ...
│   │   ├── patterns/                         # Reusable patterns
│   │   │   ├── authentication-pattern.md
│   │   │   ├── caching-strategy.md
│   │   │   └── ...
│   │   ├── lessons-learned.md                # Retrospective insights
│   │   └── faq.md                            # Frequently asked questions
│   │
│   ├── ci-cd/                                # CI/CD configurations
│   │   ├── github-actions/
│   │   │   ├── build.yaml
│   │   │   ├── test.yaml
│   │   │   ├── deploy.yaml
│   │   │   └── rlm-agent-workflow.yaml       # Agent automation workflow
│   │   ├── docker/
│   │   │   ├── Dockerfile
│   │   │   └── docker-compose.yaml
│   │   └── kubernetes/
│   │       ├── deployment.yaml
│   │       └── service.yaml
│   │
│   └── docs/                                 # Documentation
│       ├── README.md                         # RLM system overview
│       ├── getting-started.md                # Quick start guide
│       ├── user-guide.md                     # Comprehensive user guide
│       ├── architecture-guide.md             # System architecture
│       ├── agent-guide.md                    # Agent usage guide
│       ├── troubleshooting.md                # Common issues & solutions
│       └── api-reference.md                  # API documentation
│
├── .github/                                  # GitHub configuration
│   ├── workflows/
│   │   └── rlm-agent.yaml                    # Main agent workflow
│   └── CODEOWNERS                            # Code ownership
│
├── src/                                      # Application source code
│   └── [Your application structure]
│
├── tests/                                    # Test files
│   └── [Your test structure]
│
├── .gitignore                                # Git ignore rules
├── README.md                                 # Project README
└── package.json / requirements.txt           # Dependencies
```

## File Purposes and Formats

### Configuration Files

#### RLM/config/project-config.json
```json
{
  "projectName": "My Application",
  "version": "1.0.0",
  "techStack": {
    "language": "typescript",
    "framework": "next.js",
    "database": "postgresql",
    "testing": "jest"
  },
  "github": {
    "repo": "org/project",
    "branch": "main"
  },
  "automation": {
    "defaultMode": "supervised",
    "parallelTasks": 4,
    "autoCommit": true
  }
}
```

#### RLM/config/agent-profiles.json
```json
{
  "agents": [
    {
      "id": "master-architect",
      "name": "Master Architect",
      "model": "claude-sonnet-4",
      "temperature": 0.2,
      "systemPrompt": "agents/master-architect.md",
      "tools": ["codebase_search", "file_edit", "terminal"],
      "triggers": ["architecture_task", "design_review"]
    },
    {
      "id": "implementation-agent",
      "name": "Implementation Agent",
      "model": "claude-sonnet-4",
      "temperature": 0.1,
      "systemPrompt": "agents/implementation-agent.md",
      "tools": ["file_edit", "terminal", "test_runner"],
      "triggers": ["implementation_task", "code_generation"]
    }
  ]
}
```

### Specification Files

#### RLM/specs/constitution.md
```markdown
# Project Constitution

## Coding Standards
- Use TypeScript with strict mode
- Follow functional programming principles
- All functions must have JSDoc comments
- Maximum function length: 50 lines
- Maximum file length: 500 lines

## Testing Standards
- Minimum 80% code coverage
- Test-driven development (TDD) required
- Tests must run in under 30 seconds
- All edge cases must be tested

## Security Standards
- Input validation on all endpoints
- SQL injection prevention
- XSS protection
- Rate limiting on public APIs

## Performance Standards
- API response time < 200ms (p95)
- Database queries < 50ms
- Frontend bundle size < 500KB
```

#### RLM/specs/features/FTR-001-login/spec.md
```markdown
# Feature Specification: User Login

## Feature ID: FTR-001
## Status: Active
## Priority: High
## Epic: EPIC-001-UserAuth

## Overview
Implement secure user authentication system with email/password login.

## User Stories
- As a user, I want to log in with email/password so that I can access the application
- As a user, I want password validation to ensure my account is secure
- As a user, I want "remember me" functionality to stay logged in

## Acceptance Criteria
- [ ] User can enter email and password
- [ ] Invalid credentials show appropriate error
- [ ] Successful login redirects to dashboard
- [ ] "Remember me" extends session to 30 days
- [ ] Failed login attempts are rate-limited

## Technical Requirements
- JWT-based authentication
- bcrypt password hashing
- Rate limiting: 5 attempts per 15 minutes
- Session duration: 24 hours (7 days with remember me)
```

### Task Files

#### RLM/tasks/active/TASK-001.md
```markdown
# Task: Implement Login API Endpoint

## Task ID: TASK-001
## Feature: FTR-001-login
## Type: implementation
## Status: active
## Assigned Agent: implementation-agent
## Estimated Effort: 3 hours

## Description
Create POST /api/auth/login endpoint with validation and JWT generation.

## Acceptance Criteria
- [ ] Endpoint accepts email and password
- [ ] Validates input format
- [ ] Verifies credentials against database
- [ ] Returns JWT token on success
- [ ] Returns 401 on invalid credentials
- [ ] Implements rate limiting

## Technical Details
- Framework: Express.js
- Validation: Zod schema
- Database: Prisma ORM
- Token: jsonwebtoken library

## Dependencies
- TASK-000 (database setup) - completed

## Test Requirements
- Unit tests for validation logic
- Integration tests for endpoint
- Test invalid credentials
- Test rate limiting

## Files to Modify/Create
- src/routes/auth.ts
- src/controllers/auth-controller.ts
- src/services/auth-service.ts
- tests/auth.test.ts
```

### Progress Files

#### RLM/progress/status.json
```json
{
  "lastUpdate": "2025-01-15T14:30:00Z",
  "tasks": {
    "TASK-001": {
      "status": "in_progress",
      "progress": 65,
      "startedAt": "2025-01-15T10:00:00Z",
      "estimatedCompletion": "2025-01-15T16:00:00Z",
      "agent": "implementation-agent"
    },
    "TASK-002": {
      "status": "completed",
      "completedAt": "2025-01-15T12:00:00Z",
      "agent": "master-architect"
    },
    "TASK-003": {
      "status": "blocked",
      "blockedSince": "2025-01-15T11:00:00Z",
      "blocker": "ISSUE-001",
      "agent": "implementation-agent"
    }
  },
  "metrics": {
    "totalTasks": 25,
    "completed": 10,
    "inProgress": 3,
    "blocked": 2,
    "pending": 10,
    "velocity": 4.2
  }
}
```

### Issue Files

#### RLM/issues/open/ISSUE-001.md
```markdown
# Issue: Database Connection Timeout

## Issue ID: ISSUE-001
## Severity: high
## Type: blocker
## Blocking Tasks: TASK-003, TASK-005
## Created: 2025-01-15T11:00:00Z
## Agent: implementation-agent

## Description
Database connections are timing out after 30 seconds when running integration tests.

## Context
- Environment: Development
- Database: PostgreSQL 15
- Connection pool size: 10
- Test suite: Integration tests

## Steps to Reproduce
1. Run `npm test -- --integration`
2. Tests hang after 3-4 seconds
3. Timeout error after 30 seconds

## Attempted Solutions
- Increased pool size to 20 - no change
- Verified database is running - confirmed
- Checked connection string - correct

## Recommended Next Steps
1. Review database connection pooling configuration
2. Check for connection leaks in test suite
3. Verify test database has sufficient resources

## Impact
- 2 implementation tasks blocked
- Estimated delay: 4 hours
- Risk: High - may affect other tests

## Assigned To
Escalated to human architect for investigation
```

## Directory Initialization

When running `rlm-init.sh`, the system creates this entire structure with:
1. All directories created
2. Template files populated
3. Initial configuration files generated
4. Git hooks installed
5. `.gitignore` updated to exclude sensitive files

## File Naming Conventions

- **Specs**: Descriptive names with context (e.g., `FTR-001-login-spec.md`)
- **Tasks**: ID-based naming (e.g., `TASK-001.md`, `TASK-002.md`)
- **Issues**: ID-based naming (e.g., `ISSUE-001.md`)
- **Logs**: Match task IDs (e.g., `TASK-001.md` in logs/)
- **Reports**: Date-stamped (e.g., `report-2025-01-15.md`)

## Version Control

### Tracked Files
- All specification files in `RLM/specs/`
- All task files
- Configuration files
- Agent prompts
- Documentation

### Ignored Files
- `RLM/progress/logs/*.md` (unless specifically committed)
- `RLM/.cache/`
- Temporary files
- API keys in config files (use environment variables)

### Sync Strategy
- PM pushes to `RLM/specs/` and `RLM/tasks/active/`
- Developers push to `RLM/progress/` and `RLM/issues/`
- Bidirectional sync happens on schedule or manual trigger

## Best Practices

1. **Keep specs focused**: One feature per directory
2. **Task granularity**: Tasks should be 2-8 hours of work
3. **Regular syncs**: Sync at least twice daily
4. **Issue documentation**: Thorough context for every issue
5. **Progress logging**: Update status after every significant step
6. **Clean commits**: Commit completed tasks with descriptive messages