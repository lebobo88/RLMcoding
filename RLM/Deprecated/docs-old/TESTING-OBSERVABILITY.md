# Testing the RLM Observability System

Complete guide to testing all observability components.

## Quick Test

Run the automated test suite:

```bash
./RLM/commands/rlm-test-observability.sh
```

This will test:
- ✅ All utility scripts exist and are functional
- ✅ CLI tools are accessible
- ✅ Database initialization and queries
- ✅ Configuration files
- ✅ Integration with rlm-build.sh
- ✅ Backend server files
- ✅ Frontend dashboard files
- ✅ Documentation completeness
- ✅ Functional event logging

## Manual Testing Guide

### 1. Test Event Logging

```bash
# Initialize database
./RLM/commands/utils/event-logger.sh init

# Log a test event
source RLM/commands/utils/event-logger.sh
log_event "test_event" "Manual test event" '{"test":true}' "test-session" "test-agent" "TEST-001" 100 50 0.001 100

# Verify event was logged
sqlite3 RLM/progress/events.db "SELECT * FROM events WHERE event_type = 'test_event'"
```

**Expected**: Event appears in database with all fields populated.

### 2. Test Session Colors

```bash
# Test color generation
./RLM/commands/utils/session-colors.sh test-session-123

# Test formatting
source RLM/commands/utils/session-colors.sh
format_session "test-session-123" "Test Session"
format_agent "implementation-agent"
```

**Expected**: Color codes and emojis are generated consistently.

### 3. Test CLI Observability Tool

```bash
# Test help
./RLM/commands/rlm-observe.sh help

# Test statistics
./RLM/commands/rlm-observe.sh stats

# Test summary
./RLM/commands/rlm-observe.sh summary

# Test filtering (after generating some events)
./RLM/commands/rlm-observe.sh filter --type test_event

# Test tracing
./RLM/commands/rlm-observe.sh trace session test-session-123
```

**Expected**: All commands execute without errors and show relevant output.

### 4. Test Event Summarization

```bash
# Test summarizer help
./RLM/commands/utils/event-summarizer.sh help

# Test statistics
./RLM/commands/utils/event-summarizer.sh stats

# Test summarization (requires API key)
export RLM_SUMMARIZATION_API_KEY="sk-ant-api03-..."
./RLM/commands/utils/event-summarizer.sh summarize "" 5
```

**Expected**: 
- Without API key: Uses pattern-based fallback
- With API key: Generates AI summaries via Haiku API

### 5. Test Intervention Handler

```bash
# Test help
./RLM/commands/utils/intervention-handler.sh help

# Request approval
./RLM/commands/utils/intervention-handler.sh request \
    "implementation-agent" \
    "Deploy to production" \
    "Production deployment" \
    "test-session" \
    "TEST-001"

# List pending
./RLM/commands/utils/intervention-handler.sh list

# Approve (use approval ID from list)
./RLM/commands/utils/intervention-handler.sh approve approval-1234567890-12345
```

**Expected**: Approval workflow creates files in `RLM/progress/interventions/`.

### 6. Test Integration with rlm-build.sh

```bash
# Run a dry-run build to generate events
./RLM/commands/rlm-build.sh --mode supervised --dry-run

# Check events were logged
./RLM/commands/rlm-observe.sh tail 20

# Verify session ID was created
./RLM/commands/rlm-observe.sh filter --type session_start
```

**Expected**: Build process logs events automatically.

### 7. Test Backend Server

```bash
# Start server
./RLM/commands/rlm-observe-server.sh start

# Check status
./RLM/commands/rlm-observe-server.sh status

# Test health endpoint
curl http://localhost:3000/health

# Test events endpoint
curl http://localhost:3000/events?limit=10

# Test stats endpoint
curl http://localhost:3000/stats

# Stop server
./RLM/commands/rlm-observe-server.sh stop
```

**Expected**: 
- Server starts without errors
- Health endpoint returns `{"status":"ok"}`
- Events endpoint returns JSON array
- Stats endpoint returns statistics

### 8. Test Frontend Dashboard

```bash
# Start server
./RLM/commands/rlm-observe-server.sh start

# Open dashboard
./RLM/commands/rlm-observe-server.sh dashboard

# Or manually open
# File: RLM/observability/client/index.html
```

**Expected**:
- Dashboard loads in browser
- WebSocket connects (status shows "Connected")
- Events appear in activity feed
- Filters work
- Statistics update

### 9. Test WebSocket Real-time Updates

```bash
# Terminal 1: Start server and watch logs
./RLM/commands/rlm-observe-server.sh start
./RLM/commands/rlm-observe-server.sh logs

# Terminal 2: Generate events
source RLM/commands/utils/event-logger.sh
for i in {1..5}; do
    log_event "test_event" "Test event $i" '{"number":'$i'}' "ws-test-session" "test-agent" "TEST-001" 100 50 0.001 100
    sleep 1
done

# Terminal 3: Monitor events
./RLM/commands/rlm-observe.sh tail
```

**Expected**: Events appear in real-time in both CLI and dashboard.

### 10. Test Full Workflow

```bash
# 1. Initialize
./RLM/commands/rlm-init.sh --ide cursor --tech-stack node

# 2. Create a test task
mkdir -p RLM/tasks/active
cat > RLM/tasks/active/TEST-OBSERVABILITY.md << EOF
# Test Task for Observability

## Type: implementation

## Description
Test task to validate observability system.

## Acceptance Criteria
- Events are logged
- Dashboard shows activity
- Statistics are accurate
EOF

# 3. Start observability server
./RLM/commands/rlm-observe-server.sh start

# 4. Monitor in one terminal
./RLM/commands/rlm-observe.sh tail

# 5. Run build in another terminal
./RLM/commands/rlm-build.sh --task TEST-OBSERVABILITY --mode supervised

# 6. Verify events
./RLM/commands/rlm-observe.sh trace task TEST-OBSERVABILITY

# 7. Check statistics
./RLM/commands/rlm-observe.sh summary
```

**Expected**: Complete workflow generates events at each stage.

## Integration Testing

### Test with Real Agent Work

1. **Create a real feature spec**:
   ```bash
   mkdir -p RLM/specs/features/FTR-TEST
   # Add a simple feature spec
   ```

2. **Run supervised build**:
   ```bash
   ./RLM/commands/rlm-build.sh --mode supervised
   ```

3. **Monitor in real-time**:
   ```bash
   # Terminal 1: Live events
   ./RLM/commands/rlm-observe.sh tail
   
   # Terminal 2: Dashboard
   ./RLM/commands/rlm-observe-server.sh start
   ```

4. **Verify all event types**:
   ```bash
   # Check for session events
   ./RLM/commands/rlm-observe.sh filter --type session_start
   ./RLM/commands/rlm-observe.sh filter --type session_end
   
   # Check for task events
   ./RLM/commands/rlm-observe.sh filter --type task_start
   ./RLM/commands/rlm-observe.sh filter --type task_complete
   
   # Check for tool events
   ./RLM/commands/rlm-observe.sh filter --type tool_use
   ```

## Performance Testing

### Test Event Logging Performance

```bash
# Generate 1000 events and measure time
time (
    source RLM/commands/utils/event-logger.sh
    for i in {1..1000}; do
        log_event "perf_test" "Performance test $i" '{"index":'$i'}' "perf-session" "test-agent" "PERF-001" 100 50 0.001 100
    done
)
```

**Expected**: < 1 second for 1000 events.

### Test Database Query Performance

```bash
# Time query for recent events
time sqlite3 RLM/progress/events.db "SELECT * FROM events ORDER BY timestamp DESC LIMIT 100"

# Time filtered query
time sqlite3 RLM/progress/events.db "SELECT * FROM events WHERE agent_id = 'test-agent' LIMIT 100"
```

**Expected**: < 100ms for typical queries.

## Troubleshooting Tests

### Database Issues

```bash
# Check database integrity
sqlite3 RLM/progress/events.db "PRAGMA integrity_check;"

# Check table structure
sqlite3 RLM/progress/events.db ".schema events"

# Rebuild indexes
sqlite3 RLM/progress/events.db "REINDEX;"
```

### Server Issues

```bash
# Check if port is in use
netstat -an | grep 3000

# Check server logs
./RLM/commands/rlm-observe-server.sh logs

# Check Node.js version
node --version  # Should be 18+

# Install dependencies
cd RLM/observability/server
npm install
```

### WebSocket Issues

```bash
# Test WebSocket connection
wscat -c ws://localhost:3000

# Or use curl for HTTP
curl http://localhost:3000/health
```

## Test Checklist

Before considering observability system ready:

- [ ] All utility scripts exist and are executable
- [ ] Database initializes correctly
- [ ] Events can be logged and queried
- [ ] CLI tools work (tail, trace, filter, summary, stats)
- [ ] Session colors generate consistently
- [ ] Event summarization works (with/without API key)
- [ ] Intervention handler creates/manages approvals
- [ ] rlm-build.sh logs events automatically
- [ ] Backend server starts and responds
- [ ] WebSocket broadcasts events
- [ ] Frontend dashboard loads and connects
- [ ] Dashboard shows real-time events
- [ ] Filters work in dashboard
- [ ] Statistics update in dashboard
- [ ] Documentation is complete

## Continuous Testing

Add to your CI/CD pipeline:

```bash
# In your CI script
./RLM/commands/rlm-test-observability.sh

# If tests pass, run integration test
./RLM/commands/rlm-build.sh --mode supervised --dry-run

# Verify events were generated
./RLM/commands/rlm-observe.sh stats | grep -q "total_events"
```

## Next Steps

After testing:

1. **Review test results** - Fix any failures
2. **Run integration test** - Full workflow with real tasks
3. **Monitor in production** - Use observability during real development
4. **Optimize** - Adjust based on usage patterns
5. **Document findings** - Update docs with any issues found

## Getting Help

If tests fail:

1. Check error messages carefully
2. Verify all dependencies are installed
3. Check file permissions
4. Review logs in `RLM/progress/`
5. Check configuration in `RLM/config/project-config.json`
6. Review [OBSERVABILITY.md](OBSERVABILITY.md) troubleshooting section


