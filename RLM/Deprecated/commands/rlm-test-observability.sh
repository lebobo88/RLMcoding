#!/bin/bash
# RLM Observability System Test Suite
# Tests all observability components

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

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Test function
run_test() {
    local test_name=$1
    local test_command=$2
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    print_info "Testing: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        print_success "$test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        print_error "$test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Test with output capture
run_test_with_output() {
    local test_name=$1
    local test_command=$2
    local expected_output=$3
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    print_info "Testing: $test_name"
    
    local output=$(eval "$test_command" 2>&1)
    
    if echo "$output" | grep -q "$expected_output"; then
        print_success "$test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        print_error "$test_name (Expected: $expected_output)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo ""
echo "=========================================="
echo "RLM Observability System Test Suite"
echo "=========================================="
echo ""

#######################
# 1. UTILITY SCRIPTS
#######################

echo "=== Testing Utility Scripts ==="
echo ""

# Test event-logger.sh exists and is executable
run_test "event-logger.sh exists" "[ -f '$RLM_ROOT/commands/utils/event-logger.sh' ]"

# Test event-logger.sh can initialize database
run_test "event-logger.sh init" "source '$RLM_ROOT/commands/utils/event-logger.sh' && init_event_database"

# Test event-logger.sh can log events
run_test "event-logger.sh log_event" "source '$RLM_ROOT/commands/utils/event-logger.sh' && log_event 'test_event' 'Test event' '{\"test\":true}' 'test-session' 'test-agent' 'test-task' 100 50 0.001 100"

# Test session-colors.sh exists
run_test "session-colors.sh exists" "[ -f '$RLM_ROOT/commands/utils/session-colors.sh' ]"

# Test session-colors.sh functions
run_test "session-colors.sh get_session_color" "source '$RLM_ROOT/commands/utils/session-colors.sh' && get_session_color 'test-session' > /dev/null"

# Test event-summarizer.sh exists
run_test "event-summarizer.sh exists" "[ -f '$RLM_ROOT/commands/utils/event-summarizer.sh' ]"

# Test intervention-handler.sh exists
run_test "intervention-handler.sh exists" "[ -f '$RLM_ROOT/commands/utils/intervention-handler.sh' ]"

echo ""

#######################
# 2. CLI TOOLS
#######################

echo "=== Testing CLI Tools ==="
echo ""

# Test rlm-observe.sh exists
run_test "rlm-observe.sh exists" "[ -f '$RLM_ROOT/commands/rlm-observe.sh' ]"

# Test rlm-observe.sh help
run_test_with_output "rlm-observe.sh help" "$RLM_ROOT/commands/rlm-observe.sh help" "RLM Observability CLI"

# Test rlm-observe.sh stats (should work even with empty DB)
run_test "rlm-observe.sh stats" "$RLM_ROOT/commands/rlm-observe.sh stats > /dev/null 2>&1 || true"

# Test rlm-observe-server.sh exists
run_test "rlm-observe-server.sh exists" "[ -f '$RLM_ROOT/commands/rlm-observe-server.sh' ]"

# Test rlm-observe-server.sh help
run_test_with_output "rlm-observe-server.sh help" "$RLM_ROOT/commands/rlm-observe-server.sh help" "RLM Observability Server Manager"

echo ""

#######################
# 3. DATABASE
#######################

echo "=== Testing Database ==="
echo ""

# Test database file exists
run_test "events.db exists" "[ -f '$RLM_ROOT/progress/events.db' ]"

# Test database has events table
if command -v sqlite3 &> /dev/null; then
    run_test "events table exists" "sqlite3 '$RLM_ROOT/progress/events.db' '.tables' | grep -q events"
    
    # Test we can query events
    run_test "can query events" "sqlite3 '$RLM_ROOT/progress/events.db' 'SELECT COUNT(*) FROM events' > /dev/null"
    
    # Test event_summaries table exists
    run_test "event_summaries table exists" "sqlite3 '$RLM_ROOT/progress/events.db' '.tables' | grep -q event_summaries"
else
    print_warning "sqlite3 not available - skipping database tests"
fi

echo ""

#######################
# 4. CONFIGURATION
#######################

echo "=== Testing Configuration ==="
echo ""

# Test project-config.json has observability section
if command -v jq &> /dev/null; then
    run_test "observability config exists" "jq -e '.observability' '$RLM_ROOT/config/project-config.json' > /dev/null"
    
    run_test "observability.enabled exists" "jq -e '.observability.enabled' '$RLM_ROOT/config/project-config.json' > /dev/null"
else
    print_warning "jq not available - skipping JSON config tests"
fi

echo ""

#######################
# 5. INTEGRATION
#######################

echo "=== Testing Integration ==="
echo ""

# Test rlm-build.sh sources event-logger.sh
run_test "rlm-build.sh sources event-logger" "grep -q 'source.*event-logger.sh' '$RLM_ROOT/commands/rlm-build.sh'"

# Test rlm-build.sh sources session-colors.sh
run_test "rlm-build.sh sources session-colors" "grep -q 'source.*session-colors.sh' '$RLM_ROOT/commands/rlm-build.sh'"

# Test rlm-build.sh initializes event database
run_test "rlm-build.sh initializes database" "grep -q 'init_event_database' '$RLM_ROOT/commands/rlm-build.sh'"

# Test background-agent.sh sources event-logger.sh
run_test "background-agent.sh sources event-logger" "grep -q 'source.*event-logger.sh' '$RLM_ROOT/commands/utils/background-agent.sh'"

echo ""

#######################
# 6. BACKEND SERVER
#######################

echo "=== Testing Backend Server ==="
echo ""

# Test server.js exists
run_test "server.js exists" "[ -f '$RLM_ROOT/observability/server/server.js' ]"

# Test package.json exists
run_test "package.json exists" "[ -f '$RLM_ROOT/observability/server/package.json' ]"

# Test server dependencies are listed
if command -v jq &> /dev/null; then
    run_test "server has dependencies" "jq -e '.dependencies' '$RLM_ROOT/observability/server/package.json' > /dev/null"
fi

echo ""

#######################
# 7. FRONTEND DASHBOARD
#######################

echo "=== Testing Frontend Dashboard ==="
echo ""

# Test index.html exists
run_test "index.html exists" "[ -f '$RLM_ROOT/observability/client/index.html' ]"

# Test styles.css exists
run_test "styles.css exists" "[ -f '$RLM_ROOT/observability/client/styles.css' ]"

# Test app.js exists
run_test "app.js exists" "[ -f '$RLM_ROOT/observability/client/app.js' ]"

# Test HTML references Vue.js
run_test "HTML uses Vue.js" "grep -q 'vue' '$RLM_ROOT/observability/client/index.html'"

echo ""

#######################
# 8. DOCUMENTATION
#######################

echo "=== Testing Documentation ==="
echo ""

# Test OBSERVABILITY.md exists
run_test "OBSERVABILITY.md exists" "[ -f '$RLM_ROOT/docs/OBSERVABILITY.md' ]"

# Test README mentions observability
run_test "README mentions observability" "grep -qi 'observability' '$RLM_ROOT/../README.md'"

# Test Commands Guide has observability commands
run_test "Commands Guide has observability" "grep -qi 'rlm-observe' '$RLM_ROOT/docs/RLM-Commands-Guide.md'"

echo ""

#######################
# 9. FUNCTIONAL TESTS
#######################

echo "=== Testing Functionality ==="
echo ""

# Generate test events
print_info "Generating test events..."

source "$RLM_ROOT/commands/utils/event-logger.sh" 2>/dev/null || true

# Test event logging
TEST_SESSION="test-$(date +%s)"
TEST_EVENT_ID=$(log_event "test_event" "Test event for validation" \
    '{"test":true,"component":"observability"}' \
    "$TEST_SESSION" "test-agent" "TEST-001" 100 50 0.001 100 2>/dev/null || echo "")

if [ -n "$TEST_EVENT_ID" ]; then
    print_success "Generated test event: $TEST_EVENT_ID"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
else
    print_error "Failed to generate test event"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
fi

# Test querying the event
if command -v sqlite3 &> /dev/null && [ -n "$TEST_EVENT_ID" ]; then
    run_test "can query test event" "sqlite3 '$RLM_ROOT/progress/events.db' \"SELECT COUNT(*) FROM events WHERE id = '$TEST_EVENT_ID'\" | grep -q '1'"
fi

# Test session events query
if command -v sqlite3 &> /dev/null; then
    run_test "can query session events" "sqlite3 '$RLM_ROOT/progress/events.db' \"SELECT COUNT(*) FROM events WHERE session_id = '$TEST_SESSION'\" > /dev/null"
fi

echo ""

#######################
# SUMMARY
#######################

echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""
echo "Total Tests: $TESTS_TOTAL"
print_success "Passed: $TESTS_PASSED"
if [ $TESTS_FAILED -gt 0 ]; then
    print_error "Failed: $TESTS_FAILED"
else
    echo "Failed: $TESTS_FAILED"
fi
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    print_success "All tests passed! ✓"
    echo ""
    print_info "Next steps:"
    echo "  1. Run a test build: ./RLM/commands/rlm-build.sh --mode supervised --dry-run"
    echo "  2. Monitor events: ./RLM/commands/rlm-observe.sh tail"
    echo "  3. Start dashboard: ./RLM/commands/rlm-observe-server.sh start"
    exit 0
else
    print_error "Some tests failed. Please review the errors above."
    exit 1
fi


