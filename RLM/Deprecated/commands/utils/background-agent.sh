#!/bin/bash
# Background Agent Execution for RLM
# Allows autonomous task execution out-of-loop

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RLM_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Source observability utilities
source "$SCRIPT_DIR/event-logger.sh" 2>/dev/null || true
source "$SCRIPT_DIR/session-colors.sh" 2>/dev/null || true

# Background execution directory
BACKGROUND_DIR="$RLM_ROOT/progress/background"
mkdir -p "$BACKGROUND_DIR/active" "$BACKGROUND_DIR/completed"

#######################
# BACKGROUND EXECUTION
#######################

# Start a background agent task
start_background_agent() {
    local agent_id=$1
    local task_id=$2
    local mode=${3:-auto}
    
    local session_id="bg-$(date +%s)-$$"
    local log_file="$BACKGROUND_DIR/active/${session_id}.log"
    local status_file="$BACKGROUND_DIR/active/${session_id}.status"
    
    print_info "Starting background agent: $agent_id for $task_id"
    print_info "Session: $(format_session "$session_id" "Background Agent")"
    
    # Log background agent start
    log_event "task_start" "Background agent started: $agent_id for $task_id" \
        "{\"agent\":\"$agent_id\",\"task\":\"$task_id\",\"mode\":\"$mode\"}" \
        "$session_id" "$agent_id" "$task_id" 0 0 0.0 0 2>/dev/null || true
    
    # Create status file
    cat > "$status_file" << EOF
{
  "sessionId": "$session_id",
  "agent": "$agent_id",
  "task": "$task_id",
  "mode": "$mode",
  "status": "running",
  "startTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "pid": "$$"
}
EOF
    
    # Execute agent in background
    (
        # Source utilities
        source "$SCRIPT_DIR/token-tracker.sh" 2>/dev/null || true
        source "$SCRIPT_DIR/progress-tracker.sh" 2>/dev/null || true
        source "$SCRIPT_DIR/context-manager.sh" 2>/dev/null || true
        
        # Prepare isolated context
        local context_file=$(prepare_agent_context "$agent_id" "$task_id" 2>/dev/null)
        
        # Log start
        echo "=== Background Agent Execution ===" > "$log_file"
        echo "Agent: $agent_id" >> "$log_file"
        echo "Task: $task_id" >> "$log_file"
        echo "Mode: $mode" >> "$log_file"
        echo "Started: $(date -u)" >> "$log_file"
        echo "" >> "$log_file"
        
        # Execute the actual agent work
        # In a real implementation, this would invoke the AI model
        # For now, we simulate the work
        echo "Executing agent workflow..." >> "$log_file"
        
        local bg_start_time=$(date +%s%3N 2>/dev/null || date +%s)
        
        # Simulate work steps
        local steps=("Analyzing task" "Generating plan" "Executing work" "Validating results")
        for step in "${steps[@]}"; do
            echo "- [x] $step" >> "$log_file"
            log_event "tool_use" "$step" \
                "{\"step\":\"$step\"}" \
                "$session_id" "$agent_id" "$task_id" 0 0 0.0 0 2>/dev/null || true
            sleep 0.5
        done
        
        local bg_end_time=$(date +%s%3N 2>/dev/null || date +%s)
        local bg_duration=$((bg_end_time - bg_start_time))
        [ $bg_duration -lt 0 ] && bg_duration=0
        
        # Update status
        local end_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        
        if command -v jq &> /dev/null; then
            jq --arg status "completed" \
               --arg endTime "$end_time" \
               '.status = $status | .endTime = $endTime' \
               "$status_file" > "$status_file.tmp"
            mv "$status_file.tmp" "$status_file"
        fi
        
        # Log task completion
        log_event "task_complete" "Background agent completed: $agent_id for $task_id" \
            "{\"duration_ms\":$bg_duration}" \
            "$session_id" "$agent_id" "$task_id" 0 0 0.0 "$bg_duration" 2>/dev/null || true
        
        # Move to completed
        mv "$status_file" "$BACKGROUND_DIR/completed/"
        mv "$log_file" "$BACKGROUND_DIR/completed/"
        
        # Clean up context
        cleanup_agent_context "$agent_id" "$task_id" 2>/dev/null || true
        
        # Create completion marker
        echo "COMPLETED" > "$BACKGROUND_DIR/completed/${session_id}.done"
        
    ) &
    
    local bg_pid=$!
    
    print_success "Background agent started (PID: $bg_pid)"
    echo "$session_id"
}

# Check background agent status
check_background_status() {
    local session_id=$1
    
    local active_status="$BACKGROUND_DIR/active/${session_id}.status"
    local completed_status="$BACKGROUND_DIR/completed/${session_id}.status"
    
    if [ -f "$active_status" ]; then
        print_info "Status: Running"
        if command -v jq &> /dev/null; then
            jq '.' "$active_status"
        else
            cat "$active_status"
        fi
    elif [ -f "$completed_status" ]; then
        print_success "Status: Completed"
        if command -v jq &> /dev/null; then
            jq '.' "$completed_status"
        else
            cat "$completed_status"
        fi
    else
        print_error "Session not found: $session_id"
        return 1
    fi
}

# List background agents
list_background_agents() {
    print_info "Active Background Agents:"
    
    if [ -d "$BACKGROUND_DIR/active" ]; then
        local count=$(find "$BACKGROUND_DIR/active" -name "*.status" 2>/dev/null | wc -l)
        if [ $count -eq 0 ]; then
            echo "  None"
        else
            find "$BACKGROUND_DIR/active" -name "*.status" | while read -r status_file; do
                local session=$(basename "$status_file" .status)
                if command -v jq &> /dev/null; then
                    local agent=$(jq -r '.agent' "$status_file" 2>/dev/null)
                    local task=$(jq -r '.task' "$status_file" 2>/dev/null)
                    local start=$(jq -r '.startTime' "$status_file" 2>/dev/null)
                    echo "  - $session: $agent on $task (Started: $start)"
                else
                    echo "  - $session"
                fi
            done
        fi
    fi
    
    echo ""
    print_info "Completed Background Agents:"
    
    if [ -d "$BACKGROUND_DIR/completed" ]; then
        local count=$(find "$BACKGROUND_DIR/completed" -name "*.status" 2>/dev/null | wc -l)
        if [ $count -eq 0 ]; then
            echo "  None"
        else
            find "$BACKGROUND_DIR/completed" -name "*.status" | head -10 | while read -r status_file; do
                local session=$(basename "$status_file" .status)
                if command -v jq &> /dev/null; then
                    local agent=$(jq -r '.agent' "$status_file" 2>/dev/null)
                    local task=$(jq -r '.task' "$status_file" 2>/dev/null)
                    echo "  - $session: $agent on $task"
                else
                    echo "  - $session"
                fi
            done
        fi
    fi
}

# Get background agent log
get_background_log() {
    local session_id=$1
    
    local active_log="$BACKGROUND_DIR/active/${session_id}.log"
    local completed_log="$BACKGROUND_DIR/completed/${session_id}.log"
    
    if [ -f "$active_log" ]; then
        print_info "Log (Running):"
        cat "$active_log"
    elif [ -f "$completed_log" ]; then
        print_info "Log (Completed):"
        cat "$completed_log"
    else
        print_error "Log not found for session: $session_id"
        return 1
    fi
}

# Wait for background agent completion
wait_for_completion() {
    local session_id=$1
    local timeout=${2:-3600}  # Default 1 hour
    
    print_info "Waiting for completion: $session_id (timeout: ${timeout}s)"
    
    local elapsed=0
    while [ $elapsed -lt $timeout ]; do
        if [ -f "$BACKGROUND_DIR/completed/${session_id}.done" ]; then
            print_success "Agent completed!"
            return 0
        fi
        
        sleep 5
        elapsed=$((elapsed + 5))
        
        # Show progress every 30 seconds
        if [ $((elapsed % 30)) -eq 0 ]; then
            print_info "Still running... (${elapsed}s elapsed)"
        fi
    done
    
    print_error "Timeout reached"
    return 1
}

# Stop background agent
stop_background_agent() {
    local session_id=$1
    
    local status_file="$BACKGROUND_DIR/active/${session_id}.status"
    
    if [ ! -f "$status_file" ]; then
        print_error "Agent not running or not found: $session_id"
        return 1
    fi
    
    if command -v jq &> /dev/null; then
        local pid=$(jq -r '.pid' "$status_file" 2>/dev/null)
        if [ -n "$pid" ] && [ "$pid" != "null" ]; then
            print_info "Stopping agent (PID: $pid)..."
            kill "$pid" 2>/dev/null || true
            print_success "Agent stopped"
        fi
    fi
}

# Clean up old completed agents
cleanup_completed() {
    local days=${1:-30}
    
    print_info "Cleaning up completed agents older than $days days..."
    
    local count=$(find "$BACKGROUND_DIR/completed" -name "*.status" -mtime +$days 2>/dev/null | wc -l)
    
    if [ $count -gt 0 ]; then
        find "$BACKGROUND_DIR/completed" -name "*" -mtime +$days -delete 2>/dev/null
        print_success "Cleaned up $count old background agents"
    else
        print_info "No old agents to clean up"
    fi
}

#######################
# QUICK PLAN EXECUTION
#######################

# Execute a quick plan in background
execute_quick_plan() {
    local plan_name=$1
    local plan_file="$RLM_ROOT/templates/plans/${plan_name}.md"
    
    if [ ! -f "$plan_file" ]; then
        print_error "Plan not found: $plan_name"
        return 1
    fi
    
    local session_id="plan-$(date +%s)"
    
    print_info "Executing quick plan: $plan_name"
    print_info "Session ID: $session_id"
    
    # Start background execution
    (
        local log_file="$BACKGROUND_DIR/active/${session_id}.log"
        
        echo "=== Quick Plan Execution ===" > "$log_file"
        echo "Plan: $plan_name" >> "$log_file"
        echo "Started: $(date -u)" >> "$log_file"
        echo "" >> "$log_file"
        
        # Execute plan steps
        cat "$plan_file" >> "$log_file"
        
        # Simulate execution
        sleep 2
        
        echo "" >> "$log_file"
        echo "Completed: $(date -u)" >> "$log_file"
        
        # Move to completed
        mv "$log_file" "$BACKGROUND_DIR/completed/"
        echo "COMPLETED" > "$BACKGROUND_DIR/completed/${session_id}.done"
        
    ) &
    
    print_success "Plan started in background"
    echo "$session_id"
}

#######################
# COMMAND INTERFACE
#######################

# Export functions if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    export -f start_background_agent
    export -f check_background_status
    export -f list_background_agents
    export -f get_background_log
    export -f wait_for_completion
    export -f stop_background_agent
    export -f cleanup_completed
    export -f execute_quick_plan
fi

# CLI interface
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    case "${1:-help}" in
        start)
            start_background_agent "$2" "$3" "${4:-auto}"
            ;;
        status)
            check_background_status "$2"
            ;;
        list)
            list_background_agents
            ;;
        log)
            get_background_log "$2"
            ;;
        wait)
            wait_for_completion "$2" "${3:-3600}"
            ;;
        stop)
            stop_background_agent "$2"
            ;;
        cleanup)
            cleanup_completed "${2:-30}"
            ;;
        plan)
            execute_quick_plan "$2"
            ;;
        *)
            cat << EOF
RLM Background Agent Executor
=============================

Usage: $0 <command> [options]

Commands:
  start <agent> <task> [mode]   Start background agent
  status <session-id>            Check agent status
  list                           List all background agents
  log <session-id>               View agent log
  wait <session-id> [timeout]    Wait for completion
  stop <session-id>              Stop running agent
  cleanup [days]                 Clean old completed agents
  plan <plan-name>               Execute quick plan

Examples:
  $0 start implementation-agent TASK-001 auto
  $0 list
  $0 status bg-1234567890-12345
  $0 wait bg-1234567890-12345 600
  $0 cleanup 30

Benefits:
  - Run agents without occupying your terminal
  - Execute multiple agents simultaneously
  - No human-in-the-loop bottleneck
  - Agents report via file I/O

EOF
            ;;
    esac
fi

