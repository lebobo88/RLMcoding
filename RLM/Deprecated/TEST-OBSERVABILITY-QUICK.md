# Quick Test Guide - Observability System

## 🚀 Fastest Way to Test Everything

### Step 1: Run Automated Test Suite (30 seconds)

```bash
# On Linux/Mac/Git Bash
./RLM/commands/rlm-test-observability.sh

# On Windows PowerShell (if you have Git Bash)
bash RLM/commands/rlm-test-observability.sh
```

This will test all components automatically and report results.

### Step 2: Manual Quick Tests (2 minutes)

#### Test 1: Event Logging
```bash
# Initialize database
./RLM/commands/utils/event-logger.sh init

# Log a test event
source RLM/commands/utils/event-logger.sh
log_event "test" "Quick test" '{}' "test-session" "test-agent" "TEST-001" 0 0 0 0

# Verify it worked
./RLM/commands/rlm-observe.sh stats
```

#### Test 2: CLI Tool
```bash
# Check help works
./RLM/commands/rlm-observe.sh help

# View statistics
./RLM/commands/rlm-observe.sh stats
```

#### Test 3: Integration
```bash
# Run a dry-run build (generates events)
./RLM/commands/rlm-build.sh --mode supervised --dry-run

# Check events were logged
./RLM/commands/rlm-observe.sh tail 10
```

### Step 3: Test Web Dashboard (Optional, 1 minute)

```bash
# Start server
./RLM/commands/rlm-observe-server.sh start

# Check it's running
curl http://localhost:3000/health

# Open dashboard (or manually open RLM/observability/client/index.html)
./RLM/commands/rlm-observe-server.sh dashboard
```

## ✅ What Should Work

After testing, you should see:

1. ✅ **Database**: `RLM/progress/events.db` exists and has tables
2. ✅ **CLI Tools**: `rlm-observe.sh` shows help and statistics
3. ✅ **Events**: Events are logged when running builds
4. ✅ **Server**: Backend server starts and responds to HTTP requests
5. ✅ **Dashboard**: Frontend loads in browser (if server running)

## 🐛 If Something Fails

### Database Issues
```bash
# Reinitialize database
rm RLM/progress/events.db
./RLM/commands/utils/event-logger.sh init
```

### Server Issues
```bash
# Check if Node.js is installed
node --version  # Should be 18+

# Install dependencies
cd RLM/observability/server
npm install
```

### Permission Issues (Linux/Mac)
```bash
chmod +x RLM/commands/rlm-observe.sh
chmod +x RLM/commands/rlm-observe-server.sh
chmod +x RLM/commands/utils/*.sh
```

## 📚 Full Testing Guide

For comprehensive testing instructions, see:
- **[TESTING-OBSERVABILITY.md](docs/TESTING-OBSERVABILITY.md)** - Complete testing guide
- **[OBSERVABILITY.md](docs/OBSERVABILITY.md)** - Full observability documentation

## 🎯 Next Steps After Testing

1. **Run a real build** to see events in action:
   ```bash
   ./RLM/commands/rlm-build.sh --mode supervised
   ```

2. **Monitor in real-time**:
   ```bash
   # Terminal 1: Watch events
   ./RLM/commands/rlm-observe.sh tail
   
   # Terminal 2: Run build
   ./RLM/commands/rlm-build.sh --mode supervised
   ```

3. **Use the dashboard** for visual monitoring:
   ```bash
   ./RLM/commands/rlm-observe-server.sh start
   # Open dashboard in browser
   ```

## 💡 Pro Tips

- **Always-on**: Observability is enabled by default - no setup needed
- **Zero overhead**: Event logging adds < 1ms per event
- **Real-time**: Events appear instantly in CLI and dashboard
- **Persistent**: All events stored in SQLite for later analysis


