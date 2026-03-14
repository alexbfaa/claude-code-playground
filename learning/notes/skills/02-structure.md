# Skill Structure

Skills live in a specific folder structure and have their own file format.

---

## Where Skills Live

```
~/.claude/skills/           # Global (all projects)
    └── my-skill/
        └── SKILL.md

.claude/skills/             # Project-specific
    └── my-skill/
        └── SKILL.md
```

Unlike agents (single `.md` files), skills are **folders** containing a `SKILL.md` file.

---

## Basic Structure

A skill folder typically contains:

```
my-skill/
├── SKILL.md              # Main skill definition (required)
└── references/           # Optional supporting files
    ├── examples.md
    └── patterns.md
```

---

## SKILL.md Format

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

---

## Frontmatter Options

| Field | Purpose |
|-------|---------|
| `name` | Unique identifier, becomes the `/slash` command |
| `description` | When Claude should trigger this skill |

Skills have simpler frontmatter than agents - they don't need `tools`, `model`, or `memory` because they run in the main conversation with full access.

---

## References Folder

Skills can include supporting files:

```
playwright-cli/
├── SKILL.md
└── references/
    ├── session-management.md
    ├── request-mocking.md
    └── test-generation.md
```

These get loaded when the skill runs, giving Claude additional context without cluttering the main SKILL.md.

---

## Skill vs Agent Structure

| Aspect | Skill | Agent |
|--------|-------|-------|
| Location | `skills/my-skill/SKILL.md` | `agents/my-agent.md` |
| Structure | Folder with SKILL.md | Single .md file |
| Supporting files | `references/` folder | None (uses `skills:` to load) |
| Frontmatter | Simple (name, description) | Rich (tools, model, memory, hooks, etc.) |

---

## Example Skill

```
ship-workflow/
├── SKILL.md
└── references/
    └── quality-checks.md
```

**SKILL.md:**
```markdown
---
name: ship
description: Commit and push with quality gates
---

## When to Use

Run this when the user says "/ship", "ship it", or is ready to push changes.

## Steps

1. Run /simplify if there are substantial changes
2. Run the linter to check for errors
3. Create a commit with a descriptive message
4. Push to the remote
5. If frontend changes, prompt to run deploy-verifier

## Quality Gates

Before committing, verify:
- [ ] Tests pass (if any exist)
- [ ] No linter errors
- [ ] Changes match what was requested
```
