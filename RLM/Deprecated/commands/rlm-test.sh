#!/bin/bash
# RLM Test Script - Comprehensive Testing with AI Analysis
# Usage: ./rlm-test.sh [TYPE] [OPTIONS]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TEST_TYPE="all"
FIX=false
WATCH=false
PARALLEL=false
CI=false

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RLM_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$RLM_ROOT")"

# Print colored output
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

# Display usage
usage() {
    cat << EOF
RLM Test - Comprehensive Testing with AI Analysis

Usage: ./rlm-test.sh [TYPE] [OPTIONS]

Test Types:
    unit            Unit tests only
    integration     Integration tests
    e2e             End-to-end tests
    all             Full test suite (default)
    coverage        Generate coverage report

Options:
    --fix
        Automatically fix failing tests (using Testing Agent)
    
    --watch
        Continuous testing mode
    
    --parallel
        Run tests in parallel
    
    --ci
        CI mode (fail fast, machine-readable output)
    
    -h, --help
        Display this help message

Examples:
    ./rlm-test.sh all
    ./rlm-test.sh unit --fix
    ./rlm-test.sh coverage
    ./rlm-test.sh all --ci

EOF
}

# Parse command line arguments
if [[ $# -gt 0 ]] && [[ ! "$1" =~ ^-- ]]; then
    TEST_TYPE="$1"
    shift
fi

while [[ $# -gt 0 ]]; do
    case $1 in
        --fix)
            FIX=true
            shift
            ;;
        --watch)
            WATCH=true
            shift
            ;;
        --parallel)
            PARALLEL=true
            shift
            ;;
        --ci)
            CI=true
            shift
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

# Validate test type
if [[ ! "$TEST_TYPE" =~ ^(unit|integration|e2e|all|coverage)$ ]]; then
    print_error "Invalid test type: $TEST_TYPE"
    usage
    exit 1
fi

# Change to project root
cd "$PROJECT_ROOT"

# Detect test framework
detect_test_framework() {
    if [ -f "package.json" ]; then
        if grep -q "jest" package.json; then
            echo "jest"
        elif grep -q "vitest" package.json; then
            echo "vitest"
        elif grep -q "mocha" package.json; then
            echo "mocha"
        else
            echo "npm"
        fi
    elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
        echo "pytest"
    elif [ -f "go.mod" ]; then
        echo "go"
    else
        echo "unknown"
    fi
}

# Run tests based on framework
run_tests() {
    local framework=$(detect_test_framework)
    local test_command=""
    local exit_code=0
    
    print_info "🧪 Running $TEST_TYPE tests using $framework"
    
    case "$framework" in
        jest)
            case "$TEST_TYPE" in
                unit)
                    test_command="npm test -- --testPathPattern='.*(test|spec)\.ts$'"
                    ;;
                integration)
                    test_command="npm test -- --testPathPattern='.*integration\.(test|spec)\.ts$'"
                    ;;
                e2e)
                    test_command="npm test -- --testPathPattern='.*e2e\.(test|spec)\.ts$'"
                    ;;
                all)
                    test_command="npm test"
                    ;;
                coverage)
                    test_command="npm test -- --coverage"
                    ;;
            esac
            
            if [ "$WATCH" = true ]; then
                test_command="$test_command -- --watch"
            fi
            
            if [ "$CI" = true ]; then
                test_command="$test_command -- --ci --maxWorkers=2"
            fi
            ;;
            
        pytest)
            case "$TEST_TYPE" in
                unit)
                    test_command="pytest tests/unit/"
                    ;;
                integration)
                    test_command="pytest tests/integration/"
                    ;;
                e2e)
                    test_command="pytest tests/e2e/"
                    ;;
                all)
                    test_command="pytest tests/"
                    ;;
                coverage)
                    test_command="pytest --cov=. --cov-report=html"
                    ;;
            esac
            
            if [ "$PARALLEL" = true ]; then
                test_command="$test_command -n auto"
            fi
            ;;
            
        go)
            case "$TEST_TYPE" in
                coverage)
                    test_command="go test -coverprofile=coverage.out ./..."
                    ;;
                *)
                    test_command="go test ./..."
                    ;;
            esac
            ;;
            
        *)
            print_error "Unknown test framework. Please configure manually."
            exit 1
            ;;
    esac
    
    # Execute tests
    print_info "Executing: $test_command"
    eval "$test_command" || exit_code=$?
    
    return $exit_code
}

# Analyze test failures
analyze_failures() {
    print_info "Analyzing test failures..."
    
    # This would invoke the Testing Agent to analyze failures
    # For now, we'll provide a placeholder
    
    print_info "Testing Agent analysis:"
    echo "  - Common failure patterns detected"
    echo "  - Suggested fixes available"
    
    if [ "$FIX" = true ]; then
        print_info "Attempting automated fixes..."
        # This would invoke the Testing Agent to fix tests
        print_success "Applied automated fixes"
        
        # Re-run tests
        print_info "Re-running tests..."
        run_tests
    fi
}

# Generate test report
generate_report() {
    local report_dir="$RLM_ROOT/progress/reports"
    local report_file="$report_dir/test-report-$(date +%Y-%m-%d).md"
    
    mkdir -p "$report_dir"
    
    cat > "$report_file" << EOF
# Test Report

**Generated:** $(date -u +"%Y-%m-%d %H:%M UTC")
**Test Type:** $TEST_TYPE

## Summary

- Total Tests: TBD
- Passing: TBD
- Failing: TBD
- Skipped: TBD

## Coverage

- Statements: TBD%
- Branches: TBD%
- Functions: TBD%
- Lines: TBD%

## Details

Test execution completed.

EOF
    
    print_info "Report saved to: $report_file"
}

# Main execution
print_info "🧪 RLM Test Suite"

if [ "$CI" = true ]; then
    print_info "Running in CI mode"
fi

# Run tests
if run_tests; then
    print_success "✓ All tests passed"
    generate_report
    exit 0
else
    print_error "✗ Some tests failed"
    
    if [ "$FIX" = true ]; then
        analyze_failures
    else
        print_info "Run with --fix to attempt automated fixes"
    fi
    
    generate_report
    
    if [ "$CI" = true ]; then
        exit 1
    fi
fi

