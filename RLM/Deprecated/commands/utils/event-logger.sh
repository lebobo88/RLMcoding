#!/bin/bash
# Event Logging Utilities for RLM Observability System

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

# Event database
EVENTS_DB="$RLM_ROOT/progress/events.db"
EVENTS_LOG="$RLM_ROOT/progress/events.log"

# Ensure progress directory exists
mkdir -p "$RLM_ROOT/progress"

#######################
# DATABASE INITIALIZATION
#######################

# Initialize SQLite database
init_event_database() {
    if [ ! -f "$EVENTS_DB" ]; then
        print_info "Initializing events database..."
        
        sqlite3 "$EVENTS_DB" << 'EOF'
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  session_id TEXT,
  agent_id TEXT,
  task_id TEXT,
  event_type TEXT NOT NULL,
  summary TEXT,
  details_json TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  cost REAL DEFAULT 0.0,
  duration_ms INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_id ON events(agent_id);
CREATE INDEX IF NOT EXISTS idx_task_id ON events(task_id);
CREATE INDEX IF NOT EXISTS idx_event_type ON events(event_type);

CREATE TABLE IF NOT EXISTS event_summaries (
  event_id TEXT PRIMARY KEY,
  summary_text TEXT,
  model_used TEXT,
  tokens_used INTEGER,
  cost REAL,
  created_at TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE INDEX IF NOT EXISTS idx_summary_created ON event_summaries(created_at);
EOF
        
        print_success "Events database initialized"
    fi
}

#######################
# EVENT LOGGING
#######################

# Generate unique event ID
generate_event_id() {
    echo "evt_$(date +%s)_$$_${RANDOM}"
}

# Log event to both SQLite and JSON log file
log_event() {
    local event_type=$1
    local summary=$2
    local details_json=${3:-"{}"}
    local session_id=${4:-""}
    local agent_id=${5:-""}
    local task_id=${6:-""}
    local tokens_input=${7:-0}
    local tokens_output=${8:-0}
    local cost=${9:-0.0}
    local duration_ms=${10:-0}
    
    # Generate event ID
    local event_id=$(generate_event_id)
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # Ensure database exists
    init_event_database
    
    # Insert into SQLite
    if command -v sqlite3 &> /dev/null; then
        sqlite3 "$EVENTS_DB" << EOF
INSERT INTO events (
  id, timestamp, session_id, agent_id, task_id, event_type,
  summary, details_json, tokens_input, tokens_output, cost, duration_ms
) VALUES (
  '$event_id', '$timestamp', '$session_id', '$agent_id', '$task_id', '$event_type',
  '${summary//\'/\'\'}', '${details_json//\'/\'\'}', $tokens_input, $tokens_output, $cost, $duration_ms
);
EOF
    fi
    
    # Also append to JSON log file for easy parsing
    local event_json=$(cat << EOF
{
  "id": "$event_id",
  "timestamp": "$timestamp",
  "session_id": "$session_id",
  "agent_id": "$agent_id",
  "task_id": "$task_id",
  "event_type": "$event_type",
  "summary": "$summary",
  "details": $details_json,
  "tokens": {
    "input": $tokens_input,
    "output": $tokens_output,
    "total": $((tokens_input + tokens_output))
  },
  "cost": $cost,
  "duration_ms": $duration_ms
}
EOF
)
    
    echo "$event_json" >> "$EVENTS_LOG"
    
    # Send to observability server if enabled
    send_event_to_server "$event_json" 2>/dev/null || true
    
    echo "$event_id"
}

# Send event to observability server (if running)
send_event_to_server() {
    local event_json=$1
    local server_url="${RLM_OBSERVABILITY_SERVER_URL:-http://localhost:3000}"
    
    # Check if server is configured and running
    if [ -n "$RLM_OBSERVABILITY_SERVER_URL" ] || curl -s "$server_url/health" &> /dev/null; then
        curl -s -X POST "$server_url/events" \
            -H "Content-Type: application/json" \
            -d "$event_json" \
            &> /dev/null || true
    fi
}

#######################
# EVENT QUERY HELPERS
#######################

# Get events by criteria
query_events() {
    local where_clause=$1
    local limit=${2:-100}
    
    if [ ! -f "$EVENTS_DB" ] || ! command -v sqlite3 &> /dev/null; then
        return 1
    fi
    
    sqlite3 -json "$EVENTS_DB" << EOF
SELECT * FROM events
WHERE $where_clause
ORDER BY timestamp DESC
LIMIT $limit;
EOF
}

# Get events by session
get_session_events() {
    local session_id=$1
    query_events "session_id = '$session_id'"
}

# Get events by task
get_task_events() {
    local task_id=$1
    query_events "task_id = '$task_id'"
}

# Get events by agent
get_agent_events() {
    local agent_id=$1
    local limit=${2:-50}
    query_events "agent_id = '$agent_id'" "$limit"
}

# Get events by type
get_events_by_type() {
    local event_type=$1
    local limit=${2:-50}
    query_events "event_type = '$event_type'" "$limit"
}

# Get recent events
get_recent_events() {
    local minutes=${1:-60}
    local limit=${2:-100}
    
    if [ ! -f "$EVENTS_DB" ] || ! command -v sqlite3 &> /dev/null; then
        return 1
    fi
    
    sqlite3 -json "$EVENTS_DB" << EOF
SELECT * FROM events
WHERE datetime(timestamp) > datetime('now', '-$minutes minutes')
ORDER BY timestamp DESC
LIMIT $limit;
EOF
}

#######################
# EVENT STATISTICS
#######################

# Get event statistics
get_event_stats() {
    if [ ! -f "$EVENTS_DB" ] || ! command -v sqlite3 &> /dev/null; then
        return 1
    fi
    
    sqlite3 -json "$EVENTS_DB" << EOF
SELECT 
  COUNT(*) as total_events,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT agent_id) as unique_agents,
  COUNT(DISTINCT task_id) as unique_tasks,
  SUM(tokens_input + tokens_output) as total_tokens,
  SUM(cost) as total_cost,
  AVG(duration_ms) as avg_duration_ms
FROM events;
EOF
}

# Get statistics by agent
get_agent_stats() {
    if [ ! -f "$EVENTS_DB" ] || ! command -v sqlite3 &> /dev/null; then
        return 1
    fi
    
    sqlite3 -json "$EVENTS_DB" << EOF
SELECT 
  agent_id,
  COUNT(*) as event_count,
  SUM(tokens_input + tokens_output) as total_tokens,
  SUM(cost) as total_cost,
  AVG(duration_ms) as avg_duration_ms
FROM events
WHERE agent_id IS NOT NULL
GROUP BY agent_id
ORDER BY total_tokens DESC;
EOF
}

# Get statistics by event type
get_event_type_stats() {
    if [ ! -f "$EVENTS_DB" ] || ! command -v sqlite3 &> /dev/null; then
        return 1
    fi
    
    sqlite3 -json "$EVENTS_DB" << EOF
SELECT 
  event_type,
  COUNT(*) as count,
  SUM(tokens_input + tokens_output) as total_tokens,
  SUM(cost) as total_cost
FROM events
GROUP BY event_type
ORDER BY count DESC;
EOF
}

#######################
# EVENT CLEANUP
#######################

# Clean old events
cleanup_old_events() {
    local days=${1:-90}
    
    if [ ! -f "$EVENTS_DB" ] || ! command -v sqlite3 &> /dev/null; then
        return 1
    fi
    
    print_info "Cleaning events older than $days days..."
    
    local deleted=$(sqlite3 "$EVENTS_DB" << EOF
DELETE FROM events
WHERE datetime(timestamp) < datetime('now', '-$days days');
SELECT changes();
EOF
)
    
    print_success "Deleted $deleted old events"
}

# Vacuum database
vacuum_database() {
    if [ ! -f "$EVENTS_DB" ] || ! command -v sqlite3 &> /dev/null; then
        return 1
    fi
    
    print_info "Vacuuming events database..."
    sqlite3 "$EVENTS_DB" "VACUUM;"
    print_success "Database optimized"
}

#######################
# EXPORT FUNCTIONS
#######################

# Export functions if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    export -f init_event_database
    export -f log_event
    export -f generate_event_id
    export -f query_events
    export -f get_session_events
    export -f get_task_events
    export -f get_agent_events
    export -f get_events_by_type
    export -f get_recent_events
    export -f get_event_stats
    export -f get_agent_stats
    export -f get_event_type_stats
    export -f cleanup_old_events
    export -f vacuum_database
    export -f send_event_to_server
fi

# Initialize database if run directly
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    case "${1:-init}" in
        init)
            init_event_database
            ;;
        stats)
            get_event_stats | jq '.' 2>/dev/null || get_event_stats
            ;;
        cleanup)
            cleanup_old_events "${2:-90}"
            ;;
        vacuum)
            vacuum_database
            ;;
        *)
            cat << EOF
RLM Event Logger
================

Usage: $0 <command>

Commands:
  init          Initialize events database
  stats         Show event statistics
  cleanup [days] Clean old events (default: 90 days)
  vacuum        Optimize database

EOF
            ;;
    esac
fi

