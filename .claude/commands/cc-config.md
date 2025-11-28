# Configuration Management

You are managing Claude Code enhanced workflow configuration.

## Arguments

`$ARGUMENTS` can be:
- Empty - Show current configuration
- `[setting] [value]` - Update a setting
- `reset` - Reset to defaults
- `export` - Export current config

## Configuration File

Settings stored in `RLM/progress/cc-config.json`.

## Available Settings

### Parallel Execution
```
/cc-config parallel_limit 5      # Set concurrent sub-agents (1-10)
```

### Automation Level
```
/cc-config automation_level auto        # Full autonomy
/cc-config automation_level supervised  # Checkpoints at each phase
/cc-config automation_level manual      # Step-by-step approval
```

### Context Priming
```
/cc-config auto_priming true     # Enable automatic context loading
/cc-config auto_priming false    # Disable (use /prime-* manually)
```

### Token Reporting Thresholds
```
/cc-config warning_threshold 0.5      # Warn at 50% budget
/cc-config critical_threshold 0.75    # Critical warning at 75%
/cc-config auto_bundle_threshold 0.9  # Auto-save at 90%
```

### Error Handling
```
/cc-config auto_retry true       # Auto-retry failed tasks
/cc-config max_retries 3         # Maximum retry attempts
```

### Output Verbosity
```
/cc-config verbose true          # Show detailed output
/cc-config verbose false         # Minimal output
```

## Workflow

### Show Current Config
```
/cc-config
```

Output:
```markdown
## Claude Code Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| parallel_limit | 5 | Concurrent sub-agents |
| automation_level | supervised | Pipeline behavior |
| auto_priming | true | Context auto-load |
| warning_threshold | 0.5 | Token warning at 50% |
| critical_threshold | 0.75 | Critical at 75% |
| auto_bundle_threshold | 0.9 | Auto-save at 90% |
| auto_retry | false | Retry failed tasks |
| verbose | false | Output detail |
```

### Update Setting
```
/cc-config parallel_limit 8
```

Output:
```
Updated: parallel_limit = 8 (was 5)
```

### Reset to Defaults
```
/cc-config reset
```

Output:
```
Configuration reset to defaults.
```

### Export Config
```
/cc-config export
```

Output:
```json
{
  "parallel_limit": 5,
  "automation_level": "supervised",
  ...
}
```

## Validation

Settings are validated on update:

| Setting | Valid Range | Default |
|---------|-------------|---------|
| parallel_limit | 1-10 | 5 |
| automation_level | auto, supervised, manual | supervised |
| *_threshold | 0.0-1.0 | varies |
| max_retries | 0-5 | 2 |
| boolean settings | true, false | varies |

## Per-Session Override

Override config for a single command:
```
/cc-implement all --parallel=8 --auto
/cc-full [idea] --supervised --verbose
```

These don't modify the config file.

## Recommended Configurations

### High Performance (Powerful Machine)
```
/cc-config parallel_limit 8
/cc-config automation_level auto
/cc-config verbose false
```

### Conservative (Limited Resources)
```
/cc-config parallel_limit 3
/cc-config automation_level supervised
/cc-config warning_threshold 0.4
```

### Debug Mode
```
/cc-config verbose true
/cc-config automation_level manual
/cc-config auto_retry false
```
