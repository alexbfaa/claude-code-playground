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

## How Memory Loading Actually Works

The memory folder isn't just a regular folder -- it gets **special treatment by the system**.

When an agent starts up:
1. The system automatically loads the **first 200 lines** of the agent's `MEMORY.md` into its context
2. This happens without the agent doing anything -- it's injected like CLAUDE.md
3. Topic files (the detailed notes) are **not** loaded at startup -- the agent reads them on demand when relevant

If the agent saved notes to some random project folder instead, the system wouldn't know to load them. The agent would have to manually find and read them every session. That's the key benefit of using the memory folder.

---

## The 200-Line Limit and Bloat

There's a built-in safeguard: only the first 200 lines of `MEMORY.md` auto-load. Anything beyond line 200 gets silently cut off and the agent won't see it.

**What this means:**
- If an agent dumps everything into one big `MEMORY.md`, it'll eventually stop seeing its older notes
- Topic files don't count against this limit since they're not auto-loaded
- The agent needs to keep `MEMORY.md` short and move details into separate files

---

## Best Practice: Index + Topic Files

Structure agent memory the same way the main conversation memory works -- a short index pointing to detailed files:

```
.claude/agent-memory/site-checker/
├── MEMORY.md              ← Short index, under 200 lines (auto-loaded)
├── known-issues.md        ← Detailed notes on past problems
├── site-history.md        ← Record of past checks
└── patterns.md            ← Recurring patterns noticed
```

`MEMORY.md` acts as a table of contents. It contains brief pointers like:
```markdown
- [Known issues](known-issues.md) - Recurring problems by site
- [Site history](site-history.md) - Past check results
```

The agent then reads the full topic file only when it's relevant to the current task. This keeps the auto-loaded portion small and focused.

---

## Controlling What Agents Remember

There's no config setting for this. You control it through the **agent's prompt instructions**:

```yaml
---
name: site-checker
memory: project
---

Save to your memory:
- Sites checked and their status
- Recurring issues you've seen before
- Fixes that worked

Keep MEMORY.md as a short index pointing to topic files.
Don't save routine check details that won't matter next time.
```

The agent uses judgment based on these instructions. It asks itself: "Would knowing this make me better at my job next time?" Good candidates are discovered patterns, past mistakes, and project-specific quirks. Bad candidates are routine task details.

---

## The Memory Folder Doesn't Exist Until Needed

The `.claude/agent-memory/` folder only gets created when an agent with memory enabled actually runs and writes something. It's not pre-created as part of the project setup. If none of your agents have `memory: project` or `memory: user` in their frontmatter, you won't see this folder at all.

---

## Built-In Memory vs. Domain Memory

There are two fundamentally different kinds of memory an agent might need:

| Type | What It's For | Where It Lives |
|------|---------------|----------------|
| **Built-in memory** | How to work with you (preferences, feedback, workflow) | `.claude/agent-memory/` |
| **Domain memory** | Knowledge the agent accumulates about its actual work | Custom files you design |

Built-in memory is great for operational context -- "the user prefers concise output" or "last time I used this API it required auth headers." But when an agent needs to track knowledge about **specific subjects it's analyzing or monitoring**, built-in memory falls short because it's shared across everything the agent does.

---

## When One Agent Handles Multiple Subjects

If you have a single agent that runs against different inputs (different companies to analyze, different codebases to audit, different accounts to monitor), you don't need a copy of the agent for each input. You need:

- **One agent definition** (the template/instructions)
- **Per-subject data folders** (where each subject's memory lives)

```
data/
  subject-a/
    summary.md            # Current assessment
    memory.md             # Accumulated learnings about this subject
    config.json           # What to track, thresholds, sources
    history/
      2026-03-15.md       # Findings from this date
      2026-03-01.md
  subject-b/
    summary.md
    memory.md
    config.json
    history/
      ...
```

When the agent runs, you tell it which subject to work on. It reads that subject's files, does its work, and writes back to those same files. It never sees other subjects' files during a run, so memory is naturally isolated.

**Why not duplicate the agent?** If you copy the agent for each subject, every improvement to the analysis logic means updating every copy. One agent + per-subject data means you fix the logic once and every subject benefits.

---

## Designing Per-Subject Memory Files

A good per-subject memory structure typically has three layers:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Summary** | The current big-picture assessment | `summary.md` -- the agent's current conclusion |
| **Memory** | Patterns, flags, and accumulated insights | `memory.md` -- "this subject has shown X pattern three times" |
| **History** | Raw findings from each run | `history/2026-03-15.md` -- what was found on this date |

The summary is the "what do I think right now." Memory is "what have I noticed over time." History is the raw log.

---

## You Must Explicitly Tell the Agent to Update Its Memory

Unlike built-in memory (which has system-level instructions telling Claude when to save), per-subject memory files are just regular files. The agent will only read or update them if its workflow instructions say to.

A typical workflow looks like:

1. **Load context** -- read the subject's summary and memory files
2. **Do the work** -- research, analyze, check for changes
3. **Compare** -- how do new findings relate to the existing assessment?
4. **Update summary** -- write the new assessment
5. **Update memory** -- add new patterns or flags, remove outdated ones
6. **Log the run** -- save raw findings to history

Steps 4, 5, and 6 are the memory writes. Without them, the agent does the work, returns results, and forgets everything by next run.

---

## Curating Memory (Preventing Bloat)

The memory file should be **curated, not appended to**. Without constraints, it grows endlessly until it's too long to be useful. Tell the agent:

- What's worth remembering (new patterns, contradictions, risks, sentiment shifts)
- What to remove (outdated info, things that are no longer relevant)
- A size limit ("keep this under 50 lines")

This mimics how a human expert works -- you update your mental model rather than keeping a running log of every observation you've ever made.

For the history folder, which will grow over time, the agent should:
- Always read the **last 3-5 entries** in full
- Rely on `memory.md` for long-term patterns
- Only dig into older history when something specific warrants it

---

## Key Insight

Memory turns stateless agents into stateful ones. An agent without memory is like talking to someone with amnesia. An agent with memory learns, improves, and builds on past work.

The deeper insight: **built-in memory is for remembering how to work. Domain memory is for remembering what you know.** When an agent needs to track knowledge about specific subjects over time, design the memory into your data structure rather than relying on the built-in system.
