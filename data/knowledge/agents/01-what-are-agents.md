# What Are Agents?

Agents are specialized assistants that handle specific tasks. Instead of doing everything yourself in one conversation, you delegate work to an agent focused on a particular job.

Think of it like a company: instead of one person doing sales, accounting, and customer support, you have specialists. Agents are Claude's specialists.

---

## Two Types of Agents

### System Agents (Built-in)

These come with Claude Code and run as separate processes. When you launch one, it works independently and returns results when done.

**Examples:**
- `general-purpose` -- research and multi-step tasks
- `Explore` -- fast codebase exploration
- `Plan` -- design implementation strategies
- `test-generator` -- generate tests for code

**How to use them:**
The Agent tool launches these. They run in their own context (a separate conversation), do their work, and report back.

**Key trait:** They can run in the background or in parallel with other agents.

---

### Project Agents (Custom)

These are agents you create yourself. They live as markdown files in your `.claude/agents/` folder. They work more like "instruction presets" -- when you invoke one, Claude reads the file and follows its instructions in your current conversation.

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
Say "Use the code-explainer agent to explain this file." Claude reads the agent file and follows its instructions.

**Key trait:** They shape Claude's behavior directly -- they don't run as separate processes.

---

## The Key Difference

| Aspect | System Agents | Project Agents |
|--------|---------------|----------------|
| Where they live | Built into Claude Code | `.claude/agents/` folder |
| How they run | Separate process | Same conversation |
| Can run in parallel | Yes | No |
| Customizable | No | Yes -- you write them |
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
2. Add frontmatter (the configuration section between `---` markers) with a name, description, tools, and model
3. Write instructions in the markdown body below the frontmatter
4. Use it by saying "Use the [agent-name] agent to..."

That's it. One markdown file is the entire agent.

---

## How Agents Fit Into the Bigger Picture

Agents are one layer of the Claude Code system. Here's how it all stacks up:

| Layer | What It Is | Example |
|-------|-----------|---------|
| **Base CLI** | Claude Code itself | Chatting, reading files, running commands |
| **Skills/Commands** | Reusable procedures | `/ship`, `/ingest` |
| **Agents** | Specialized workers | code-explainer, deploy-verifier |
| **Multi-agent orchestration** | Teams of agents working together | A research pipeline with parallel subagents |

You can mix these layers. An agent can load skills. A skill can launch agents. A command can orchestrate everything. More on this in the design patterns guide.

---

## Try It

Create a code-explainer agent that reads a file and explains what it does in plain language.

**Steps:**

1. Create a new file at `.claude/agents/code-explainer.md`

2. Add this content:
```yaml
---
name: code-explainer
description: Reads a file and explains what it does in non-technical language
tools: [Read, Glob]
model: sonnet
---

## What You Do

You explain code to someone who isn't a programmer. Imagine you're talking to a smart 15-year-old who has never written code.

## How to Explain

- Start with what the file does overall (one sentence)
- Walk through the main sections, explaining each in plain English
- Use analogies when helpful (e.g., "this function is like a recipe that...")
- Skip minor details like imports and boilerplate
- If you see something interesting or unusual, call it out

## What You Don't Do

- Don't use programming jargon without explaining it
- Don't suggest code changes
- Don't skip the overall summary
```

3. Test it by saying: "Use the code-explainer agent to explain [any file in your project]"

4. See how the output reads. If the explanations are too technical or too basic, tweak the instructions and try again.

This is the core loop for building any agent: write instructions, test, adjust.
