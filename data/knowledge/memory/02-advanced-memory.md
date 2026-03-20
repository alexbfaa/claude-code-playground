# Advanced Memory Patterns

Going beyond basic persistence: controlling what agents remember, designing domain-specific memory, and preventing memory bloat.

---

## What This Is

The basics guide covered how memory works -- files, scopes, the 200-line limit. This guide covers the harder question: **what should agents remember, and how should you structure that knowledge?**

The short version: there are two kinds of memory. Built-in memory is for remembering how to work with you. Domain memory is for remembering what the agent actually knows about its subject. Most useful agents eventually need both.

---

## The Standard Approach

### Controlling What Agents Remember

There's no config setting for this. You control it through the **agent's prompt instructions** -- you tell the agent what's worth saving:

```yaml
---
name: site-checker
memory: project
---

Save to your memory:
- Sites checked and their status
- Recurring issues you've seen before
- Fixes that worked

Don't save routine check details that won't matter next time.
Keep MEMORY.md as a short index pointing to topic files.
```

The agent uses judgment based on these instructions. Good candidates for memory: discovered patterns, past mistakes, project-specific quirks. Bad candidates: routine task details that won't matter next session.

### Built-In Memory vs. Domain Memory

These serve fundamentally different purposes:

| Type | What It's For | Where It Lives | Example |
|------|---------------|----------------|---------|
| **Built-in memory** | How to work with you (preferences, feedback, workflow) | `.claude/agent-memory/` | "User prefers concise output" |
| **Domain memory** | Knowledge the agent accumulates about its actual work | Custom files you design | "Company X has shown declining revenue three quarters in a row" |

Built-in memory is great for operational context. But when an agent needs to track knowledge about **specific subjects** it's analyzing or monitoring, built-in memory falls short because it's shared across everything the agent does.

### When One Agent Handles Multiple Subjects

If a single agent runs against different inputs (different companies to analyze, different sites to monitor, different accounts to check), you don't need a copy of the agent for each input. You need:

- **One agent definition** (the instructions)
- **Per-subject data folders** (where each subject's memory lives)

```
data/
  subject-a/
    summary.md           # Current assessment
    memory.md            # Accumulated learnings about this subject
    config.json          # What to track, thresholds, sources
    history/
      2026-03-15.md      # Findings from this date
      2026-03-01.md
  subject-b/
    summary.md
    memory.md
    config.json
    history/
      ...
```

When the agent runs, you tell it which subject to work on. It reads that subject's files, does its work, and writes back. It never sees other subjects' files during a run, so memory is naturally isolated.

**Why not duplicate the agent?** If you copy the agent for each subject, every improvement to the analysis logic means updating every copy. One agent plus per-subject data means you fix the logic once and every subject benefits.

### Per-Subject Memory: Three Layers

A good per-subject memory structure has three layers:

| Layer | Purpose | Think of It As |
|-------|---------|----------------|
| **Summary** (`summary.md`) | The current big-picture assessment | "What do I think right now?" |
| **Memory** (`memory.md`) | Patterns, flags, accumulated insights | "What have I noticed over time?" |
| **History** (`history/`) | Raw findings from each run | "What happened on this specific date?" |

The summary is the conclusion. Memory is the supporting evidence. History is the raw log.

### You Must Tell the Agent to Update Memory

Unlike built-in memory (which has system-level instructions for when to save), domain memory files are just regular files. The agent will only read or update them if you tell it to in its workflow instructions.

A typical workflow:

1. **Load context** -- read the subject's summary and memory files
2. **Do the work** -- research, analyze, check for changes
3. **Compare** -- how do new findings relate to the existing assessment?
4. **Update summary** -- write the new assessment
5. **Update memory** -- add new patterns or flags, remove outdated ones
6. **Log the run** -- save raw findings to history

Steps 4, 5, and 6 are the memory writes. Without them, the agent does the work, returns results, and forgets everything by next run.

### Curating Memory (Preventing Bloat)

The memory file should be **curated, not endlessly appended to**. Without constraints, it grows until it's too long to be useful. Tell the agent:

- **What's worth remembering** -- new patterns, contradictions, risks, significant changes
- **What to remove** -- outdated info, things that are no longer relevant
- **A size limit** -- "keep this under 50 lines"

This mimics how a human expert works: you update your mental model rather than keeping a running log of every observation you've ever made.

For the **history folder**, which grows over time, the agent should:
- Always read the **last 3-5 entries** in full (recent context)
- Rely on `memory.md` for long-term patterns (the curated view)
- Only dig into older history when something specific warrants it

---

## Other Approaches

- **Append-only logs:** Some setups just keep growing a single file with every finding. Simpler to build but degrades quickly as the file gets too long for the agent to process effectively.
- **Database storage:** For very large-scale tracking (hundreds of subjects), you could store data in a database and have the agent query it. Adds complexity but scales better than flat files.

---

## What's New

- **1M context helps but doesn't replace memory:** With 1M tokens, agents can hold much more during a single session. But context still resets between sessions. Domain memory files remain essential for knowledge that needs to persist.
- **Pattern emerging:** The index-plus-topic-files structure (short MEMORY.md pointing to detailed files) is becoming the standard approach across the Claude Code community for both built-in and domain memory.

---

## Key Insight

Built-in memory is for remembering **how to work**. Domain memory is for remembering **what you know**. When an agent needs to track knowledge about specific subjects over time, design the memory into your data structure rather than relying on the built-in system alone.
