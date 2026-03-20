# Context and Memory Basics

How Claude remembers things -- within a conversation and across conversations.

---

## What This Is

When you talk to Claude, it can only hold so much information at once. Think of it like a whiteboard: there's a fixed amount of space, and once it's full, you have to erase something to write something new. That whiteboard is the **context window**.

Memory is different. Memory is like a notebook that sits next to the whiteboard. When a conversation ends, the whiteboard gets erased, but the notebook stays. Next time you start a conversation, Claude can flip open the notebook and pick up where it left off.

This guide covers both: how much Claude can hold during a session (context), and how it remembers things between sessions (memory).

---

## The Standard Approach

### Context Window (The Whiteboard)

The context window is how much text -- code, conversation, documents -- Claude can hold at once during a session. It's measured in "tokens," which are roughly one word each.

| Model | Context Window | What That Means |
|-------|---------------|-----------------|
| Claude Opus 4.6 | 1 million tokens | About 750,000 words -- enough to hold entire codebases |
| Claude Sonnet 4.6 | 1 million tokens | Same capacity, faster responses |

With 1M tokens, you can load entire project repositories into a single session instead of reading files one at a time. This reduces mistakes from Claude not seeing the full picture.

You can also include up to **600 images or PDF pages** per request, making it practical to feed large document sets (manuals, design specs, reports) directly into a session.

**Key thing to remember:** The context window resets when a conversation ends. Everything on the whiteboard gets erased. That's where memory comes in.

### Memory (The Notebook)

Memory is just files. Claude writes notes to files, and those files get loaded into the next conversation automatically. There are two separate memory systems:

| System | What It Is | Who Uses It |
|--------|------------|-------------|
| **Your memory** (`~/.claude/projects/.../memory/`) | Claude's main conversation memory | Claude in your main conversations |
| **Agent memory** (`.claude/agent-memory/<agent-name>/`) | Per-agent storage folders | Individual agents you've created |

These are completely separate. Agents don't access your MEMORY.md, and you don't see their folders.

### Three Memory Scopes

Think of scopes like "how widely should this agent remember?"

| Scope | Where It Lives | When to Use It |
|-------|----------------|----------------|
| `memory: user` | `~/.claude/agent-memory/<agent-name>/` | Agent should remember across all your projects |
| `memory: project` | `.claude/agent-memory/<agent-name>/` | Agent should remember within one project only |
| `memory: local` | Agent-specific file | Temporary scratchpad, cleared after use |
| `memory: false` | Nowhere | Agent starts fresh every time (the default) |

### How It Works in Practice

When you set `memory: project` on an agent, it gets a folder where it can read and write files:

```
.claude/agent-memory/site-checker/
```

Each agent has **isolated storage** -- the site-checker can't see what the research-agent wrote, and vice versa. This prevents conflicts, keeps each agent focused on its own job, and makes debugging easier.

What agents typically store: progress on tasks, things they've discovered, known issues, and patterns they've noticed. All as plain text or markdown files.

### How Memory Loading Works

This is the key mechanic that makes the memory folder special:

1. When an agent starts, the system automatically loads the **first 200 lines** of its `MEMORY.md` file
2. This happens without the agent doing anything -- it's injected automatically, like CLAUDE.md
3. Topic files (detailed notes in separate files) are **not** loaded at startup -- the agent reads them on demand

If you saved notes to some random project folder instead, the system wouldn't know to load them. The agent would have to manually find and read them every session.

### The 200-Line Limit

Anything beyond line 200 in MEMORY.md gets **silently cut off**. The agent won't see it and won't know it's missing.

What this means:
- If an agent dumps everything into one big MEMORY.md, it'll eventually stop seeing its older notes
- Topic files (separate files in the same folder) don't count against this limit
- The agent needs to keep MEMORY.md short and move details into separate files

### Best Practice: Index + Topic Files

Structure memory like a table of contents pointing to detailed files:

```
.claude/agent-memory/site-checker/
  MEMORY.md              <-- Short index, under 200 lines (auto-loaded)
  known-issues.md        <-- Detailed notes on past problems
  site-history.md        <-- Record of past checks
  patterns.md            <-- Recurring patterns noticed
```

MEMORY.md acts as a table of contents with brief pointers:
```markdown
- [Known issues](known-issues.md) -- Recurring problems by site
- [Site history](site-history.md) -- Past check results
```

The agent then reads the full topic file only when it's relevant to the current task. This keeps the auto-loaded portion small and focused.

### Memory + Long-Running Work

Memory helps with tasks that span multiple sessions. When the context window (whiteboard) gets full:

1. Agent saves important info to memory (the notebook)
2. Old context gets cleared (whiteboard erased)
3. Agent reads from memory to continue (opens notebook)

This lets agents work on tasks that take longer than a single session without losing progress.

---

## Other Approaches

- **No memory at all** (`memory: false`): Good for simple, one-shot tasks where the agent doesn't need to learn or improve over time. Every run is completely independent.
- **User-scoped memory** (`memory: user`): For agents that should carry knowledge across projects, like a personal preferences tracker. Use sparingly -- most agents only need project-level memory.

---

## What's New

- **1M context window is GA (March 2026):** The 1 million token context window is now generally available for Opus 4.6 and Sonnet 4.6 at standard pricing. Previously a beta feature. Anthropic's Thariq noted: "the performance is so good, I really just don't clear the context window much these days."
- **Media limits expanded:** Each request now supports up to 600 images or PDF pages, up from previous limits.
- **Benchmark performance:** Opus 4.6 scores 78.3% on the MRCR v2 benchmark at 1M tokens -- the highest score among frontier models for finding and using information buried deep in long contexts.
- **Best practices shifting:** With reliable 1M context, the emphasis is moving toward loading full codebases into sessions and clearing context less often, while still using MEMORY.md for facts that need to persist between sessions.
