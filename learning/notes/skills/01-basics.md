# Skill Basics

## What Are Skills?

Skills are reusable workflows triggered by `/slash` commands. When you type `/ship` or `/commit`, you're invoking a skill.

Think of skills as checklists or standard operating procedures (SOPs) that Claude follows step by step.

---

## Skills vs Agents

| Aspect | Skill | Agent |
|--------|-------|-------|
| **Who runs it** | Claude (main conversation) | Claude following a persona, or a subagent |
| **Triggered by** | `/skill-name` command | "Use the X agent to..." |
| **Purpose** | Step-by-step workflow | Specialized behavior or persona |
| **Complexity** | Multi-step procedures | Focused expertise |
| **Memory** | No persistence | Can have persistent memory |

**Mental model:**
- **Skill** = "Here's a checklist to follow"
- **Agent** = "Here's a specialist to consult"

---

## When to Use a Skill

Use a skill when:

- It's a **repeatable procedure** with defined steps
- You want a **slash command** to trigger it
- The workflow is **action-oriented** (do X, then Y, then Z)
- It should run in the **main conversation**

**Examples:**
- `/ship` - commit, push, verify (a sequence of steps)
- `/sync-config` - backup config to GitHub (a procedure)
- `/init-project` - set up project structure (guided workflow)

---

## When to Use an Agent Instead

Use an agent when:

- It's a **way of thinking** or specialized expertise
- The task benefits from **isolation** (own context, own memory)
- You want a **persona** that approaches problems differently
- It might run in **parallel** with other agents

---

## Decision Guide

| Question | If Yes → | If No → |
|----------|----------|---------|
| Does it need its own context/memory? | Agent | Skill |
| Is it a sequence of commands? | Skill | Agent |
| Should it run in parallel with other work? | Agent | Skill |
| Is it a persona or way of thinking? | Agent | Skill |
| Do you want `/slash` invocation? | Skill | Agent |

---

## Example: Same Workflow, Two Ways

**As a skill (`/research`):**
```
1. Ask user for topic
2. Break into angles
3. Search each angle
4. Synthesize results
5. Present summary
```
You run this and watch it execute step by step.

**As an agent (`research-orchestrator`):**
```
You are a research coordinator. When given a topic,
break it into angles, dispatch parallel agents...
```
You say "use the research-orchestrator to research X" and it handles things its own way.

Both work. The skill is more prescriptive ("do exactly this"). The agent is more autonomous ("figure it out").
