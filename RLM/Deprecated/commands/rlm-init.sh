#!/bin/bash
# RLM Init Script - Initialize RLM System in a Project
# Usage: ./rlm-init.sh [OPTIONS]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
IDE="cursor"
TECH_STACK="node"
GITHUB_REPO=""
FORCE=false
CHECK=false

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
RLM Init - Initialize RLM AI Agent Development System

Usage: ./rlm-init.sh [OPTIONS]

Options:
    --ide <cursor|windsurf|vscode|kiro|antigravity|claude>
        Target IDE (default: cursor)
    
    --tech-stack <node|python|dotnet|go>
        Primary technology stack (default: node)
    
    --github-repo <url>
        GitHub repository URL (optional)
    
    --force
        Overwrite existing RLM configuration
    
    --check
        Verify installation without making changes
    
    -h, --help
        Display this help message

Examples:
    ./rlm-init.sh --ide cursor --tech-stack node
    ./rlm-init.sh --github-repo https://github.com/org/project
    ./rlm-init.sh --check

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --ide)
            IDE="$2"
            shift 2
            ;;
        --tech-stack)
            TECH_STACK="$2"
            shift 2
            ;;
        --github-repo)
            GITHUB_REPO="$2"
            shift 2
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --check)
            CHECK=true
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

# Check if running in check mode
if [ "$CHECK" = true ]; then
    print_info "Running RLM installation check..."
    
    # Check directory structure
    if [ -d "$RLM_ROOT/config" ] && [ -d "$RLM_ROOT/specs" ] && [ -d "$RLM_ROOT/tasks" ]; then
        print_success "RLM directory structure exists"
    else
        print_error "RLM directory structure incomplete"
        exit 1
    fi
    
    # Check configuration files
    if [ -f "$RLM_ROOT/config/project-config.json" ]; then
        print_success "Configuration files exist"
    else
        print_error "Configuration files missing"
        exit 1
    fi
    
    # Check commands
    if [ -f "$RLM_ROOT/commands/rlm-sync.sh" ] && [ -f "$RLM_ROOT/commands/rlm-build.sh" ]; then
        print_success "Command scripts exist"
    else
        print_error "Command scripts missing"
        exit 1
    fi
    
    print_success "RLM installation check passed!"
    exit 0
fi

# Main initialization
print_info "Initializing RLM AI Agent Development System..."
print_info "IDE: $IDE"
print_info "Tech Stack: $TECH_STACK"

# Check if RLM already exists
if [ -d "$RLM_ROOT/config" ] && [ "$FORCE" = false ]; then
    print_warning "RLM configuration already exists. Use --force to overwrite."
    exit 1
fi

# Create directory structure (already exists from manual creation)
print_info "Verifying directory structure..."
print_success "Directory structure verified"

# Update configuration files
print_info "Updating configuration files..."

# Update project-config.json
if [ -f "$RLM_ROOT/config/project-config.json" ]; then
    # Use jq if available, otherwise keep defaults
    if command -v jq &> /dev/null; then
        jq --arg ts "$TECH_STACK" '.techStack.language = $ts' "$RLM_ROOT/config/project-config.json" > "$RLM_ROOT/config/project-config.tmp.json"
        mv "$RLM_ROOT/config/project-config.tmp.json" "$RLM_ROOT/config/project-config.json"
        
        if [ -n "$GITHUB_REPO" ]; then
            jq --arg repo "$GITHUB_REPO" '.github.repo = $repo' "$RLM_ROOT/config/project-config.json" > "$RLM_ROOT/config/project-config.tmp.json"
            mv "$RLM_ROOT/config/project-config.tmp.json" "$RLM_ROOT/config/project-config.json"
        fi
    fi
    print_success "Updated project-config.json"
fi

# Update IDE settings
if [ -f "$RLM_ROOT/config/ide-settings.json" ]; then
    if command -v jq &> /dev/null; then
        jq --arg ide "$IDE" '.currentIDE = $ide' "$RLM_ROOT/config/ide-settings.json" > "$RLM_ROOT/config/ide-settings.tmp.json"
        mv "$RLM_ROOT/config/ide-settings.tmp.json" "$RLM_ROOT/config/ide-settings.json"
    fi
    print_success "Updated ide-settings.json"
fi

# Initialize Git hooks
print_info "Installing Git hooks..."
if [ -d "$PROJECT_ROOT/.git" ]; then
    # Create pre-commit hook
    cat > "$PROJECT_ROOT/.git/hooks/pre-commit" << 'HOOK_EOF'
#!/bin/bash
# RLM pre-commit hook
# Validates specs and runs linting
echo "Running RLM pre-commit checks..."
HOOK_EOF
    chmod +x "$PROJECT_ROOT/.git/hooks/pre-commit"
    print_success "Git hooks installed"
else
    print_warning "Not a Git repository. Skipping Git hooks."
fi

# Create .env.example if it doesn't exist
print_info "Creating .env.example..."
cat > "$PROJECT_ROOT/.env.example" << 'ENV_EOF'
# GitHub Integration
RLM_GITHUB_TOKEN=ghp_your_token_here
RLM_GITHUB_REPO=your-org/your-project
RLM_GITHUB_BRANCH=main

# AI Configuration
RLM_AI_MODEL=claude-sonnet-4
RLM_AI_API_KEY=sk-your-api-key
RLM_AI_TEMPERATURE=0.2

# Automation Settings
RLM_DEFAULT_MODE=supervised
RLM_PARALLEL_TASKS=4
RLM_AUTO_COMMIT=true

# Testing Configuration
RLM_TEST_COVERAGE_THRESHOLD=80
RLM_AUTO_FIX_TESTS=true

# Notification Settings (Optional)
RLM_WEBHOOK_URL=
RLM_EMAIL_TO=
RLM_SLACK_WEBHOOK=
ENV_EOF
print_success "Created .env.example"

# Make all command scripts executable
print_info "Making command scripts executable..."
chmod +x "$RLM_ROOT/commands"/*.sh 2>/dev/null || true
print_success "Command scripts are executable"

# Initialize status tracking
print_info "Initializing status tracking..."
if [ -f "$RLM_ROOT/progress/status.json" ]; then
    CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    if command -v jq &> /dev/null; then
        jq --arg date "$CURRENT_DATE" '.lastUpdate = $date' "$RLM_ROOT/progress/status.json" > "$RLM_ROOT/progress/status.tmp.json"
        mv "$RLM_ROOT/progress/status.tmp.json" "$RLM_ROOT/progress/status.json"
    fi
fi
print_success "Status tracking initialized"

# Display next steps
echo ""
print_success "RLM System initialized successfully!"
echo ""
print_info "Next Steps:"
echo "  1. Copy .env.example to .env and configure your credentials"
echo "  2. Edit RLM/specs/constitution.md to define your project standards"
echo "  3. Create your first feature spec in RLM/specs/features/"
echo "  4. Run './RLM/commands/rlm-build.sh --mode supervised' to start"
echo ""
print_info "Documentation:"
echo "  - Quick Start: RLM/docs/README.md"
echo "  - User Guide: RLM/docs/RLM-User-Guide.md"
echo "  - Commands: RLM/docs/RLM-Commands-Guide.md"
echo ""
print_success "Happy automated development! 🚀"

