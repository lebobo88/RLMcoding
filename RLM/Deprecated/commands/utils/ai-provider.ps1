<#
.SYNOPSIS
    AI Provider Abstraction Layer for RLM

.DESCRIPTION
    Provides a unified interface for invoking different AI models/providers.
    Supports: Claude, OpenAI GPT, Google Gemini, Ollama (local), and generic OpenAI-compatible APIs.

    The RLM method is AI-agnostic - this layer enables that flexibility.

.NOTES
    Configure your preferred provider in RLM/config/project-config.json under "agents"
    or via environment variables.
#>

# Provider Configuration
$script:AIProviders = @{
    "claude" = @{
        Name = "Anthropic Claude"
        ApiUrl = "https://api.anthropic.com/v1/messages"
        EnvKey = "ANTHROPIC_API_KEY"
        Models = @("claude-sonnet-4", "claude-opus-4", "claude-haiku-3.5")
        CliCommand = "claude"
    }
    "openai" = @{
        Name = "OpenAI GPT"
        ApiUrl = "https://api.openai.com/v1/chat/completions"
        EnvKey = "OPENAI_API_KEY"
        Models = @("gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo")
        CliCommand = $null
    }
    "gemini" = @{
        Name = "Google Gemini"
        ApiUrl = "https://generativelanguage.googleapis.com/v1beta/models"
        EnvKey = "GOOGLE_API_KEY"
        Models = @("gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash")
        CliCommand = $null
    }
    "ollama" = @{
        Name = "Ollama (Local)"
        ApiUrl = "http://localhost:11434/api/chat"
        EnvKey = $null
        Models = @("llama3", "codellama", "mistral", "mixtral", "deepseek-coder")
        CliCommand = "ollama"
    }
    "openai-compatible" = @{
        Name = "OpenAI-Compatible API"
        ApiUrl = $null  # Set via RLM_AI_API_URL
        EnvKey = "RLM_AI_API_KEY"
        Models = @()  # Any model
        CliCommand = $null
    }
}

function Get-AIProvider {
    <#
    .SYNOPSIS
        Determines the AI provider to use based on configuration and environment.
    #>
    [CmdletBinding()]
    param(
        [Parameter()]
        [string]$PreferredProvider = ""
    )

    # Priority order:
    # 1. Explicit parameter
    # 2. RLM_AI_PROVIDER environment variable
    # 3. project-config.json setting
    # 4. Auto-detect based on available API keys

    if ($PreferredProvider) {
        return $PreferredProvider
    }

    if ($env:RLM_AI_PROVIDER) {
        return $env:RLM_AI_PROVIDER
    }

    # Try to load from project config
    $configPath = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) "config/project-config.json"
    if (Test-Path $configPath) {
        $config = Get-Content $configPath -Raw | ConvertFrom-Json
        if ($config.agents.provider) {
            return $config.agents.provider
        }
        # Infer from model name
        $model = $config.agents.defaultModel
        if ($model -match "claude") { return "claude" }
        if ($model -match "gpt") { return "openai" }
        if ($model -match "gemini") { return "gemini" }
    }

    # Auto-detect based on available keys
    if ($env:ANTHROPIC_API_KEY) { return "claude" }
    if ($env:OPENAI_API_KEY) { return "openai" }
    if ($env:GOOGLE_API_KEY) { return "gemini" }

    # Check if Ollama is running locally
    try {
        $null = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 2
        return "ollama"
    }
    catch {
        # Ollama not running
    }

    # Check for OpenAI-compatible endpoint
    if ($env:RLM_AI_API_URL -and $env:RLM_AI_API_KEY) {
        return "openai-compatible"
    }

    return $null
}

function Get-AIModel {
    <#
    .SYNOPSIS
        Gets the configured AI model for a provider.
    #>
    [CmdletBinding()]
    param(
        [Parameter()]
        [string]$Provider = ""
    )

    if (-not $Provider) {
        $Provider = Get-AIProvider
    }

    # Check environment variable first
    if ($env:RLM_AI_MODEL) {
        return $env:RLM_AI_MODEL
    }

    # Load from config
    $configPath = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) "config/project-config.json"
    if (Test-Path $configPath) {
        $config = Get-Content $configPath -Raw | ConvertFrom-Json
        if ($config.agents.defaultModel) {
            return $config.agents.defaultModel
        }
    }

    # Return default for provider
    switch ($Provider) {
        "claude" { return "claude-sonnet-4" }
        "openai" { return "gpt-4o" }
        "gemini" { return "gemini-1.5-pro" }
        "ollama" { return "llama3" }
        default { return "gpt-4" }
    }
}

function Invoke-AICompletion {
    <#
    .SYNOPSIS
        Invokes an AI model completion using the configured provider.

    .DESCRIPTION
        Universal interface for AI completions across different providers.
        Handles provider-specific API formats internally.

    .PARAMETER SystemPrompt
        The system prompt/instructions for the AI.

    .PARAMETER UserPrompt
        The user message/query.

    .PARAMETER Provider
        Override the default provider.

    .PARAMETER Model
        Override the default model.

    .PARAMETER Temperature
        Sampling temperature (0-1).

    .PARAMETER MaxTokens
        Maximum tokens in response.

    .EXAMPLE
        Invoke-AICompletion -SystemPrompt "You are a helpful assistant" -UserPrompt "Hello"

    .EXAMPLE
        Invoke-AICompletion -UserPrompt "Explain recursion" -Provider "ollama" -Model "codellama"
    #>
    [CmdletBinding()]
    param(
        [Parameter()]
        [string]$SystemPrompt = "",

        [Parameter(Mandatory = $true)]
        [string]$UserPrompt,

        [Parameter()]
        [string]$Provider = "",

        [Parameter()]
        [string]$Model = "",

        [Parameter()]
        [double]$Temperature = 0.2,

        [Parameter()]
        [int]$MaxTokens = 4096
    )

    # Resolve provider and model
    if (-not $Provider) {
        $Provider = Get-AIProvider
    }
    if (-not $Model) {
        $Model = Get-AIModel -Provider $Provider
    }

    if (-not $Provider) {
        throw "No AI provider configured. Set RLM_AI_PROVIDER or configure in project-config.json"
    }

    Write-Verbose "Using AI Provider: $Provider, Model: $Model"

    # Route to provider-specific handler
    switch ($Provider) {
        "claude" {
            return Invoke-ClaudeCompletion -SystemPrompt $SystemPrompt -UserPrompt $UserPrompt -Model $Model -Temperature $Temperature -MaxTokens $MaxTokens
        }
        "openai" {
            return Invoke-OpenAICompletion -SystemPrompt $SystemPrompt -UserPrompt $UserPrompt -Model $Model -Temperature $Temperature -MaxTokens $MaxTokens
        }
        "gemini" {
            return Invoke-GeminiCompletion -SystemPrompt $SystemPrompt -UserPrompt $UserPrompt -Model $Model -Temperature $Temperature -MaxTokens $MaxTokens
        }
        "ollama" {
            return Invoke-OllamaCompletion -SystemPrompt $SystemPrompt -UserPrompt $UserPrompt -Model $Model -Temperature $Temperature -MaxTokens $MaxTokens
        }
        "openai-compatible" {
            return Invoke-OpenAICompatibleCompletion -SystemPrompt $SystemPrompt -UserPrompt $UserPrompt -Model $Model -Temperature $Temperature -MaxTokens $MaxTokens
        }
        default {
            throw "Unknown AI provider: $Provider"
        }
    }
}

function Invoke-ClaudeCompletion {
    [CmdletBinding()]
    param(
        [string]$SystemPrompt,
        [string]$UserPrompt,
        [string]$Model,
        [double]$Temperature,
        [int]$MaxTokens
    )

    $apiKey = $env:ANTHROPIC_API_KEY
    if (-not $apiKey) {
        # Fall back to CLI if available
        $claudeCmd = Get-Command "claude" -ErrorAction SilentlyContinue
        if ($claudeCmd) {
            return Invoke-ClaudeCLI -SystemPrompt $SystemPrompt -UserPrompt $UserPrompt
        }
        throw "ANTHROPIC_API_KEY not set and Claude CLI not available"
    }

    $messages = @(
        @{
            role = "user"
            content = $UserPrompt
        }
    )

    $body = @{
        model = $Model
        max_tokens = $MaxTokens
        messages = $messages
    }

    if ($SystemPrompt) {
        $body.system = $SystemPrompt
    }

    $bodyJson = $body | ConvertTo-Json -Depth 10

    $response = Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" `
        -Method POST `
        -Headers @{
            "x-api-key" = $apiKey
            "anthropic-version" = "2023-06-01"
            "Content-Type" = "application/json"
        } `
        -Body $bodyJson `
        -TimeoutSec 120

    return $response.content[0].text
}

function Invoke-ClaudeCLI {
    [CmdletBinding()]
    param(
        [string]$SystemPrompt,
        [string]$UserPrompt
    )

    # Use Claude Code CLI
    $result = & claude --print -p $UserPrompt 2>&1

    if ($LASTEXITCODE -ne 0) {
        throw "Claude CLI error: $result"
    }

    return $result
}

function Invoke-OpenAICompletion {
    [CmdletBinding()]
    param(
        [string]$SystemPrompt,
        [string]$UserPrompt,
        [string]$Model,
        [double]$Temperature,
        [int]$MaxTokens
    )

    $apiKey = $env:OPENAI_API_KEY
    if (-not $apiKey) {
        throw "OPENAI_API_KEY not set"
    }

    $messages = @()
    if ($SystemPrompt) {
        $messages += @{
            role = "system"
            content = $SystemPrompt
        }
    }
    $messages += @{
        role = "user"
        content = $UserPrompt
    }

    $body = @{
        model = $Model
        messages = $messages
        temperature = $Temperature
        max_tokens = $MaxTokens
    } | ConvertTo-Json -Depth 10

    $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $apiKey"
            "Content-Type" = "application/json"
        } `
        -Body $body `
        -TimeoutSec 120

    return $response.choices[0].message.content
}

function Invoke-GeminiCompletion {
    [CmdletBinding()]
    param(
        [string]$SystemPrompt,
        [string]$UserPrompt,
        [string]$Model,
        [double]$Temperature,
        [int]$MaxTokens
    )

    $apiKey = $env:GOOGLE_API_KEY
    if (-not $apiKey) {
        throw "GOOGLE_API_KEY not set"
    }

    $contents = @()

    if ($SystemPrompt) {
        $contents += @{
            role = "user"
            parts = @(@{ text = "System instructions: $SystemPrompt" })
        }
        $contents += @{
            role = "model"
            parts = @(@{ text = "Understood. I will follow these instructions." })
        }
    }

    $contents += @{
        role = "user"
        parts = @(@{ text = $UserPrompt })
    }

    $body = @{
        contents = $contents
        generationConfig = @{
            temperature = $Temperature
            maxOutputTokens = $MaxTokens
        }
    } | ConvertTo-Json -Depth 10

    $url = "https://generativelanguage.googleapis.com/v1beta/models/${Model}:generateContent?key=$apiKey"

    $response = Invoke-RestMethod -Uri $url `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
        } `
        -Body $body `
        -TimeoutSec 120

    return $response.candidates[0].content.parts[0].text
}

function Invoke-OllamaCompletion {
    [CmdletBinding()]
    param(
        [string]$SystemPrompt,
        [string]$UserPrompt,
        [string]$Model,
        [double]$Temperature,
        [int]$MaxTokens
    )

    $messages = @()
    if ($SystemPrompt) {
        $messages += @{
            role = "system"
            content = $SystemPrompt
        }
    }
    $messages += @{
        role = "user"
        content = $UserPrompt
    }

    $body = @{
        model = $Model
        messages = $messages
        stream = $false
        options = @{
            temperature = $Temperature
            num_predict = $MaxTokens
        }
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:11434/api/chat" `
            -Method POST `
            -Headers @{
                "Content-Type" = "application/json"
            } `
            -Body $body `
            -TimeoutSec 300  # Ollama can be slow

        return $response.message.content
    }
    catch {
        throw "Ollama error (is it running?): $_"
    }
}

function Invoke-OpenAICompatibleCompletion {
    [CmdletBinding()]
    param(
        [string]$SystemPrompt,
        [string]$UserPrompt,
        [string]$Model,
        [double]$Temperature,
        [int]$MaxTokens
    )

    $apiUrl = $env:RLM_AI_API_URL
    $apiKey = $env:RLM_AI_API_KEY

    if (-not $apiUrl) {
        throw "RLM_AI_API_URL not set for OpenAI-compatible endpoint"
    }

    $messages = @()
    if ($SystemPrompt) {
        $messages += @{
            role = "system"
            content = $SystemPrompt
        }
    }
    $messages += @{
        role = "user"
        content = $UserPrompt
    }

    $body = @{
        model = $Model
        messages = $messages
        temperature = $Temperature
        max_tokens = $MaxTokens
    } | ConvertTo-Json -Depth 10

    $headers = @{
        "Content-Type" = "application/json"
    }
    if ($apiKey) {
        $headers["Authorization"] = "Bearer $apiKey"
    }

    $response = Invoke-RestMethod -Uri $apiUrl `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -TimeoutSec 120

    return $response.choices[0].message.content
}

function Test-AIProvider {
    <#
    .SYNOPSIS
        Tests the configured AI provider with a simple prompt.
    #>
    [CmdletBinding()]
    param(
        [Parameter()]
        [string]$Provider = ""
    )

    if (-not $Provider) {
        $Provider = Get-AIProvider
    }

    if (-not $Provider) {
        Write-Host "No AI provider configured." -ForegroundColor Red
        Write-Host ""
        Write-Host "Configure one of the following:" -ForegroundColor Yellow
        Write-Host "  1. Set ANTHROPIC_API_KEY for Claude"
        Write-Host "  2. Set OPENAI_API_KEY for OpenAI GPT"
        Write-Host "  3. Set GOOGLE_API_KEY for Google Gemini"
        Write-Host "  4. Run Ollama locally (ollama serve)"
        Write-Host "  5. Set RLM_AI_API_URL and RLM_AI_API_KEY for custom endpoint"
        Write-Host ""
        Write-Host "Or set RLM_AI_PROVIDER to specify explicitly."
        return $false
    }

    $model = Get-AIModel -Provider $Provider
    Write-Host "Testing AI Provider: $Provider (Model: $model)" -ForegroundColor Cyan

    try {
        $result = Invoke-AICompletion -UserPrompt "Say 'RLM test successful' and nothing else." -Provider $Provider -Model $model

        if ($result -match "successful") {
            Write-Host "SUCCESS: AI provider is working" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "Response received: $result" -ForegroundColor Yellow
            return $true
        }
    }
    catch {
        Write-Host "FAILED: $_" -ForegroundColor Red
        return $false
    }
}

function Get-AvailableProviders {
    <#
    .SYNOPSIS
        Lists all available AI providers and their status.
    #>
    [CmdletBinding()]
    param()

    Write-Host "`nAvailable AI Providers:" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan

    foreach ($key in $script:AIProviders.Keys) {
        $provider = $script:AIProviders[$key]
        $available = $false
        $reason = ""

        switch ($key) {
            "claude" {
                if ($env:ANTHROPIC_API_KEY) {
                    $available = $true
                }
                elseif (Get-Command "claude" -ErrorAction SilentlyContinue) {
                    $available = $true
                    $reason = "(via CLI)"
                }
                else {
                    $reason = "(set ANTHROPIC_API_KEY)"
                }
            }
            "openai" {
                if ($env:OPENAI_API_KEY) {
                    $available = $true
                }
                else {
                    $reason = "(set OPENAI_API_KEY)"
                }
            }
            "gemini" {
                if ($env:GOOGLE_API_KEY) {
                    $available = $true
                }
                else {
                    $reason = "(set GOOGLE_API_KEY)"
                }
            }
            "ollama" {
                try {
                    $null = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 2
                    $available = $true
                }
                catch {
                    $reason = "(run 'ollama serve')"
                }
            }
            "openai-compatible" {
                if ($env:RLM_AI_API_URL) {
                    $available = $true
                }
                else {
                    $reason = "(set RLM_AI_API_URL)"
                }
            }
        }

        $status = if ($available) { "[OK]" } else { "[--]" }
        $color = if ($available) { "Green" } else { "Gray" }

        Write-Host "  $status $($provider.Name) $reason" -ForegroundColor $color
    }

    $current = Get-AIProvider
    if ($current) {
        Write-Host "`nCurrent provider: $current" -ForegroundColor Yellow
    }
}

# Export functions
Export-ModuleMember -Function @(
    'Get-AIProvider',
    'Get-AIModel',
    'Invoke-AICompletion',
    'Test-AIProvider',
    'Get-AvailableProviders'
)
