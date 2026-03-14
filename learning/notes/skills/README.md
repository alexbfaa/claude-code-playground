# Skills Notes

Everything I've learned about skills in Claude Code.

## Contents

| File | Topic |
|------|-------|
| [01-basics.md](01-basics.md) | What skills are, when to use them |
| [02-structure.md](02-structure.md) | File structure, frontmatter options |

## Quick Reference

**What skills are:**
- Reusable workflows triggered by `/slash` commands
- Step-by-step procedures Claude follows
- Run in the main conversation (not separate processes)

**Skills vs Agents:**
- **Skill** = "Here's a checklist to follow"
- **Agent** = "Here's a specialist to consult"

## Where Skills Live

```
~/.claude/skills/           # Global (all projects)
.claude/skills/             # Project-specific
```

## See Also

- [Agents: Composition](../agents/06-composition.md) - How skills and agents layer together
