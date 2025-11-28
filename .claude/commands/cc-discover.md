# Enhanced Discovery with Sub-Agent Research

You are initiating Claude Code enhanced discovery mode. This command delegates research-intensive tasks to the Research Sub-Agent for context efficiency.

## Automatic Context Priming

This command automatically loads:
- `RLM/progress/cc-config.json` - Configuration settings
- `RLM/templates/PRD-TEMPLATE.md` - PRD structure reference
- `RLM/prompts/01-DISCOVER.md` - Discovery framework
- Existing `RLM/specs/PRD.md` (if resuming/updating)

## Automatic Token Reporting

Token usage is tracked automatically:
- Each Research sub-agent call logged silently
- **50% budget**: Warning displayed, continue discovery
- **75% budget**: "Consider completing Round 3 questions and generating PRD"
- **90% budget**: Auto-save context, complete PRD generation only

## Workflow

### Step 1: Initial Context Gathering
Read the user's idea/description provided as: $ARGUMENTS

If no arguments provided, ask: "What project idea would you like to explore?"

### Step 2: Delegate Research to Sub-Agent
Use the Task tool to spawn the Research Sub-Agent with:
- **subagent_type**: `research` (from `.claude/agents/research.md`)
- **prompt**: Include the user's idea and request:
  - Competitive landscape analysis
  - Similar solutions and their approaches
  - Relevant technology trends
  - Potential user segments

### Step 3: Primary Agent Analysis
While research proceeds, analyze the idea for:
- Industry detection (SaaS, E-commerce, FinTech, HealthTech, EdTech, Marketplace)
- Core problem identification
- Initial scope assessment

### Step 4: Synthesize and Question
Combine research findings with your analysis.

Ask clarifying questions in 3 rounds:

**Round 1 - Problem & Users (4 questions)**
- Who is the target user?
- What specific problem are we solving?
- What happens if this problem isn't solved?
- How are users solving this today?

**Round 2 - Solution & Scope (4 questions)**
- What's the core feature that solves this?
- What are the "must-have" vs "nice-to-have" features?
- What's out of scope for v1?
- Any integrations required?

**Round 3 - Technical & Business (4 questions)**
- Any specific technology requirements?
- What scale do we need to support?
- How will this make money (if applicable)?
- What does success look like?

### Step 5: Generate PRD
After all questions answered, read and follow `RLM/prompts/01-DISCOVER.md` to generate the PRD.

Write output to `RLM/specs/PRD.md`.

### Step 6: Report Token Usage
Log this session's token usage via the token-reporter hook.

## Context Efficiency Notes

- Research sub-agent operates in isolated context (0% primary window pollution)
- Only synthesized research findings are returned to primary agent
- Detailed research is saved to `RLM/specs/research/` for reference
- This workflow reduces primary context usage by ~40% compared to inline research
