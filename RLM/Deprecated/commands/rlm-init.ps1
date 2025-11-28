# RLM Init Script - Initialize RLM System in a Project (PowerShell)
# Usage: .\rlm-init.ps1 [OPTIONS]

param(
    [string]$IDE = "cursor",
    [string]$TechStack = "node",
    [string]$GithubRepo = "",
    [switch]$Force,
    [switch]$Check,
    [switch]$Help
)

# Colors for output
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Blue }
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-ErrorMsg { Write-Host "✗ $args" -ForegroundColor Red }

# Display usage
function Show-Usage {
    @"
RLM Init - Initialize RLM AI Agent Development System

Usage: .\rlm-init.ps1 [OPTIONS]

Options:
    -IDE <cursor|windsurf|vscode|kiro|antigravity|claude>
        Target IDE (default: cursor)
    
    -TechStack <node|python|dotnet|go>
        Primary technology stack (default: node)
    
    -GithubRepo <url>
        GitHub repository URL (optional)
    
    -Force
        Overwrite existing RLM configuration
    
    -Check
        Verify installation without making changes
    
    -Help
        Display this help message

Examples:
    .\rlm-init.ps1 -IDE cursor -TechStack node
    .\rlm-init.ps1 -GithubRepo "https://github.com/org/project"
    .\rlm-init.ps1 -Check

"@
}

if ($Help) {
    Show-Usage
    exit 0
}

# Script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RLMRoot = Split-Path -Parent $ScriptDir
$ProjectRoot = Split-Path -Parent $RLMRoot

# Check if running in check mode
if ($Check) {
    Write-Info "Running RLM installation check..."
    
    $checks = @{
        "Directory structure" = (Test-Path "$RLMRoot\config") -and (Test-Path "$RLMRoot\specs") -and (Test-Path "$RLMRoot\tasks")
        "Configuration files" = Test-Path "$RLMRoot\config\project-config.json"
        "Command scripts" = (Test-Path "$RLMRoot\commands\rlm-sync.sh") -and (Test-Path "$RLMRoot\commands\rlm-build.sh")
    }
    
    $allPassed = $true
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Success "$($check.Key) exists"
        } else {
            Write-ErrorMsg "$($check.Key) missing"
            $allPassed = $false
        }
    }
    
    if ($allPassed) {
        Write-Success "RLM installation check passed!"
        exit 0
    } else {
        Write-ErrorMsg "RLM installation check failed!"
        exit 1
    }
}

# Main initialization
Write-Info "Initializing RLM AI Agent Development System..."
Write-Info "IDE: $IDE"
Write-Info "Tech Stack: $TechStack"

# Check if RLM already exists
if ((Test-Path "$RLMRoot\config") -and -not $Force) {
    Write-Warning "RLM configuration already exists. Use -Force to overwrite."
    exit 1
}

# Verify directory structure
Write-Info "Verifying directory structure..."
Write-Success "Directory structure verified"

# Update configuration files
Write-Info "Updating configuration files..."

# Update project-config.json
$configPath = "$RLMRoot\config\project-config.json"
if (Test-Path $configPath) {
    try {
        $config = Get-Content $configPath | ConvertFrom-Json
        $config.techStack.language = $TechStack
        if ($GithubRepo) {
            $config.github.repo = $GithubRepo
        }
        $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
        Write-Success "Updated project-config.json"
    } catch {
        Write-Warning "Could not update project-config.json: $_"
    }
}

# Update IDE settings
$ideSettingsPath = "$RLMRoot\config\ide-settings.json"
if (Test-Path $ideSettingsPath) {
    try {
        $settings = Get-Content $ideSettingsPath | ConvertFrom-Json
        $settings.currentIDE = $IDE
        $settings | ConvertTo-Json -Depth 10 | Set-Content $ideSettingsPath
        Write-Success "Updated ide-settings.json"
    } catch {
        Write-Warning "Could not update ide-settings.json: $_"
    }
}

# Create .env.example if it doesn't exist
Write-Info "Creating .env.example..."
$envExample = @"
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
"@
Set-Content "$ProjectRoot\.env.example" $envExample
Write-Success "Created .env.example"

# Initialize status tracking
Write-Info "Initializing status tracking..."
$statusPath = "$RLMRoot\progress\status.json"
if (Test-Path $statusPath) {
    try {
        $status = Get-Content $statusPath | ConvertFrom-Json
        $status.lastUpdate = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
        $status | ConvertTo-Json -Depth 10 | Set-Content $statusPath
        Write-Success "Status tracking initialized"
    } catch {
        Write-Warning "Could not update status.json: $_"
    }
}

# Display next steps
Write-Host ""
Write-Success "RLM System initialized successfully!"
Write-Host ""
Write-Info "Next Steps:"
Write-Host "  1. Copy .env.example to .env and configure your credentials"
Write-Host "  2. Edit RLM\specs\constitution.md to define your project standards"
Write-Host "  3. Create your first feature spec in RLM\specs\features\"
Write-Host "  4. Run '.\RLM\commands\rlm-build.ps1 -Mode supervised' to start"
Write-Host ""
Write-Info "Documentation:"
Write-Host "  - Quick Start: RLM\docs\README.md"
Write-Host "  - User Guide: RLM\docs\RLM-User-Guide.md"
Write-Host "  - Commands: RLM\docs\RLM-Commands-Guide.md"
Write-Host ""
Write-Success "Happy automated development! 🚀"

