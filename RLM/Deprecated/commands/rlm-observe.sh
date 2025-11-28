#!/bin/bash
# RLM Observability CLI Tool
# Real-time monitoring and analysis of AI agent activities

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_agent() { echo -e "${PURPLE}🤖${NC} $1"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RLM_ROOT="$(dirname "$SCRIPT_DIR")"

# Source utilities
source "$SCRIPT_DIR/utils/event-logger.sh" 2>/dev/null || true
source "$SCRIPT_DIR/utils/session-colors.sh" 2>/dev/null || true
source "$SCRIPT_DIR/utils/event-summarizer.sh" 2>/dev/null || true

EVENTS_DB="$RLM_ROOT/progress/events.db"
EVENTS_LOG="$RLM_ROOT/progress/events.log"

#######################
# LIVE EVENT STREAM (tail)
#######################

tail_events() {
    local follow=${1:-true}
    local limit=${2:-50}
    
    print_info "Live event stream (Press Ctrl+C to stop)"
    echo ""
    
    if [ ! -f "$EVENTS_LOG" ]; then
        print_warning "No events log found. Waiting for events..."
        touch "$EVENTS_LOG"
    fi
    
    # Show recent events first
    if [ -f "$EVENTS_LOG" ]; then
        tail -n "$limit" "$EVENTS_LOG" | while IFS= read -r line; do
            display_event_json "$line"
        done
    fi
    
    if [ "$follow" = "true" ]; then
        # Follow new events
        tail -f "$EVENTS_LOG" 2>/dev/null | while IFS= read -r line; do
            display_event_json "$line"
        done
    fi
}

# Display event in formatted way
display_event_json() {
    local event_json="$1"
    
    if ! command -v jq &> /dev/null; then
        echo "$event_json"
        return
    fi
    
    local event_id=$(echo "$event_json" | jq -r '.id' 2>/dev/null)
    local timestamp=$(echo "$event_json" | jq -r '.timestamp' 2>/dev/null)
    local session_id=$(echo "$event_json" | jq -r '.session_id' 2>/dev/null)
    local agent_id=$(echo "$event_json" | jq -r '.agent_id' 2>/dev/null)
    local task_id=$(echo "$event_json" | jq -r '.task_id' 2>/dev/null)
    local event_type=$(echo "$event_json" | jq -r '.event_type' 2>/dev/null)
    local summary=$(echo "$event_json" | jq -r '.summary' 2>/dev/null)
    local tokens=$(echo "$event_json" | jq -r '.tokens.total' 2>/dev/null)
    local cost=$(echo "$event_json" | jq -r '.cost' 2>/dev/null)
    
    # Format timestamp
    local time_str=$(echo "$timestamp" | sed 's/T/ /;s/Z$//' | cut -d'.' -f1)
    
    # Get session color
    local session_display=""
    if [ -n "$session_id" ] && [ "$session_id" != "null" ]; then
        session_display=$(format_session "$session_id" "" | sed 's/\x1b\[[0-9;]*m//g')
    fi
    
    # Get agent color
    local agent_display=""
    if [ -n "$agent_id" ] && [ "$agent_id" != "null" ]; then
        agent_display=$(format_agent "$agent_id" | sed 's/\x1b\[[0-9;]*m//g')
    fi
    
    # Event type color
    local type_color="$NC"
    case "$event_type" in
        task_start|session_start) type_color="$GREEN" ;;
        task_complete|session_end) type_color="$CYAN" ;;
        error_occurred|blocker_created) type_color="$RED" ;;
        code_written|test_written) type_color="$BLUE" ;;
        *) type_color="$YELLOW" ;;
    esac
    
    # Display formatted event
    echo -e "${type_color}[$event_type]${NC} $time_str"
    if [ -n "$session_display" ]; then
        echo -e "  Session: $session_display"
    fi
    if [ -n "$agent_display" ]; then
        echo -e "  Agent: $agent_display"
    fi
    if [ -n "$task_id" ] && [ "$task_id" != "null" ]; then
        echo -e "  Task: $task_id"
    fi
    echo -e "  ${summary}"
    if [ -n "$tokens" ] && [ "$tokens" != "null" ] && [ "$tokens" != "0" ]; then
        echo -e "  Tokens: $(printf "%'d" $tokens) | Cost: \$$(printf "%.4f" $cost)"
    fi
    echo ""
}

#######################
# TRACE (Replay Timeline)
#######################

trace_session() {
    local session_id=$1
    
    if [ -z "$session_id" ]; then
        print_error "Session ID required"
        return 1
    fi
    
    print_info "Tracing session: $(format_session "$session_id" "")"
    echo ""
    
    local events=$(get_session_events "$session_id")
    
    if [ -z "$events" ] || [ "$events" = "[]" ]; then
        print_warning "No events found for session: $session_id"
        return 1
    fi
    
    if command -v jq &> /dev/null; then
        echo "$events" | jq -r '.[] | "\(.timestamp) [\(.event_type)] \(.summary) (Agent: \(.agent_id // "N/A"), Task: \(.task_id // "N/A"))"' | while IFS= read -r line; do
            echo "  $line"
        done
    else
        echo "$events"
    fi
}

trace_task() {
    local task_id=$1
    
    if [ -z "$task_id" ]; then
        print_error "Task ID required"
        return 1
    fi
    
    print_info "Tracing task: $task_id"
    echo ""
    
    local events=$(get_task_events "$task_id")
    
    if [ -z "$events" ] || [ "$events" = "[]" ]; then
        print_warning "No events found for task: $task_id"
        return 1
    fi
    
    if command -v jq &> /dev/null; then
        echo "$events" | jq -r '.[] | "\(.timestamp) [\(.event_type)] \(.summary)"' | while IFS= read -r line; do
            echo "  $line"
        done
    else
        echo "$events"
    fi
}

#######################
# FILTER (Query Events)
#######################

filter_events() {
    local agent_id=$1
    local event_type=$2
    local task_id=$3
    local limit=${4:-100}
    
    local where_clauses=()
    
    if [ -n "$agent_id" ]; then
        where_clauses+=("agent_id = '$agent_id'")
    fi
    
    if [ -n "$event_type" ]; then
        where_clauses+=("event_type = '$event_type'")
    fi
    
    if [ -n "$task_id" ]; then
        where_clauses+=("task_id = '$task_id'")
    fi
    
    local where_clause="1=1"
    if [ ${#where_clauses[@]} -gt 0 ]; then
        where_clause=$(IFS=" AND "; echo "${where_clauses[*]}")
    fi
    
    print_info "Filtering events: $where_clause"
    echo ""
    
    local events=$(query_events "$where_clause" "$limit")
    
    if [ -z "$events" ] || [ "$events" = "[]" ]; then
        print_warning "No events found matching criteria"
        return 1
    fi
    
    if command -v jq &> /dev/null; then
        echo "$events" | jq -r '.[] | "\(.timestamp) [\(.event_type)] \(.summary) | Session: \(.session_id // "N/A") | Agent: \(.agent_id // "N/A") | Task: \(.task_id // "N/A")"'
    else
        echo "$events"
    fi
}

#######################
# SUMMARY (Aggregates)
#######################

show_summary() {
    local period=${1:-24}  # hours
    
    print_info "Activity Summary (Last $period hours)"
    echo ""
    
    if ! command -v sqlite3 &> /dev/null || [ ! -f "$EVENTS_DB" ]; then
        print_error "Database not available"
        return 1
    fi
    
    # Overall stats
    local stats=$(get_event_stats)
    if command -v jq &> /dev/null; then
        local total=$(echo "$stats" | jq -r '.[0].total_events')
        local sessions=$(echo "$stats" | jq -r '.[0].unique_sessions')
        local agents=$(echo "$stats" | jq -r '.[0].unique_agents')
        local tasks=$(echo "$stats" | jq -r '.[0].unique_tasks')
        local tokens=$(echo "$stats" | jq -r '.[0].total_tokens')
        local cost=$(echo "$stats" | jq -r '.[0].total_cost')
        
        echo "Total Events: $(printf "%'d" $total)"
        echo "Sessions: $sessions"
        echo "Agents: $agents"
        echo "Tasks: $tasks"
        echo "Total Tokens: $(printf "%'d" $tokens)"
        echo "Total Cost: \$$(printf "%.4f" $cost)"
    else
        echo "$stats"
    fi
    
    echo ""
    print_info "Top Agents:"
    local agent_stats=$(get_agent_stats)
    if command -v jq &> /dev/null; then
        echo "$agent_stats" | jq -r '.[] | "  \(.agent_id): \(.event_count) events, \(.total_tokens) tokens, \$$(.total_cost)"'
    else
        echo "$agent_stats"
    fi
    
    echo ""
    print_info "Event Types:"
    local type_stats=$(get_event_type_stats)
    if command -v jq &> /dev/null; then
        echo "$type_stats" | jq -r '.[] | "  \(.event_type): \(.count) occurrences"'
    else
        echo "$type_stats"
    fi
}

#######################
# DATABASE QUERY
#######################

db_query() {
    local query=$1
    
    if [ -z "$query" ]; then
        print_error "SQL query required"
        return 1
    fi
    
    if ! command -v sqlite3 &> /dev/null || [ ! -f "$EVENTS_DB" ]; then
        print_error "Database not available"
        return 1
    fi
    
    sqlite3 -json "$EVENTS_DB" "$query" | jq '.' 2>/dev/null || sqlite3 "$EVENTS_DB" "$query"
}

#######################
# STATISTICS
#######################

show_stats() {
    print_info "Event Statistics"
    echo ""
    
    if ! command -v sqlite3 &> /dev/null || [ ! -f "$EVENTS_DB" ]; then
        print_error "Database not available"
        return 1
    fi
    
    local stats=$(get_event_stats)
    
    if command -v jq &> /dev/null; then
        echo "$stats" | jq '.'
    else
        echo "$stats"
    fi
}

#######################
# USAGE
#######################

usage() {
    cat << EOF
RLM Observability CLI
====================

Usage: $0 <command> [options]

Commands:
  tail [limit]              Live event stream (default: follow, 50 events)
  trace session <id>       Replay session timeline
  trace task <id>           Replay task timeline
  filter [options]          Query events with filters
    --agent <id>            Filter by agent
    --type <type>           Filter by event type
    --task <id>             Filter by task
    --limit <n>             Limit results (default: 100)
  summary [hours]           Activity summary (default: 24 hours)
  stats                     Event statistics
  db <sql-query>            Direct SQLite query
  help                      Show this help

Examples:
  $0 tail                  # Live event feed
  $0 tail 100              # Show last 100 events
  $0 trace session build-1234567890-12345
  $0 trace task TASK-001
  $0 filter --agent implementation-agent --type code_written
  $0 filter --type error_occurred --limit 10
  $0 summary 48            # Last 48 hours
  $0 stats
  $0 db "SELECT COUNT(*) FROM events WHERE event_type = 'task_start'"

Event Types:
  session_start, session_end
  task_start, task_complete
  spec_read, context_loaded, plan_created
  tool_use, code_written, test_written, test_run
  error_occurred, blocker_created

EOF
}

#######################
# MAIN
#######################

case "${1:-help}" in
    tail)
        tail_events "true" "${2:-50}"
        ;;
    trace)
        case "$2" in
            session)
                trace_session "$3"
                ;;
            task)
                trace_task "$3"
                ;;
            *)
                print_error "Usage: $0 trace <session|task> <id>"
                exit 1
                ;;
        esac
        ;;
    filter)
        local agent_id=""
        local event_type=""
        local task_id=""
        local limit=100
        
        shift
        while [[ $# -gt 0 ]]; do
            case $1 in
                --agent)
                    agent_id="$2"
                    shift 2
                    ;;
                --type)
                    event_type="$2"
                    shift 2
                    ;;
                --task)
                    task_id="$2"
                    shift 2
                    ;;
                --limit)
                    limit="$2"
                    shift 2
                    ;;
                *)
                    print_error "Unknown option: $1"
                    usage
                    exit 1
                    ;;
            esac
        done
        
        filter_events "$agent_id" "$event_type" "$task_id" "$limit"
        ;;
    summary)
        show_summary "${2:-24}"
        ;;
    stats)
        show_stats
        ;;
    db)
        db_query "$2"
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        print_error "Unknown command: $1"
        usage
        exit 1
        ;;
esac

