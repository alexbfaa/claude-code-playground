# Agent File Structure

Agents are **single markdown files** - that's the whole thing. No asset folders, no companion files.

```
.claude/agents/
└── my-agent.md    ← This is the entire agent
```

---

## Defaults When Frontmatter Is Omitted

| Field | Default Behavior |
|-------|------------------|
| `name` | **Required** - agent won't work without it |
| `description` | **Required** - Claude won't know when to use it |
| `tools` | Gets access to all tools |
| `model` | Inherits from parent (whatever model you're using) |
| `permissionMode` | `default` - asks permission when needed |
| `maxTurns` | No limit - runs until task is complete |
| `skills` | None loaded |
| `mcpServers` | None connected |
| `hooks` | None run |
| `memory` | No persistence |

A minimal agent only needs `name` and `description`:

```yaml
---
name: my-agent
description: Does something useful
---
```

**Risks of leaving things unspecified:**
- **No `tools`** = agent can do anything (might be dangerous)
- **No `maxTurns`** = agent could run forever (cost/time risk)
- **No `permissionMode`** = will prompt you a lot (annoying for automation)

**When defaults are fine:**
- Quick experiments where you want full flexibility
- Agents you'll always run interactively (so prompts are OK)
- Simple tasks that naturally complete quickly

For production agents, being explicit is better - it documents intent and prevents surprises.

---

## Basic Structure

Every agent has two parts:

1. **YAML frontmatter** - Configuration at the top between `---` markers
2. **Markdown body** - Instructions the agent follows

```yaml
---
name: my-agent
description: What this agent does
tools: [Read, Write, Edit]
model: sonnet
---

## Instructions

The markdown body tells the agent how to behave...
```

---

## Frontmatter Options

| Field | Purpose |
|-------|---------|
| `name` | Unique identifier (required) |
| `description` | When to use this agent (required) |
| `tools` | Which tools it can use |
| `disallowedTools` | Which tools to deny |
| `model` | Which model: `sonnet`, `opus`, `haiku` |
| `skills` | Skills to preload into context |
| `mcpServers` | MCP servers to connect |
| `hooks` | Scripts to run at specific moments |
| `memory` | Persistent storage scope |
| `maxTurns` | Max steps before stopping |
| `permissionMode` | How to handle permissions |

---

## Permission Mode

Controls whether the agent asks for approval before doing things.

| Value | What It Does |
|-------|--------------|
| `default` | Normal behavior - asks permission when needed |
| `acceptEdits` | Auto-approves file edits without asking |
| `dontAsk` | Auto-denies anything that would need approval (blocks instead of asking) |
| `bypassPermissions` | Skips all permission checks - agent can do anything |
| `plan` | Read-only mode - agent can only explore, not modify |

**Example use cases:**

```yaml
# A research agent that should never change files
permissionMode: plan

# A code fixer you trust to edit freely
permissionMode: acceptEdits

# An automation that runs unattended
permissionMode: bypassPermissions
```

---

## Max Turns

Controls how many steps the agent can take before it stops. A "turn" is one cycle of: think, use a tool, see results.

| Setting | Use For |
|---------|---------|
| No limit (omit it) | Complex tasks that need to run to completion |
| `maxTurns: 5-10` | Quick, focused work (simple lookups) |
| `maxTurns: 15-30` | Medium research or debugging |
| `maxTurns: 50+` | Thorough analysis |

**Why use it:**
- Prevent runaway agents that keep going forever
- Control costs (more turns = more tokens)
- Force agents to be concise

**Example:**

```yaml
# A quick fact-checker that shouldn't dig too deep
maxTurns: 10

# A thorough researcher with room to explore
maxTurns: 50
```

---

## References: Connecting to External Resources

While the agent itself is one file, the frontmatter can connect it to other things:

### Skills

Preloads skill content into the agent's context:

```yaml
skills:
  - playwright-cli
  - database-conventions
```

The agent "knows" whatever the skill contains without you explaining it.

### MCP Servers

Gives access to external tools:

```yaml
mcpServers:
  - vercel      # Deployment tools
  - supabase    # Database tools
  - playwright  # Browser automation
```

### Hooks

Runs scripts at specific moments (see hooks note for details):

```yaml
hooks:
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
```

### Memory

Creates persistent storage the agent can read/write across sessions:

```yaml
memory: project   # Options: user, project, local
```

---

## How References Connect

```
my-agent.md
      │
      ├── skills: playwright-cli
      │        └── Skill content loaded into context
      │
      ├── mcpServers: vercel
      │        └── Vercel tools become available
      │
      ├── hooks: PostToolUse
      │        └── Scripts run after tool calls
      │
      └── memory: project
               └── Persistent storage created
```

---

## What Agents Cannot Have

- No companion asset folders
- No external config files (everything goes in frontmatter)
- No dynamic file discovery

The design is intentionally simple: one focused file with configuration, and everything else flows through normal tool access.
