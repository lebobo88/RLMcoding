# RLM System Installation Guide

## Prerequisites

Before installing the RLM AI Agent Development System, ensure you have:

### Required
- **Git** (version 2.30+)
- **Operating System:** Windows 10/11, macOS 10.15+, or Linux
- **GitHub Account** with repository access
- **AI API Key** from one of:
  - Anthropic (Claude) - Recommended
  - OpenAI (GPT-4)
  - Google (Gemini)

### Language-Specific
Choose based on your tech stack:

#### Node.js Projects
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+

#### Python Projects
- Python 3.11+
- pip 23+
- virtualenv (recommended)

#### .NET Projects
- .NET 7+ SDK
- NuGet

#### Go Projects
- Go 1.21+

### Optional but Recommended
- **IDE:** Cursor, Windsurf, VS Code, Kiro, or Antigravity
- **jq** - JSON processor for command-line
- **Redis** - For caching (if using PM web app)
- **PostgreSQL** - For database (if using PM web app)

---

## Installation Steps

### Step 1: Clone or Navigate to Your Project

```bash
# For existing project
cd /path/to/your/project

# For new project
mkdir my-new-project
cd my-new-project
git init
```

### Step 2: Download RLM System

#### Option A: From GitHub (if RLM is published)
```bash
curl -L https://github.com/your-org/rlm-system/archive/main.zip -o rlm.zip
unzip rlm.zip -d RLM/
rm rlm.zip
```

#### Option B: Copy from Existing Installation
```bash
# Copy the entire RLM directory into your project
cp -r /path/to/rlm-source/RLM ./
```

### Step 3: Run Initialization

#### On Linux/macOS
```bash
chmod +x RLM/commands/*.sh
./RLM/commands/rlm-init.sh --ide cursor --tech-stack node
```

#### On Windows (PowerShell)
```powershell
.\RLM\commands\rlm-init.ps1 -IDE cursor -TechStack node
```

### Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Copy example file
cp RLM/.env.example .env

# Edit with your credentials
nano .env  # or use your preferred editor
```

Required configuration:
```env
# GitHub Integration
RLM_GITHUB_TOKEN=ghp_your_token_here
RLM_GITHUB_REPO=your-org/your-project
RLM_GITHUB_BRANCH=main

# AI Configuration
RLM_AI_MODEL=claude-sonnet-4
RLM_AI_API_KEY=sk-your-api-key-here
```

### Step 5: Verify Installation

```bash
# Check installation
./RLM/commands/rlm-init.sh --check

# Should output:
# ✓ RLM directory structure exists
# ✓ Configuration files exist
# ✓ Command scripts exist
# ✓ RLM installation check passed!
```

---

## GitHub Token Setup

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
4. Generate and copy the token
5. Add to your `.env` file

---

## AI API Key Setup

### Anthropic Claude (Recommended)
1. Visit: https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Create new key
5. Copy to `.env` as `RLM_AI_API_KEY`

### OpenAI GPT-4
1. Visit: https://platform.openai.com/
2. Sign up or log in
3. Navigate to API keys
4. Create new secret key
5. Copy to `.env` as `RLM_AI_API_KEY`
6. Update `.env`: `RLM_AI_MODEL=gpt-4`

### Google Gemini
1. Visit: https://makersuite.google.com/
2. Get API key
3. Copy to `.env` as `RLM_AI_API_KEY`
4. Update `.env`: `RLM_AI_MODEL=gemini-pro`

---

## IDE Configuration

### Cursor IDE
Cursor has native support for AI agents and the RLM system works seamlessly.

1. Open your project in Cursor
2. The RLM system will be detected automatically
3. Use Composer for multi-file edits
4. Agent prompts from `RLM/agents/` will be available

### Windsurf IDE
1. Open your project in Windsurf
2. Configure Cascade workflows in `.windsurf/workflows/`
3. RLM automation scripts can be triggered via Cascade

### VS Code
1. Install extensions:
   - GitHub Copilot
   - GitHub Copilot Chat
2. Configure tasks in `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "RLM: Build",
      "type": "shell",
      "command": "./RLM/commands/rlm-build.sh",
      "group": "build"
    }
  ]
}
```

---

## Initial Configuration

### 1. Edit Project Constitution

```bash
nano RLM/specs/constitution.md
```

Define your project's:
- Coding standards
- Testing requirements
- Security policies
- Performance targets
- Architecture principles

### 2. Create Your First Feature Spec

```bash
mkdir -p RLM/specs/features/FTR-001-my-feature
nano RLM/specs/features/FTR-001-my-feature/spec.md
```

Use the template from `RLM/templates/spec-template.md`

### 3. Commit Initial Setup

```bash
git add RLM/ .env.example .gitignore
git commit -m "feat: Initialize RLM AI Agent Development System"
git push origin main
```

---

## Verification Tests

### Test 1: Run Help Command
```bash
./RLM/commands/rlm-build.sh --help
```

Should display help information.

### Test 2: Generate Report
```bash
./RLM/commands/rlm-report.sh summary
```

Should display a progress report (even if empty).

### Test 3: Sync Test
```bash
./RLM/commands/rlm-sync.sh pull --dry-run
```

Should simulate pulling from GitHub without errors.

---

## Troubleshooting

### Issue: Command not found

**Solution:**
```bash
# Make scripts executable
chmod +x RLM/commands/*.sh

# Or use bash explicitly
bash ./RLM/commands/rlm-init.sh
```

### Issue: jq not found

**Solution:**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Windows (with Chocolatey)
choco install jq
```

### Issue: GitHub authentication failed

**Solution:**
1. Verify token has correct permissions
2. Check token hasn't expired
3. Ensure `RLM_GITHUB_TOKEN` in `.env` is correct

### Issue: AI API errors

**Solution:**
1. Verify API key is valid
2. Check you have credits/quota remaining
3. Ensure model name is correct
4. Try with a simpler model first

---

## Next Steps

After successful installation:

1. **Read the User Guide**: `RLM/docs/RLM-User-Guide.md`
2. **Review Commands**: `RLM/docs/RLM-Commands-Guide.md`
3. **Create Your First Spec**: Use templates from `RLM/templates/`
4. **Run Your First Build**:
   ```bash
   ./RLM/commands/rlm-build.sh --mode supervised
   ```

---

## Uninstallation

If you need to remove RLM from your project:

```bash
# Remove RLM directory
rm -rf RLM/

# Remove configuration
rm .env

# Remove from git
git rm -r RLM/
git commit -m "chore: Remove RLM system"
```

---

## Getting Help

- **Documentation**: Check `RLM/docs/` directory
- **GitHub Issues**: Report bugs and request features
- **Community**: Join discussions on GitHub Discussions

---

## System Requirements Summary

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 4 GB | 8 GB+ |
| Disk Space | 500 MB | 2 GB+ |
| Internet | Required | High-speed |
| Git | 2.30+ | Latest |
| Node.js | 18 | 20 LTS |
| Python | 3.11 | 3.12 |

---

**Installation Complete!** 🎉

You're now ready to start using the RLM AI Agent Development System for automated, AI-driven development.

