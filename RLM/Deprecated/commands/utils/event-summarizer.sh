#!/bin/bash
# Event Summarization with Anthropic Haiku API

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

# API Configuration
HAIKU_API_KEY="${RLM_SUMMARIZATION_API_KEY:-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}"
HAIKU_API_URL="https://api.anthropic.com/v1/messages"
HAIKU_MODEL="claude-3-5-haiku-20241022"

EVENTS_DB="$RLM_ROOT/progress/events.db"
SUMMARIES_DB="$RLM_ROOT/progress/events.db"  # Same database, different table

#######################
# SUMMARIZATION
#######################

# Summarize a single event using Haiku API
summarize_event() {
    local event_id=$1
    local event_type=$2
    local summary=$3
    local details_json=$4
    
    # Check if already summarized
    if command -v sqlite3 &> /dev/null && [ -f "$EVENTS_DB" ]; then
        local existing=$(sqlite3 "$EVENTS_DB" \
            "SELECT summary_text FROM event_summaries WHERE event_id = '$event_id'" 2>/dev/null)
        
        if [ -n "$existing" ]; then
            echo "$existing"
            return 0
        fi
    fi
    
    # Build prompt for summarization
    local prompt="Summarize this AI agent event in exactly one sentence (max 100 words). Be specific and actionable.

Event Type: $event_type
Summary: $summary
Details: $details_json

One-sentence summary:"
    
    # Call Haiku API
    local response=$(curl -s -X POST "$HAIKU_API_URL" \
        -H "x-api-key: $HAIKU_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -H "Content-Type: application/json" \
        -d "{
            \"model\": \"$HAIKU_MODEL\",
            \"max_tokens\": 150,
            \"messages\": [
                {
                    \"role\": \"user\",
                    \"content\": \"$prompt\"
                }
            ]
        }" 2>/dev/null)
    
    # Extract summary from response
    local ai_summary=""
    local tokens_used=0
    local cost=0.0
    
    if command -v jq &> /dev/null && [ -n "$response" ]; then
        ai_summary=$(echo "$response" | jq -r '.content[0].text' 2>/dev/null | sed 's/^"//;s/"$//' | head -c 500)
        tokens_used=$(echo "$response" | jq -r '.usage.input_tokens + .usage.output_tokens' 2>/dev/null || echo "0")
        
        # Calculate cost (Haiku pricing: $0.25/$1.25 per 1M tokens)
        if [ "$tokens_used" -gt 0 ]; then
            local input_tokens=$(echo "$response" | jq -r '.usage.input_tokens' 2>/dev/null || echo "0")
            local output_tokens=$(echo "$response" | jq -r '.usage.output_tokens' 2>/dev/null || echo "0")
            cost=$(echo "scale=6; ($input_tokens * 0.25 + $output_tokens * 1.25) / 1000000" | bc 2>/dev/null || echo "0.0")
        fi
    fi
    
    # Fallback to pattern-based summarization if API fails
    if [ -z "$ai_summary" ] || [ "$ai_summary" = "null" ]; then
        ai_summary=$(pattern_based_summary "$event_type" "$summary" "$details_json")
        tokens_used=0
        cost=0.0
    fi
    
    # Store summary in database
    if command -v sqlite3 &> /dev/null && [ -f "$EVENTS_DB" ]; then
        local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        sqlite3 "$EVENTS_DB" << EOF
INSERT OR REPLACE INTO event_summaries (
  event_id, summary_text, model_used, tokens_used, cost, created_at
) VALUES (
  '$event_id', '${ai_summary//\'/\'\'}', '$HAIKU_MODEL', $tokens_used, $cost, '$timestamp'
);
EOF
    fi
    
    echo "$ai_summary"
}

# Pattern-based fallback summarization
pattern_based_summary() {
    local event_type=$1
    local summary=$2
    local details_json=$3
    
    case "$event_type" in
        task_start)
            echo "Started task: $summary"
            ;;
        task_complete)
            echo "Completed task: $summary"
            ;;
        code_written)
            echo "Wrote code: $summary"
            ;;
        test_written)
            echo "Wrote tests: $summary"
            ;;
        test_run)
            echo "Ran tests: $summary"
            ;;
        error_occurred)
            echo "Error: $summary"
            ;;
        blocker_created)
            echo "Blocker: $summary"
            ;;
        tool_use)
            echo "Used tool: $summary"
            ;;
        *)
            echo "$summary"
            ;;
    esac
}

# Summarize multiple events (batch)
summarize_events() {
    local event_ids=("$@")
    local count=0
    
    print_info "Summarizing ${#event_ids[@]} events..."
    
    for event_id in "${event_ids[@]}"; do
        # Get event details from database
        if ! command -v sqlite3 &> /dev/null || [ ! -f "$EVENTS_DB" ]; then
            continue
        fi
        
        local event_data=$(sqlite3 -json "$EVENTS_DB" \
            "SELECT event_type, summary, details_json FROM events WHERE id = '$event_id'" 2>/dev/null)
        
        if [ -z "$event_data" ]; then
            continue
        fi
        
        local event_type=$(echo "$event_data" | jq -r '.[0].event_type' 2>/dev/null)
        local summary=$(echo "$event_data" | jq -r '.[0].summary' 2>/dev/null)
        local details_json=$(echo "$event_data" | jq -r '.[0].details_json' 2>/dev/null)
        
        if [ -n "$event_type" ] && [ "$event_type" != "null" ]; then
            summarize_event "$event_id" "$event_type" "$summary" "$details_json" > /dev/null
            count=$((count + 1))
            
            # Rate limiting: small delay between API calls
            sleep 0.1
        fi
    done
    
    print_success "Summarized $count events"
}

# Summarize events without summaries
summarize_unsummarized_events() {
    local limit=${1:-100}
    
    if ! command -v sqlite3 &> /dev/null || [ ! -f "$EVENTS_DB" ]; then
        print_error "Database not available"
        return 1
    fi
    
    print_info "Finding events without summaries..."
    
    # Get event IDs that don't have summaries
    local event_ids=$(sqlite3 "$EVENTS_DB" << EOF
SELECT e.id
FROM events e
LEFT JOIN event_summaries s ON e.id = s.event_id
WHERE s.event_id IS NULL
ORDER BY e.timestamp DESC
LIMIT $limit;
EOF
)
    
    if [ -z "$event_ids" ]; then
        print_info "All events already summarized"
        return 0
    fi
    
    # Convert to array
    local ids_array=()
    while IFS= read -r id; do
        [ -n "$id" ] && ids_array+=("$id")
    done <<< "$event_ids"
    
    summarize_events "${ids_array[@]}"
}

# Get summary for event
get_event_summary() {
    local event_id=$1
    
    if ! command -v sqlite3 &> /dev/null || [ ! -f "$EVENTS_DB" ]; then
        return 1
    fi
    
    sqlite3 "$EVENTS_DB" \
        "SELECT summary_text FROM event_summaries WHERE event_id = '$event_id'" 2>/dev/null
}

#######################
# STATISTICS
#######################

# Get summarization statistics
get_summarization_stats() {
    if ! command -v sqlite3 &> /dev/null || [ ! -f "$EVENTS_DB" ]; then
        return 1
    fi
    
    sqlite3 -json "$EVENTS_DB" << EOF
SELECT 
  COUNT(*) as total_events,
  (SELECT COUNT(*) FROM event_summaries) as summarized_events,
  (SELECT SUM(tokens_used) FROM event_summaries) as total_tokens,
  (SELECT SUM(cost) FROM event_summaries) as total_cost
FROM events;
EOF
}

#######################
# EXPORT FUNCTIONS
#######################

# Export functions if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    export -f summarize_event
    export -f summarize_events
    export -f summarize_unsummarized_events
    export -f get_event_summary
    export -f get_summarization_stats
    export -f pattern_based_summary
fi

# CLI interface
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    case "${1:-help}" in
        summarize)
            if [ -n "$2" ]; then
                # Summarize specific event
                local event_id="$2"
                local event_data=$(sqlite3 -json "$EVENTS_DB" \
                    "SELECT event_type, summary, details_json FROM events WHERE id = '$event_id'" 2>/dev/null)
                
                if [ -n "$event_data" ]; then
                    local event_type=$(echo "$event_data" | jq -r '.[0].event_type' 2>/dev/null)
                    local summary=$(echo "$event_data" | jq -r '.[0].summary' 2>/dev/null)
                    local details=$(echo "$event_data" | jq -r '.[0].details_json' 2>/dev/null)
                    
                    summarize_event "$event_id" "$event_type" "$summary" "$details"
                else
                    print_error "Event not found: $event_id"
                fi
            else
                # Summarize all unsummarized events
                summarize_unsummarized_events "${3:-100}"
            fi
            ;;
        stats)
            get_summarization_stats | jq '.' 2>/dev/null || get_summarization_stats
            ;;
        *)
            cat << EOF
RLM Event Summarizer
====================

Usage: $0 <command> [options]

Commands:
  summarize [event-id] [limit]   Summarize event(s)
  stats                           Show summarization statistics

Examples:
  $0 summarize                    # Summarize all unsummarized events
  $0 summarize evt_123            # Summarize specific event
  $0 summarize "" 50              # Summarize up to 50 events
  $0 stats                        # Show statistics

Note: Requires RLM_SUMMARIZATION_API_KEY environment variable
      or uses default API key from config.

EOF
            ;;
    esac
fi

