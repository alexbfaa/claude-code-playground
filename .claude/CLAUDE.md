# Claude Code Playground

This is an experimentation space for learning and building Claude Code capabilities.

## What This Project Is For

- Testing new agents before promoting them to global config
- Learning how agents, skills, MCP tools, and orchestration work
- Drafting skills and commands for later use
- Experimenting with multi-agent patterns

## How to Work Here

### Fetching Documentation

When I need official docs, ask me to fetch them:
- "Look up the Claude Code docs on [topic]"
- "What do the official docs say about [feature]?"

I'll use web search/fetch to get current information rather than relying on potentially outdated local copies.

### Testing Agents

Agents in `.claude/agents/` are project-specific and can be tested here:
```
Use the [agent-name] agent to [task]
```

### Graduating Experiments

When something works well:
1. Check `graduating/graduation-checklist.md`
2. Copy to `~/.claude/` (the global config)
3. Run `/sync-config` to back up to GitHub

## Quick Reference

### Agent Frontmatter Options
```yaml
---
name: agent-name
description: What this agent does (shown in agent picker)
tools: [Read, Write, Edit, Bash, Grep, Glob]  # Tools it can use
model: sonnet  # or opus, haiku
memory: user   # or project, local, false
skills: [skill-name]  # Skills it can load
---
```

### Common Tool Combinations
- **Read-only research**: `[Read, Grep, Glob, WebSearch, WebFetch]`
- **Code modification**: `[Read, Write, Edit, Bash, Grep, Glob]`
- **Full access**: `*` (all tools)

### Memory Scopes
- `user` - Persists across all projects for this user
- `project` - Persists only within this project
- `local` - Agent-specific memory file
- `false` - No memory

## Learning Notes

(Add notes here as you learn things - this section grows over time)

---
