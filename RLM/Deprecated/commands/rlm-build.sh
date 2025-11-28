#!/bin/bash
# RLM Build Script - Automated AI Agent Implementation
# Usage: ./rlm-build.sh [OPTIONS]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Default values
MODE="supervised"
TASK_ID=""
AGENT=""
PARALLEL=false
DRY_RUN=false

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RLM_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$RLM_ROOT")"

# Source utilities
source "$SCRIPT_DIR/utils/token-tracker.sh" 2>/dev/null || true
source "$SCRIPT_DIR/utils/progress-tracker.sh" 2>/dev/null || true
source "$SCRIPT_DIR/utils/event-logger.sh" 2>/dev/null || true
source "$SCRIPT_DIR/utils/session-colors.sh" 2>/dev/null || true

# Initialize systems
init_token_tracking 2>/dev/null || true
init_event_database 2>/dev/null || true

# Generate session ID for this build run
SESSION_ID="build-$(date +%s)-$$"

# Print colored output
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_agent() { echo -e "${PURPLE}🤖${NC} $1"; }

# Display usage
usage() {
    cat << EOF
RLM Build - Automated AI Agent Implementation

Usage: ./rlm-build.sh [OPTIONS]

Options:
    --task <task-id>
        Specific task to implement (default: all active)
    
    --agent <architect|implementation|testing|devops>
        Specific agent to run
    
    --mode <auto|supervised|manual>
        Automation level (default: supervised)
        - auto: Full automation, agents make decisions independently
        - supervised: Agents ask for approval at key decision points
        - manual: Step-by-step execution with human oversight
    
    --parallel
        Run multiple tasks in parallel
    
    --dry-run
        Validate without making changes
    
    -h, --help
        Display this help message

Examples:
    ./rlm-build.sh --mode auto
    ./rlm-build.sh --task TASK-123 --mode supervised
    ./rlm-build.sh --agent architect
    ./rlm-build.sh --parallel --mode auto

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --task)
            TASK_ID="$2"
            shift 2
            ;;
        --agent)
            AGENT="$2"
            shift 2
            ;;
        --mode)
            MODE="$2"
            shift 2
            ;;
        --parallel)
            PARALLEL=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Validate mode
if [[ ! "$MODE" =~ ^(auto|supervised|manual)$ ]]; then
    print_error "Invalid mode: $MODE"
    usage
    exit 1
fi

# Change to project root
cd "$PROJECT_ROOT"

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check if constitution exists
    if [ ! -f "$RLM_ROOT/specs/constitution.md" ]; then
        print_error "Constitution not found. Please create RLM/specs/constitution.md"
        exit 1
    fi
    
    # Check if any tasks exist
    local task_count=$(find "$RLM_ROOT/tasks/active" -type f -name "*.md" 2>/dev/null | wc -l)
    if [ "$task_count" -eq 0 ] && [ -z "$TASK_ID" ]; then
        print_warning "No active tasks found. Please create tasks in RLM/tasks/active/"
        exit 0
    fi
    
    print_success "Prerequisites check passed"
}

# Function to load task
load_task() {
    local task_file="$1"
    local task_name=$(basename "$task_file" .md)
    
    print_info "Loading task: $task_name"
    
    if [ ! -f "$task_file" ]; then
        print_error "Task file not found: $task_file"
        return 1
    fi
    
    # Log task load
    log_event "spec_read" "Loaded task specification: $task_name" \
        "{\"task_file\":\"$task_file\"}" \
        "$SESSION_ID" "" "$task_name" 0 0 0.0 0 2>/dev/null || true
    
    echo "$task_name"
}

# Function to determine which agent to use
determine_agent() {
    local task_file="$1"
    
    # Extract task type from task file
    local task_type=$(grep "^## Type:" "$task_file" | sed 's/^## Type: //')
    
    case "$task_type" in
        architecture|design)
            echo "master-architect"
            ;;
        implementation|coding)
            echo "implementation-agent"
            ;;
        testing|qa)
            echo "testing-agent"
            ;;
        deployment|devops)
            echo "devops-agent"
            ;;
        *)
            echo "implementation-agent"  # Default
            ;;
    esac
}

# Function to invoke AI agent
invoke_agent() {
    local agent_id="$1"
    local task_file="$2"
    local task_name=$(basename "$task_file" .md)
    
    print_agent "Invoking $agent_id for $task_name"
    
    # Log task start
    local task_start_time=$(date +%s%3N 2>/dev/null || date +%s)
    log_event "task_start" "Task started: $task_name" \
        "{\"agent\":\"$agent_id\",\"mode\":\"$MODE\"}" \
        "$SESSION_ID" "$agent_id" "$task_name" 0 0 0.0 0 2>/dev/null || true
    
    # Create log file
    local log_file="$RLM_ROOT/progress/logs/$task_name.md"
    mkdir -p "$(dirname "$log_file")"
    
    # Initialize log
    cat > "$log_file" << EOF
# Task: $task_name

## Status: IN_PROGRESS
## Started: $(date -u +"%Y-%m-%d %H:%M UTC")
## Agent: $agent_id
## Mode: $MODE
## Session: $SESSION_ID

### Progress Log
EOF
    
    # Update status.json
    update_status "$task_name" "in_progress" "$agent_id"
    
    print_info "Agent working on task (mode: $MODE)..."
    
    # In a real implementation, this would invoke the actual AI agent
    # For now, we'll simulate the agent workflow
    
    case "$MODE" in
        auto)
            # Fully automated - no interaction needed
            simulate_agent_work "$agent_id" "$task_file" "$log_file"
            ;;
        supervised)
            # Show plan and ask for approval
            print_info "Agent has analyzed the task."
            echo ""
            print_agent "Proposed approach:"
            echo "  1. Review specifications"
            echo "  2. Design implementation"
            echo "  3. Write tests (TDD)"
            echo "  4. Implement code"
            echo "  5. Run tests and validate"
            echo ""
            
            # Log plan creation
            log_event "plan_created" "Implementation plan created for $task_name" \
                "{\"steps\":5,\"mode\":\"supervised\"}" \
                "$SESSION_ID" "$agent_id" "$task_name" 0 0 0.0 0 2>/dev/null || true
            
            if [ "$DRY_RUN" = false ]; then
                read -p "Approve this plan? (yes/no): " -r
                if [[ ! $REPLY =~ ^[Yy]([Ee][Ss])?$ ]]; then
                    print_warning "Plan rejected. Task cancelled."
                    log_event "blocker_created" "Plan rejected by user" \
                        "{\"reason\":\"user_rejection\"}" \
                        "$SESSION_ID" "$agent_id" "$task_name" 0 0 0.0 0 2>/dev/null || true
                    update_status "$task_name" "pending" ""
                    return 1
                fi
            fi
            
            simulate_agent_work "$agent_id" "$task_file" "$log_file"
            ;;
        manual)
            # Step-by-step with manual confirmation
            print_info "Manual mode - step through each phase"
            simulate_agent_work "$agent_id" "$task_file" "$log_file" "manual"
            ;;
    esac
    
    # Mark task complete
    echo "## Status: COMPLETED" >> "$log_file"
    echo "## Completed: $(date -u +"%Y-%m-%d %H:%M UTC")" >> "$log_file"
    
    # Calculate duration
    local task_end_time=$(date +%s%3N 2>/dev/null || date +%s)
    local duration_ms=$((task_end_time - task_start_time))
    [ $duration_ms -lt 0 ] && duration_ms=0
    
    # Log task completion
    log_event "task_complete" "Task completed: $task_name" \
        "{\"duration_ms\":$duration_ms}" \
        "$SESSION_ID" "$agent_id" "$task_name" 0 0 0.0 "$duration_ms" 2>/dev/null || true
    
    update_status "$task_name" "completed" "$agent_id"
    
    # Move task to completed
    if [ "$DRY_RUN" = false ]; then
        mv "$task_file" "$RLM_ROOT/tasks/completed/"
    fi
    
    print_success "Task $task_name completed"
}

# Function to simulate agent work
simulate_agent_work() {
    local agent_id="$1"
    local task_file="$2"
    local log_file="$3"
    local step_mode="${4:-auto}"
    local task_name=$(basename "$task_file" .md)
    
    # This is a placeholder for actual AI agent invocation
    # In production, this would call the actual AI model with appropriate context
    
    local steps=(
        "Reviewing specifications"
        "Analyzing requirements"
        "Creating implementation plan"
        "Writing test cases"
        "Implementing code"
        "Running tests"
        "Validating results"
    )
    
    # Simulate token usage (in production, capture from actual AI API)
    local start_time=$(date +%s)
    local total_input_tokens=0
    local total_output_tokens=0
    
    for step in "${steps[@]}"; do
        local step_start=$(date +%s%3N 2>/dev/null || date +%s)
        print_info "$step..."
        echo "- [x] $step" >> "$log_file"
        
        # Determine event type based on step
        local event_type="tool_use"
        case "$step" in
            *test*) event_type="test_written" ;;
            *code*) event_type="code_written" ;;
            *test*run*) event_type="test_run" ;;
        esac
        
        # Simulate token usage per step (replace with actual API response)
        local step_input=$((RANDOM % 5000 + 2000))
        local step_output=$((RANDOM % 3000 + 1000))
        total_input_tokens=$((total_input_tokens + step_input))
        total_output_tokens=$((total_output_tokens + step_output))
        
        # Calculate step cost
        local step_cost=$(calculate_cost "$model" "$step_input" "$step_output" 2>/dev/null || echo "0")
        
        # Calculate step duration
        local step_end=$(date +%s%3N 2>/dev/null || date +%s)
        local step_duration=$((step_end - step_start))
        [ $step_duration -lt 0 ] && step_duration=0
        
        # Log step event
        log_event "$event_type" "$step" \
            "{\"step\":\"$step\",\"model\":\"$model\"}" \
            "$SESSION_ID" "$agent_id" "$task_name" \
            "$step_input" "$step_output" "$step_cost" "$step_duration" 2>/dev/null || true
        
        sleep 0.5
        
        if [ "$step_mode" = "manual" ] && [ "$DRY_RUN" = false ]; then
            read -p "Continue to next step? (yes/no): " -r
            if [[ ! $REPLY =~ ^[Yy]([Ee][Ss])?$ ]]; then
                print_warning "Stopped at: $step"
                log_event "blocker_created" "User stopped execution at: $step" \
                    "{\"step\":\"$step\"}" \
                    "$SESSION_ID" "$agent_id" "$task_name" 0 0 0.0 0 2>/dev/null || true
                return 1
            fi
        fi
    done
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Get model from config or use default
    local model="${RLM_AI_MODEL:-claude-sonnet-4}"
    
    # Log token usage
    if command -v log_token_usage &> /dev/null; then
        log_token_usage "$task_name" "$agent_id" "$model" "$total_input_tokens" "$total_output_tokens" "$duration"
        
        # Calculate cost
        local cost=$(calculate_cost "$model" "$total_input_tokens" "$total_output_tokens")
        
        # Display token usage
        echo "" >> "$log_file"
        echo "### Token Usage" >> "$log_file"
        echo "- Input Tokens: $total_input_tokens" >> "$log_file"
        echo "- Output Tokens: $total_output_tokens" >> "$log_file"
        echo "- Total Tokens: $((total_input_tokens + total_output_tokens))" >> "$log_file"
        echo "- Estimated Cost: \$$cost" >> "$log_file"
        
        print_success "All steps completed (Tokens: $((total_input_tokens + total_output_tokens)), Cost: \$$cost)"
        
        # Check budget
        check_budget 2>/dev/null || true
    else
        print_success "All steps completed"
    fi
}

# Function to update status.json
update_status() {
    local task_name="$1"
    local status="$2"
    local agent="$3"
    
    local status_file="$RLM_ROOT/progress/status.json"
    
    if [ -f "$status_file" ] && command -v jq &> /dev/null; then
        local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        
        jq --arg task "$task_name" \
           --arg status "$status" \
           --arg agent "$agent" \
           --arg time "$timestamp" \
           '.lastUpdate = $time | .tasks[$task] = {status: $status, agent: $agent, lastUpdate: $time}' \
           "$status_file" > "$status_file.tmp"
        
        mv "$status_file.tmp" "$status_file"
    fi
}

# Main execution
print_info "🚀 RLM Build - Automated AI Agent Implementation"
print_info "Mode: $MODE"
print_info "Session: $(format_session "$SESSION_ID" "Build Run")"

# Log session start
log_event "session_start" "RLM build session started" \
    "{\"mode\":\"$MODE\",\"parallel\":$PARALLEL,\"dry_run\":$DRY_RUN}" \
    "$SESSION_ID" "" "" 0 0 0.0 0 2>/dev/null || true

if [ "$DRY_RUN" = true ]; then
    print_warning "DRY RUN - No changes will be made"
fi

# Check prerequisites
check_prerequisites

# Get tasks to process
if [ -n "$TASK_ID" ]; then
    # Process specific task
    TASK_FILE="$RLM_ROOT/tasks/active/$TASK_ID.md"
    if [ ! -f "$TASK_FILE" ]; then
        print_error "Task not found: $TASK_ID"
        exit 1
    fi
    TASKS=("$TASK_FILE")
else
    # Process all active tasks
    mapfile -t TASKS < <(find "$RLM_ROOT/tasks/active" -type f -name "*.md" 2>/dev/null)
fi

if [ ${#TASKS[@]} -eq 0 ]; then
    print_info "No tasks to process"
    exit 0
fi

print_info "Found ${#TASKS[@]} task(s) to process"

# Process tasks
for task_file in "${TASKS[@]}"; do
    echo ""
    
    # Determine agent if not specified
    if [ -z "$AGENT" ]; then
        SELECTED_AGENT=$(determine_agent "$task_file")
    else
        SELECTED_AGENT="$AGENT"
    fi
    
    # Invoke agent
    invoke_agent "$SELECTED_AGENT" "$task_file" || {
        print_error "Task processing failed"
        continue
    }
    
    if [ "$PARALLEL" = false ]; then
        echo ""
        print_info "Task completed. Moving to next..."
    fi
done

echo ""
print_success "✓ Build operation complete"

# Log session end
log_event "session_end" "RLM build session completed" \
    "{\"tasks_processed\":${#TASKS[@]}}" \
    "$SESSION_ID" "" "" 0 0 0.0 0 2>/dev/null || true

# Show token usage summary
if command -v get_total_tokens &> /dev/null; then
    echo ""
    print_info "=== Token Usage Summary ==="
    local total_tokens=$(get_total_tokens)
    local total_cost=$(get_total_cost)
    local daily_tokens=$(get_daily_tokens)
    
    echo "  Session Tokens: $(printf "%'d" $total_tokens)"
    echo "  Total Cost: \$$total_cost"
    echo "  Today's Usage: $(printf "%'d" $daily_tokens)"
    echo ""
    print_info "View detailed token report: ./RLM/commands/utils/token-tracker.sh report"
fi

print_info "View progress: ./RLM/commands/rlm-report.sh summary"
print_info "View events: ./RLM/commands/rlm-observe.sh tail"

