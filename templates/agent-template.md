# Agent Template

Copy this file to create a new agent. Agents go in:
- `.claude/agents/` for project-specific agents (commit to git so teammates get it)
- `~/.claude/agents/` for global agents (available across all projects)

---

```markdown
---
# REQUIRED
name: my-agent

# DESCRIPTION - Claude uses this to decide when to delegate to your agent.
# Be specific and action-oriented. Vague descriptions get ignored.
# Add "use proactively" to encourage automatic delegation without being asked.
# Bad:  "Reviews code"
# Good: "Expert code reviewer. Proactively reviews code for quality and security after any changes."
description: One sentence explaining what this agent does and when to use it

# TOOLS - Only grant tools the agent actually needs. Every extra tool is extra risk.
# Options: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, Agent, etc.
# Use * for all tools (use sparingly)
# Read-only research:   [Read, Grep, Glob, WebSearch, WebFetch]
# Code modification:    [Read, Write, Edit, Bash, Grep, Glob]
# Read-only review:     [Read, Glob, Grep, Bash]
tools: [Read, Write, Edit, Bash, Grep, Glob]

# OPTIONAL - Model selection
# haiku  - Fast, cheap. Good for search/explore tasks.
# sonnet - Balanced. Good for most agents. (default)
# opus   - Most capable. Use for complex reasoning or analysis.
model: sonnet

# OPTIONAL - Memory persistence
# user    - Shared across all projects (stored in ~/.claude/agent-memory/)
# project - Only this project (stored in .claude/agent-memory/, can be committed to git)
# local   - Agent's own private memory file
# false   - No memory (default)
memory: false

# OPTIONAL - Limit how many steps the agent can take before stopping.
# Prevents runaway agents on tasks that should finish quickly.
# maxTurns: 10

# OPTIONAL - Run the agent in an isolated copy of the repo.
# Useful when the agent modifies files and you don't want it touching your working state.
# isolation: worktree

# OPTIONAL - Skills to load
# Skills provide additional context/capabilities
skills: []
---

## What You Do

[One focused task. If you're describing two distinct jobs, make two agents.]

## How You Work

[Step-by-step instructions for the agent to follow]

1. First, do this
2. Then, do that
3. Finally, do this

## Important Rules

- [Rule 1]
- [Rule 2]
- [Rule 3]

## Output Format

[Describe how results should be presented]
```

---

## Tips

1. **Descriptions drive delegation** - Claude reads the description to decide when to use your agent. Be specific.
2. **One agent, one job** - Specialists beat generalists. Split agents that do too many things.
3. **Restrict tools aggressively** - Grant only what the agent needs. When in doubt, leave it out.
4. **Match model to task** - Haiku for speed, Sonnet for most things, Opus for complex reasoning.
5. **Use `maxTurns`** for agents that should complete quickly and predictably.
6. **Use `isolation: worktree`** when the agent modifies files and you want a safe sandbox.
7. **Commit project agents** - Agents in `.claude/agents/` should be checked into git.
8. **Memory adds overhead** - Only use it if the agent genuinely needs to learn over time.
