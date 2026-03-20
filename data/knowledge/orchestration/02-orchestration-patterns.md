# Orchestration Patterns

## What This Is

This guide covers the more advanced orchestration patterns beyond the basics. If you have read "When to Orchestrate," you know the four main patterns (router, parallel, hierarchical, sequential). This guide goes deeper into how those patterns are implemented and what newer approaches look like.

## The Standard Approach

### The 4-Layer Stack

Claude Code has four layers of capability, each building on the one below:

| Layer | What It Is | Example |
|-------|-----------|---------|
| **1. Base CLI** | The core Claude Code tool -- read files, write code, run commands | Asking Claude to fix a bug |
| **2. Skills & Commands** | Reusable instructions packaged as slash commands | `/ingest`, `/ship`, `/review-pr` |
| **3. Agents & Subagents** | Specialized roles with their own context and instructions | A researcher agent, a code reviewer agent |
| **4. Orchestration** | Coordinating multiple agents to complete a complex task | `/ingest` dispatching researchers, categorizers, and synthesizers |

Most people only need layers 1-2 for daily work. Layers 3-4 come in when tasks are complex enough to benefit from specialization.

### The Star Pattern

This is the most common orchestration setup. One central orchestrator dispatches work to multiple agents, like a hub with spokes:

```
        Worker A
         /
Orchestrator --- Worker B
         \
        Worker C
```

The orchestrator:
1. Breaks the task into pieces
2. Sends each piece to a worker
3. Collects all results
4. Combines them into a final output

This is what the `/ingest` command uses. The main session acts as the orchestrator, dispatching web researchers and Twitter researchers, then routing their findings through categorizers and synthesizers.

**When to use it**: Most multi-agent tasks. It is simple, predictable, and easy to debug.

### Sequential vs. Parallel Decision

A key choice in any orchestration is whether agents should work one after another (sequential) or at the same time (parallel):

| Consideration | Sequential | Parallel |
|--------------|-----------|----------|
| Agent B needs Agent A's output | Yes | No |
| Tasks are independent | Overkill | Yes |
| You need to verify each step | Yes | No |
| Speed matters most | Slower | Faster |
| Debugging matters most | Easier | Harder |

**Rule of thumb**: If the next agent needs the previous agent's output, go sequential. If tasks are independent, go parallel. When unsure, default to sequential -- it is safer.

## Other Approaches

### Agent Teams (Experimental)

This is a native Claude Code feature currently in early testing. Instead of the star pattern where one orchestrator controls everything, Agent Teams lets a "team lead" coordinate "teammates" who each have their own full context windows.

Key differences from the star pattern:
- Teammates can potentially communicate with each other, not just through the lead
- Each teammate maintains their own persistent context (they remember previous interactions)
- The team lead coordinates rather than micromanages

To enable it, set the environment variable:
```
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=true
```

**Best practices** (based on early reports):
- Keep teams to 3-5 members. Larger teams create coordination overhead.
- Give each teammate a clear, distinct role
- The team lead should have explicit instructions for how to delegate

**Status**: Experimental. Expect breaking changes and rough edges. Not recommended for critical workflows yet.

### Queen/Worker Model (Claude Flow)

Claude Flow is a third-party framework (available on npm, currently in alpha) that formalizes the star pattern with specific terminology:

- The "Queen" is the orchestrator
- "Workers" are the specialist agents
- The framework provides structured communication between them

It is essentially the star pattern with a named framework around it, plus built-in tooling for setting up the communication channels.

**When to consider it**: If you want a more structured, opinionated way to set up orchestration rather than building it yourself. Keep in mind it is alpha software.

### Async Orchestration

Traditional orchestration requires you to stay connected while agents work. Async orchestration lets you start a task, disconnect, and come back later for the results.

**Cowork Dispatch** is Anthropic's implementation of this:
- Start a long-running task
- Close your terminal or switch to something else
- The task continues running in the cloud
- Check back when it is done

This is especially useful for tasks that take a long time (large codebases, extensive research, multi-step pipelines) where babysitting the process adds no value.

### Shared Memory Patterns

When agents need to share information (but cannot see each other's context), there are a few approaches:

| Approach | How It Works | Best For |
|----------|-------------|----------|
| **File-based** | Agents read/write shared files | Simple workflows, small data |
| **Database** | Agents read/write a shared SQLite or similar store | Larger data, concurrent access |
| **Pass-through** | Orchestrator extracts key info and includes it in the next agent's prompt | Sequential workflows |

The pass-through approach is simplest and most common. The orchestrator reads Agent A's output, pulls out what Agent B needs, and includes it in Agent B's instructions.

## What's New

- **Agent Teams** is the biggest development -- native multi-agent support directly in Claude Code. Still experimental but worth watching.
- **Cowork Dispatch** brings async orchestration to all Pro users, removing the need to stay connected during long tasks.
- **Claude Flow** provides a third-party framework for those who want more structure than DIY orchestration.
- **Open questions**: When will Agent Teams stabilize? Can teammates truly communicate directly, or does everything still route through the lead? Is Claude Flow production-ready? These are still being figured out as of March 2026.
