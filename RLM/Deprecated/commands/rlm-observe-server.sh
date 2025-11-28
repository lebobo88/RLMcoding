#!/bin/bash
# RLM Observability Server Management

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
RLM_ROOT="$(dirname "$SCRIPT_DIR")"
SERVER_DIR="$RLM_ROOT/observability/server"
PID_FILE="$RLM_ROOT/progress/observability-server.pid"
LOG_FILE="$RLM_ROOT/progress/observability-server.log"

PORT=${RLM_OBSERVABILITY_SERVER_PORT:-3000}
HOST=${RLM_OBSERVABILITY_SERVER_HOST:-localhost}

#######################
# SERVER MANAGEMENT
#######################

start_server() {
    if is_running; then
        print_warning "Server is already running (PID: $(cat "$PID_FILE"))"
        return 1
    fi
    
    print_info "Starting observability server..."
    
    # Check if Node.js is available
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ to run the server."
        return 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "$SERVER_DIR/node_modules" ]; then
        print_info "Installing dependencies..."
        cd "$SERVER_DIR"
        npm install 2>&1 | tee -a "$LOG_FILE"
    fi
    
    # Start server
    cd "$SERVER_DIR"
    nohup node server.js > "$LOG_FILE" 2>&1 &
    local pid=$!
    echo $pid > "$PID_FILE"
    
    # Wait a moment to check if it started
    sleep 2
    
    if is_running; then
        print_success "Server started (PID: $pid)"
        print_info "Server URL: http://$HOST:$PORT"
        print_info "WebSocket: ws://$HOST:$PORT"
        print_info "Logs: $LOG_FILE"
        
        # Open dashboard if configured
        if [ "${RLM_DASHBOARD_AUTO_OPEN:-false}" = "true" ]; then
            sleep 1
            open_dashboard
        fi
    else
        print_error "Server failed to start. Check logs: $LOG_FILE"
        rm -f "$PID_FILE"
        return 1
    fi
}

stop_server() {
    if ! is_running; then
        print_warning "Server is not running"
        return 1
    fi
    
    local pid=$(cat "$PID_FILE")
    print_info "Stopping server (PID: $pid)..."
    
    kill "$pid" 2>/dev/null || true
    
    # Wait for process to stop
    local count=0
    while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
        sleep 1
        count=$((count + 1))
    done
    
    if kill -0 "$pid" 2>/dev/null; then
        print_warning "Force killing server..."
        kill -9 "$pid" 2>/dev/null || true
    fi
    
    rm -f "$PID_FILE"
    print_success "Server stopped"
}

restart_server() {
    stop_server 2>/dev/null || true
    sleep 1
    start_server
}

is_running() {
    if [ ! -f "$PID_FILE" ]; then
        return 1
    fi
    
    local pid=$(cat "$PID_FILE")
    
    if ! kill -0 "$pid" 2>/dev/null; then
        rm -f "$PID_FILE"
        return 1
    fi
    
    return 0
}

status_server() {
    if is_running; then
        local pid=$(cat "$PID_FILE")
        print_success "Server is running (PID: $pid)"
        print_info "Server URL: http://$HOST:$PORT"
        
        # Check if server is responding
        if curl -s "http://$HOST:$PORT/health" &> /dev/null; then
            print_success "Server is responding"
        else
            print_warning "Server is running but not responding"
        fi
    else
        print_warning "Server is not running"
    fi
}

open_dashboard() {
    local dashboard_url="file://$RLM_ROOT/observability/client/index.html"
    
    print_info "Opening dashboard..."
    
    if command -v open &> /dev/null; then
        open "$dashboard_url"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$dashboard_url"
    elif command -v start &> /dev/null; then
        start "$dashboard_url"
    else
        print_info "Please open: $dashboard_url"
    fi
}

show_logs() {
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        print_warning "Log file not found"
    fi
}

#######################
# USAGE
#######################

usage() {
    cat << EOF
RLM Observability Server Manager
================================

Usage: $0 <command>

Commands:
  start       Start the observability server
  stop        Stop the server
  restart     Restart the server
  status      Check server status
  logs        Show server logs (tail -f)
  dashboard   Open dashboard in browser
  help        Show this help

Environment Variables:
  RLM_OBSERVABILITY_SERVER_PORT    Server port (default: 3000)
  RLM_OBSERVABILITY_SERVER_HOST    Server host (default: localhost)
  RLM_DASHBOARD_AUTO_OPEN          Auto-open dashboard on start (default: false)

Examples:
  $0 start
  $0 status
  $0 logs
  $0 stop

EOF
}

#######################
# MAIN
#######################

case "${1:-help}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        status_server
        ;;
    logs)
        show_logs
        ;;
    dashboard)
        open_dashboard
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

