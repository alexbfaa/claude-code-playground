# What Are Skills?

**Last updated:** 2026-03-20

## What This Is

Skills are reusable workflows you trigger by typing a `/slash` command. When you type `/ship` or `/commit` in Claude Code, you're running a skill.

Think of a skill like a checklist or a standard operating procedure (SOP). You hand Claude a set of steps, and it follows them one by one. You don't need to remember the steps yourself -- just type the command and Claude handles the rest.

**Analogy:** If Claude Code is a kitchen, a skill is a recipe card. You say "make the pasta" (`/ship`) and Claude follows the recipe: boil water, cook pasta, check seasoning, plate it. You don't dictate each step every time.

## The Standard Approach

### Skills vs Agents

Skills and agents are both ways to give Claude reusable instructions, but they work differently.

| Aspect | Skill | Agent |
|--------|-------|-------|
| **Who runs it** | Claude in your main conversation | Claude following a persona, or a subagent in its own window |
| **Triggered by** | `/skill-name` command | "Use the X agent to..." |
| **Purpose** | Step-by-step workflow | Specialized behavior or expertise |
| **Memory** | No persistence between runs | Can remember things across sessions |

**The simple mental model:**
- **Skill** = a checklist to follow ("do step 1, then step 2, then step 3")
- **Agent** = a specialist to consult ("here's an expert, let them figure it out")

### When to Use a Skill

Use a skill when you have a **repeatable procedure** -- something you do the same way every time:

- `/ship` -- commit code, push it, verify it deployed (a sequence of steps)
- `/sync-config` -- back up your config files to GitHub (a procedure)
- `/init-project` -- set up a new project structure (a guided workflow)

Skills are best when:
- The workflow has **defined steps** that don't change much
- You want a **slash command** to kick it off
- It's **action-oriented** (do X, then Y, then Z)
- It should run in **your main conversation**, not off in the background

### When to Use an Agent Instead

Use an agent when the task needs **specialized thinking** rather than a fixed checklist:

- The task benefits from **isolation** (its own context, its own memory)
- You want a **persona** that approaches problems a specific way
- It might run **in parallel** with other work
- It's more about **expertise** than a sequence of commands

### Quick Decision Guide

| Question | Yes | No |
|----------|-----|-----|
| Does it need its own context or memory? | Agent | Skill |
| Is it a sequence of commands? | Skill | Agent |
| Should it run in parallel with other work? | Agent | Skill |
| Is it a persona or way of thinking? | Agent | Skill |
| Do you want `/slash` invocation? | Skill | Agent |

### Same Workflow, Two Ways

Here's how the same task looks as a skill vs an agent:

**As a skill (`/research`):** You type `/research`. Claude follows exact steps: ask for the topic, break it into angles, search each angle, combine results, show a summary. You watch it happen step by step.

**As an agent (`research-orchestrator`):** You say "use the research-orchestrator to research X." The agent decides how to approach it, might send out sub-agents in parallel, and comes back with results. It figures out the approach on its own.

Both work. The skill is more prescriptive ("do exactly this"). The agent is more autonomous ("figure it out").

## Other Approaches

Some people blur the line between skills and agents. You could, for example, write an agent that only follows a fixed checklist -- it would work, but you'd lose the convenience of `/slash` invocation and add unnecessary complexity. Similarly, you could skip skills entirely and just tell Claude what to do each time, but that means repeating yourself constantly.

The cleanest approach: use skills for repeatable procedures, agents for specialized thinking. Keep them separate.

## What's New

- **Skills 2.0** (late 2025 onward) added the ability for skills to spawn their own isolated subagents, restrict which tools they can use, and override the AI model. This blurs the skill/agent line somewhat, but the trigger mechanism (`/slash` vs natural language) remains the key difference.
- The **SKILL.md format** became an open standard in Dec 2025. Skills you write for Claude Code also work in Cursor, Gemini CLI, and OpenAI's Codex CLI.
