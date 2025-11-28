#!/bin/bash
# Session Color Coding for RLM Observability

# Generate color from session ID hash
get_session_color() {
    local session_id=$1
    
    if [ -z "$session_id" ]; then
        echo ""
        return
    fi
    
    # Generate hash from session ID
    local hash=$(echo -n "$session_id" | md5sum 2>/dev/null | cut -c1-6 || echo "000000")
    
    # Convert hex to RGB (ensure good contrast)
    local r=$((0x${hash:0:2}))
    local g=$((0x${hash:2:2}))
    local b=$((0x${hash:4:2}))
    
    # Ensure minimum brightness for visibility
    local min_brightness=100
    if [ $((r + g + b)) -lt $((min_brightness * 3)) ]; then
        r=$((r + min_brightness))
        g=$((g + min_brightness))
        b=$((b + min_brightness))
        # Clamp to 255
        [ $r -gt 255 ] && r=255
        [ $g -gt 255 ] && g=255
        [ $b -gt 255 ] && b=255
    fi
    
    # Return ANSI color code
    echo "38;2;$r;$g;$b"
}

# Get color emoji/circle for session
get_session_emoji() {
    local session_id=$1
    
    if [ -z "$session_id" ]; then
        echo "⚪"
        return
    fi
    
    # Use hash to pick from emoji set
    local hash=$(echo -n "$session_id" | md5sum 2>/dev/null | cut -c1-2 || echo "00")
    local index=$((0x$hash % 10))
    
    case $index in
        0) echo "🔴" ;;
        1) echo "🟠" ;;
        2) echo "🟡" ;;
        3) echo "🟢" ;;
        4) echo "🔵" ;;
        5) echo "🟣" ;;
        6) echo "🟤" ;;
        7) echo "⚫" ;;
        8) echo "⚪" ;;
        9) echo "🟦" ;;
        *) echo "⚪" ;;
    esac
}

# Format session with color
format_session() {
    local session_id=$1
    local label=${2:-""}
    
    local emoji=$(get_session_emoji "$session_id")
    local color_code=$(get_session_color "$session_id")
    
    if [ -n "$color_code" ]; then
        echo -e "\033[${color_code}m${emoji} ${session_id}${label:+: $label}\033[0m"
    else
        echo "${emoji} ${session_id}${label:+: $label}"
    fi
}

# Get agent color (consistent per agent)
get_agent_color() {
    local agent_id=$1
    
    case "$agent_id" in
        master-architect)
            echo "38;2;100;149;237"  # Cornflower blue
            ;;
        implementation-agent)
            echo "38;2;50;205;50"    # Lime green
            ;;
        testing-agent)
            echo "38;2;255;215;0"    # Gold
            ;;
        devops-agent)
            echo "38;2;255;140;0"   # Dark orange
            ;;
        security-agent)
            echo "38;2;220;20;60"    # Crimson
            ;;
        documentation-agent)
            echo "38;2;138;43;226"   # Blue violet
            ;;
        *)
            # Generate from agent ID hash
            get_session_color "$agent_id"
            ;;
    esac
}

# Format agent with color
format_agent() {
    local agent_id=$1
    local color_code=$(get_agent_color "$agent_id")
    
    if [ -n "$color_code" ]; then
        echo -e "\033[${color_code}m🤖 $agent_id\033[0m"
    else
        echo "🤖 $agent_id"
    fi
}

# Export functions if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    export -f get_session_color
    export -f get_session_emoji
    export -f format_session
    export -f get_agent_color
    export -f format_agent
fi

# Test if run directly
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    if [ -n "$1" ]; then
        echo "Session: $1"
        echo "Color code: $(get_session_color "$1")"
        echo "Emoji: $(get_session_emoji "$1")"
        echo "Formatted: $(format_session "$1" "Test Session")"
    else
        echo "Usage: $0 <session-id>"
        echo "Example: $0 bg-1234567890"
    fi
fi

