#!/bin/bash
# RLM Report Script - Generate Progress Reports
# Usage: ./rlm-report.sh [FORMAT] [OPTIONS]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
FORMAT="summary"
OUTPUT=""
SINCE=""
TEAM=""
EMAIL=""

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RLM_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$RLM_ROOT")"

# Source utilities
source "$SCRIPT_DIR/utils/token-tracker.sh" 2>/dev/null || true

# Print colored output
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_header() { echo -e "${CYAN}$1${NC}"; }

# Display usage
usage() {
    cat << EOF
RLM Report - Generate Progress Reports

Usage: ./rlm-report.sh [FORMAT] [OPTIONS]

Formats:
    summary         High-level overview (default)
    detailed        Full progress with task breakdowns
    metrics         Quantitative metrics and charts
    issues          Focus on blockers and issues
    json            Machine-readable JSON format

Options:
    --output <file>
        Write to file instead of stdout
    
    --since <date>
        Report on changes since date (e.g., "7 days ago", "2024-01-01")
    
    --team <name>
        Filter by team/agent
    
    --email <address>
        Email report to address
    
    -h, --help
        Display this help message

Examples:
    ./rlm-report.sh summary
    ./rlm-report.sh detailed --since "7 days ago"
    ./rlm-report.sh json --output report.json
    ./rlm-report.sh metrics --email pm@company.com

EOF
}

# Parse command line arguments
if [[ $# -gt 0 ]] && [[ ! "$1" =~ ^-- ]]; then
    FORMAT="$1"
    shift
fi

while [[ $# -gt 0 ]]; do
    case $1 in
        --output)
            OUTPUT="$2"
            shift 2
            ;;
        --since)
            SINCE="$2"
            shift 2
            ;;
        --team)
            TEAM="$2"
            shift 2
            ;;
        --email)
            EMAIL="$2"
            shift 2
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

# Validate format
if [[ ! "$FORMAT" =~ ^(summary|detailed|metrics|issues|json)$ ]]; then
    print_error "Invalid format: $FORMAT"
    usage
    exit 1
fi

# Change to project root
cd "$PROJECT_ROOT"

# Load status data
load_status_data() {
    local status_file="$RLM_ROOT/progress/status.json"
    
    if [ -f "$status_file" ] && command -v jq &> /dev/null; then
        STATUS_DATA=$(cat "$status_file")
    else
        STATUS_DATA='{}'
    fi
}

# Count tasks by status
count_tasks() {
    local total=$(find "$RLM_ROOT/tasks" -type f -name "*.md" 2>/dev/null | wc -l)
    local active=$(find "$RLM_ROOT/tasks/active" -type f -name "*.md" 2>/dev/null | wc -l)
    local completed=$(find "$RLM_ROOT/tasks/completed" -type f -name "*.md" 2>/dev/null | wc -l)
    local blocked=$(find "$RLM_ROOT/tasks/blocked" -type f -name "*.md" 2>/dev/null | wc -l)
    
    echo "$total $active $completed $blocked"
}

# Count issues
count_issues() {
    local open=$(find "$RLM_ROOT/issues/open" -type f -name "*.md" 2>/dev/null | wc -l)
    local resolved=$(find "$RLM_ROOT/issues/resolved" -type f -name "*.md" 2>/dev/null | wc -l)
    
    echo "$open $resolved"
}

# Generate summary report
generate_summary() {
    print_header "📊 RLM Progress Report"
    echo "Generated: $(date -u +"%Y-%m-%d %H:%M UTC")"
    echo ""
    
    # Task statistics
    read -r total active completed blocked <<< $(count_tasks)
    local pending=$((active))
    
    if [ $total -gt 0 ]; then
        local completion_pct=$((completed * 100 / total))
    else
        local completion_pct=0
    fi
    
    print_header "📈 Progress"
    echo "  Total Tasks: $total"
    echo "  Completed: $completed ($completion_pct%)"
    echo "  In Progress: $active"
    echo "  Blocked: $blocked"
    echo ""
    
    # Issues
    read -r open_issues resolved_issues <<< $(count_issues)
    
    if [ $open_issues -gt 0 ]; then
        print_header "🔴 Blockers ($open_issues)"
        find "$RLM_ROOT/issues/open" -type f -name "*.md" 2>/dev/null | while read -r issue_file; do
            local issue_name=$(basename "$issue_file" .md)
            local issue_title=$(grep "^#" "$issue_file" | head -1 | sed 's/^# //')
            echo "  - $issue_name: $issue_title"
        done
        echo ""
    fi
    
    # Recently completed
    print_header "✅ Recently Completed"
    find "$RLM_ROOT/tasks/completed" -type f -name "*.md" -mtime -7 2>/dev/null | head -5 | while read -r task_file; do
        local task_name=$(basename "$task_file" .md)
        local task_title=$(grep "^# Task:" "$task_file" | head -1 | sed 's/^# Task: //')
        echo "  - $task_name: $task_title"
    done
    
    if [ $(find "$RLM_ROOT/tasks/completed" -type f -name "*.md" -mtime -7 2>/dev/null | wc -l) -eq 0 ]; then
        echo "  (No tasks completed recently)"
    fi
    echo ""
    
    # Next up
    print_header "📋 Next Up"
    find "$RLM_ROOT/tasks/active" -type f -name "*.md" 2>/dev/null | head -3 | while read -r task_file; do
        local task_name=$(basename "$task_file" .md)
        local task_title=$(grep "^# Task:" "$task_file" | head -1 | sed 's/^# Task: //')
        echo "  - $task_name: $task_title"
    done
    
    if [ $active -eq 0 ]; then
        echo "  (No active tasks)"
    fi
    echo ""
    
    # Token usage summary
    if command -v get_total_tokens &> /dev/null; then
        print_header "💰 Token Usage"
        local total_tokens=$(get_total_tokens)
        local total_cost=$(get_total_cost)
        local daily_tokens=$(get_daily_tokens)
        
        echo "  Total Tokens Used: $(printf "%'d" $total_tokens)"
        echo "  Total Cost: \$$total_cost"
        echo "  Today's Usage: $(printf "%'d" $daily_tokens) tokens"
        
        # Show budget status if configured
        if [ -f "$RLM_ROOT/config/project-config.json" ] && command -v jq &> /dev/null; then
            local daily_budget=$(jq -r '.tokenTracking.budgetDaily // 0' "$RLM_ROOT/config/project-config.json")
            if [ "$daily_budget" -gt 0 ]; then
                local remaining=$((daily_budget - daily_tokens))
                local percentage=$((daily_tokens * 100 / daily_budget))
                echo "  Daily Budget: $(printf "%'d" $daily_tokens) / $(printf "%'d" $daily_budget) (${percentage}%)"
                echo "  Remaining Today: $(printf "%'d" $remaining) tokens"
            fi
        fi
    fi
}

# Generate detailed report
generate_detailed() {
    generate_summary
    echo ""
    print_header "📝 Detailed Task Breakdown"
    echo ""
    
    # Active tasks
    if [ -d "$RLM_ROOT/tasks/active" ]; then
        print_header "Active Tasks:"
        find "$RLM_ROOT/tasks/active" -type f -name "*.md" 2>/dev/null | while read -r task_file; do
            echo ""
            echo "---"
            head -20 "$task_file"
        done
    fi
}

# Generate metrics report
generate_metrics() {
    print_header "📊 RLM Metrics Report"
    echo "Generated: $(date -u +"%Y-%m-%d %H:%M UTC")"
    echo ""
    
    # Task statistics
    read -r total active completed blocked <<< $(count_tasks)
    
    print_header "Task Metrics:"
    echo "  Total: $total"
    echo "  Completed: $completed"
    echo "  Active: $active"
    echo "  Blocked: $blocked"
    echo "  Completion Rate: $((completed * 100 / (total > 0 ? total : 1)))%"
    echo ""
    
    # Token usage metrics
    if command -v generate_token_report &> /dev/null; then
        generate_token_report
    elif [ -f "$RLM_ROOT/progress/metrics.json" ] && command -v jq &> /dev/null; then
        print_header "Token Usage Metrics:"
        
        local total_tokens=$(jq -r '.tokenUsage.total // 0' "$RLM_ROOT/progress/metrics.json")
        local total_cost=$(jq -r '.tokenUsage.totalCost // 0' "$RLM_ROOT/progress/metrics.json")
        local avg_per_task=$(jq -r '.tokenUsage.averagePerTask // 0' "$RLM_ROOT/progress/metrics.json")
        
        echo "  Total Tokens: $(printf "%'d" $total_tokens)"
        echo "  Total Cost: \$$total_cost"
        echo "  Average per Task: $(printf "%'d" $avg_per_task) tokens"
        echo ""
        
        print_header "Token Usage by Agent:"
        jq -r '.tokenUsage.byAgent | to_entries | .[] | "  \(.key): \(.value | tonumber | floor) tokens"' \
            "$RLM_ROOT/progress/metrics.json" 2>/dev/null || echo "  No data available"
        echo ""
    else
        echo "Metrics tracking not yet available"
        echo ""
    fi
    
    # Optimization suggestions
    if command -v suggest_optimizations &> /dev/null; then
        suggest_optimizations
    fi
}

# Generate issues report
generate_issues() {
    print_header "🔴 RLM Issues Report"
    echo "Generated: $(date -u +"%Y-%m-%d %H:%M UTC")"
    echo ""
    
    read -r open_issues resolved_issues <<< $(count_issues)
    
    print_header "Open Issues: $open_issues"
    echo ""
    
    if [ $open_issues -gt 0 ]; then
        find "$RLM_ROOT/issues/open" -type f -name "*.md" 2>/dev/null | while read -r issue_file; do
            echo "---"
            cat "$issue_file"
            echo ""
        done
    else
        echo "No open issues! 🎉"
    fi
}

# Generate JSON report
generate_json() {
    read -r total active completed blocked <<< $(count_tasks)
    read -r open_issues resolved_issues <<< $(count_issues)
    
    local total_tokens=0
    local total_cost=0
    local daily_tokens=0
    
    if command -v get_total_tokens &> /dev/null; then
        total_tokens=$(get_total_tokens)
        total_cost=$(get_total_cost)
        daily_tokens=$(get_daily_tokens)
    fi
    
    cat << EOF
{
  "generated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "tasks": {
    "total": $total,
    "active": $active,
    "completed": $completed,
    "blocked": $blocked,
    "completion_rate": $((completed * 100 / (total > 0 ? total : 1)))
  },
  "issues": {
    "open": $open_issues,
    "resolved": $resolved_issues
  },
  "tokens": {
    "total": $total_tokens,
    "daily": $daily_tokens,
    "cost": $total_cost
  }
}
EOF
}

# Main execution
load_status_data

# Generate report based on format
REPORT_OUTPUT=""

case "$FORMAT" in
    summary)
        REPORT_OUTPUT=$(generate_summary)
        ;;
    detailed)
        REPORT_OUTPUT=$(generate_detailed)
        ;;
    metrics)
        REPORT_OUTPUT=$(generate_metrics)
        ;;
    issues)
        REPORT_OUTPUT=$(generate_issues)
        ;;
    json)
        REPORT_OUTPUT=$(generate_json)
        ;;
esac

# Output report
if [ -n "$OUTPUT" ]; then
    echo "$REPORT_OUTPUT" > "$OUTPUT"
    print_success "Report saved to: $OUTPUT"
else
    echo "$REPORT_OUTPUT"
fi

# Email if requested
if [ -n "$EMAIL" ]; then
    print_info "Email functionality not yet implemented"
    print_info "Report would be sent to: $EMAIL"
fi

