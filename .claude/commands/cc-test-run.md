# Test Run Pipeline Command

You are initiating a **test run** of the RLM methodology. This command creates an isolated test project and runs the full automation pipeline to validate RLM functionality.

## Arguments

`$ARGUMENTS` should contain:
- `[project-name]` - Name for the test project (required)
- `--from-prd [path]` - Optional path to existing PRD file
- `--idea "[description]"` - Optional project idea (otherwise uses default test idea)
- `--metrics-only` - Only run metrics collection on existing test project

If no project name provided, prompt: "Enter a name for this test project (e.g., 'test-run-1')."

## Test Run Workflow

```
/cc-test-run [project-name]
│
├─► Step 1: CREATE ISOLATED DIRECTORY
│   ├─► Create: test_projects/[project-name]-[YYYYMMDD-HHMMSS]/
│   ├─► Copy RLM framework structure
│   │   ├─► RLM/prompts/
│   │   ├─► RLM/agents/
│   │   ├─► RLM/templates/
│   │   └─► RLM/progress/ (empty)
│   └─► Initialize test metrics file
│
├─► Step 2: RUN FULL PIPELINE
│   ├─► Change working context to test directory
│   ├─► Execute /cc-full [idea] --auto
│   │   └─► If --from-prd: Copy PRD and use /cc-full --from-prd
│   └─► Capture all output and metrics
│
├─► Step 3: COLLECT METRICS
│   ├─► Total tokens used (input + output)
│   ├─► Time elapsed per phase
│   ├─► Lines of code generated
│   ├─► Number of files created
│   ├─► Test coverage percentage
│   ├─► Design QA score (if applicable)
│   ├─► Features completed vs planned
│   └─► Tasks completed vs planned
│
├─► Step 4: GENERATE REPORT
│   ├─► Create: test_projects/[project-name]-[timestamp]/TEST-REPORT.md
│   ├─► Log to: RLM/progress/test-runs/[project-name]-[timestamp].json
│   └─► If multiple instances exist, generate comparison
│
└─► Step 5: CLEANUP (Optional)
    └─► If --cleanup flag: Remove test project after metrics collected
```

## Default Test Ideas

If no idea provided, use one of these default test prompts:

1. **Simple App** (recommended for quick tests):
   ```
   "A minimal todo list web app with add, complete, and delete tasks"
   ```

2. **Medium App** (tests full design system):
   ```
   "A habit tracker app where users can create habits, track daily completion, and view streaks"
   ```

3. **Complex App** (tests all phases):
   ```
   "A recipe management app with user accounts, recipe creation with ingredients, meal planning, and shopping list generation"
   ```

To use a specific default:
```
/cc-test-run my-test --default=simple
/cc-test-run my-test --default=medium
/cc-test-run my-test --default=complex
```

## Metrics Collection

### Metrics File Structure

**Location**: `RLM/progress/test-runs/[project-name]-[timestamp].json`

```json
{
  "test_run": {
    "name": "[project-name]",
    "timestamp": "2024-01-15T14:30:00Z",
    "idea": "[project idea or PRD reference]",
    "config": {
      "automation_level": "auto",
      "parallel_limit": 5,
      "design_philosophy": "CONSISTENT"
    }
  },
  "metrics": {
    "tokens": {
      "total": 125000,
      "input": 45000,
      "output": 80000,
      "by_phase": {
        "discover": 15000,
        "design_system": 12000,
        "specs": 18000,
        "feature_design": 10000,
        "tasks": 8000,
        "implement": 45000,
        "quality": 12000,
        "verify": 5000
      }
    },
    "time": {
      "total_minutes": 45,
      "by_phase": {
        "discover": 8,
        "design_system": 5,
        "specs": 6,
        "feature_design": 4,
        "tasks": 3,
        "implement": 15,
        "quality": 3,
        "verify": 1
      }
    },
    "code": {
      "lines_generated": 2500,
      "files_created": 35,
      "test_coverage": 85,
      "design_qa_score": 108
    },
    "completion": {
      "features_planned": 5,
      "features_completed": 5,
      "features_verified": 5,
      "tasks_planned": 25,
      "tasks_completed": 25,
      "tasks_blocked": 0
    }
  },
  "status": "success",
  "errors": [],
  "notes": ""
}
```

## Comparison Report

When multiple test runs exist, generate comparison:

**Location**: `RLM/progress/test-runs/COMPARISON-[date].md`

```markdown
# Test Run Comparison Report

| Metric | Run 1 | Run 2 | Run 3 | Average |
|--------|-------|-------|-------|---------|
| Total Tokens | 125,000 | 118,000 | 132,000 | 125,000 |
| Time (min) | 45 | 42 | 48 | 45 |
| Lines of Code | 2,500 | 2,450 | 2,600 | 2,517 |
| Test Coverage | 85% | 88% | 82% | 85% |
| Design QA | 108/117 | 110/117 | 105/117 | 108/117 |

## Observations
- Run 2 was most efficient (lowest tokens, good coverage)
- Run 3 generated most code but had lower test coverage
```

## Usage Examples

### Basic Test Run
```
/cc-test-run my-first-test
```
Creates `test_projects/my-first-test-20240115-143000/` with default simple app.

### Test with Specific Idea
```
/cc-test-run auth-test --idea "A simple authentication service with login, logout, and password reset"
```

### Test from Existing PRD
```
/cc-test-run prd-test --from-prd "path/to/existing/PRD.md"
```

### Run Multiple Tests for Comparison
```
/cc-test-run comparison-1 --default=medium
/cc-test-run comparison-2 --default=medium
/cc-test-run comparison-3 --default=medium
```
Then view: `RLM/progress/test-runs/COMPARISON-[date].md`

### Quick Metrics Check
```
/cc-test-run my-test --metrics-only
```
Re-calculates metrics for existing test project.

## Configuration

Test runs respect `RLM/progress/cc-config.json` settings plus test-specific options:

```json
{
  "test_mode": {
    "enabled": true,
    "output_directory": "test_projects/",
    "collect_metrics": true,
    "default_idea": "simple",
    "cleanup_on_success": false,
    "generate_comparison": true
  }
}
```

## Directory Structure After Test

```
test_projects/
└── my-test-20240115-143000/
    ├── RLM/
    │   ├── specs/
    │   │   ├── PRD.md
    │   │   ├── constitution.md
    │   │   ├── features/
    │   │   ├── architecture/
    │   │   └── design/
    │   ├── tasks/
    │   │   ├── active/
    │   │   └── completed/
    │   └── progress/
    │       └── token-usage/
    ├── [generated-app]/
    │   ├── src/
    │   ├── tests/
    │   └── ...
    └── TEST-REPORT.md
```

## Error Handling

If test run fails:
1. Capture error state and context
2. Log to `RLM/progress/test-runs/[name]-FAILED.json`
3. Mark status as "failed" with error details
4. Continue with metrics collection for completed phases

```json
{
  "status": "failed",
  "failed_at_phase": "implement",
  "errors": [
    {
      "phase": "implement",
      "task": "TASK-005",
      "message": "Build failed: missing dependency",
      "timestamp": "2024-01-15T14:45:00Z"
    }
  ]
}
```

## Resume Failed Test

```
/cc-test-run my-test --resume
```
Continues from last successful phase.

## Implementation Notes

When executing this command:

1. **Create test directory** using Bash:
   ```bash
   mkdir -p "test_projects/[name]-[timestamp]"
   ```

2. **Copy RLM structure**:
   - Copy prompts, agents, templates directories
   - Create empty progress directory

3. **Run pipeline**:
   - Execute `/cc-full` with `--auto` flag
   - Capture all token counts from sub-agent calls
   - Track time for each phase

4. **Generate metrics**:
   - Count lines: `find . -name "*.ts" -o -name "*.tsx" | xargs wc -l`
   - Count files: `find . -type f | wc -l`
   - Read test coverage from Jest/Playwright output
   - Read Design QA score from progress files

5. **Generate report**:
   - Write TEST-REPORT.md with summary
   - Write JSON metrics file
   - If comparison exists, update comparison report
