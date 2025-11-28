#!/bin/bash
# Git Helper Functions for RLM

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

# Check if in git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not a git repository"
        return 1
    fi
    return 0
}

# Get current branch
get_current_branch() {
    git rev-parse --abbrev-ref HEAD
}

# Check if branch exists
branch_exists() {
    local branch=$1
    git show-ref --verify --quiet "refs/heads/$branch"
}

# Create and checkout branch
create_branch() {
    local branch=$1
    if branch_exists "$branch"; then
        print_warning "Branch $branch already exists"
        git checkout "$branch"
    else
        git checkout -b "$branch"
        print_success "Created and checked out branch: $branch"
    fi
}

# Commit with conventional commit message
commit_conventional() {
    local type=$1
    local scope=$2
    local message=$3
    
    if [ -z "$scope" ]; then
        git commit -m "$type: $message"
    else
        git commit -m "$type($scope): $message"
    fi
}

# Push with tracking
push_with_tracking() {
    local branch=$(get_current_branch)
    git push -u origin "$branch"
}

# Check for uncommitted changes
has_uncommitted_changes() {
    ! git diff-index --quiet HEAD --
}

# Check for untracked files
has_untracked_files() {
    [ -n "$(git ls-files --others --exclude-standard)" ]
}

# Get list of modified files
get_modified_files() {
    git diff --name-only
}

# Get list of staged files
get_staged_files() {
    git diff --cached --name-only
}

# Create tag
create_tag() {
    local tag=$1
    local message=$2
    git tag -a "$tag" -m "$message"
}

# Export functions if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    export -f check_git_repo
    export -f get_current_branch
    export -f branch_exists
    export -f create_branch
    export -f commit_conventional
    export -f push_with_tracking
    export -f has_uncommitted_changes
    export -f has_untracked_files
    export -f get_modified_files
    export -f get_staged_files
    export -f create_tag
fi

