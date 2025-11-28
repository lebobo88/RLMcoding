# RLM Discovery Prompt

**Copy and paste this prompt into ANY AI coding agent to start discovery.**

---

## The Prompt

```
I want to create specifications for a new project using the RLM method.

First, please read the file: RLM/agents/research-agent.md
This contains the discovery process I want you to follow.

My project idea is:
[DESCRIBE YOUR IDEA HERE]

Please follow these phases:

## Phase 1: Research
- Analyze my idea and identify the core problem
- Research existing solutions and competitors
- Identify best practices for this type of project
- Note any technical considerations

## Phase 2: Questions
Ask me clarifying questions in these categories (ask 2-3 per category):

**Business (Critical)**
- What is the primary goal?
- Who are the target users?
- What does success look like?

**Technical (High)**
- What scale are we designing for?
- Are there technology preferences or constraints?
- What integrations are needed?

**Data (High)**
- What data needs to be stored?
- Are there compliance requirements (GDPR, etc.)?
- What are the privacy requirements?

**Security (Medium)**
- What authentication is needed?
- What authorization model?
- Are there audit requirements?

**UX (Medium)**
- What platforms (web, mobile, desktop)?
- Are there accessibility requirements?
- What are the key user workflows?

## Phase 3: Draft Specs
After I answer your questions, create these documents:

1. **RLM/specs/constitution.md** - Project standards including:
   - Development principles
   - Coding standards
   - Testing requirements
   - Security standards

2. **RLM/specs/features/FTR-001/spec.md** - Feature specification including:
   - Overview
   - User stories with acceptance criteria
   - Technical specifications
   - API endpoints (if applicable)
   - Data models

3. **RLM/specs/architecture/overview.md** - Technical architecture including:
   - System overview
   - Technology stack with rationale
   - Component architecture
   - Data flow

4. **RLM/specs/epics/breakdown.md** - Sprint planning including:
   - Epic breakdown
   - Task list
   - Suggested sprint plan
   - Risk register

Please start with Phase 1 and Phase 2 (research and questions).
```

---

## Quick Version

For agents that already have access to your codebase:

```
Read RLM/agents/research-agent.md and help me discover specs for: [YOUR IDEA]

Follow the phased approach:
1. Research the idea
2. Ask me clarifying questions (Business, Technical, Data, Security, UX)
3. Generate spec documents to RLM/specs/
```

---

## After Discovery

Once specs are generated, tell your AI agent:

```
Now implement the features following the specs in RLM/specs/.
Read the constitution for coding standards.
Use TDD - write tests first.
```
