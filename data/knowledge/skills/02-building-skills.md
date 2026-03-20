# Building Skills

**Last updated:** 2026-03-20

## What This Is

This guide covers how skills are structured and how to build your own. If skills are recipe cards (see 01-what-are-skills.md), this guide teaches you how to write a new recipe card and put it in the right drawer.

## The Standard Approach

### Where Skills Live

Skills go in one of two places:

```
~/.claude/skills/        --> Global (available in every project)
.claude/skills/          --> Project-specific (only this project)
```

Each skill is a **folder** containing a file called `SKILL.md`. This is different from agents, which are single `.md` files. Think of it this way: a skill is a folder (a binder) that holds its main instructions plus any reference materials. An agent is just a single page.

### Basic Folder Structure

At minimum, a skill needs one file:

```
my-skill/
  SKILL.md              <-- The main instructions (required)
```

You can optionally add a `references/` folder for supporting files:

```
my-skill/
  SKILL.md              <-- Main instructions (required)
  references/           <-- Supporting materials (optional)
    examples.md
    patterns.md
```

The references folder holds extra context that gets loaded when the skill runs. This keeps the main SKILL.md clean while giving Claude access to detailed guidance when it needs it.

### The SKILL.md File

A SKILL.md file has two parts: **frontmatter** (the settings at the top) and **body** (the actual instructions).

```markdown
---
name: my-skill
description: What this skill does and when to use it
---

## Steps

1. First, do this
2. Then do that
3. Finally, verify it worked

## Notes

Additional context or guidance...
```

The frontmatter (the part between the `---` lines) has just two fields:

| Field | What it does |
|-------|-------------|
| `name` | The unique name for this skill. This becomes the `/slash` command. If name is "ship", you type `/ship`. |
| `description` | Tells Claude when this skill should be used. Write it like you're explaining to a coworker. |

Skills have much simpler settings than agents. They don't need fields like `tools`, `model`, or `memory` because they run directly in your main conversation -- they already have access to everything you do.

### Skill vs Agent Structure at a Glance

| Aspect | Skill | Agent |
|--------|-------|-------|
| **Location** | `skills/my-skill/SKILL.md` | `agents/my-agent.md` |
| **Structure** | Folder with SKILL.md inside | Single .md file |
| **Supporting files** | `references/` folder | None (loads skills via frontmatter) |
| **Frontmatter** | Simple: name, description | Rich: tools, model, memory, hooks, and more |

### Example: A /ship Skill

Here's a real skill that commits and pushes code with quality checks:

```
ship-workflow/
  SKILL.md
  references/
    quality-checks.md
```

**SKILL.md:**
```markdown
---
name: ship
description: Commit and push with quality gates
---

## When to Use

Run this when the user says "/ship", "ship it",
or is ready to push changes.

## Steps

1. Run /simplify if there are substantial changes
2. Run the linter to check for errors
3. Create a commit with a descriptive message
4. Push to the remote
5. If frontend changes, prompt to run deploy-verifier

## Quality Gates

Before committing, verify:
- Tests pass (if any exist)
- No linter errors
- Changes match what was requested
```

Notice how the steps are clear and sequential. Claude follows them in order, checking each quality gate before moving to the next step.

### Tips for Writing Good Skills

1. **Be specific with steps.** "Check for errors" is vague. "Run the linter to check for errors" is actionable.
2. **Include conditions.** "If frontend changes, prompt to run deploy-verifier" tells Claude when to do something extra.
3. **Add quality gates.** Verification steps prevent mistakes from shipping.
4. **Use the description well.** Claude reads the description to decide if this skill is relevant to what you're doing.
5. **Keep references separate.** Put detailed guidance in the `references/` folder so the main SKILL.md stays readable.

## Other Approaches

Some people put all their instructions directly in CLAUDE.md instead of creating skills. This works for simple workflows but gets messy fast -- your CLAUDE.md becomes a giant document and Claude has to parse everything every time. Skills keep things modular: each workflow lives in its own folder, loaded only when needed.

Another approach is to use agents for everything, even sequential workflows. This adds overhead (agents need more configuration and run in isolation) without much benefit for straightforward checklists.

## What's New

- **Skills 2.0** added richer frontmatter options (tool restrictions, model overrides, lifecycle hooks) for advanced use cases. The basic `name` and `description` frontmatter still works and is all most people need.
- The **SKILL.md format** is now an open standard, meaning skills you write work across multiple AI coding tools, not just Claude Code.
