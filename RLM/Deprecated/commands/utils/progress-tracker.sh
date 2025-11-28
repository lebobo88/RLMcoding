#!/bin/bash
# Progress Tracking Utilities for RLM

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RLM_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Update task status in status.json
update_task_status() {
    local task_id=$1
    local status=$2
    local agent=$3
    local tokens_input=${4:-0}
    local tokens_output=${5:-0}
    local cost=${6:-0}
    
    local status_file="$RLM_ROOT/progress/status.json"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local total_tokens=$((tokens_input + tokens_output))
    
    if [ -f "$status_file" ] && command -v jq &> /dev/null; then
        jq --arg task "$task_id" \
           --arg status "$status" \
           --arg agent "$agent" \
           --arg time "$timestamp" \
           --argjson input "$tokens_input" \
           --argjson output "$tokens_output" \
           --argjson total "$total_tokens" \
           --argjson cost "$cost" \
           '.lastUpdate = $time | .tasks[$task] = {
               status: $status,
               agent: $agent,
               lastUpdate: $time,
               tokens: {
                   input: $input,
                   output: $output,
                   total: $total,
                   cost: $cost
               }
           }' "$status_file" > "$status_file.tmp"
        mv "$status_file.tmp" "$status_file"
    fi
}

# Create progress log
create_progress_log() {
    local task_id=$1
    local agent=$2
    
    local log_file="$RLM_ROOT/progress/logs/$task_id.md"
    mkdir -p "$(dirname "$log_file")"
    
    cat > "$log_file" << EOF
# Task: $task_id

## Status: IN_PROGRESS
## Started: $(date -u +"%Y-%m-%d %H:%M UTC")
## Agent: $agent

### Progress Log
EOF
}

# Append to progress log
append_to_log() {
    local task_id=$1
    local message=$2
    
    local log_file="$RLM_ROOT/progress/logs/$task_id.md"
    echo "- [$(date -u +"%H:%M:%S")] $message" >> "$log_file"
}

# Complete progress log
complete_progress_log() {
    local task_id=$1
    
    local log_file="$RLM_ROOT/progress/logs/$task_id.md"
    cat >> "$log_file" << EOF

## Status: COMPLETED
## Completed: $(date -u +"%Y-%m-%d %H:%M UTC")
EOF
}

# Calculate velocity
calculate_velocity() {
    local days=${1:-7}
    
    # Count completed tasks in last N days
    local completed=$(find "$RLM_ROOT/tasks/completed" -type f -name "*.md" -mtime -$days 2>/dev/null | wc -l)
    
    # Calculate velocity (tasks per day)
    echo "scale=2; $completed / $days" | bc
}

# Get task counts
get_task_counts() {
    local total=$(find "$RLM_ROOT/tasks" -type f -name "*.md" 2>/dev/null | wc -l)
    local active=$(find "$RLM_ROOT/tasks/active" -type f -name "*.md" 2>/dev/null | wc -l)
    local completed=$(find "$RLM_ROOT/tasks/completed" -type f -name "*.md" 2>/dev/null | wc -l)
    local blocked=$(find "$RLM_ROOT/tasks/blocked" -type f -name "*.md" 2>/dev/null | wc -l)
    
    echo "$total $active $completed $blocked"
}

# Update metrics
update_metrics() {
    local metrics_file="$RLM_ROOT/progress/metrics.json"
    
    read -r total active completed blocked <<< $(get_task_counts)
    local velocity=$(calculate_velocity 7)
    
    if command -v jq &> /dev/null; then
        jq --arg total "$total" \
           --arg completed "$completed" \
           --arg active "$active" \
           --arg blocked "$blocked" \
           --arg velocity "$velocity" \
           '.overview.totalTasks = ($total | tonumber) |
            .overview.completedTasks = ($completed | tonumber) |
            .overview.velocity = ($velocity | tonumber)' \
           "$metrics_file" > "$metrics_file.tmp"
        mv "$metrics_file.tmp" "$metrics_file"
    fi
}

# Get token usage for task
get_task_token_usage() {
    local task_id=$1
    local status_file="$RLM_ROOT/progress/status.json"
    
    if [ -f "$status_file" ] && command -v jq &> /dev/null; then
        jq -r --arg task "$task_id" '.tasks[$task].tokens.total // 0' "$status_file"
    else
        echo "0"
    fi
}

# Get token cost for task
get_task_token_cost() {
    local task_id=$1
    local status_file="$RLM_ROOT/progress/status.json"
    
    if [ -f "$status_file" ] && command -v jq &> /dev/null; then
        jq -r --arg task "$task_id" '.tasks[$task].tokens.cost // 0' "$status_file"
    else
        echo "0.00"
    fi
}

# Export functions if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    export -f update_task_status
    export -f create_progress_log
    export -f append_to_log
    export -f complete_progress_log
    export -f calculate_velocity
    export -f get_task_counts
    export -f update_metrics
    export -f get_task_token_usage
    export -f get_task_token_cost
fi

