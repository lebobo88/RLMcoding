# RLM Observability System

Complete guide to monitoring, analyzing, and debugging AI agent activities in the RLM system.

## Overview

The RLM Observability System provides comprehensive visibility into all AI agent activities through:

- **Event Logging**: Structured event capture with SQLite persistence
- **Real-time Monitoring**: Live event streams via CLI and WebSocket
- **AI Summarization**: Automatic event summarization using Claude Haiku
- **Web Dashboard**: Real-time visualization and intervention controls
- **Session Tracking**: Color-coded session identification for easy tracking

## Quick Start

### 1. Enable Observability

Observability is enabled by default. Verify in `RLM/config/project-config.json`:

```json
{
  "observability": {
    "enabled": true,
    "logEvents": true
  }
}
```

### 2. Monitor Events

```bash
# Live event stream
./RLM/commands/rlm-observe.sh tail

# View recent events
./RLM/commands/rlm-observe.sh tail 100

# Activity summary
./RLM/commands/rlm-observe.sh summary
```

### 3. Start Web Dashboard (Optional)

```bash
# Start observability server
./RLM/commands/rlm-observe-server.sh start

# Open dashboard
./RLM/commands/rlm-observe-server.sh dashboard
```

## Event Types

The system captures the following event types:

### Session Events
- `session_start` - Build session begins
- `session_end` - Build session completes

### Task Events
- `task_start` - Task execution begins
- `task_complete` - Task execution completes
- `spec_read` - Task specification loaded
- `plan_created` - Implementation plan generated

### Code Events
- `code_written` - Code file created/modified
- `test_written` - Test file created/modified
- `test_run` - Tests executed

### Tool Events
- `tool_use` - Agent uses a tool/function
- `context_loaded` - Context primed/loaded

### Error Events
- `error_occurred` - Error encountered
- `blocker_created` - Blocker identified

### Intervention Events
- `intervention_requested` - Approval requested
- `intervention_approved` - Approval granted
- `intervention_rejected` - Approval rejected

## CLI Monitoring

### Live Event Stream

```bash
# Follow live events (Ctrl+C to stop)
./RLM/commands/rlm-observe.sh tail

# Show last N events without following
./RLM/commands/rlm-observe.sh tail 50
```

### Trace Sessions and Tasks

```bash
# Replay session timeline
./RLM/commands/rlm-observe.sh trace session build-1234567890-12345

# Replay task timeline
./RLM/commands/rlm-observe.sh trace task TASK-001
```

### Filter Events

```bash
# Filter by agent
./RLM/commands/rlm-observe.sh filter --agent implementation-agent

# Filter by event type
./RLM/commands/rlm-observe.sh filter --type error_occurred

# Filter by task
./RLM/commands/rlm-observe.sh filter --task TASK-001 --limit 20

# Combine filters
./RLM/commands/rlm-observe.sh filter --agent master-architect --type plan_created
```

### Statistics

```bash
# Overall statistics
./RLM/commands/rlm-observe.sh stats

# Activity summary (last 24 hours)
./RLM/commands/rlm-observe.sh summary

# Activity summary (last 48 hours)
./RLM/commands/rlm-observe.sh summary 48
```

### Direct Database Access

```bash
# Run SQL query
./RLM/commands/rlm-observe.sh db "SELECT COUNT(*) FROM events WHERE event_type = 'task_start'"

# Get events by date
./RLM/commands/rlm-observe.sh db "SELECT * FROM events WHERE date(timestamp) = date('now') LIMIT 10"
```

## Web Dashboard

### Starting the Server

```bash
# Start server
./RLM/commands/rlm-observe-server.sh start

# Check status
./RLM/commands/rlm-observe-server.sh status

# View logs
./RLM/commands/rlm-observe-server.sh logs

# Stop server
./RLM/commands/rlm-observe-server.sh stop
```

### Dashboard Features

1. **Real-time Activity Feed**
   - Live event stream via WebSocket
   - Color-coded event types
   - Session and agent identification

2. **Filtering**
   - Filter by agent, event type, session, or task
   - Real-time filter updates

3. **Statistics Panel**
   - Total events, tokens, and cost
   - Session and agent counts
   - Real-time updates

4. **Intervention Controls** (Supervised Mode)
   - View pending approvals
   - Approve or reject agent actions
   - Real-time approval workflow

### Accessing the Dashboard

Once the server is running, open:
- **File**: `RLM/observability/client/index.html`
- **Or**: `./RLM/commands/rlm-observe-server.sh dashboard`

## Event Summarization

Events are automatically summarized using Claude Haiku for human-readable descriptions.

### Manual Summarization

```bash
# Summarize all unsummarized events
./RLM/commands/utils/event-summarizer.sh summarize

# Summarize specific event
./RLM/commands/utils/event-summarizer.sh summarize evt_1234567890

# Summarize up to N events
./RLM/commands/utils/event-summarizer.sh summarize "" 50
```

### Summarization Statistics

```bash
./RLM/commands/utils/event-summarizer.sh stats
```

### Configuration

Set API key in environment or config:

```bash
export RLM_SUMMARIZATION_API_KEY="sk-ant-api03-..."
```

Or in `RLM/config/project-config.json`:

```json
{
  "observability": {
    "summarizeEvents": true,
    "summaryModel": "claude-haiku-3.5"
  }
}
```

## Session Color Coding

Sessions are automatically assigned unique colors for visual identification:

```bash
# Test session color
./RLM/commands/utils/session-colors.sh bg-1234567890-12345
```

Colors are used in:
- CLI event output
- Web dashboard
- Background agent listings

## Intervention Workflow

### Requesting Approval

Agents in supervised mode automatically request approval for critical actions:

```bash
# List pending approvals
./RLM/commands/utils/intervention-handler.sh list

# Approve action
./RLM/commands/utils/intervention-handler.sh approve approval-1234567890-12345

# Reject action
./RLM/commands/utils/intervention-handler.sh reject approval-1234567890-12345 "Not ready"
```

### Integration with Agents

Intervention is automatically integrated into `rlm-build.sh` when running in supervised mode. Agents will:

1. Request approval before major actions
2. Wait for approval/rejection
3. Log intervention events
4. Continue or abort based on decision

## Database Schema

Events are stored in SQLite at `RLM/progress/events.db`:

```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  session_id TEXT,
  agent_id TEXT,
  task_id TEXT,
  event_type TEXT NOT NULL,
  summary TEXT,
  details_json TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  cost REAL DEFAULT 0.0,
  duration_ms INTEGER DEFAULT 0
);

CREATE TABLE event_summaries (
  event_id TEXT PRIMARY KEY,
  summary_text TEXT,
  model_used TEXT,
  tokens_used INTEGER,
  cost REAL,
  created_at TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id)
);
```

## Configuration

### Project Config

`RLM/config/project-config.json`:

```json
{
  "observability": {
    "enabled": true,
    "logEvents": true,
    "sqliteDatabase": "RLM/progress/events.db",
    "summarizeEvents": true,
    "summaryModel": "claude-haiku-3.5",
    "server": {
      "enabled": false,
      "port": 3000,
      "host": "localhost"
    },
    "dashboard": {
      "enabled": false,
      "autoOpen": false
    }
  }
}
```

### Environment Variables

```bash
# Observability
RLM_OBSERVABILITY_ENABLED=true
RLM_SUMMARIZATION_API_KEY=sk-ant-api03-...
RLM_OBSERVABILITY_SERVER_PORT=3000
RLM_OBSERVABILITY_SERVER_HOST=localhost
RLM_DASHBOARD_AUTO_OPEN=false
```

## Testing

### Quick Test

Run the automated test suite:

```bash
./RLM/commands/rlm-test-observability.sh
```

This validates all components including:
- Utility scripts functionality
- CLI tools accessibility
- Database operations
- Configuration files
- Integration points
- Backend and frontend files

**See [Testing Guide](TESTING-OBSERVABILITY.md) for complete testing instructions.**

## Troubleshooting

### Events Not Logging

1. Check observability is enabled:
   ```bash
   jq '.observability.enabled' RLM/config/project-config.json
   ```

2. Check database exists:
   ```bash
   ls -la RLM/progress/events.db
   ```

3. Initialize database:
   ```bash
   ./RLM/commands/utils/event-logger.sh init
   ```

### WebSocket Not Connecting

1. Verify server is running:
   ```bash
   ./RLM/commands/rlm-observe-server.sh status
   ```

2. Check server logs:
   ```bash
   ./RLM/commands/rlm-observe-server.sh logs
   ```

3. Verify port is not in use:
   ```bash
   netstat -an | grep 3000
   ```

### Summarization Not Working

1. Check API key is set:
   ```bash
   echo $RLM_SUMMARIZATION_API_KEY
   ```

2. Test API connection:
   ```bash
   curl -H "x-api-key: $RLM_SUMMARIZATION_API_KEY" https://api.anthropic.com/v1/messages
   ```

3. Check fallback mode (pattern-based summaries will be used if API fails)

## Performance

- **Event Logging Overhead**: < 1ms per event
- **Database Size**: ~1KB per event
- **WebSocket Latency**: < 10ms
- **Summarization Cost**: ~$0.002 per build (with Haiku)

## Best Practices

1. **Regular Cleanup**: Clean old events periodically
   ```bash
   ./RLM/commands/utils/event-logger.sh cleanup 90
   ```

2. **Monitor Costs**: Track token usage via observability
   ```bash
   ./RLM/commands/rlm-observe.sh summary
   ```

3. **Session Tracking**: Use session IDs to trace full workflows
   ```bash
   ./RLM/commands/rlm-observe.sh trace session <session-id>
   ```

4. **Error Monitoring**: Filter for errors regularly
   ```bash
   ./RLM/commands/rlm-observe.sh filter --type error_occurred
   ```

## API Reference

### Event Logger

```bash
# Initialize database
./RLM/commands/utils/event-logger.sh init

# Get statistics
./RLM/commands/utils/event-logger.sh stats

# Cleanup old events
./RLM/commands/utils/event-logger.sh cleanup 90

# Optimize database
./RLM/commands/utils/event-logger.sh vacuum
```

### Event Summarizer

```bash
# Summarize events
./RLM/commands/utils/event-summarizer.sh summarize [event-id] [limit]

# Get statistics
./RLM/commands/utils/event-summarizer.sh stats
```

### Intervention Handler

```bash
# Request approval
./RLM/commands/utils/intervention-handler.sh request <agent> <action> [context] [session] [task]

# Approve
./RLM/commands/utils/intervention-handler.sh approve <approval-id>

# Reject
./RLM/commands/utils/intervention-handler.sh reject <approval-id> [reason]

# List pending
./RLM/commands/utils/intervention-handler.sh list
```

## Integration

Observability is automatically integrated into:

- `rlm-build.sh` - Main build script
- `background-agent.sh` - Background agent execution
- All agent invocations
- Token tracking system
- Progress tracking system

No additional code changes needed - events are captured automatically!

