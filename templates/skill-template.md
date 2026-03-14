# Skill Template

Skills are reusable prompt packages that get loaded when triggered. Unlike agents, skills run in the main conversation context.

**Important**: Skills only work from `~/.claude/skills/` (global). You can draft them here, then move them when ready.

---

## Skill File Structure

```
~/.claude/skills/
└── my-skill/
    ├── skill.md           # Main skill file (required)
    ├── reference-docs.md  # Additional context (optional)
    └── examples/          # Example files (optional)
```

## skill.md Template

```markdown
---
# REQUIRED
name: my-skill
description: One sentence for the skill picker

# TRIGGER - When should this skill activate?
# Can be a string or array of trigger phrases
trigger: "when the user says 'do the thing'"

# OPTIONAL - Tools to allow (skills inherit conversation tools by default)
tools: [Read, Write, Edit]

# OPTIONAL - Model override
model: sonnet
---

# My Skill

## When to Use This

[Describe when this skill should be triggered]

## How It Works

[Step-by-step instructions]

1. First step
2. Second step
3. Third step

## Reference

[Any quick-reference information the skill needs]
```

---

## Skill vs Agent vs Command

| Feature | Skill | Agent | Command |
|---------|-------|-------|---------|
| Runs in main context | Yes | No (subprocess) | Yes |
| Can be triggered automatically | Yes | No | No |
| User invokes with /name | Yes | No | Yes |
| Has isolated memory | No | Yes | No |
| Can run in parallel | No | Yes | No |

**Use a skill when:**
- The task runs in the main conversation
- You want automatic triggering based on context
- You need to modify main conversation behavior

**Use an agent when:**
- The task should run independently
- You want parallel execution
- You need isolated memory or context

**Use a command when:**
- It's a simple slash command
- No automatic triggering needed
- Lightweight, single-purpose action

## Tips

1. Keep skills focused - one skill, one purpose
2. Use clear trigger phrases to avoid false activations
3. Put reference material in separate files to keep skill.md clean
4. Test triggers thoroughly before promoting to global config
