#!/bin/bash
# RLM Sync Script - Bidirectional GitHub Synchronization
# Usage: ./rlm-sync.sh [DIRECTION] [OPTIONS]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DIRECTION="both"
BRANCH="main"
FORCE=false
DRY_RUN=false

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
RLM Sync - Bidirectional GitHub Synchronization

Usage: ./rlm-sync.sh [DIRECTION] [OPTIONS]

Directions:
    pull        Download latest specs and tasks from GitHub
    push        Upload progress and issues to GitHub
    both        Bidirectional sync (default)

Options:
    --branch <name>
        Target branch (default: main)
    
    --force
        Force push/pull even with conflicts
    
    --dry-run
        Show what would happen without making changes
    
    -h, --help
        Display this help message

Examples:
    ./rlm-sync.sh pull
    ./rlm-sync.sh push
    ./rlm-sync.sh both --branch develop
    ./rlm-sync.sh pull --dry-run

EOF
}

# Parse command line arguments
if [[ $# -gt 0 ]] && [[ ! "$1" =~ ^-- ]]; then
    DIRECTION="$1"
    shift
fi

while [[ $# -gt 0 ]]; do
    case $1 in
        --branch)
            BRANCH="$2"
            shift 2
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
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

# Validate direction
if [[ ! "$DIRECTION" =~ ^(pull|push|both)$ ]]; then
    print_error "Invalid direction: $DIRECTION"
    usage
    exit 1
fi

# Check if in git repository
if [ ! -d "$PROJECT_ROOT/.git" ]; then
    print_error "Not a Git repository. Please initialize Git first."
    exit 1
fi

# Change to project root
cd "$PROJECT_ROOT"

# Function to pull from GitHub
sync_pull() {
    print_info "🔄 RLM Sync: Pulling from GitHub"
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN - No changes will be made"
    fi
    
    # Fetch latest from GitHub
    print_info "Fetching latest from $BRANCH branch..."
    if [ "$DRY_RUN" = false ]; then
        git fetch origin "$BRANCH" || {
            print_error "Failed to fetch from GitHub"
            exit 1
        }
    fi
    print_success "Fetched latest from $BRANCH branch"
    
    # Check for conflicts in RLM directory
    if [ "$FORCE" = false ]; then
        if git diff --name-only HEAD origin/$BRANCH | grep -q "^RLM/"; then
            print_warning "Conflicts detected in RLM directory"
            print_info "Changes detected:"
            git diff --name-only HEAD origin/$BRANCH | grep "^RLM/" | sed 's/^/  - /'
            
            if [ "$DRY_RUN" = false ]; then
                read -p "Continue with pull? (y/n) " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    print_warning "Pull cancelled"
                    exit 0
                fi
            fi
        fi
    fi
    
    # Pull specs and tasks
    print_info "Downloading specifications..."
    if [ "$DRY_RUN" = false ]; then
        git checkout origin/$BRANCH -- RLM/specs/ 2>/dev/null || print_warning "No specs to pull"
        git checkout origin/$BRANCH -- RLM/tasks/active/ 2>/dev/null || print_warning "No active tasks to pull"
        git checkout origin/$BRANCH -- RLM/config/agent-profiles.json 2>/dev/null || print_warning "No agent profiles to pull"
    fi
    
    # Count changes
    NEW_SPECS=$(find RLM/specs/requirements/ -type f -name "*.md" 2>/dev/null | wc -l)
    NEW_FEATURES=$(find RLM/specs/features/ -type d -mindepth 1 -maxdepth 1 2>/dev/null | wc -l)
    NEW_TASKS=$(find RLM/tasks/active/ -type f -name "*.md" 2>/dev/null | wc -l)
    
    print_success "Sync pull complete"
    
    echo ""
    print_info "📋 Summary:"
    echo "  - Requirements: $NEW_SPECS"
    echo "  - Features: $NEW_FEATURES"
    echo "  - Active Tasks: $NEW_TASKS"
}

# Function to push to GitHub
sync_push() {
    print_info "🔄 RLM Sync: Pushing to GitHub"
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN - No changes will be made"
    fi
    
    # Check for changes to push
    if [ "$DRY_RUN" = false ]; then
        git add RLM/progress/ RLM/issues/ 2>/dev/null || true
    fi
    
    # Show what will be pushed
    if git diff --cached --name-only | grep -q "^RLM/"; then
        print_info "Changes to push:"
        git diff --cached --name-only | grep "^RLM/" | sed 's/^/  - /'
        
        # Count changes
        PROGRESS_FILES=$(git diff --cached --name-only | grep -c "^RLM/progress/" || echo "0")
        ISSUE_FILES=$(git diff --cached --name-only | grep -c "^RLM/issues/" || echo "0")
        
        if [ "$DRY_RUN" = false ]; then
            # Create commit message
            TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")
            COMMIT_MSG="progress: RLM sync at $TIMESTAMP"
            
            if [ $ISSUE_FILES -gt 0 ]; then
                COMMIT_MSG="$COMMIT_MSG - $ISSUE_FILES issue(s)"
            fi
            
            print_info "Committing changes..."
            git commit -m "$COMMIT_MSG" || print_warning "Nothing to commit"
            
            print_info "Pushing to $BRANCH..."
            git push origin "$BRANCH" || {
                print_error "Failed to push to GitHub"
                exit 1
            }
            
            print_success "Sync push complete"
            
            echo ""
            print_info "📊 Summary:"
            echo "  - Progress updates: $PROGRESS_FILES"
            echo "  - Issues: $ISSUE_FILES"
        else
            print_info "Would commit: $PROGRESS_FILES progress, $ISSUE_FILES issues"
        fi
    else
        print_info "No changes to push"
    fi
}

# Execute sync based on direction
case "$DIRECTION" in
    pull)
        sync_pull
        ;;
    push)
        sync_push
        ;;
    both)
        sync_pull
        echo ""
        sync_push
        ;;
esac

echo ""
print_success "✓ Sync operation complete"

