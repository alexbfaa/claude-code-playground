# Building Agents: File Structure and Configuration

Agents are **single markdown files**. That's the whole thing. No folders, no companion files, no external config.

```
.claude/agents/
  my-agent.md    <-- This IS the entire agent
```

Every agent has two parts:

1. **YAML frontmatter** -- configuration at the top between `---` markers
2. **Markdown body** -- instructions the agent follows

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

This is where you configure what the agent can do.

| Field | Purpose | Required? |
|-------|---------|-----------|
| `name` | Unique identifier for the agent | Yes |
| `description` | Tells Claude when to use this agent | Yes |
| `tools` | Which tools it can access | No (defaults to all) |
| `disallowedTools` | Which tools to block | No |
| `model` | Which model: `haiku`, `sonnet`, or `opus` | No (inherits yours) |
| `skills` | Skills to preload into context | No |
| `mcpServers` | External tool servers to connect | No |
| `hooks` | Scripts to run at specific moments | No |
| `memory` | Persistent storage scope | No |
| `maxTurns` | Max steps before stopping | No (unlimited) |
| `permissionMode` | How to handle permission requests | No (asks normally) |

A minimal agent only needs `name` and `description`:

```yaml
---
name: my-agent
description: Does something useful
---
```

---

## What Happens When You Leave Things Out

| Field Omitted | Default Behavior | Risk |
|---------------|-----------------|------|
| `tools` | Agent can use every tool | Could do things you didn't intend |
| `maxTurns` | Runs until the task is done | Could run forever (costs money) |
| `permissionMode` | Asks you for approval when needed | Annoying if you're running it unattended |
| `model` | Uses whatever model you're currently on | Might be overkill or underpowered |

**Rule of thumb:** For quick experiments, defaults are fine. For agents you'll use regularly, be explicit -- it documents your intent and prevents surprises.

---

## Permission Modes

This controls whether the agent asks for your approval before doing things.

| Mode | What It Does | Good For |
|------|-------------|----------|
| `default` | Asks permission when needed | Normal interactive use |
| `acceptEdits` | Auto-approves file edits | Trusted code fixers |
| `dontAsk` | Blocks anything that would need approval | Conservative agents |
| `bypassPermissions` | Skips all permission checks | Full automation (use carefully) |
| `plan` | Read-only mode, can explore but not change anything | Research agents |

**Examples:**
```yaml
# A research agent that should never change files
permissionMode: plan

# A code fixer you trust to edit freely
permissionMode: acceptEdits

# An automation agent that runs unattended
permissionMode: bypassPermissions
```

---

## Max Turns

A "turn" is one cycle of: think, use a tool, see results. `maxTurns` puts a cap on how many of these cycles the agent can take.

| Setting | Use For |
|---------|---------|
| Omit it (no limit) | Complex tasks that need to run to completion |
| `maxTurns: 5-10` | Quick, focused work (simple lookups) |
| `maxTurns: 15-30` | Medium research or debugging |
| `maxTurns: 50+` | Thorough analysis |

**Why use it:**
- Prevents runaway agents that keep going forever
- Controls costs (more turns = more tokens = more money)
- Forces agents to be concise

```yaml
# A quick fact-checker that shouldn't dig too deep
maxTurns: 10

# A thorough researcher with room to explore
maxTurns: 50
```

---

## Connecting to External Resources

The agent file is just one markdown file, but the frontmatter can connect it to other things:

### Skills

Preloads skill content into the agent's context. The agent "knows" whatever the skill contains without you explaining it.

```yaml
skills:
  - playwright-cli
  - database-conventions
```

### MCP Servers

Gives the agent access to external tools (deployment platforms, databases, browser automation).

```yaml
mcpServers:
  - vercel
  - supabase
  - playwright
```

### Hooks

Runs scripts at specific moments (before a tool runs, after a tool runs, when the agent finishes). Covered in detail in the hooks guide.

```yaml
hooks:
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
```

### Memory

Creates persistent storage the agent can read and write across sessions.

```yaml
memory: project   # Options: user, project, local
```

---

## How References Connect

```
my-agent.md
      |
      |-- skills: playwright-cli
      |        --> Skill content loaded into context
      |
      |-- mcpServers: vercel
      |        --> Vercel tools become available
      |
      |-- hooks: PostToolUse
      |        --> Scripts run after tool calls
      |
      +-- memory: project
               --> Persistent storage created
```

---

## What Agents Cannot Have

- **No companion folders** -- no asset directories alongside the file
- **No external config files** -- everything goes in frontmatter
- **No dynamic file discovery** -- the agent doesn't scan for extra files

The design is intentionally simple: one focused file with configuration, and everything else flows through normal tool access.

---

## Putting It All Together

Here's a complete, well-configured agent:

```yaml
---
name: deploy-verifier
description: Verifies a Vercel deployment works correctly
tools: [Read, Bash, Glob]
model: sonnet
skills: [playwright-cli]
mcpServers: [vercel]
maxTurns: 20
permissionMode: acceptEdits
---

## What You Do

After a deployment, verify that the site loads correctly and key features work.

## Steps

1. Get the deployment URL from Vercel
2. Visit the site using Playwright
3. Check that the homepage loads
4. Test key interactive features
5. Report results with screenshots

## Output Format

### Deployment Status
[Pass/Fail]

### What Was Checked
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Key features functional

### Issues Found
[List any problems, or "None"]
```

Every field is explicit. Anyone reading this file knows exactly what the agent does, what tools it has, and how it behaves.
