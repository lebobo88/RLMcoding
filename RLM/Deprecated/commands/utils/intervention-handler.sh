#!/bin/bash
# Intervention Handler for RLM Supervised Mode
# Handles approval/rejection workflows for agent actions

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

# Intervention directory
INTERVENTION_DIR="$RLM_ROOT/progress/interventions"
mkdir -p "$INTERVENTION_DIR/pending" "$INTERVENTION_DIR/approved" "$INTERVENTION_DIR/rejected"

# Source event logger
source "$SCRIPT_DIR/event-logger.sh" 2>/dev/null || true

#######################
# REQUEST APPROVAL
#######################

# Request approval for an action
request_approval() {
    local agent_id=$1
    local action=$2
    local context=${3:-""}
    local session_id=${4:-""}
    local task_id=${5:-""}
    
    local approval_id="approval-$(date +%s)-$$"
    local approval_file="$INTERVENTION_DIR/pending/${approval_id}.json"
    
    # Create approval request
    local approval_data=$(cat << EOF
{
  "id": "$approval_id",
  "agent_id": "$agent_id",
  "action": "$action",
  "context": "$context",
  "session_id": "$session_id",
  "task_id": "$task_id",
  "status": "pending",
  "requested_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
)
    
    echo "$approval_data" > "$approval_file"
    
    # Log intervention request
    log_event "intervention_requested" "Approval requested: $action" \
        "{\"agent\":\"$agent_id\",\"action\":\"$action\",\"approval_id\":\"$approval_id\"}" \
        "$session_id" "$agent_id" "$task_id" 0 0 0.0 0 2>/dev/null || true
    
    # Send to observability server if available
    send_approval_to_server "$approval_data" 2>/dev/null || true
    
    # If server is not available, wait for file-based approval
    if [ -z "$RLM_OBSERVABILITY_SERVER_URL" ] || ! curl -s "${RLM_OBSERVABILITY_SERVER_URL:-http://localhost:3000}/health" &> /dev/null; then
        print_warning "Approval required: $action"
        print_info "Approval ID: $approval_id"
        print_info "Waiting for approval..."
        
        # Wait for approval (polling)
        wait_for_approval "$approval_id" 3600  # 1 hour timeout
    fi
    
    echo "$approval_id"
}

# Wait for approval decision
wait_for_approval() {
    local approval_id=$1
    local timeout=${2:-3600}  # Default 1 hour
    
    local approval_file="$INTERVENTION_DIR/pending/${approval_id}.json"
    local start_time=$(date +%s)
    
    while [ $(date +%s) -lt $((start_time + timeout)) ]; do
        # Check if approved
        if [ -f "$INTERVENTION_DIR/approved/${approval_id}.json" ]; then
            print_success "Approval granted"
            return 0
        fi
        
        # Check if rejected
        if [ -f "$INTERVENTION_DIR/rejected/${approval_id}.json" ]; then
            print_error "Approval rejected"
            return 1
        fi
        
        # Check if still pending
        if [ ! -f "$approval_file" ]; then
            print_warning "Approval request not found"
            return 1
        fi
        
        sleep 1
    done
    
    print_error "Approval timeout"
    return 1
}

#######################
# APPROVE/REJECT
#######################

# Approve an action
approve_action() {
    local approval_id=$1
    
    local pending_file="$INTERVENTION_DIR/pending/${approval_id}.json"
    local approved_file="$INTERVENTION_DIR/approved/${approval_id}.json"
    
    if [ ! -f "$pending_file" ]; then
        print_error "Approval request not found: $approval_id"
        return 1
    fi
    
    # Read approval data
    local approval_data=$(cat "$pending_file")
    
    # Add approval metadata
    if command -v jq &> /dev/null; then
        approval_data=$(echo "$approval_data" | jq --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            '.status = "approved" | .approved_at = $time')
    fi
    
    # Move to approved
    echo "$approval_data" > "$approved_file"
    rm -f "$pending_file"
    
    # Log approval
    local agent_id=$(echo "$approval_data" | jq -r '.agent_id' 2>/dev/null || echo "")
    local session_id=$(echo "$approval_data" | jq -r '.session_id' 2>/dev/null || echo "")
    local task_id=$(echo "$approval_data" | jq -r '.task_id' 2>/dev/null || echo "")
    
    log_event "intervention_approved" "Approval granted: $approval_id" \
        "{\"approval_id\":\"$approval_id\",\"agent\":\"$agent_id\"}" \
        "$session_id" "$agent_id" "$task_id" 0 0 0.0 0 2>/dev/null || true
    
    # Notify server
    send_approval_response_to_server "$approval_id" "approved" 2>/dev/null || true
    
    print_success "Approval granted: $approval_id"
}

# Reject an action
reject_action() {
    local approval_id=$1
    local reason=${2:-""}
    
    local pending_file="$INTERVENTION_DIR/pending/${approval_id}.json"
    local rejected_file="$INTERVENTION_DIR/rejected/${approval_id}.json"
    
    if [ ! -f "$pending_file" ]; then
        print_error "Approval request not found: $approval_id"
        return 1
    fi
    
    # Read approval data
    local approval_data=$(cat "$pending_file")
    
    # Add rejection metadata
    if command -v jq &> /dev/null; then
        approval_data=$(echo "$approval_data" | jq --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            --arg reason "$reason" \
            '.status = "rejected" | .rejected_at = $time | .reason = $reason')
    fi
    
    # Move to rejected
    echo "$approval_data" > "$rejected_file"
    rm -f "$pending_file"
    
    # Log rejection
    local agent_id=$(echo "$approval_data" | jq -r '.agent_id' 2>/dev/null || echo "")
    local session_id=$(echo "$approval_data" | jq -r '.session_id' 2>/dev/null || echo "")
    local task_id=$(echo "$approval_data" | jq -r '.task_id' 2>/dev/null || echo "")
    
    log_event "intervention_rejected" "Approval rejected: $approval_id" \
        "{\"approval_id\":\"$approval_id\",\"agent\":\"$agent_id\",\"reason\":\"$reason\"}" \
        "$session_id" "$agent_id" "$task_id" 0 0 0.0 0 2>/dev/null || true
    
    # Notify server
    send_approval_response_to_server "$approval_id" "rejected" "$reason" 2>/dev/null || true
    
    print_success "Approval rejected: $approval_id"
}

#######################
# LIST APPROVALS
#######################

# List pending approvals
list_pending() {
    print_info "Pending Approvals:"
    echo ""
    
    local count=0
    if [ -d "$INTERVENTION_DIR/pending" ]; then
        for approval_file in "$INTERVENTION_DIR/pending"/*.json; do
            if [ -f "$approval_file" ]; then
                count=$((count + 1))
                if command -v jq &> /dev/null; then
                    local id=$(jq -r '.id' "$approval_file")
                    local agent=$(jq -r '.agent_id' "$approval_file")
                    local action=$(jq -r '.action' "$approval_file")
                    local requested=$(jq -r '.requested_at' "$approval_file")
                    
                    echo "  ID: $id"
                    echo "  Agent: $agent"
                    echo "  Action: $action"
                    echo "  Requested: $requested"
                    echo ""
                else
                    cat "$approval_file"
                    echo ""
                fi
            fi
        done
    fi
    
    if [ $count -eq 0 ]; then
        echo "  No pending approvals"
    fi
}

#######################
# SERVER COMMUNICATION
#######################

# Send approval to server
send_approval_to_server() {
    local approval_data=$1
    local server_url="${RLM_OBSERVABILITY_SERVER_URL:-http://localhost:3000}"
    
    if curl -s "$server_url/health" &> /dev/null; then
        curl -s -X POST "$server_url/interventions" \
            -H "Content-Type: application/json" \
            -d "$approval_data" \
            &> /dev/null || true
    fi
}

# Send approval response to server
send_approval_response_to_server() {
    local approval_id=$1
    local status=$2
    local reason=${3:-""}
    local server_url="${RLM_OBSERVABILITY_SERVER_URL:-http://localhost:3000}"
    
    if curl -s "$server_url/health" &> /dev/null; then
        curl -s -X POST "$server_url/interventions/$approval_id/respond" \
            -H "Content-Type: application/json" \
            -d "{\"status\":\"$status\",\"reason\":\"$reason\"}" \
            &> /dev/null || true
    fi
}

#######################
# EXPORT FUNCTIONS
#######################

# Export functions if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    export -f request_approval
    export -f wait_for_approval
    export -f approve_action
    export -f reject_action
    export -f list_pending
fi

# CLI interface
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    case "${1:-help}" in
        request)
            request_approval "$2" "$3" "${4:-}" "${5:-}" "${6:-}"
            ;;
        approve)
            approve_action "$2"
            ;;
        reject)
            reject_action "$2" "${3:-}"
            ;;
        list)
            list_pending
            ;;
        *)
            cat << EOF
RLM Intervention Handler
========================

Usage: $0 <command> [options]

Commands:
  request <agent> <action> [context] [session] [task]
          Request approval for an action
  
  approve <approval-id>
          Approve a pending action
  
  reject <approval-id> [reason]
          Reject a pending action
  
  list
          List all pending approvals

Examples:
  $0 request implementation-agent "Deploy to production" "Production deployment" session-123 TASK-001
  $0 list
  $0 approve approval-1234567890-12345
  $0 reject approval-1234567890-12345 "Not ready for production"

EOF
            ;;
    esac
fi

