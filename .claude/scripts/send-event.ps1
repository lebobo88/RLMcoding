# send-event.ps1 - Unified event emission for RLM Observability
# Called by hooks to send events to the observability server

param(
    [Parameter(Mandatory=$true)]
    [string]$EventType,

    [Parameter(Mandatory=$false)]
    [string]$ToolName = "",

    [Parameter(Mandatory=$false)]
    [string]$DetailsJson = "{}",

    [Parameter(Mandatory=$false)]
    [string]$WorkspaceRoot = $env:CLAUDE_PROJECT_DIR,

    [Parameter(Mandatory=$false)]
    [int]$TokensEstimated = 0,

    [Parameter(Mandatory=$false)]
    [int]$DurationMs = 0
)

# Configuration
$ObservabilityServerUrl = "http://localhost:3001/api/events"
$FallbackEventsDir = Join-Path $WorkspaceRoot "RLM\progress\events"
$TimeoutSeconds = 5

# Generate unique event ID
function New-EventId {
    $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    $random = Get-Random -Maximum 9999
    return "evt_${timestamp}_${random}"
}

# Get session identity from environment
function Get-SessionIdentity {
    $sessionId = $env:CLAUDE_SESSION_ID
    if (-not $sessionId) {
        # Fallback: generate from timestamp
        $sessionId = "session_" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    }

    # Agent ID from manifest context or default to "primary"
    $agentId = $env:CLAUDE_AGENT_ID
    if (-not $agentId) {
        $agentId = "primary"
    }

    return @{
        SessionId = $sessionId
        AgentId = $agentId
    }
}

# Generate consistent color hash from identity
function Get-IdentityColor {
    param([string]$Identity)

    # Simple hash to color
    $hash = 0
    foreach ($char in $Identity.ToCharArray()) {
        $hash = (($hash -shl 5) - $hash) + [int]$char
        $hash = $hash -band 0xFFFFFF
    }

    # Generate HSL color with good saturation/lightness
    $hue = $hash % 360
    return "hsl($hue, 70%, 50%)"
}

# Build event payload
function Build-EventPayload {
    $identity = Get-SessionIdentity
    $eventId = New-EventId
    $timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

    # Parse details JSON if provided
    $details = @{}
    if ($DetailsJson -and $DetailsJson -ne "{}") {
        try {
            $details = $DetailsJson | ConvertFrom-Json -AsHashtable
        } catch {
            $details = @{ raw = $DetailsJson }
        }
    }

    # Get project info
    $projectId = Split-Path -Leaf $WorkspaceRoot

    return @{
        id = $eventId
        timestamp = $timestamp
        session_id = $identity.SessionId
        agent_id = $identity.AgentId
        project_id = $projectId
        event_type = $EventType
        tool_name = $ToolName
        summary = $null  # Will be filled by AI summarization later
        details_json = ($details | ConvertTo-Json -Compress -Depth 10)
        tokens_estimated = $TokensEstimated
        duration_ms = $DurationMs
        color = Get-IdentityColor -Identity "$projectId-$($identity.SessionId)"
    }
}

# Send event to server
function Send-ToServer {
    param([hashtable]$Event)

    try {
        $body = $Event | ConvertTo-Json -Depth 10

        $response = Invoke-RestMethod `
            -Uri $ObservabilityServerUrl `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -TimeoutSec $TimeoutSeconds `
            -ErrorAction Stop

        return $true
    } catch {
        # Server not available - will fallback to file
        return $false
    }
}

# Fallback: write event to local file
function Write-ToFallback {
    param([hashtable]$Event)

    # Ensure directory exists
    if (-not (Test-Path $FallbackEventsDir)) {
        New-Item -ItemType Directory -Path $FallbackEventsDir -Force | Out-Null
    }

    $filename = "$($Event.id).json"
    $filepath = Join-Path $FallbackEventsDir $filename

    $Event | ConvertTo-Json -Depth 10 | Out-File -FilePath $filepath -Encoding UTF8

    # Cleanup: keep only last 1000 event files
    $files = Get-ChildItem -Path $FallbackEventsDir -Filter "evt_*.json" | Sort-Object Name -Descending
    if ($files.Count -gt 1000) {
        $files | Select-Object -Skip 1000 | Remove-Item -Force
    }
}

# Main execution
try {
    $event = Build-EventPayload

    # Try to send to server first
    $sent = Send-ToServer -Event $event

    if (-not $sent) {
        # Fallback to local file
        Write-ToFallback -Event $event
    }

    # Output event ID for logging
    Write-Output $event.id

} catch {
    Write-Error "Failed to send event: $_"
    exit 1
}
