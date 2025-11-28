# Perplexity Pro API Client for RLM Research
# Provides web research capabilities for the Research Agent

<#
.SYNOPSIS
    Perplexity Pro API client for conducting web research.

.DESCRIPTION
    This module provides functions to interact with the Perplexity API
    for conducting market research, competitor analysis, and technology research
    during the RLM discovery phase.

.NOTES
    Requires PERPLEXITY_API_KEY environment variable to be set.
    Get your API key from: https://www.perplexity.ai/settings/api
#>

# Configuration
$script:PerplexityConfig = @{
    BaseUrl = "https://api.perplexity.ai/chat/completions"
    DefaultModel = "llama-3.1-sonar-large-128k-online"  # Online model for web search
    ProModel = "sonar-pro"                               # Pro model if available
    MaxTokens = 4096
    Temperature = 0.2
    Timeout = 60
}

function Get-PerplexityApiKey {
    <#
    .SYNOPSIS
        Gets the Perplexity API key from environment variable.
    #>
    $apiKey = $env:PERPLEXITY_API_KEY
    if (-not $apiKey) {
        Write-Warning "PERPLEXITY_API_KEY environment variable not set."
        Write-Warning "Set it with: `$env:PERPLEXITY_API_KEY = 'pplx-xxxxx'"
        return $null
    }
    return $apiKey
}

function Invoke-PerplexitySearch {
    <#
    .SYNOPSIS
        Conducts a web search using Perplexity API.

    .DESCRIPTION
        Sends a query to Perplexity's online model which has access to real-time
        web search results.

    .PARAMETER Query
        The search query or question to research.

    .PARAMETER Model
        The Perplexity model to use. Defaults to online model with web search.

    .PARAMETER SystemPrompt
        Optional system prompt to guide the response format.

    .EXAMPLE
        Invoke-PerplexitySearch -Query "What are the top task management apps in 2024?"

    .EXAMPLE
        Invoke-PerplexitySearch -Query "Compare React vs Vue for enterprise apps" -SystemPrompt "Provide a structured comparison table"
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$Query,

        [Parameter(Mandatory = $false)]
        [string]$Model = $script:PerplexityConfig.DefaultModel,

        [Parameter(Mandatory = $false)]
        [string]$SystemPrompt = "You are a research assistant helping with software project planning. Provide factual, well-sourced information. Include specific examples and data where available."
    )

    $apiKey = Get-PerplexityApiKey
    if (-not $apiKey) {
        return @{
            Success = $false
            Error = "API key not configured"
            Content = $null
        }
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
        content = $Query
    }

    $body = @{
        model = $Model
        messages = $messages
        max_tokens = $script:PerplexityConfig.MaxTokens
        temperature = $script:PerplexityConfig.Temperature
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri $script:PerplexityConfig.BaseUrl `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $apiKey"
                "Content-Type" = "application/json"
            } `
            -Body $body `
            -TimeoutSec $script:PerplexityConfig.Timeout

        return @{
            Success = $true
            Error = $null
            Content = $response.choices[0].message.content
            Model = $response.model
            Usage = @{
                PromptTokens = $response.usage.prompt_tokens
                CompletionTokens = $response.usage.completion_tokens
                TotalTokens = $response.usage.total_tokens
            }
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
            Content = $null
        }
    }
}

function Search-Competitors {
    <#
    .SYNOPSIS
        Researches competitors for a given product idea.

    .PARAMETER ProductIdea
        Description of the product or service to find competitors for.

    .PARAMETER Domain
        Optional domain/industry to focus the search.

    .EXAMPLE
        Search-Competitors -ProductIdea "AI-powered task management app" -Domain "productivity"
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$ProductIdea,

        [Parameter(Mandatory = $false)]
        [string]$Domain = ""
    )

    $domainContext = if ($Domain) { " in the $Domain space" } else { "" }

    $query = @"
Research the competitive landscape for: $ProductIdea$domainContext

Provide:
1. Top 5-10 existing competitors/alternatives
2. For each competitor:
   - Name and brief description
   - Key features
   - Pricing model (if known)
   - Strengths
   - Weaknesses
   - Target audience
3. Market gaps and opportunities
4. Differentiation strategies

Format as a structured analysis with clear sections.
"@

    $systemPrompt = @"
You are a market research analyst. Provide factual, current information about existing products and services.
Include specific company names, features, and pricing where available.
Be objective and comprehensive in your analysis.
"@

    return Invoke-PerplexitySearch -Query $query -SystemPrompt $systemPrompt
}

function Search-BestPractices {
    <#
    .SYNOPSIS
        Researches best practices for building a specific type of application.

    .PARAMETER AppType
        Type of application (e.g., "e-commerce platform", "real-time chat app").

    .PARAMETER TechStack
        Optional preferred technology stack.

    .EXAMPLE
        Search-BestPractices -AppType "real-time collaboration tool" -TechStack "React, Node.js"
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$AppType,

        [Parameter(Mandatory = $false)]
        [string]$TechStack = ""
    )

    $techContext = if ($TechStack) { " using $TechStack" } else { "" }

    $query = @"
What are the best practices for building a $AppType$techContext in 2024?

Cover:
1. Architecture patterns recommended
2. Technology recommendations with rationale
3. Security considerations
4. Performance optimization strategies
5. Scalability patterns
6. Common pitfalls to avoid
7. Testing strategies
8. Deployment best practices

Provide specific, actionable recommendations with examples where possible.
"@

    $systemPrompt = @"
You are a senior software architect with expertise in modern application development.
Provide practical, current best practices based on industry standards and real-world experience.
Include specific tools, libraries, and patterns where relevant.
"@

    return Invoke-PerplexitySearch -Query $query -SystemPrompt $systemPrompt
}

function Search-TechnologyComparison {
    <#
    .SYNOPSIS
        Compares technologies for a specific use case.

    .PARAMETER Technologies
        Array of technologies to compare.

    .PARAMETER UseCase
        The use case or context for comparison.

    .EXAMPLE
        Search-TechnologyComparison -Technologies @("PostgreSQL", "MongoDB", "DynamoDB") -UseCase "real-time analytics dashboard"
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Technologies,

        [Parameter(Mandatory = $true)]
        [string]$UseCase
    )

    $techList = $Technologies -join " vs "

    $query = @"
Compare $techList for building a $UseCase.

For each technology, analyze:
1. Suitability for this use case (score 1-10 with explanation)
2. Performance characteristics
3. Scalability
4. Developer experience
5. Community and ecosystem
6. Cost considerations
7. Pros and cons specific to this use case

Provide a recommendation with clear rationale.
"@

    $systemPrompt = @"
You are a technology consultant helping teams make informed decisions.
Provide objective, balanced comparisons based on current capabilities and real-world usage.
Include specific benchmarks or case studies where available.
"@

    return Invoke-PerplexitySearch -Query $query -SystemPrompt $systemPrompt
}

function Search-MarketAnalysis {
    <#
    .SYNOPSIS
        Researches market trends and analysis for a domain.

    .PARAMETER Domain
        The market domain to analyze.

    .PARAMETER Focus
        Optional specific focus area within the domain.

    .EXAMPLE
        Search-MarketAnalysis -Domain "project management software" -Focus "AI integration"
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$Domain,

        [Parameter(Mandatory = $false)]
        [string]$Focus = ""
    )

    $focusContext = if ($Focus) { " with focus on $Focus" } else { "" }

    $query = @"
Provide a market analysis for $Domain$focusContext in 2024.

Include:
1. Market size and growth projections
2. Key trends shaping the industry
3. Major players and market share
4. Emerging technologies and innovations
5. Customer needs and pain points
6. Regulatory considerations
7. Investment and funding trends
8. Future outlook and predictions

Use recent data and cite sources where possible.
"@

    $systemPrompt = @"
You are a market research analyst providing industry insights.
Focus on factual, data-driven analysis with specific numbers and trends.
Distinguish between established facts and projections.
"@

    return Invoke-PerplexitySearch -Query $query -SystemPrompt $systemPrompt
}

function Invoke-ComprehensiveResearch {
    <#
    .SYNOPSIS
        Conducts comprehensive research for a project idea.

    .DESCRIPTION
        Runs multiple research queries to gather competitors, best practices,
        technology recommendations, and market analysis.

    .PARAMETER Idea
        The project idea to research.

    .PARAMETER Domain
        The domain/industry.

    .PARAMETER OutputPath
        Path to save research results.

    .EXAMPLE
        Invoke-ComprehensiveResearch -Idea "AI task management app" -Domain "productivity" -OutputPath "./research"
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$Idea,

        [Parameter(Mandatory = $false)]
        [string]$Domain = "",

        [Parameter(Mandatory = $false)]
        [string]$OutputPath = ""
    )

    $results = @{
        Idea = $Idea
        Domain = $Domain
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Research = @{}
    }

    Write-Host "Researching competitors..." -ForegroundColor Cyan
    $competitors = Search-Competitors -ProductIdea $Idea -Domain $Domain
    $results.Research.Competitors = $competitors

    Write-Host "Researching best practices..." -ForegroundColor Cyan
    $bestPractices = Search-BestPractices -AppType $Idea
    $results.Research.BestPractices = $bestPractices

    if ($Domain) {
        Write-Host "Conducting market analysis..." -ForegroundColor Cyan
        $market = Search-MarketAnalysis -Domain $Domain
        $results.Research.MarketAnalysis = $market
    }

    # Calculate total tokens used
    $totalTokens = 0
    foreach ($key in $results.Research.Keys) {
        if ($results.Research[$key].Success -and $results.Research[$key].Usage) {
            $totalTokens += $results.Research[$key].Usage.TotalTokens
        }
    }
    $results.TotalTokensUsed = $totalTokens

    # Save to file if output path provided
    if ($OutputPath) {
        if (-not (Test-Path $OutputPath)) {
            New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
        }

        # Save as JSON
        $jsonPath = Join-Path $OutputPath "research-raw.json"
        $results | ConvertTo-Json -Depth 10 | Out-File -FilePath $jsonPath -Encoding utf8

        # Generate markdown summary
        $markdownPath = Join-Path $OutputPath "research-summary.md"
        $markdown = Format-ResearchAsMarkdown -Results $results
        $markdown | Out-File -FilePath $markdownPath -Encoding utf8

        Write-Host "Research saved to: $OutputPath" -ForegroundColor Green
    }

    return $results
}

function Format-ResearchAsMarkdown {
    <#
    .SYNOPSIS
        Formats research results as markdown.
    #>
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Results
    )

    $sb = [System.Text.StringBuilder]::new()

    [void]$sb.AppendLine("# Research Findings")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("**Idea:** $($Results.Idea)")
    [void]$sb.AppendLine("**Domain:** $($Results.Domain)")
    [void]$sb.AppendLine("**Generated:** $($Results.Timestamp)")
    [void]$sb.AppendLine("**Total Tokens Used:** $($Results.TotalTokensUsed)")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("---")
    [void]$sb.AppendLine("")

    if ($Results.Research.Competitors.Success) {
        [void]$sb.AppendLine("## Competitive Analysis")
        [void]$sb.AppendLine("")
        [void]$sb.AppendLine($Results.Research.Competitors.Content)
        [void]$sb.AppendLine("")
        [void]$sb.AppendLine("---")
        [void]$sb.AppendLine("")
    }

    if ($Results.Research.BestPractices.Success) {
        [void]$sb.AppendLine("## Best Practices")
        [void]$sb.AppendLine("")
        [void]$sb.AppendLine($Results.Research.BestPractices.Content)
        [void]$sb.AppendLine("")
        [void]$sb.AppendLine("---")
        [void]$sb.AppendLine("")
    }

    if ($Results.Research.MarketAnalysis -and $Results.Research.MarketAnalysis.Success) {
        [void]$sb.AppendLine("## Market Analysis")
        [void]$sb.AppendLine("")
        [void]$sb.AppendLine($Results.Research.MarketAnalysis.Content)
        [void]$sb.AppendLine("")
    }

    return $sb.ToString()
}

# Export functions
Export-ModuleMember -Function @(
    'Invoke-PerplexitySearch',
    'Search-Competitors',
    'Search-BestPractices',
    'Search-TechnologyComparison',
    'Search-MarketAnalysis',
    'Invoke-ComprehensiveResearch',
    'Format-ResearchAsMarkdown'
)
