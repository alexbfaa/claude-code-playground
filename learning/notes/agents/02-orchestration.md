# Multi-Agent Orchestration

When a single agent isn't enough, you can coordinate multiple agents working together. This is called orchestration.

## The Core Idea

One "orchestrator" breaks a complex task into pieces, assigns each piece to a specialist agent, and combines their results. It's like a project manager coordinating a team.

---

## Four Main Patterns

| Pattern | How It Works | Example |
|---------|--------------|---------|
| **Router** | Dispatcher sends tasks to the right specialist | Support system routing billing vs. technical questions |
| **Parallel** | Multiple agents work simultaneously | Research different aspects of a topic at once |
| **Hierarchical** | Manager agents delegate to worker agents | Building a marketing campaign with copywriter, designer, scheduler |
| **Sequential** | Assembly line - each agent hands off to the next | Data pipeline: scrape → clean → write → fact-check |

---

## Context Isolation

Each agent runs in its own "bubble":
- Gets only the prompt you send it
- Can't see the main conversation
- Can't see other agents' work
- Returns a single result, then its context disappears

**Why this matters:**
- Agents can't step on each other
- Heavy work doesn't clutter your main conversation
- But you must give complete instructions (agents can't "remember" prior context)

---

## Model Selection

You can choose which model each agent uses:

| Model | Use For |
|-------|---------|
| **haiku** | Simple lookups, fact-finding |
| **sonnet** | Standard tasks, balanced work |
| **opus** | Complex reasoning, deep analysis |

Use cheaper models for simple work, expensive models only where depth matters.

---

## When NOT to Orchestrate

Stick with a single agent when:
- The task fits in one context window
- It doesn't need specialization
- It's straightforward (summarization, simple Q&A)

**Rule:** Try single agent first. Only split into multiple agents if that fails.

---

## What Can Go Wrong

- **Coordination tax** - overhead costs can exceed benefits
- **Context rot** - performance degrades as context fills
- **Goal conflicts** - agents optimizing for different things work against each other
- **Cost explosion** - multi-agent flows can be 50x more expensive
- **Debugging nightmares** - hard to trace what went wrong across agents

---

## Key Insights from Research

1. **Accuracy gains plateau beyond 4 agents** - more isn't always better
2. **"Share memory by communicating, don't communicate by sharing memory"** - keep agents isolated
3. **The synthesizer needs explicit rules** - merging results requires handling contradictions
4. **Token caching cuts costs by ~90%** - but requires intentional implementation
5. **Use sync only when truly blocking** - async for everything else

---

## Manual vs. Automated Orchestration

### Manual Orchestration

You (or Claude in the main conversation) act as the coordinator:
1. Break down the topic into angles
2. Launch agents in parallel
3. Collect results as they return
4. Synthesize into final output

**Pros:** Full control, can adjust on the fly
**Cons:** More work for each task

### Automated Orchestration (Orchestrator Agent)

Create a project agent with orchestration instructions. When invoked, it follows a standard process automatically.

**Pros:** Consistent approach, less manual work
**Cons:** Less flexible, can't adjust mid-process

**Note:** Project agents can't launch system agents as subprocesses. They guide behavior in the current conversation, so "orchestration" means Claude follows the agent's instructions to coordinate work.
