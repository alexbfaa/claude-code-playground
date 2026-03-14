# Agent Notes

Everything I've learned about agents in Claude Code.

## Contents

| File | Topic |
|------|-------|
| [01-basics.md](01-basics.md) | What agents are, system vs project agents, when to use each |
| [02-orchestration.md](02-orchestration.md) | Multi-agent coordination, patterns, context isolation |
| [03-agent-structure.md](03-agent-structure.md) | File structure, frontmatter options, references |
| [04-hooks.md](04-hooks.md) | Scripts that run at specific moments |
| [05-memory.md](05-memory.md) | Persistent storage across sessions |
| [06-composition.md](06-composition.md) | Layering agents and skills together |

## Quick Reference

**Two types of agents:**
- **System agents** - Built-in, run as separate processes, can parallelize
- **Project agents** - Custom `.md` files, shape behavior in current conversation

**Four orchestration patterns:**
- Router, Parallel, Hierarchical, Sequential

**Agent references:**
- Skills, MCP Servers, Hooks, Memory

## Where Agents Live

```
~/.claude/agents/           # Global (all projects)
.claude/agents/             # Project-specific
```
