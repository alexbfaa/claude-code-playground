# When to Orchestrate

## What This Is

Orchestration is when you use multiple AI agents working together instead of just one. Think of it like a project manager coordinating a team: one "orchestrator" breaks a complex task into pieces, assigns each piece to a specialist, and combines their results.

You already use orchestration if you have ever told Claude to "use the researcher agent to look this up." That is a simple form of it. This guide covers when orchestration helps, when it hurts, and the main patterns you can use.

## The Standard Approach

### Start With One Agent

The default should always be a single agent doing the work. Only reach for orchestration when:

- The task has **clearly separate parts** that need different expertise
- The work is **too large** for one context window
- You need **multiple things happening at the same time** to save time
- Different parts need **different AI models** (cheap for simple, expensive for complex)

If the task is straightforward (summarizing something, answering a question, editing a file), one agent is the right call.

### Four Main Patterns

When you do need orchestration, there are four common ways to set it up:

| Pattern | How It Works | Example |
|---------|-------------|---------|
| **Router** | Sends each task to the right specialist | A support system routing billing questions to one agent and technical questions to another |
| **Parallel** | Multiple agents work at the same time | Researching different topics simultaneously, then combining findings |
| **Hierarchical** | A manager delegates to workers | A marketing campaign with a copywriter agent, designer agent, and scheduler agent |
| **Sequential** | Assembly line, each agent hands off to the next | Data pipeline: scrape, then clean, then write, then fact-check |

Most real workflows mix these patterns. For example, the `/ingest` command in this project uses parallel research, then sequential categorization and synthesis.

### Context Isolation

This is the most important thing to understand about orchestration. Each agent runs in its own "bubble":

- It only sees the instructions you send it
- It **cannot** see your main conversation
- It **cannot** see what other agents are doing
- When it finishes, its context disappears

This means you must give each agent **complete instructions**. You cannot say "use the same format as before" because the agent has no idea what "before" means. Think of it like emailing a contractor: include everything they need in the message, because they were not in your earlier meetings.

### Model Selection

Not every task needs the most powerful (and expensive) model. Choose based on complexity:

| Model | Best For | Cost |
|-------|----------|------|
| **Haiku** | Simple lookups, fact-finding, categorization | Cheapest |
| **Sonnet** | Standard tasks, balanced quality and speed | Middle |
| **Opus** | Complex reasoning, deep analysis, synthesis | Most expensive |

A well-designed orchestration flow might use haiku for categorizing inputs, sonnet for processing each category, and opus for the final synthesis. This keeps costs manageable.

## Other Approaches

### Manual vs. Automated Orchestration

**Manual orchestration** means you act as the coordinator yourself. You break the task down, launch agents one by one, collect results, and combine them. This gives you full control and the ability to adjust on the fly, but it is more work each time.

**Automated orchestration** means you write the coordination logic into a command or agent definition. When triggered, it follows the same process every time without your involvement. This is consistent and hands-off, but less flexible if something unexpected comes up.

Most people start manual, then automate the workflows they repeat often. The `/ingest` command in this project is an example of automated orchestration.

### What Can Go Wrong

Orchestration is not free. Here are the real risks:

- **Coordination tax**: The overhead of splitting, assigning, and merging work can cost more than just doing it in one shot
- **Context rot**: As conversations get longer, agent performance degrades
- **Goal conflicts**: If agents are optimizing for different things, their outputs can contradict each other
- **Cost explosion**: Multi-agent flows can be 50x more expensive than a single-agent approach
- **Debugging difficulty**: When something goes wrong, it is hard to figure out which agent caused the problem

### Key Research Insights

These findings come from real-world testing:

1. **Accuracy gains plateau beyond 4 agents** -- adding a fifth, sixth, seventh agent rarely improves results
2. **"Share memory by communicating, don't communicate by sharing memory"** -- keep agents isolated, pass information through explicit messages
3. **The synthesizer needs explicit rules** -- the agent that merges results must know how to handle contradictions and overlaps
4. **Token caching cuts costs by ~90%** -- but you need to design your prompts intentionally to take advantage of it
5. **Use sync only when truly blocking** -- if you need an answer before continuing, wait for it; otherwise, let agents run in the background

## What's New

- **Agent Teams** (experimental): A native Claude Code feature where a team lead coordinates teammates who each have their own context windows. Still in early testing.
- **Claude Flow** (alpha): A third-party framework that provides a structured way to set up orchestration patterns. Available on npm.
- **Cowork Dispatch**: Anthropic's async orchestration feature, now available to all Pro users. Start a task, disconnect, come back later.
- **Cost management**: Token caching and model selection are now the primary levers for keeping multi-agent costs reasonable.
