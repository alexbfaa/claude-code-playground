# Agent Template

Copy this file to create a new agent. Agents go in:
- `.claude/agents/` for project-specific agents
- `~/.claude/agents/` for global agents

---

```markdown
---
# REQUIRED
name: my-agent
description: One sentence explaining what this agent does

# TOOLS - What the agent can use
# Options: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, Agent, etc.
# Use * for all tools
tools: [Read, Write, Edit, Bash, Grep, Glob]

# OPTIONAL - Model selection
# Options: sonnet (default, fast), opus (most capable), haiku (fastest, cheapest)
model: sonnet

# OPTIONAL - Memory persistence
# Options:
#   user    - Shared across all projects (stored in ~/.claude/agent-memory/)
#   project - Only this project (stored in .claude/agent-memory/)
#   local   - Agent's own memory file
#   false   - No memory (default)
memory: false

# OPTIONAL - Skills to load
# Skills provide additional context/capabilities
skills: []
---

## What You Do

[Describe the agent's purpose and when it should be used]

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

## Common Tool Combinations

**Read-only research:**
```yaml
tools: [Read, Grep, Glob, WebSearch, WebFetch]
```

**Code modification:**
```yaml
tools: [Read, Write, Edit, Bash, Grep, Glob]
```

**Full autonomy:**
```yaml
tools: *
```

## Memory Examples

**Agent that learns user preferences:**
```yaml
memory: user
```

**Agent that tracks project-specific state:**
```yaml
memory: project
```

## Tips

1. Keep the description short - it appears in the agent picker
2. Only grant tools the agent actually needs
3. Use `model: opus` for complex reasoning tasks
4. Use `model: haiku` for fast, simple tasks
5. Memory is powerful but adds context overhead - use sparingly
