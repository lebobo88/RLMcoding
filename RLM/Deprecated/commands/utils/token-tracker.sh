#!/bin/bash
# Token Tracking Utilities for RLM AI Agent System

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

# Token cost per 1K tokens (configurable via config)
declare -A TOKEN_COSTS
TOKEN_COSTS["claude-sonnet-4-input"]=0.003
TOKEN_COSTS["claude-sonnet-4-output"]=0.015
TOKEN_COSTS["gpt-4-input"]=0.03
TOKEN_COSTS["gpt-4-output"]=0.06
TOKEN_COSTS["gemini-pro-input"]=0.00125
TOKEN_COSTS["gemini-pro-output"]=0.00375

# Load token costs from config if available
load_token_costs() {
    local config_file="$RLM_ROOT/config/project-config.json"
    
    if [ -f "$config_file" ] && command -v jq &> /dev/null; then
        # Load custom costs from config
        while IFS="=" read -r key value; do
            TOKEN_COSTS["$key"]="$value"
        done < <(jq -r '.tokenTracking.costPerToken | to_entries | .[] | "\(.key)=\(.value)"' "$config_file" 2>/dev/null)
    fi
}

# Calculate cost for tokens
calculate_cost() {
    local model=$1
    local input_tokens=$2
    local output_tokens=$3
    
    local input_cost=$(echo "scale=6; $input_tokens * ${TOKEN_COSTS[\"$model-input\"]} / 1000" | bc 2>/dev/null || echo "0")
    local output_cost=$(echo "scale=6; $output_tokens * ${TOKEN_COSTS[\"$model-output\"]} / 1000" | bc 2>/dev/null || echo "0")
    local total_cost=$(echo "scale=6; $input_cost + $output_cost" | bc 2>/dev/null || echo "0")
    
    echo "$total_cost"
}

# Log token usage
log_token_usage() {
    local task_id=$1
    local agent=$2
    local model=$3
    local input_tokens=$4
    local output_tokens=$5
    local duration=$6
    
    local total_tokens=$((input_tokens + output_tokens))
    local cost=$(calculate_cost "$model" "$input_tokens" "$output_tokens")
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local date_key=$(date -u +"%Y-%m-%d")
    
    # Create log entry
    local log_file="$RLM_ROOT/progress/token-usage.log"
    mkdir -p "$(dirname "$log_file")"
    
    # Append to log file
    cat >> "$log_file" << EOF
{
  "timestamp": "$timestamp",
  "date": "$date_key",
  "task": "$task_id",
  "agent": "$agent",
  "model": "$model",
  "tokens": {
    "input": $input_tokens,
    "output": $output_tokens,
    "total": $total_tokens
  },
  "cost": $cost,
  "duration": $duration
}
EOF
    
    # Update metrics.json
    update_token_metrics "$task_id" "$agent" "$model" "$input_tokens" "$output_tokens" "$cost" "$date_key"
}

# Update token metrics in metrics.json
update_token_metrics() {
    local task_id=$1
    local agent=$2
    local model=$3
    local input_tokens=$4
    local output_tokens=$5
    local cost=$6
    local date_key=$7
    
    local metrics_file="$RLM_ROOT/progress/metrics.json"
    
    if [ ! -f "$metrics_file" ] || ! command -v jq &> /dev/null; then
        return
    fi
    
    local total_tokens=$((input_tokens + output_tokens))
    
    # Update metrics using jq
    jq --arg agent "$agent" \
       --arg task "$task_id" \
       --arg date "$date_key" \
       --argjson input "$input_tokens" \
       --argjson output "$output_tokens" \
       --argjson total "$total_tokens" \
       --argjson cost "$cost" \
       '
       # Update agent-specific metrics
       .agents[$agent].tokensUsed.input += $input |
       .agents[$agent].tokensUsed.output += $output |
       .agents[$agent].tokensUsed.total += $total |
       .agents[$agent].tokensUsed.cost += $cost |
       
       # Update overall token usage
       .tokenUsage.input += $input |
       .tokenUsage.output += $output |
       .tokenUsage.total += $total |
       .tokenUsage.totalCost += $cost |
       
       # Update daily usage
       .tokenUsage.dailyUsage[$date] = (.tokenUsage.dailyUsage[$date] // 0) + $total |
       
       # Update by agent
       .tokenUsage.byAgent[$agent] = (.tokenUsage.byAgent[$agent] // 0) + $total |
       
       # Update by task
       .tokenUsage.byTask[$task] = (.tokenUsage.byTask[$task] // 0) + $total
       ' "$metrics_file" > "$metrics_file.tmp"
    
    mv "$metrics_file.tmp" "$metrics_file"
}

# Get total token usage
get_total_tokens() {
    local metrics_file="$RLM_ROOT/progress/metrics.json"
    
    if [ -f "$metrics_file" ] && command -v jq &> /dev/null; then
        jq -r '.tokenUsage.total // 0' "$metrics_file"
    else
        echo "0"
    fi
}

# Get total cost
get_total_cost() {
    local metrics_file="$RLM_ROOT/progress/metrics.json"
    
    if [ -f "$metrics_file" ] && command -v jq &> /dev/null; then
        jq -r '.tokenUsage.totalCost // 0' "$metrics_file"
    else
        echo "0.00"
    fi
}

# Get daily token usage
get_daily_tokens() {
    local date_key=$(date -u +"%Y-%m-%d")
    local metrics_file="$RLM_ROOT/progress/metrics.json"
    
    if [ -f "$metrics_file" ] && command -v jq &> /dev/null; then
        jq -r --arg date "$date_key" '.tokenUsage.dailyUsage[$date] // 0' "$metrics_file"
    else
        echo "0"
    fi
}

# Check budget and alert if needed
check_budget() {
    local daily_tokens=$(get_daily_tokens)
    local config_file="$RLM_ROOT/config/project-config.json"
    
    if [ ! -f "$config_file" ] || ! command -v jq &> /dev/null; then
        return 0
    fi
    
    local daily_budget=$(jq -r '.tokenTracking.budgetDaily // 5000000' "$config_file")
    local alert_threshold=$(jq -r '.tokenTracking.alertThreshold // 1000000' "$config_file")
    
    # Check if approaching threshold
    if [ "$daily_tokens" -gt "$alert_threshold" ]; then
        local percentage=$((daily_tokens * 100 / daily_budget))
        print_warning "Token usage at ${percentage}% of daily budget ($daily_tokens / $daily_budget)"
    fi
    
    # Check if over budget
    if [ "$daily_tokens" -gt "$daily_budget" ]; then
        print_error "Daily token budget exceeded! ($daily_tokens / $daily_budget)"
        return 1
    fi
    
    return 0
}

# Generate token usage report
generate_token_report() {
    local period=${1:-"all"}  # all, today, week, month
    local metrics_file="$RLM_ROOT/progress/metrics.json"
    
    if [ ! -f "$metrics_file" ] || ! command -v jq &> /dev/null; then
        print_error "Metrics file not found or jq not installed"
        return 1
    fi
    
    echo ""
    print_info "=== Token Usage Report ==="
    echo ""
    
    # Overall statistics
    local total_tokens=$(jq -r '.tokenUsage.total // 0' "$metrics_file")
    local total_cost=$(jq -r '.tokenUsage.totalCost // 0' "$metrics_file")
    local input_tokens=$(jq -r '.tokenUsage.input // 0' "$metrics_file")
    local output_tokens=$(jq -r '.tokenUsage.output // 0' "$metrics_file")
    
    echo "Overall Usage:"
    echo "  Total Tokens: $(printf "%'d" $total_tokens)"
    echo "  Input Tokens: $(printf "%'d" $input_tokens)"
    echo "  Output Tokens: $(printf "%'d" $output_tokens)"
    echo "  Total Cost: \$$total_cost"
    echo ""
    
    # Usage by agent
    echo "Usage by Agent:"
    jq -r '.tokenUsage.byAgent | to_entries | .[] | "  \(.key): \(.value | tonumber | floor) tokens"' "$metrics_file"
    echo ""
    
    # Daily usage (last 7 days)
    echo "Daily Usage (Last 7 Days):"
    jq -r '.tokenUsage.dailyUsage | to_entries | sort_by(.key) | reverse | limit(7; .[]) | "  \(.key): \(.value | tonumber | floor) tokens"' "$metrics_file"
    echo ""
    
    # Budget status
    local daily_tokens=$(get_daily_tokens)
    local config_file="$RLM_ROOT/config/project-config.json"
    
    if [ -f "$config_file" ]; then
        local daily_budget=$(jq -r '.tokenTracking.budgetDaily // 5000000' "$config_file")
        local daily_remaining=$((daily_budget - daily_tokens))
        local daily_percentage=$((daily_tokens * 100 / daily_budget))
        
        echo "Budget Status:"
        echo "  Daily Used: $(printf "%'d" $daily_tokens) / $(printf "%'d" $daily_budget) (${daily_percentage}%)"
        echo "  Daily Remaining: $(printf "%'d" $daily_remaining)"
        echo ""
    fi
    
    # Cost breakdown by agent
    echo "Cost by Agent:"
    jq -r '.agents | to_entries | .[] | select(.value.tokensUsed.cost > 0) | "  \(.key): $\(.value.tokensUsed.cost)"' "$metrics_file"
    echo ""
}

# Estimate tokens for task
estimate_task_tokens() {
    local task_complexity=${1:-"medium"}  # simple, medium, complex
    
    case "$task_complexity" in
        simple)
            echo "50000"  # ~50k tokens
            ;;
        medium)
            echo "200000"  # ~200k tokens
            ;;
        complex)
            echo "500000"  # ~500k tokens
            ;;
        *)
            echo "200000"  # default to medium
            ;;
    esac
}

# Optimize token usage suggestions
suggest_optimizations() {
    local metrics_file="$RLM_ROOT/progress/metrics.json"
    
    if [ ! -f "$metrics_file" ] || ! command -v jq &> /dev/null; then
        return
    fi
    
    echo ""
    print_info "=== Token Optimization Suggestions ==="
    echo ""
    
    # Calculate average tokens per task
    local total_tokens=$(jq -r '.tokenUsage.total // 0' "$metrics_file")
    local total_tasks=$(jq -r '.overview.completedTasks // 1' "$metrics_file")
    
    if [ "$total_tasks" -gt 0 ]; then
        local avg_per_task=$((total_tokens / total_tasks))
        echo "Average tokens per task: $(printf "%'d" $avg_per_task)"
        
        if [ "$avg_per_task" -gt 300000 ]; then
            echo "  💡 Consider breaking down complex tasks into smaller subtasks"
        fi
    fi
    
    # Check for high-cost agents
    echo ""
    echo "Agent Efficiency:"
    jq -r '.agents | to_entries | .[] | 
        select(.value.tasksCompleted > 0) | 
        "\(.key): \((.value.tokensUsed.total / .value.tasksCompleted) | floor) tokens/task"' \
        "$metrics_file" | while read line; do
        echo "  $line"
    done
    
    echo ""
    echo "Optimization Tips:"
    echo "  1. Use 'auto' mode for simple, repetitive tasks"
    echo "  2. Provide clear, concise specifications"
    echo "  3. Reuse successful patterns and templates"
    echo "  4. Consider using smaller models for testing"
    echo "  5. Review and refine agent prompts regularly"
    echo ""
}

# Reset daily counters (run at midnight)
reset_daily_counters() {
    local metrics_file="$RLM_ROOT/progress/metrics.json"
    
    if [ -f "$metrics_file" ] && command -v jq &> /dev/null; then
        # Archive current day's data
        local yesterday=$(date -u -d "yesterday" +"%Y-%m-%d" 2>/dev/null || date -u -v-1d +"%Y-%m-%d")
        local daily_tokens=$(jq -r --arg date "$yesterday" '.tokenUsage.dailyUsage[$date] // 0' "$metrics_file")
        
        print_info "Daily reset complete. Yesterday's usage: $daily_tokens tokens"
    fi
}

# Export token usage to CSV
export_token_csv() {
    local output_file=${1:-"token-usage-export.csv"}
    local log_file="$RLM_ROOT/progress/token-usage.log"
    
    if [ ! -f "$log_file" ]; then
        print_error "No token usage log found"
        return 1
    fi
    
    echo "timestamp,date,task,agent,model,input_tokens,output_tokens,total_tokens,cost,duration" > "$output_file"
    
    # Parse JSON log and export to CSV
    jq -r '[.timestamp, .date, .task, .agent, .model, .tokens.input, .tokens.output, .tokens.total, .cost, .duration] | @csv' \
        "$log_file" >> "$output_file" 2>/dev/null
    
    print_success "Exported token usage to: $output_file"
}

# Initialize token tracking
init_token_tracking() {
    load_token_costs
    
    # Ensure log file exists
    local log_file="$RLM_ROOT/progress/token-usage.log"
    mkdir -p "$(dirname "$log_file")"
    
    if [ ! -f "$log_file" ]; then
        echo "[]" > "$log_file"
    fi
    
    print_success "Token tracking initialized"
}

# Export functions if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    export -f load_token_costs
    export -f calculate_cost
    export -f log_token_usage
    export -f update_token_metrics
    export -f get_total_tokens
    export -f get_total_cost
    export -f get_daily_tokens
    export -f check_budget
    export -f generate_token_report
    export -f estimate_task_tokens
    export -f suggest_optimizations
    export -f reset_daily_counters
    export -f export_token_csv
    export -f init_token_tracking
fi

# If run directly, show usage
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    case "${1:-help}" in
        report)
            generate_token_report "${2:-all}"
            ;;
        check)
            check_budget
            ;;
        optimize)
            suggest_optimizations
            ;;
        export)
            export_token_csv "${2:-token-usage-export.csv}"
            ;;
        init)
            init_token_tracking
            ;;
        *)
            echo "RLM Token Tracker"
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  report [period]  - Generate token usage report"
            echo "  check            - Check budget status"
            echo "  optimize         - Show optimization suggestions"
            echo "  export [file]    - Export usage to CSV"
            echo "  init             - Initialize token tracking"
            echo ""
            ;;
    esac
fi

