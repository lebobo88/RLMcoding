Claude Code Sub-Agent Architecture

1. Core Directive: The Delegation Hierarchy
You are to operate within a tiered agentic structure to maximize context efficiency and task specialization.

Primary Agent: The top-level interface interacting with the user. It functions as the orchestrator.

Sub-Agents: Specialized, ephemeral instances called by the Primary Agent to perform specific tasks. They operate in isolated context windows.

The Golden Rule of Information Flow
Protocol: Sub-Agents do not report to the User. Sub-Agents report to the Primary Agent.

User prompts Primary Agent.

Primary Agent prompts Sub-Agent (passing necessary context).

Sub-Agent executes task and reports results to Primary Agent.

Primary Agent synthesizes result and reports to User.

2. Sub-Agent Configuration Protocol
When defining new agents in the agents/ directory, adhere to the following strict standards to avoid common engineering pitfalls.

A. The System Prompt Fallacy
Concept: The text inside a sub-agent's configuration file is a System Prompt, not a User Prompt.

Instruction: Write instructions that define who the agent is and how it functions, not what you want it to do in a specific instance.

Variable Injection: Use variables (e.g., {{USERNAME}}) to pass dynamic context, but rely on the Primary Agent to provide the specific task trigger.

B. Description Engineering (The API Hook)
Concept: The description field in the agent config is the only API the Primary Agent sees.

Instruction: You must "prompt the Primary Agent" via this description.

Bad: "A helper for text to speech."

Good: "Use this agent proactively when the user asks for a summary. Prompt this agent with a concise summary of the work completed so it can generate audio."

Why: This guides the Primary Agent on when to call the tool and what data to pass it.

3. The "Meta Agent" Protocol (Self-Replication)
Use a "Meta Agent" to build new sub-agents, solving the "Problem -> Solution -> Tech" pipeline.

Construction Workflow
Problem Identification: (e.g., "I lose track of background tasks.")

Solution Design: (e.g., "I need an audio notification.")

Tech Implementation: (e.g., "Build a Sub-Agent with 11Labs MCP tools.")

Meta-Prompting: Use a specialized agent explicitly designed to generate valid .agent configuration files based on a user's natural language description.

Meta Agent Capabilities
Must be able to read current documentation (via AI_DOCS or similar).

Must output files to the agents/ directory.

Must validate tool availability (e.g., check for text-to-speech tools before adding them to the config).

4. Operational Constraints & Trade-offs
A. Context Isolation (The Double-Edged Sword)
Benefit: Sub-agents start with 0% token usage. They do not pollute the main session history.

Constraint: Sub-agents have Zero Context History. They do not know what the user said 5 minutes ago unless the Primary Agent explicitly passes that string in the prompt payload.

Mitigation: The Primary Agent must be instructed to pass "Work done so far" or "User requirements" explicitly in the call.

B. Debugging & Visibility
Constraint: You cannot easily see the internal thought process of a sub-agent, only its tool inputs and final output.

Mitigation: Rely on Claude Code Hooks to log lifecycle events if deep debugging is required.

C. Recursive Limitation
Constraint: Sub-agents cannot currently call other sub-agents. The hierarchy is flat (Primary -> Sub).

5. Example Implementation: The "TTS Notification" Module
A concrete application of the Sub-Agent Protocol.

Trigger: Work completion (e.g., a long build or plan generation).

Sub-Agent Config:

Tools: 11labs-mcp (Text-to-Speech), play_audio.

System Prompt: "You are a narrator. Receive a summary of work, convert it to a concise audio file using the 'Adam' voice, and play it immediately."

Primary Agent Instruction: "When the plan is finished, call the TTS Agent with a one-sentence summary of the generated file."

Summary Checklist for Engineers
Isolate: Move high-context or distinct tasks (docs reading, heavy codegen) to sub-agents.

Describe: Write description fields that instruct the Primary Agent on how to prompt the sub-agent.

Meta-Build: Don't write configs by hand; use a Meta Agent to generate them to ensure schema compliance.

Monitor: Watch for "Dependency Coupling"—if a sub-agent's output format changes, the Primary Agent may fail to parse it.