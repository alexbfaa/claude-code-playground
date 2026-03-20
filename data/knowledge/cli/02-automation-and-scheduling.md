# Automation and Scheduling

## What This Is

Claude Code does not have to be something you sit and watch. You can set it up to run tasks automatically -- on a schedule, in response to events (like a new pull request), or as part of a larger system. This guide covers all six approaches, from simple to advanced, so you can pick the one that fits your needs.

## The Standard Approach

### 1. Built-in Scheduling

The simplest way to automate Claude Code, with no setup required.

**`/loop` (session-scoped)**

Run a task on a repeating interval inside your current Claude Code session:

```
/loop 5m check if the deployment finished
/loop 20m /review-pr 1234
```

- Intervals: seconds, minutes, hours, days (minimum 1 minute)
- Default is every 10 minutes if you do not specify
- **Only runs while Claude Code is open.** Close the terminal and it stops.
- Tasks auto-expire after 3 days
- Up to 50 tasks per session

**Good for**: Quick polling during an active work session. "Let me know when the build finishes."
**Not good for**: Anything that needs to run when you are not at your computer.

**Desktop Scheduled Tasks (durable)**

If you use the Claude Desktop app, it has a "Schedule" section in the sidebar for recurring tasks that survive app restarts:

- Frequency: Hourly, Daily, Weekdays, Weekly, or custom
- Each run starts a fresh session
- Missed runs get one catch-up when your computer wakes up (looks back 7 days)
- Your computer must be awake and the Desktop app must be open

**Good for**: Daily code reviews, dependency checks, morning briefings.
**Not good for**: True 24/7 operation.

### 2. CLI Non-Interactive Mode

The foundation for all automation. The `-p` flag runs Claude Code as a one-shot command:

```bash
claude -p "What does the auth module do?"
claude -p "Run tests and fix any failures" --allowedTools "Bash,Read,Edit"
claude -p "Summarize this project" --output-format json
```

Key flags for automation:
- `-p` / `--print`: Run without human interaction
- `--allowedTools`: Pre-approve specific tools (no permission popups)
- `--output-format json|text`: Control output format
- `--continue`: Pick up where a previous conversation left off
- `--permission-mode acceptEdits`: Auto-accept file changes

You can wrap `claude -p` in a cron job, a shell script, or anything that can run a command. This is the building block that the other approaches build on.

**Good for**: Scheduled scripts, one-off automated tasks, piping into other tools.

### 3. Claude Code on the Web (Cloud-Hosted)

Run Claude Code on Anthropic's cloud servers so your computer does not need to be on:

```bash
claude --remote "Fix the authentication bug in src/auth/login.ts"
```

- Your repo gets cloned to a cloud VM
- Sessions persist even when your computer is off
- Run multiple tasks in parallel (each `--remote` is independent)
- Check progress from the Claude mobile app
- Pull a cloud session back to your terminal with `/teleport`

A useful pattern is **plan locally, execute remotely**:
1. Discuss the approach interactively with Claude
2. Send the actual work to the cloud: `claude --remote "Execute the plan in docs/plan.md"`

Available to Pro, Max, Team, and Enterprise users.

**Good for**: Long-running tasks, working without your laptop, parallel work.

### 4. Claude Agent SDK

A Python/TypeScript library that lets you use Claude Code's capabilities inside your own programs:

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Find and fix the bug in auth.py",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
):
    print(message)
```

You get all the same tools (Read, Write, Edit, Bash, etc.) plus:
- Hooks to run custom code at key points
- Subagent spawning
- MCP server support
- Session management
- Structured JSON output

**Good for**: Building custom applications, production automation, anything needing programmatic control.

### 5. GitHub Actions / GitLab CI/CD

Run Claude Code in response to GitHub/GitLab events:

```yaml
# Respond to @claude mentions in PRs
name: Claude Code
on:
  issue_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

What it can do:
- Respond to `@claude` mentions in issues and PRs
- Auto-review PRs when they are opened
- Run on a daily schedule (cron)
- Create PRs from issue descriptions
- Fix bugs mentioned in comments

Quickest setup: Run `/install-github-app` in Claude Code.

**Good for**: PR reviews, issue triage, daily reports, team workflows.

### 6. Self-Hosted (Mac Mini, VPS, Cloud VMs)

Run Claude Code on a dedicated machine that is always on:

- Install Claude Code on the machine
- Use cron or systemd to run `claude -p` on a schedule
- Use the Agent SDK for more complex setups
- Access remotely via Tailscale or similar

Any Linux VPS or cloud VM works. The main requirements are Claude Code installed and an API key available.

**Good for**: Full control, always-on operation, custom infrastructure.

## Other Approaches

### Comparison Table

| Approach | Survives restart? | Needs your hardware? | Best for |
|----------|------------------|---------------------|----------|
| `/loop` | No | Yes | Quick polling during a session |
| Desktop scheduled tasks | Yes (if app open) | Yes | Recurring local tasks |
| `claude -p` + cron | Yes | Yes (or a server) | Simple scheduled automation |
| Cloud-hosted (`--remote`) | Yes | No | Long tasks, parallel work |
| Agent SDK | Yes | Yes (or a server) | Custom applications |
| GitHub Actions | Yes | No (GitHub runners) | Event-driven, PR workflows |
| Self-hosted hardware | Yes | Yes (dedicated) | Full control, always-on |

### Recommendations by Use Case

**"I want daily automated code reviews"**
Use GitHub Actions with a cron schedule, or Desktop scheduled tasks for local.

**"I want Claude to respond to @claude in PRs"**
Use GitHub Actions with `anthropics/claude-code-action@v1`.

**"I want to run complex workflows 24/7"**
Use the Agent SDK on a Mac Mini or cloud VM.

**"I want tasks to run without my laptop open"**
Use `claude --remote` (cloud-hosted) or GitHub Actions.

**"I want to build a product using Claude Code's capabilities"**
Use the Agent SDK (Python or TypeScript).

**"I want simple periodic checks while working"**
Use `/loop` in your current session.

## What's New

- **Claude Code on the Web** is now available in research preview, making cloud-hosted execution accessible without your own infrastructure.
- **Cowork Dispatch** adds async execution for Pro users -- start a task and disconnect.
- **Agent SDK** has matured with hooks, subagent support, and structured output.
- **`/loop`** provides built-in scheduling without external tools.
- **GitHub Actions** now supports `@claude` mentions, auto-review, and cron schedules through the official action.
