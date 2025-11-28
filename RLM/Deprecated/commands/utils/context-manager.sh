#!/bin/bash
# Context Management Utilities for RLM
# Based on Elite Context Engineering Protocols

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_header() { echo -e "${CYAN}$1${NC}"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RLM_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Context bundle directory
BUNDLE_DIR="$RLM_ROOT/progress/context-bundles"
mkdir -p "$BUNDLE_DIR"

#######################
# CONTEXT PRIMING
#######################

# Load context prime for specific task type
load_context_prime() {
    local prime_type=$1
    local prime_file="$RLM_ROOT/templates/primes/${prime_type}.md"
    
    if [ ! -f "$prime_file" ]; then
        print_warning "Prime file not found: $prime_type"
        return 1
    fi
    
    print_info "Loading context prime: $prime_type"
    cat "$prime_file"
}

# Get minimal context for agent invocation
get_minimal_context() {
    local agent_id=$1
    local task_id=$2
    
    print_info "Preparing minimal context for $agent_id on $task_id"
    
    # Get agent's required context from profile
    local agent_config="$RLM_ROOT/config/agent-profiles.json"
    
    if [ -f "$agent_config" ] && command -v jq &> /dev/null; then
        local input_contexts=$(jq -r --arg agent "$agent_id" \
            '.agents[] | select(.id == $agent) | .inputContext[]' \
            "$agent_config" 2>/dev/null)
        
        if [ -n "$input_contexts" ]; then
            while IFS= read -r context_path; do
                # Resolve wildcards and variables
                local resolved_path=$(echo "$context_path" | \
                    sed "s|\[task-id\]|$task_id|g" | \
                    sed "s|\[feature\]|${task_id%-*}|g")
                
                # Find matching files
                for file in $resolved_path; do
                    if [ -f "$file" ]; then
                        echo "# Context: $file"
                        cat "$file"
                        echo ""
                    fi
                done
            done <<< "$input_contexts"
        fi
    fi
}

#######################
# CONTEXT BUNDLES
#######################

# Create context bundle (trail of work)
create_context_bundle() {
    local session_id=${1:-$(date +%s)}
    local bundle_file="$BUNDLE_DIR/bundle-$session_id.md"
    
    print_info "Creating context bundle: $session_id"
    
    cat > "$bundle_file" << EOF
# Context Bundle: $session_id
**Created:** $(date -u +"%Y-%m-%d %H:%M UTC")

## Session Summary
$(get_session_summary)

## Active Tasks
$(list_active_tasks)

## Recent Actions
$(get_recent_actions)

## Current State
$(get_current_state)

## Context Size
$(calculate_context_size)

---
*This bundle can be used to restore agent state or resume work*
EOF
    
    print_success "Context bundle saved: $bundle_file"
    echo "$bundle_file"
}

# Load context bundle
load_context_bundle() {
    local bundle_id=$1
    local bundle_file="$BUNDLE_DIR/bundle-$bundle_id.md"
    
    if [ ! -f "$bundle_file" ]; then
        print_error "Bundle not found: $bundle_id"
        return 1
    fi
    
    print_info "Loading context bundle: $bundle_id"
    cat "$bundle_file"
}

# List available bundles
list_context_bundles() {
    print_header "Available Context Bundles:"
    
    if [ -d "$BUNDLE_DIR" ]; then
        find "$BUNDLE_DIR" -name "bundle-*.md" -type f | while read -r bundle; do
            local bundle_id=$(basename "$bundle" | sed 's/bundle-//;s/.md//')
            local created=$(head -2 "$bundle" | tail -1 | sed 's/\*\*Created:\*\* //')
            echo "  - $bundle_id (Created: $created)"
        done
    else
        echo "  No bundles found"
    fi
}

#######################
# CONTEXT ANALYSIS
#######################

# Calculate context size
calculate_context_size() {
    local total_chars=0
    local estimated_tokens=0
    
    # Count chars in active tasks
    if [ -d "$RLM_ROOT/tasks/active" ]; then
        total_chars=$(find "$RLM_ROOT/tasks/active" -name "*.md" -type f -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print $1}')
    fi
    
    # Estimate tokens (rough: 4 chars per token)
    estimated_tokens=$((total_chars / 4))
    
    echo "Total Chars: $(printf "%'d" $total_chars)"
    echo "Estimated Tokens: $(printf "%'d" $estimated_tokens)"
}

# Analyze context bloat
analyze_context_bloat() {
    print_header "=== Context Bloat Analysis ==="
    echo ""
    
    # Check constitution size
    if [ -f "$RLM_ROOT/specs/constitution.md" ]; then
        local const_size=$(wc -c < "$RLM_ROOT/specs/constitution.md")
        local const_tokens=$((const_size / 4))
        echo "Constitution:"
        echo "  Size: $(printf "%'d" $const_size) chars (~$(printf "%'d" $const_tokens) tokens)"
        if [ $const_tokens -gt 10000 ]; then
            print_warning "  Constitution is large. Consider trimming to essentials."
        fi
    fi
    
    echo ""
    
    # Check active tasks
    local task_count=$(find "$RLM_ROOT/tasks/active" -name "*.md" 2>/dev/null | wc -l)
    echo "Active Tasks: $task_count"
    if [ $task_count -gt 10 ]; then
        print_warning "  Many active tasks. Consider breaking into subtasks or completing some first."
    fi
    
    echo ""
    
    # Check spec complexity
    local spec_count=$(find "$RLM_ROOT/specs/features" -name "spec.md" 2>/dev/null | wc -l)
    echo "Feature Specs: $spec_count"
    
    echo ""
    calculate_context_size
}

# Optimize context
optimize_context() {
    print_header "=== Context Optimization ==="
    echo ""
    
    print_info "Running optimization..."
    
    # Move completed tasks
    local completed_count=$(find "$RLM_ROOT/tasks/completed" -name "*.md" -mtime +30 2>/dev/null | wc -l)
    if [ $completed_count -gt 0 ]; then
        print_info "Archiving $completed_count old completed tasks..."
        mkdir -p "$RLM_ROOT/tasks/archived"
        find "$RLM_ROOT/tasks/completed" -name "*.md" -mtime +30 -exec mv {} "$RLM_ROOT/tasks/archived/" \; 2>/dev/null
    fi
    
    # Clean old logs
    local old_logs=$(find "$RLM_ROOT/progress/logs" -name "*.md" -mtime +90 2>/dev/null | wc -l)
    if [ $old_logs -gt 0 ]; then
        print_info "Cleaning $old_logs old log files..."
        find "$RLM_ROOT/progress/logs" -name "*.md" -mtime +90 -delete 2>/dev/null
    fi
    
    # Compress old bundles
    local old_bundles=$(find "$BUNDLE_DIR" -name "*.md" -mtime +60 2>/dev/null | wc -l)
    if [ $old_bundles -gt 0 ]; then
        print_info "Compressing $old_bundles old bundles..."
        find "$BUNDLE_DIR" -name "*.md" -mtime +60 -exec gzip {} \; 2>/dev/null
    fi
    
    print_success "Context optimization complete"
}

#######################
# HELPER FUNCTIONS
#######################

get_session_summary() {
    local active_count=$(find "$RLM_ROOT/tasks/active" -name "*.md" 2>/dev/null | wc -l)
    local completed_count=$(find "$RLM_ROOT/tasks/completed" -name "*.md" 2>/dev/null | wc -l)
    
    echo "Active tasks: $active_count"
    echo "Completed tasks: $completed_count"
}

list_active_tasks() {
    if [ -d "$RLM_ROOT/tasks/active" ]; then
        find "$RLM_ROOT/tasks/active" -name "*.md" -type f | while read -r task; do
            local task_name=$(basename "$task" .md)
            local task_title=$(grep "^# Task:" "$task" 2>/dev/null | head -1 | sed 's/^# Task: //')
            echo "- $task_name: $task_title"
        done
    fi
}

get_recent_actions() {
    if [ -d "$RLM_ROOT/progress/logs" ]; then
        find "$RLM_ROOT/progress/logs" -name "*.md" -type f -mtime -1 | head -5 | while read -r log; do
            local task=$(basename "$log" .md)
            echo "- $task (Recent activity)"
        done
    fi
}

get_current_state() {
    if [ -f "$RLM_ROOT/progress/status.json" ] && command -v jq &> /dev/null; then
        jq -r '.tasks | to_entries | .[] | "- \(.key): \(.value.status)"' \
            "$RLM_ROOT/progress/status.json" 2>/dev/null | head -10
    fi
}

#######################
# DELEGATION HELPERS
#######################

# Prepare agent invocation context
prepare_agent_context() {
    local agent_id=$1
    local task_id=$2
    local context_file="$RLM_ROOT/progress/context-bundles/agent-context-${agent_id}-${task_id}.md"
    
    print_info "Preparing context for $agent_id on $task_id..."
    
    cat > "$context_file" << EOF
# Agent Context: $agent_id
**Task:** $task_id
**Prepared:** $(date -u +"%Y-%m-%d %H:%M UTC")

## Constitution (Essential Only)
$(head -50 "$RLM_ROOT/specs/constitution.md" 2>/dev/null || echo "Not found")

## Task Specification
$(cat "$RLM_ROOT/tasks/active/${task_id}.md" 2>/dev/null || echo "Not found")

## Relevant Architecture
$(get_minimal_context "$agent_id" "$task_id")

---
*Context prepared for isolated agent execution*
EOF
    
    print_success "Context prepared: $context_file"
    echo "$context_file"
}

# Clean up agent context after completion
cleanup_agent_context() {
    local agent_id=$1
    local task_id=$2
    local context_file="$RLM_ROOT/progress/context-bundles/agent-context-${agent_id}-${task_id}.md"
    
    if [ -f "$context_file" ]; then
        # Archive instead of delete
        local archive_dir="$RLM_ROOT/progress/context-bundles/archived"
        mkdir -p "$archive_dir"
        mv "$context_file" "$archive_dir/" 2>/dev/null
        print_info "Agent context archived"
    fi
}

#######################
# COMMAND INTERFACE
#######################

# Export functions if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    export -f load_context_prime
    export -f get_minimal_context
    export -f create_context_bundle
    export -f load_context_bundle
    export -f list_context_bundles
    export -f calculate_context_size
    export -f analyze_context_bloat
    export -f optimize_context
    export -f prepare_agent_context
    export -f cleanup_agent_context
fi

# CLI interface
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    case "${1:-help}" in
        prime)
            load_context_prime "${2:-implementation}"
            ;;
        bundle)
            create_context_bundle "${2:-}"
            ;;
        load-bundle)
            load_context_bundle "$2"
            ;;
        list-bundles)
            list_context_bundles
            ;;
        analyze)
            analyze_context_bloat
            ;;
        optimize)
            optimize_context
            ;;
        prepare)
            prepare_agent_context "$2" "$3"
            ;;
        cleanup)
            cleanup_agent_context "$2" "$3"
            ;;
        *)
            cat << EOF
RLM Context Manager
==================

Usage: $0 <command> [options]

Commands:
  prime <type>           Load context prime template
  bundle [session-id]    Create context bundle
  load-bundle <id>       Load context bundle
  list-bundles           List available bundles
  analyze                Analyze context bloat
  optimize               Optimize context usage
  prepare <agent> <task> Prepare agent context
  cleanup <agent> <task> Clean up agent context

Examples:
  $0 prime implementation
  $0 bundle
  $0 analyze
  $0 optimize

Based on Elite Context Engineering Protocols:
  - Reduce: Minimize context loaded
  - Delegate: Offload to specialized agents
  - Isolate: Keep contexts clean and focused

EOF
            ;;
    esac
fi

