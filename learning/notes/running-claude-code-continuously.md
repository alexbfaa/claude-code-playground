# Running Claude Code Continuously or On a Schedule

Research completed March 2026. This covers the practical options for running Claude Code agents without constant human supervision.

---

## The Big Picture

There are six main approaches, ranging from simple to advanced:

1. **Built-in scheduling** (`/loop` and Desktop scheduled tasks)
2. **CLI non-interactive mode** (`claude -p`)
3. **Claude Code on the Web** (cloud-hosted, runs in Anthropic VMs)
4. **The Claude Agent SDK** (Python/TypeScript library for building custom agents)
5. **GitHub Actions / GitLab CI/CD** (event-driven automation)
6. **Self-hosted hardware** (Mac Mini, VPS, cloud VMs)

---

## 1. Built-in Scheduling

### /loop (Session-Scoped)

The `/loop` skill runs a prompt on a repeating interval inside an active Claude Code session.

```
/loop 5m check if the deployment finished and tell me what happened
/loop 20m /review-pr 1234
```

- Intervals: seconds, minutes, hours, days (minimum granularity is 1 minute)
- Default interval is every 10 minutes if you don't specify one
- **Session-scoped**: tasks only run while Claude Code is open and idle. Closing the terminal kills all scheduled tasks.
- Tasks auto-expire after 3 days
- No catch-up for missed runs
- Up to 50 tasks per session
- One-shot reminders also work: "remind me at 3pm to push the release branch"
- Uses `CronCreate`, `CronList`, `CronDelete` tools under the hood

**Good for**: Polling deployments, monitoring builds, periodic checks during an active work session.

**Not good for**: Anything that needs to survive a restart or run unattended.

### Desktop Scheduled Tasks (Durable)

The Claude Desktop app has a "Schedule" section in the sidebar that creates recurring tasks that persist across app restarts.

- Frequency options: Manual, Hourly, Daily, Weekdays, Weekly (or ask Claude for custom intervals like "every 6 hours")
- Each run starts a fresh session automatically
- Tasks run locally on your machine -- the Desktop app must be open and your computer awake
- Missed runs get one catch-up run when the computer wakes (looks back 7 days, runs once)
- Can use Git worktrees for isolation (each run gets its own copy)
- Has its own permission mode (can pre-approve tools to avoid stalls)
- Task prompts stored at `~/.claude/scheduled-tasks/<task-name>/SKILL.md`
- "Keep computer awake" setting available in Desktop preferences (doesn't prevent lid-close sleep)

**Good for**: Daily code reviews, dependency checks, morning briefings, any recurring task where your computer is on.

**Not good for**: True 24/7 operation (needs computer awake + app open).

---

## 2. CLI Non-Interactive Mode (`claude -p`)

The `-p` (or `--print`) flag runs Claude Code as a one-shot command that takes a prompt, does the work, and exits. No human interaction needed.

```bash
# Simple question
claude -p "What does the auth module do?"

# Fix code with specific tool permissions
claude -p "Run the test suite and fix any failures" --allowedTools "Bash,Read,Edit"

# Get structured JSON output
claude -p "Summarize this project" --output-format json

# Continue a previous conversation
claude -p "Now focus on the database queries" --continue

# Custom system prompt for specialized tasks
gh pr diff "$1" | claude -p --append-system-prompt "You are a security engineer. Review for vulnerabilities." --output-format json
```

Key flags for automation:
- `-p` / `--print`: Run non-interactively
- `--allowedTools`: Pre-approve specific tools (no permission prompts)
- `--output-format json|stream-json|text`: Control output format
- `--json-schema`: Get output matching a specific structure
- `--continue` / `--resume <session-id>`: Continue previous conversations
- `--append-system-prompt`: Add custom instructions
- `--permission-mode acceptEdits`: Auto-accept file changes

**This is the foundation for all automation.** You can wrap `claude -p` in a cron job, a shell script, a CI pipeline, or anything else that can run a command.

---

## 3. Claude Code on the Web (Cloud-Hosted)

Anthropic runs Claude Code on their own cloud VMs so you don't need your own hardware.

### How it works:
1. Go to claude.ai/code or use `claude --remote "your task"` from the terminal
2. Your repo gets cloned to an Anthropic-managed VM
3. Claude runs in a sandboxed environment with your code
4. You review changes in a diff view and create a PR when ready

### Key features:
- **Runs even when your computer is off** -- sessions persist in the cloud
- **Parallel tasks**: Each `--remote` command creates an independent session
- **Multiple repos**: Cloud sessions can work across multiple codebases
- **Mobile monitoring**: Check progress from the Claude iOS/Android app
- **Setup scripts**: Install custom dependencies in the cloud VM
- **Network controls**: Limited (allowlisted domains), Full, or No internet
- **Teleport**: Pull a cloud session back to your terminal with `/teleport`

```bash
# Start a remote task
claude --remote "Fix the authentication bug in src/auth/login.ts"

# Run multiple tasks in parallel
claude --remote "Fix the flaky test in auth.spec.ts"
claude --remote "Update the API documentation"
claude --remote "Refactor the logger to use structured output"
```

### Plan locally, execute remotely pattern:
```bash
# First: plan mode (read-only, collaborate on approach)
claude --permission-mode plan

# Then: send work to cloud for autonomous execution
claude --remote "Execute the migration plan in docs/migration-plan.md"
```

Available to Pro, Max, Team, and Enterprise users. Currently in research preview.

**Good for**: Long-running tasks, parallel work, working on repos not on your machine, running while your laptop is closed.

---

## 4. The Claude Agent SDK

The Agent SDK (formerly "Claude Code SDK") lets you use Claude Code as a library in your own Python or TypeScript programs. Same tools, same agent loop, same capabilities -- but you control everything programmatically.

### Installation:
```bash
# TypeScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install claude-agent-sdk
```

### Basic usage:
```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
    ):
        print(message)

asyncio.run(main())
```

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);
}
```

### What you get:
- **Built-in tools**: Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch
- **Hooks**: Run custom code at key lifecycle points (PreToolUse, PostToolUse, Stop, etc.)
- **Subagents**: Spawn specialized agents for focused subtasks
- **MCP support**: Connect to external systems (databases, browsers, APIs)
- **Permissions**: Fine-grained control over what tools are allowed
- **Sessions**: Resume conversations, maintain context across multiple exchanges
- **Structured output**: Get responses matching a JSON schema

### When to use CLI vs SDK:
| Use case | Best choice |
|----------|-------------|
| Interactive development | CLI |
| CI/CD pipelines | SDK or CLI with `-p` |
| Custom applications | SDK |
| One-off tasks | CLI |
| Production automation | SDK |

Authentication works with Anthropic API key, AWS Bedrock, Google Vertex AI, or Microsoft Azure.

**Good for**: Building custom agent applications, production automation systems, anything where you need programmatic control.

---

## 5. GitHub Actions / GitLab CI/CD

### GitHub Actions

Official action: `anthropics/claude-code-action@v1`

Quickest setup: Run `/install-github-app` in Claude Code terminal.

```yaml
# Respond to @claude mentions in PRs and issues
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

```yaml
# Run on a daily schedule
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Generate a summary of yesterday's commits and open issues"
```

What it can do:
- Respond to `@claude` mentions in issues and PRs
- Auto-review PRs on open/sync
- Run on a cron schedule for daily reports, audits, etc.
- Create PRs from issue descriptions
- Fix bugs mentioned in comments
- Works with Claude API, AWS Bedrock, or Google Vertex AI

### GitLab CI/CD

Similar capabilities, maintained by GitLab (currently in beta). Uses `.gitlab-ci.yml` with Claude Code installed in the job. Supports `@claude` mentions via webhook triggers.

**Good for**: Event-driven automation (PR reviews, issue triage), scheduled tasks that don't need a dedicated machine, team workflows.

---

## 6. Self-Hosted Hardware (Mac Mini, VPS, Cloud VMs)

### The Mac Mini approach

People are using Mac Minis as dedicated Claude Code machines. From community discussions:

- Works well for local development tasks and homelab setups
- Minimum 16GB RAM recommended on Apple Silicon
- Good for "digital sovereignty" -- your code stays on your hardware
- Combine with Tailscale or similar for remote access
- Claude Code excels at straightforward tooling tasks
- Complex infrastructure tasks still need human oversight

### How to set it up (any always-on machine):

1. **Install Claude Code** on the machine
2. **Use cron or launchd** to run `claude -p` commands on a schedule:
   ```bash
   # crontab example: run tests every hour
   0 * * * * cd /path/to/project && claude -p "Run tests and report failures" --allowedTools "Bash,Read" >> /var/log/claude-tests.log 2>&1
   ```
3. **Use the Agent SDK** for more complex automation (Python/TypeScript scripts that run as services)
4. **Use Desktop scheduled tasks** if you want the graphical interface (requires the Desktop app running)

### VPS / Cloud VM options:

Any Linux VPS or cloud VM can run Claude Code in non-interactive mode:
- Install Claude Code via `curl -fsSL https://claude.ai/install.sh | bash`
- Set `ANTHROPIC_API_KEY` environment variable
- Use `claude -p` in cron jobs or systemd services
- Use the Agent SDK for more sophisticated setups

The main consideration is that Claude Code needs to be installed and your API key needs to be available. Beyond that, it's just running commands on a server.

---

## Comparison Table

| Approach | Survives restart? | Needs hardware? | Best for |
|----------|------------------|-----------------|----------|
| /loop | No | Your machine | Quick polling during a session |
| Desktop scheduled tasks | Yes (if app open) | Your machine | Recurring local tasks |
| claude -p + cron | Yes | Your machine or server | Simple scheduled automation |
| Claude Code on the Web | Yes | None (cloud) | Long tasks, parallel work |
| Agent SDK | Yes | Your machine or server | Custom applications |
| GitHub Actions | Yes | None (GitHub runners) | Event-driven, PR workflows |
| GitLab CI/CD | Yes | None (GitLab runners) | Event-driven, MR workflows |
| Mac Mini / VPS | Yes | Dedicated hardware | Full control, always-on |

---

## Recommendations by Use Case

**"I want daily automated code reviews"**
Use GitHub Actions with a cron schedule, or Desktop scheduled tasks if you want it local.

**"I want Claude to respond to @claude in PRs"**
Use GitHub Actions (`anthropics/claude-code-action@v1`).

**"I want to run complex agent workflows 24/7"**
Use the Agent SDK on a dedicated machine (Mac Mini or cloud VM) with systemd/launchd for process management.

**"I want to run tasks without my laptop being open"**
Use Claude Code on the Web (`claude --remote`) or GitHub Actions.

**"I want to build a product that uses Claude Code's capabilities"**
Use the Agent SDK (Python or TypeScript).

**"I want simple periodic checks while I'm working"**
Use `/loop` in your current session.
