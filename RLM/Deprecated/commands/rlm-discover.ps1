<#
.SYNOPSIS
    RLM Discover - AI-Assisted Spec Creation from Ideas

.DESCRIPTION
    Transforms raw project ideas into complete RLM specifications through:
    1. AI-powered research (web, codebase, domain)
    2. Intelligent clarifying questions
    3. Automated spec generation
    4. Interactive refinement

.PARAMETER Idea
    Project idea as text or path to markdown file

.PARAMETER Codebase
    Path to existing codebase (for brownfield projects)

.PARAMETER Domain
    Target domain (e.g., fintech, healthcare, ecommerce)

.PARAMETER Mode
    Interaction mode: interactive (default), guided, auto

.PARAMETER Resume
    Session ID to resume a previous discovery session

.PARAMETER SkipQuestions
    Skip question phase and use AI assumptions

.EXAMPLE
    ./rlm-discover.ps1 --idea "Build a task management app with AI prioritization"

.EXAMPLE
    ./rlm-discover.ps1 --idea ./my-idea.md --codebase ./existing-project --domain productivity

.EXAMPLE
    ./rlm-discover.ps1 --resume DISC-1234567890

.NOTES
    AI Provider Agnostic - Works with:
    - Claude (ANTHROPIC_API_KEY or Claude CLI)
    - OpenAI GPT (OPENAI_API_KEY)
    - Google Gemini (GOOGLE_API_KEY)
    - Ollama local models (ollama serve)
    - Any OpenAI-compatible API (RLM_AI_API_URL)

    Optional: PERPLEXITY_API_KEY for enhanced web research
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [Alias("idea")]
    [string]$IdeaInput = "",

    [Parameter()]
    [Alias("codebase")]
    [string]$CodebasePath = "",

    [Parameter()]
    [string]$Domain = "",

    [Parameter()]
    [ValidateSet("interactive", "guided", "auto")]
    [string]$Mode = "interactive",

    [Parameter()]
    [string]$Resume = "",

    [Parameter()]
    [Alias("skip-questions")]
    [switch]$SkipQuestions,

    [Parameter()]
    [Alias("h")]
    [switch]$Help,

    [Parameter()]
    [Alias("provider")]
    [ValidateSet("claude", "openai", "gemini", "ollama", "openai-compatible", "")]
    [string]$AIProvider = "",

    [Parameter()]
    [Alias("model")]
    [string]$AIModel = ""
)

# Script configuration
$ErrorActionPreference = "Stop"
$script:ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$script:RlmRoot = Split-Path -Parent $script:ScriptDir
$script:ProjectRoot = Split-Path -Parent $script:RlmRoot

# Colors and formatting
function Write-Info { param([string]$Message) Write-Host "[i] $Message" -ForegroundColor Blue }
function Write-Success { param([string]$Message) Write-Host "[+] $Message" -ForegroundColor Green }
function Write-Warning { param([string]$Message) Write-Host "[!] $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[x] $Message" -ForegroundColor Red }
function Write-Agent { param([string]$Message) Write-Host "[*] $Message" -ForegroundColor Magenta }
function Write-Question { param([string]$Message) Write-Host "[?] $Message" -ForegroundColor Cyan }
function Write-Phase { param([string]$Message) Write-Host "`n=== $Message ===" -ForegroundColor Magenta }

# Display help
function Show-Help {
    $helpText = @"

RLM Discover - AI-Assisted Spec Creation from Ideas

USAGE:
    ./rlm-discover.ps1 [OPTIONS]

OPTIONS:
    --idea <text|file>
        Project idea (text or path to markdown file)

    --codebase <path>
        Path to existing codebase (for brownfield projects)

    --domain <domain>
        Target domain (e.g., fintech, healthcare, ecommerce)

    --mode <interactive|guided|auto>
        Interaction mode (default: interactive)
        - interactive: Full control over each phase
        - guided: Step-by-step with AI suggestions
        - auto: Minimal interaction, use defaults

    --resume <session-id>
        Resume a previous discovery session

    --skip-questions
        Skip question phase, use AI assumptions

    --provider <claude|openai|gemini|ollama|openai-compatible>
        AI provider to use (auto-detected if not specified)

    --model <model-name>
        Specific model to use (e.g., gpt-4o, claude-sonnet-4, llama3)

    -h, --help
        Display this help message

EXAMPLES:
    ./rlm-discover.ps1 --idea "Build a task management app with AI prioritization"
    ./rlm-discover.ps1 --idea ./my-idea.md --codebase ./existing-project
    ./rlm-discover.ps1 --resume DISC-1234567890
    ./rlm-discover.ps1 --idea "E-commerce platform" --domain ecommerce --mode guided
    ./rlm-discover.ps1 --idea "API service" --provider openai --model gpt-4o
    ./rlm-discover.ps1 --idea "Local app" --provider ollama --model codellama

PHASES:
    1. RESEARCH   - AI researches your idea (web + codebase)
    2. QUESTIONS  - AI asks clarifying questions incrementally
    3. DRAFT      - AI generates spec documents
    4. REFINEMENT - You review and refine specs

OUTPUT:
    - RLM/specs/constitution.md (updated)
    - RLM/specs/features/FTR-XXX/spec.md
    - RLM/specs/architecture/overview.md
    - RLM/specs/epics/breakdown.md

AI PROVIDERS (set one):
    ANTHROPIC_API_KEY   - For Claude models
    OPENAI_API_KEY      - For GPT models
    GOOGLE_API_KEY      - For Gemini models
    ollama serve        - For local Ollama models
    RLM_AI_API_URL      - For OpenAI-compatible endpoints

OPTIONAL:
    PERPLEXITY_API_KEY  - For enhanced web research
    RLM_AI_PROVIDER     - Override provider detection
    RLM_AI_MODEL        - Override model selection

"@
    Write-Host $helpText
}

# Initialize session
function Initialize-Session {
    param(
        [string]$SessionId = ""
    )

    if (-not $SessionId) {
        $SessionId = "DISC-$(Get-Date -Format 'yyyyMMddHHmmss')"
    }

    $sessionDir = Join-Path $script:RlmRoot "research/sessions/$SessionId"

    if (-not (Test-Path $sessionDir)) {
        New-Item -ItemType Directory -Path $sessionDir -Force | Out-Null
        New-Item -ItemType Directory -Path "$sessionDir/drafts" -Force | Out-Null
        New-Item -ItemType Directory -Path "$sessionDir/drafts/features" -Force | Out-Null
    }

    $state = @{
        session_id = $SessionId
        created_at = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        current_phase = "INIT"
        mode = $Mode
        codebase_path = $CodebasePath
        domain = $Domain
        phases_completed = @()
        last_updated = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        question_rounds = 0
    }

    $stateFile = Join-Path $sessionDir "state.json"
    $state | ConvertTo-Json -Depth 10 | Out-File -FilePath $stateFile -Encoding utf8

    return @{
        SessionId = $SessionId
        SessionDir = $sessionDir
        State = $state
    }
}

# Load existing session
function Get-Session {
    param([string]$SessionId)

    $sessionDir = Join-Path $script:RlmRoot "research/sessions/$SessionId"
    $stateFile = Join-Path $sessionDir "state.json"

    if (-not (Test-Path $stateFile)) {
        throw "Session not found: $SessionId"
    }

    $state = Get-Content $stateFile -Raw | ConvertFrom-Json -AsHashtable

    return @{
        SessionId = $SessionId
        SessionDir = $sessionDir
        State = $state
    }
}

# Update session state
function Update-SessionState {
    param(
        [hashtable]$Session,
        [string]$NewPhase,
        [string]$Action
    )

    $Session.State.current_phase = $NewPhase
    $Session.State.last_updated = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    $Session.State.phases_completed += $Action

    $stateFile = Join-Path $Session.SessionDir "state.json"
    $Session.State | ConvertTo-Json -Depth 10 | Out-File -FilePath $stateFile -Encoding utf8
}

# Capture user's idea
function Capture-Idea {
    param([hashtable]$Session)

    Write-Phase "CAPTURING YOUR IDEA"

    $ideaContent = ""

    if ($IdeaInput) {
        if (Test-Path $IdeaInput) {
            $ideaContent = Get-Content $IdeaInput -Raw
            Write-Info "Loaded idea from file: $IdeaInput"
        }
        else {
            $ideaContent = $IdeaInput
            Write-Info "Using provided idea text"
        }
    }
    else {
        Write-Info "Please describe your project idea."
        Write-Info "Type your idea and press Enter twice when done:"
        Write-Host ""

        $lines = @()
        $emptyCount = 0
        while ($emptyCount -lt 1) {
            $line = Read-Host
            if ([string]::IsNullOrWhiteSpace($line)) {
                $emptyCount++
            }
            else {
                $emptyCount = 0
                $lines += $line
            }
        }
        $ideaContent = $lines -join "`n"
    }

    # Save idea
    $ideaFile = Join-Path $Session.SessionDir "idea.md"
    $ideaDoc = @"
# Project Idea

**Session:** $($Session.SessionId)
**Captured:** $(Get-Date -Format "yyyy-MM-dd HH:mm UTC")
**Domain:** $(if ($Domain) { $Domain } else { "Not specified" })
**Existing Codebase:** $(if ($CodebasePath) { $CodebasePath } else { "None (greenfield)" })

## Raw Idea

$ideaContent

## Metadata

- Mode: $Mode
- Skip Questions: $SkipQuestions
"@

    $ideaDoc | Out-File -FilePath $ideaFile -Encoding utf8
    Write-Success "Idea captured and saved"

    Update-SessionState -Session $Session -NewPhase "RESEARCH" -Action "idea_captured"
}

# Run research phase
function Invoke-ResearchPhase {
    param([hashtable]$Session)

    Write-Phase "RESEARCH PHASE"
    Write-Agent "Research Agent is analyzing your idea..."

    $ideaFile = Join-Path $Session.SessionDir "idea.md"
    $ideaContent = Get-Content $ideaFile -Raw

    # Try Perplexity research first
    $perplexityAvailable = $null -ne $env:PERPLEXITY_API_KEY

    if ($perplexityAvailable) {
        Write-Info "Conducting web research via Perplexity..."

        # Import the Perplexity client
        . "$script:ScriptDir/utils/perplexity-client.ps1"

        try {
            $webResearch = Invoke-ComprehensiveResearch -Idea $ideaContent -Domain $Domain -OutputPath $Session.SessionDir
            Write-Success "Web research complete"
        }
        catch {
            Write-Warning "Web research failed: $_"
            $webResearch = $null
        }
    }
    else {
        Write-Warning "PERPLEXITY_API_KEY not set - skipping web research"
        Write-Info "Set with: `$env:PERPLEXITY_API_KEY = 'pplx-xxxxx'"
        $webResearch = $null
    }

    # Analyze codebase if provided
    $codebaseAnalysis = $null
    if ($CodebasePath -and (Test-Path $CodebasePath)) {
        Write-Info "Analyzing existing codebase..."
        $codebaseAnalysis = Analyze-Codebase -Path $CodebasePath
        Write-Success "Codebase analysis complete"
    }

    # Build research context for Claude
    $researchContext = @"
# Research Context

## Original Idea
$ideaContent

## Domain
$(if ($Domain) { $Domain } else { "Not specified" })

"@

    if ($webResearch -and $webResearch.Research) {
        $researchContext += @"

## Web Research Findings

### Competitors
$(if ($webResearch.Research.Competitors.Success) { $webResearch.Research.Competitors.Content } else { "Not available" })

### Best Practices
$(if ($webResearch.Research.BestPractices.Success) { $webResearch.Research.BestPractices.Content } else { "Not available" })

### Market Analysis
$(if ($webResearch.Research.MarketAnalysis -and $webResearch.Research.MarketAnalysis.Success) { $webResearch.Research.MarketAnalysis.Content } else { "Not available" })

"@
    }

    if ($codebaseAnalysis) {
        $researchContext += @"

## Codebase Analysis
$codebaseAnalysis

"@
    }

    # Save research context
    $contextFile = Join-Path $Session.SessionDir "research-context.md"
    $researchContext | Out-File -FilePath $contextFile -Encoding utf8

    # Invoke Claude to synthesize findings
    Write-Info "Synthesizing research findings..."

    $systemPrompt = Get-Content (Join-Path $script:RlmRoot "agents/research-agent.md") -Raw
    $userPrompt = @"
Based on the research context provided, create a comprehensive research findings document.

$researchContext

Generate a findings.md document that includes:
1. Executive Summary (2-3 sentences)
2. Core Problem Statement
3. Key Findings from research
4. Competitive Landscape summary
5. Technology Recommendations with rationale
6. Risk Assessment
7. Initial scope suggestions (MVP vs full)

Format as structured markdown.
"@

    try {
        $findings = Invoke-AIAgent -SystemPrompt $systemPrompt -UserPrompt $userPrompt
        $findingsFile = Join-Path $Session.SessionDir "findings.md"
        $findings | Out-File -FilePath $findingsFile -Encoding utf8
        Write-Success "Research findings generated"
    }
    catch {
        Write-Warning "Claude invocation failed, using web research as findings"
        if ($webResearch) {
            $findingsFile = Join-Path $Session.SessionDir "findings.md"
            Format-ResearchAsMarkdown -Results $webResearch | Out-File -FilePath $findingsFile -Encoding utf8
        }
    }

    Update-SessionState -Session $Session -NewPhase "QUESTIONS" -Action "research_complete"
}

# Analyze codebase
function Analyze-Codebase {
    param([string]$Path)

    $analysis = [System.Text.StringBuilder]::new()

    [void]$analysis.AppendLine("### Codebase Structure")

    # Get folder structure (limited depth)
    $folders = Get-ChildItem -Path $Path -Directory -Recurse -Depth 2 |
        Where-Object { $_.Name -notmatch 'node_modules|\.git|dist|build|__pycache__|\.next' } |
        Select-Object -First 50

    [void]$analysis.AppendLine("```")
    foreach ($folder in $folders) {
        $relativePath = $folder.FullName.Replace($Path, "").TrimStart("\", "/")
        [void]$analysis.AppendLine($relativePath)
    }
    [void]$analysis.AppendLine("```")

    # Detect tech stack
    [void]$analysis.AppendLine("")
    [void]$analysis.AppendLine("### Detected Tech Stack")

    if (Test-Path (Join-Path $Path "package.json")) {
        $pkg = Get-Content (Join-Path $Path "package.json") -Raw | ConvertFrom-Json
        [void]$analysis.AppendLine("- **Runtime:** Node.js")
        if ($pkg.dependencies) {
            $deps = ($pkg.dependencies.PSObject.Properties.Name | Select-Object -First 10) -join ", "
            [void]$analysis.AppendLine("- **Dependencies:** $deps")
        }
    }

    if (Test-Path (Join-Path $Path "requirements.txt")) {
        [void]$analysis.AppendLine("- **Runtime:** Python")
        $reqs = Get-Content (Join-Path $Path "requirements.txt") | Select-Object -First 10
        [void]$analysis.AppendLine("- **Dependencies:** $($reqs -join ', ')")
    }

    if (Test-Path (Join-Path $Path "go.mod")) {
        [void]$analysis.AppendLine("- **Runtime:** Go")
    }

    if (Test-Path (Join-Path $Path "Cargo.toml")) {
        [void]$analysis.AppendLine("- **Runtime:** Rust")
    }

    return $analysis.ToString()
}

# Import AI provider abstraction
. "$script:ScriptDir/utils/ai-provider.ps1"

# Invoke AI agent (provider-agnostic)
function Invoke-AIAgent {
    param(
        [string]$SystemPrompt,
        [string]$UserPrompt
    )

    # Use the AI provider abstraction layer
    try {
        $result = Invoke-AICompletion `
            -SystemPrompt $SystemPrompt `
            -UserPrompt $UserPrompt `
            -Provider $AIProvider `
            -Model $AIModel

        return $result
    }
    catch {
        Write-Warning "AI invocation failed: $_"

        # Show available providers on failure
        Write-Host ""
        Get-AvailableProviders
        Write-Host ""

        throw "AI provider error. Configure one of the providers listed above."
    }
}

# Run question phase
function Invoke-QuestionPhase {
    param([hashtable]$Session)

    Write-Phase "QUESTION PHASE"

    if ($SkipQuestions) {
        Write-Warning "Skipping questions (using AI assumptions)"
        Update-SessionState -Session $Session -NewPhase "DRAFT" -Action "questions_skipped"
        return
    }

    $Session.State.question_rounds++
    $round = $Session.State.question_rounds

    Write-Agent "Research Agent is generating clarifying questions (Round $round)..."

    # Load findings
    $findingsFile = Join-Path $Session.SessionDir "findings.md"
    $findings = if (Test-Path $findingsFile) { Get-Content $findingsFile -Raw } else { "" }

    # Load previous answers if any
    $answersFile = Join-Path $Session.SessionDir "answers.md"
    $previousAnswers = if (Test-Path $answersFile) { Get-Content $answersFile -Raw } else { "" }

    # Generate questions based on findings and previous answers
    $systemPrompt = Get-Content (Join-Path $script:RlmRoot "agents/research-agent.md") -Raw
    $userPrompt = @"
Based on the research findings and any previous answers, generate clarifying questions.

## Research Findings
$findings

## Previous Answers
$previousAnswers

## Instructions
Generate 3-5 clarifying questions for Round $round.
$(if ($round -eq 1) { "Focus on CRITICAL and HIGH priority questions that block spec creation." } else { "Generate follow-up questions based on the answers provided. Be specific based on what the user told us." })

Format each question as:
### Q[number]: [Category] - [Priority]
**Question:** [The actual question]
**Context:** [Why this matters for the spec]
**Default Assumption:** [What AI will assume if skipped]

Categories: Business, Technical, UX, Data, Security
Priorities: Critical, High, Medium, Low
"@

    try {
        $questions = Invoke-AIAgent -SystemPrompt $systemPrompt -UserPrompt $userPrompt
    }
    catch {
        Write-Warning "Failed to generate questions: $_"
        $questions = Generate-DefaultQuestions -Round $round
    }

    # Display questions and collect answers
    Write-Host ""
    Write-Host $questions
    Write-Host ""

    $questionsFile = Join-Path $Session.SessionDir "questions-round-$round.md"
    $questions | Out-File -FilePath $questionsFile -Encoding utf8

    # Collect answers interactively
    $answers = [System.Text.StringBuilder]::new()
    [void]$answers.AppendLine("# Answers - Round $round")
    [void]$answers.AppendLine("**Date:** $(Get-Date -Format 'yyyy-MM-dd HH:mm')")
    [void]$answers.AppendLine("")

    Write-Question "Please answer the questions above."
    Write-Info "Type 'done' to proceed with current answers, 'skip' to use AI assumptions."
    Write-Host ""

    $questionNum = 1
    $continueAsking = $true

    while ($continueAsking) {
        $prompt = "Q$questionNum answer (or done/skip): "
        $answer = Read-Host $prompt

        switch ($answer.ToLower()) {
            "done" {
                $continueAsking = $false
                break
            }
            "skip" {
                [void]$answers.AppendLine("## Q$questionNum")
                [void]$answers.AppendLine("**Answer:** [Skipped - using AI assumption]")
                [void]$answers.AppendLine("")
                $questionNum++
            }
            default {
                if (-not [string]::IsNullOrWhiteSpace($answer)) {
                    [void]$answers.AppendLine("## Q$questionNum")
                    [void]$answers.AppendLine("**Answer:** $answer")
                    [void]$answers.AppendLine("")
                }
                $questionNum++
            }
        }

        # Assume max 10 questions per round
        if ($questionNum -gt 10) {
            $continueAsking = $false
        }
    }

    # Append to answers file
    $allAnswers = ""
    if (Test-Path $answersFile) {
        $allAnswers = Get-Content $answersFile -Raw
    }
    $allAnswers += "`n" + $answers.ToString()
    $allAnswers | Out-File -FilePath $answersFile -Encoding utf8

    Write-Success "Answers recorded"

    # Check if more questions needed (in incremental mode)
    if ($Mode -eq "interactive" -and $round -lt 3) {
        Write-Host ""
        $moreQuestions = Read-Host "Would you like another round of questions? (yes/no)"
        if ($moreQuestions -match "^y(es)?$") {
            Update-SessionState -Session $Session -NewPhase "QUESTIONS" -Action "answers_round_$round"
            Invoke-QuestionPhase -Session $Session
            return
        }
    }

    Update-SessionState -Session $Session -NewPhase "DRAFT" -Action "questions_complete"
}

# Generate default questions if Claude fails
function Generate-DefaultQuestions {
    param([int]$Round)

    if ($Round -eq 1) {
        return @"
### Q1: Business - Critical
**Question:** What is the primary business goal for this project?
**Context:** Understanding the core objective helps prioritize features.
**Default Assumption:** General productivity/utility tool

### Q2: Technical - Critical
**Question:** What is the expected scale (users, requests, data volume)?
**Context:** Scale requirements significantly impact technology choices.
**Default Assumption:** Small to medium scale (< 10,000 users)

### Q3: Business - High
**Question:** Who are the target users/customers?
**Context:** User personas affect UX decisions and feature prioritization.
**Default Assumption:** General consumers or small business users

### Q4: Technical - High
**Question:** Are there specific technology preferences or constraints?
**Context:** May need to integrate with existing systems or team skills.
**Default Assumption:** Modern web stack (React, Node.js, PostgreSQL)

### Q5: Data - High
**Question:** What are the data privacy/compliance requirements?
**Context:** Affects architecture, storage, and security decisions.
**Default Assumption:** Standard data protection, no special compliance
"@
    }
    else {
        return @"
### Q1: Technical - Medium
**Question:** What third-party integrations are required?
**Context:** Integrations affect architecture and development timeline.
**Default Assumption:** Standard OAuth, no specialized integrations

### Q2: UX - Medium
**Question:** What devices/platforms need support?
**Context:** Affects technology choices and testing requirements.
**Default Assumption:** Web-first, responsive design

### Q3: Security - Medium
**Question:** What authentication method is preferred?
**Context:** Security architecture planning.
**Default Assumption:** Email/password with optional OAuth
"@
    }
}

# Run draft phase
function Invoke-DraftPhase {
    param([hashtable]$Session)

    Write-Phase "DRAFT PHASE"
    Write-Agent "Master Architect is generating specifications..."

    # Prepare handoff document
    $handoff = Prepare-ArchitectHandoff -Session $Session

    $handoffFile = Join-Path $Session.SessionDir "handoff.md"
    $handoff | Out-File -FilePath $handoffFile -Encoding utf8

    # Generate specs using Master Architect
    $architectPrompt = Get-Content (Join-Path $script:RlmRoot "agents/master-architect.md") -Raw

    # Generate Constitution
    Write-Info "Generating project constitution..."
    $constitutionPrompt = @"
Based on the research handoff below, generate a project constitution document.

$handoff

Generate a constitution.md that includes:
1. Development Principles (TDD, Clean Code, etc.)
2. Coding Standards
3. Testing Standards (coverage requirements)
4. Security Standards
5. Performance Standards
6. API Design Principles

Use the standard RLM constitution format.
"@

    try {
        $constitution = Invoke-AIAgent -SystemPrompt $architectPrompt -UserPrompt $constitutionPrompt
        $constitutionFile = Join-Path $Session.SessionDir "drafts/constitution-draft.md"
        $constitution | Out-File -FilePath $constitutionFile -Encoding utf8
        Write-Success "Constitution draft generated"
    }
    catch {
        Write-Warning "Constitution generation failed: $_"
    }

    # Generate Feature Specs
    Write-Info "Generating feature specifications..."
    $featurePrompt = @"
Based on the research handoff below, generate feature specifications.

$handoff

Generate feature specs for the MVP features identified. For each feature:
1. Feature ID (FTR-001, FTR-002, etc.)
2. Overview
3. User Stories with acceptance criteria
4. Technical Specifications (API endpoints, data models)
5. Security Requirements
6. Testing Requirements

Format as markdown following the RLM spec template.
"@

    try {
        $features = Invoke-AIAgent -SystemPrompt $architectPrompt -UserPrompt $featurePrompt
        $featuresFile = Join-Path $Session.SessionDir "drafts/features-draft.md"
        $features | Out-File -FilePath $featuresFile -Encoding utf8
        Write-Success "Feature specs draft generated"
    }
    catch {
        Write-Warning "Feature spec generation failed: $_"
    }

    # Generate Architecture
    Write-Info "Generating architecture overview..."
    $archPrompt = @"
Based on the research handoff below, generate an architecture overview.

$handoff

Generate an architecture document that includes:
1. System Overview
2. Technology Stack with rationale
3. Component Architecture
4. Data Model
5. API Design
6. Security Architecture
7. Deployment Architecture

Format as markdown.
"@

    try {
        $architecture = Invoke-AIAgent -SystemPrompt $architectPrompt -UserPrompt $archPrompt
        $archFile = Join-Path $Session.SessionDir "drafts/architecture-draft.md"
        $architecture | Out-File -FilePath $archFile -Encoding utf8
        Write-Success "Architecture draft generated"
    }
    catch {
        Write-Warning "Architecture generation failed: $_"
    }

    # Generate Epic Breakdown
    Write-Info "Generating epic breakdown..."
    $epicPrompt = @"
Based on the research handoff below, generate an epic breakdown for sprint planning.

$handoff

Generate an epic breakdown that includes:
1. Project Vision statement
2. Epic Overview table
3. Detailed epic descriptions with:
   - Features included
   - Tasks breakdown
   - Acceptance criteria
4. Suggested Sprint Plan
5. Risk Register
6. Success Metrics

Format as markdown following the RLM epic breakdown template.
"@

    try {
        $epics = Invoke-AIAgent -SystemPrompt $architectPrompt -UserPrompt $epicPrompt
        $epicsFile = Join-Path $Session.SessionDir "drafts/epic-breakdown.md"
        $epics | Out-File -FilePath $epicsFile -Encoding utf8
        Write-Success "Epic breakdown draft generated"
    }
    catch {
        Write-Warning "Epic breakdown generation failed: $_"
    }

    Update-SessionState -Session $Session -NewPhase "REFINEMENT" -Action "drafts_generated"
}

# Prepare handoff document
function Prepare-ArchitectHandoff {
    param([hashtable]$Session)

    $ideaFile = Join-Path $Session.SessionDir "idea.md"
    $findingsFile = Join-Path $Session.SessionDir "findings.md"
    $answersFile = Join-Path $Session.SessionDir "answers.md"

    $idea = if (Test-Path $ideaFile) { Get-Content $ideaFile -Raw } else { "" }
    $findings = if (Test-Path $findingsFile) { Get-Content $findingsFile -Raw } else { "" }
    $answers = if (Test-Path $answersFile) { Get-Content $answersFile -Raw } else { "" }

    return @"
# Research to Architecture Handoff

**Session:** $($Session.SessionId)
**Date:** $(Get-Date -Format "yyyy-MM-dd")

## Original Idea
$idea

## Research Findings
$findings

## User Answers
$answers

## Handoff Status
Ready for specification generation.
"@
}

# Run refinement phase
function Invoke-RefinementPhase {
    param([hashtable]$Session)

    Write-Phase "REFINEMENT PHASE"

    $draftsDir = Join-Path $Session.SessionDir "drafts"

    Write-Info "Draft specifications are ready for review."
    Write-Info "Location: $draftsDir"
    Write-Host ""

    # List generated files
    Write-Info "Generated files:"
    Get-ChildItem -Path $draftsDir -Filter "*.md" -Recurse | ForEach-Object {
        Write-Host "  - $($_.Name)"
    }
    Write-Host ""

    if ($Mode -eq "auto") {
        Write-Info "Auto-mode: Automatically approving drafts"
        Finalize-Specs -Session $Session
        return
    }

    # Interactive refinement loop
    $refining = $true
    while ($refining) {
        Write-Host ""
        Write-Question "What would you like to do?"
        Write-Host "  1. View a draft"
        Write-Host "  2. Request changes"
        Write-Host "  3. Approve and finalize"
        Write-Host "  4. Ask more questions"
        Write-Host "  5. Save and exit (resume later)"
        Write-Host ""

        $choice = Read-Host "Choice [1-5]"

        switch ($choice) {
            "1" {
                Write-Info "Available drafts:"
                $files = Get-ChildItem -Path $draftsDir -Filter "*.md" -Recurse
                for ($i = 0; $i -lt $files.Count; $i++) {
                    Write-Host "  $($i + 1). $($files[$i].Name)"
                }
                $fileChoice = Read-Host "Enter number"
                $idx = [int]$fileChoice - 1
                if ($idx -ge 0 -and $idx -lt $files.Count) {
                    Write-Host ""
                    Get-Content $files[$idx].FullName | Write-Host
                }
            }
            "2" {
                $feedback = Read-Host "Describe the changes needed"
                $feedbackFile = Join-Path $Session.SessionDir "feedback.md"
                $feedbackEntry = @"

## Feedback $(Get-Date -Format "yyyy-MM-dd HH:mm")
$feedback

"@
                Add-Content -Path $feedbackFile -Value $feedbackEntry
                Write-Info "Feedback recorded. Regenerating drafts..."
                Update-SessionState -Session $Session -NewPhase "DRAFT" -Action "revision_requested"
                Invoke-DraftPhase -Session $Session
                return
            }
            "3" {
                Finalize-Specs -Session $Session
                $refining = $false
            }
            "4" {
                Update-SessionState -Session $Session -NewPhase "QUESTIONS" -Action "more_questions"
                Invoke-QuestionPhase -Session $Session
                Invoke-DraftPhase -Session $Session
                return
            }
            "5" {
                Write-Info "Session saved. Resume with:"
                Write-Host "  ./rlm-discover.ps1 --resume $($Session.SessionId)"
                return
            }
            default {
                Write-Warning "Invalid choice"
            }
        }
    }
}

# Finalize specs
function Finalize-Specs {
    param([hashtable]$Session)

    Write-Phase "FINALIZING SPECIFICATIONS"

    $draftsDir = Join-Path $Session.SessionDir "drafts"
    $specsDir = Join-Path $script:RlmRoot "specs"

    # Copy constitution
    $constitutionDraft = Join-Path $draftsDir "constitution-draft.md"
    if (Test-Path $constitutionDraft) {
        $constitutionDest = Join-Path $specsDir "constitution.md"
        Copy-Item -Path $constitutionDraft -Destination $constitutionDest -Force
        Write-Success "Constitution updated: $constitutionDest"
    }

    # Copy architecture
    $archDraft = Join-Path $draftsDir "architecture-draft.md"
    if (Test-Path $archDraft) {
        $archDir = Join-Path $specsDir "architecture"
        if (-not (Test-Path $archDir)) {
            New-Item -ItemType Directory -Path $archDir -Force | Out-Null
        }
        $archDest = Join-Path $archDir "overview.md"
        Copy-Item -Path $archDraft -Destination $archDest -Force
        Write-Success "Architecture created: $archDest"
    }

    # Copy epic breakdown
    $epicDraft = Join-Path $draftsDir "epic-breakdown.md"
    if (Test-Path $epicDraft) {
        $epicsDir = Join-Path $specsDir "epics"
        if (-not (Test-Path $epicsDir)) {
            New-Item -ItemType Directory -Path $epicsDir -Force | Out-Null
        }
        $epicDest = Join-Path $epicsDir "breakdown.md"
        Copy-Item -Path $epicDraft -Destination $epicDest -Force
        Write-Success "Epic breakdown created: $epicDest"
    }

    # Copy feature specs
    $featuresDraft = Join-Path $draftsDir "features-draft.md"
    if (Test-Path $featuresDraft) {
        $featuresDir = Join-Path $specsDir "features"
        if (-not (Test-Path $featuresDir)) {
            New-Item -ItemType Directory -Path $featuresDir -Force | Out-Null
        }
        # For now, copy as a single file - in production, would parse and split
        $featuresDest = Join-Path $featuresDir "all-features.md"
        Copy-Item -Path $featuresDraft -Destination $featuresDest -Force
        Write-Success "Feature specs created: $featuresDest"
    }

    Update-SessionState -Session $Session -NewPhase "COMPLETE" -Action "specs_finalized"

    # Generate summary
    Generate-Summary -Session $Session
}

# Generate final summary
function Generate-Summary {
    param([hashtable]$Session)

    Write-Phase "DISCOVERY COMPLETE"

    $summary = @"
# Discovery Session Summary

**Session ID:** $($Session.SessionId)
**Completed:** $(Get-Date -Format "yyyy-MM-dd HH:mm UTC")
**Mode:** $Mode

## Generated Artifacts

### Specifications
- Constitution: ``RLM/specs/constitution.md``
- Architecture: ``RLM/specs/architecture/overview.md``
- Epic Breakdown: ``RLM/specs/epics/breakdown.md``
- Feature Specs: ``RLM/specs/features/``

### Research (archived)
- Idea: ``$($Session.SessionDir)/idea.md``
- Findings: ``$($Session.SessionDir)/findings.md``
- Questions & Answers: ``$($Session.SessionDir)/answers.md``

## Next Steps

1. Review generated specifications
2. Run ``./rlm-build.ps1 --mode supervised`` to start implementation
3. Use ``./rlm-sync.ps1 push`` to share specs via GitHub

"@

    $summaryFile = Join-Path $Session.SessionDir "summary.md"
    $summary | Out-File -FilePath $summaryFile -Encoding utf8

    Write-Host $summary

    Write-Success "Discovery session complete!"
    Write-Info "Session archived at: $($Session.SessionDir)"
}

# Resume session workflow
function Resume-Session {
    param([string]$SessionId)

    Write-Phase "RESUMING SESSION: $SessionId"

    $session = Get-Session -SessionId $SessionId
    $currentPhase = $session.State.current_phase

    Write-Info "Resuming from phase: $currentPhase"

    switch ($currentPhase) {
        "INIT" {
            Capture-Idea -Session $session
            Invoke-ResearchPhase -Session $session
            Invoke-QuestionPhase -Session $session
            Invoke-DraftPhase -Session $session
            Invoke-RefinementPhase -Session $session
        }
        "RESEARCH" {
            Invoke-ResearchPhase -Session $session
            Invoke-QuestionPhase -Session $session
            Invoke-DraftPhase -Session $session
            Invoke-RefinementPhase -Session $session
        }
        "QUESTIONS" {
            Invoke-QuestionPhase -Session $session
            Invoke-DraftPhase -Session $session
            Invoke-RefinementPhase -Session $session
        }
        "DRAFT" {
            Invoke-DraftPhase -Session $session
            Invoke-RefinementPhase -Session $session
        }
        "REFINEMENT" {
            Invoke-RefinementPhase -Session $session
        }
        "COMPLETE" {
            Write-Info "Session already complete."
            $summaryFile = Join-Path $session.SessionDir "summary.md"
            if (Test-Path $summaryFile) {
                Get-Content $summaryFile | Write-Host
            }
        }
        default {
            Write-Error "Unknown phase: $currentPhase"
        }
    }
}

# Main execution
function Main {
    Write-Host ""
    Write-Info "RLM Discover - AI-Assisted Spec Creation"
    Write-Info "Mode: $Mode"

    # Detect and display AI provider
    $detectedProvider = if ($AIProvider) { $AIProvider } else { Get-AIProvider }
    $detectedModel = if ($AIModel) { $AIModel } else { Get-AIModel -Provider $detectedProvider }

    if ($detectedProvider) {
        Write-Info "AI Provider: $detectedProvider (Model: $detectedModel)"
    }
    else {
        Write-Warning "No AI provider detected"
        Get-AvailableProviders
    }
    Write-Host ""

    if ($Help) {
        Show-Help
        return
    }

    if ($Resume) {
        Resume-Session -SessionId $Resume
        return
    }

    # Validate we have an idea for non-interactive mode
    if (-not $IdeaInput -and $Mode -ne "interactive") {
        Write-Error "Please provide an idea with --idea"
        Show-Help
        return
    }

    # Initialize new session
    $session = Initialize-Session
    Write-Success "Session initialized: $($session.SessionId)"
    Write-Info "Session directory: $($session.SessionDir)"

    # Run full workflow
    Capture-Idea -Session $session
    Invoke-ResearchPhase -Session $session
    Invoke-QuestionPhase -Session $session
    Invoke-DraftPhase -Session $session
    Invoke-RefinementPhase -Session $session
}

# Run main
Main
