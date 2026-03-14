# Agent Basics

## What Are Agents?

Agents are like specialized assistants that handle specific tasks. Instead of doing everything yourself in one conversation, you can delegate work to an agent that's focused on a particular job.

Think of it like a company: instead of one person doing sales, accounting, and customer support, you have specialists. Agents are Claude's specialists.

---

## Two Types of Agents

### 1. System Agents (Built-in)

These come with Claude Code and run as separate processes. When you launch one, it works independently and returns results when done.

**Examples:**
- `general-purpose` - Research and multi-step tasks
- `Explore` - Fast codebase exploration
- `Plan` - Design implementation strategies
- `test-generator` - Generate tests for code

**How to use them:**
The Agent tool launches these. They run in their own context (separate conversation), do their work, and report back.

**Key trait:** They can run in the background or in parallel with other agents.

---

### 2. Project Agents (Custom)

These are agents you create in `.claude/agents/` folders. They're more like "instruction presets" than separate workers.

**Example:**
```yaml
---
name: code-explainer
description: Explains code in simple, non-technical language
tools: [Read, Glob]
model: sonnet
---

## What You Do
You explain code to people who aren't programmers...
```

**How to use them:**
Say "Use the code-explainer agent to explain this file." Claude reads the agent file and follows its instructions in the current conversation.

**Key trait:** They shape Claude's behavior directly - they don't run as separate processes.

---

## The Key Difference

| Aspect | System Agents | Project Agents |
|--------|---------------|----------------|
| Where they live | Built into Claude Code | `.claude/agents/` folder |
| How they run | Separate process | Same conversation |
| Can run in parallel | Yes | No |
| Customizable | No | Yes - you write them |
| Use case | Heavy lifting, parallel work | Behavior presets, specialized responses |

---

## When to Use Each

**Use system agents when:**
- You need parallel processing (multiple searches at once)
- The task is heavy and you want to keep your main conversation clean
- You need a built-in capability (exploring code, generating tests)

**Use project agents when:**
- You want Claude to respond in a specific style
- You have specialized instructions for a type of task
- You want to reuse the same approach across conversations

---

## Creating a Project Agent

1. Create a file in `.claude/agents/` with a `.md` extension
2. Add frontmatter with name, description, tools, and model
3. Write instructions in markdown below the frontmatter
4. Use it by saying "Use the [agent-name] agent to..."
