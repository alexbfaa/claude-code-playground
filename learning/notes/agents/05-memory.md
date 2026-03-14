# Agent Memory

Memory lets agents remember things across conversations. Without it, every session starts fresh. With it, agents can pick up where they left off.

---

## Two Different Memory Systems

| System | What It Is | Who Uses It |
|--------|------------|-------------|
| **Your memory** (`~/.claude/projects/.../memory/`) | The memory system Claude uses in main conversations | Claude (main conversation) |
| **Agent memory** (`.claude/agent-memory/<agent-name>/`) | Per-agent storage folders | Individual agents |

These are completely separate. Agents don't access your MEMORY.md, and you don't access their folders.

---

## The Three Scopes

| Scope | Where It Lives | Use Case |
|-------|----------------|----------|
| `memory: user` | `~/.claude/agent-memory/<agent-name>/` | Remembers across all projects |
| `memory: project` | `.claude/agent-memory/<agent-name>/` | Remembers within one project |
| `memory: local` | Agent-specific file | Private scratchpad |
| `memory: false` | Nowhere | No persistence (default) |

---

## How It Works

Memory is just files. When you set `memory: project`, the agent gets a folder where it can read and write.

```yaml
---
name: site-checker
memory: project
---
```

This creates: `.claude/agent-memory/site-checker/`

Each agent has **isolated storage**. The site-checker can't see what code-explainer wrote.

---

## Visual Structure

```
Your project
│
├── .claude/agent-memory/
│   ├── site-checker/              ← site-checker's private memory
│   │   └── findings.md
│   └── research-orchestrator/     ← research-orchestrator's private memory
│       └── topics.md
│
└── ~/.claude/projects/.../memory/
    └── MEMORY.md                  ← Claude's memory (main conversation)
```

---

## What Agents Store

Memory files are plain text or markdown. Common patterns:

```
agent-memory/site-checker/
├── progress.md          # What's been done
├── findings.md          # Things discovered
├── known-issues.md      # Problems encountered before
```

---

## Practical Examples

**Site checker remembering past checks:**
```markdown
# Sites Checked

## example.com
- Last checked: 2026-03-14
- Status: Working
- Known issues: Slow image loading on /gallery
```

**Research agent building knowledge:**
```markdown
# Topics Researched

## Roblox (2026-03-14)
- 380M monthly users
- Lua-based game creation
- $1.5B paid to creators in 2025
```

**Code assistant tracking preferences:**
```markdown
# Learned Preferences

- User prefers: Minimal comments, TypeScript strict mode
- Avoid: Class components (user corrected me on this)
```

---

## When to Use Each Scope

| Use This | When |
|----------|------|
| `memory: user` | Agent should remember across all projects (personal preferences, general knowledge) |
| `memory: project` | Agent should remember project-specific context (codebase patterns, past decisions) |
| `memory: local` | Agent needs temporary scratchpad |
| `memory: false` | Agent should start fresh every time |

---

## Why Isolate Agent Memory?

- **No conflicts** - agents can't accidentally overwrite each other's notes
- **Focused context** - each agent only loads what's relevant to its job
- **Clean separation** - debugging is easier when you know which agent wrote what

---

## Memory + Long-Running Work

Memory helps with tasks that span multiple sessions. When context gets full:

1. Agent saves important info to memory
2. Old context gets cleared
3. Agent reads from memory to continue

This lets agents work on complex tasks without losing progress.

---

## Key Insight

Memory turns stateless agents into stateful ones. An agent without memory is like talking to someone with amnesia. An agent with memory learns, improves, and builds on past work.
