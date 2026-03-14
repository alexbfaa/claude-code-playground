# Command Template

Commands are slash commands that users invoke directly (like `/commit` or `/help`). They're simpler than skills - just a prompt that runs when called.

**Location**:
- Project commands: `.claude/commands/`
- Global commands: `~/.claude/commands/`

---

## Basic Command

Create a file named `my-command.md`:

```markdown
---
# REQUIRED
description: What this command does (shown in /help)

# OPTIONAL - Allowed tools
allowed-tools: [Read, Edit, Bash]

# OPTIONAL - Model override
model: sonnet
---

# Instructions for Claude

When the user runs this command, do the following:

1. First step
2. Second step
3. Third step

## Important

- Rule 1
- Rule 2
```

---

## Command with Arguments

Commands can accept arguments. The user's input after the command name becomes `$ARGUMENTS`:

```markdown
---
description: Explain a file in simple terms
---

Explain the file at $ARGUMENTS in simple, non-technical language.

Focus on:
- What the file does
- Why it exists
- How it fits into the project
```

Usage: `/explain src/utils/auth.ts`

---

## Nested Commands

You can organize commands in folders:

```
.claude/commands/
├── git/
│   ├── status.md      # /git:status
│   ├── sync.md        # /git:sync
│   └── cleanup.md     # /git:cleanup
└── db/
    ├── migrate.md     # /db:migrate
    └── seed.md        # /db:seed
```

The folder name becomes a prefix with a colon.

---

## Command vs Skill

| Feature | Command | Skill |
|---------|---------|-------|
| User invokes with /name | Yes | Yes |
| Auto-triggers from context | No | Yes |
| Takes arguments | Yes ($ARGUMENTS) | No |
| Complex multi-file structure | No | Yes |

**Use a command when:**
- Simple, single-purpose action
- User explicitly triggers it
- Might need arguments

**Use a skill when:**
- Should trigger automatically from context
- Needs reference docs or examples
- More complex workflow

## Tips

1. Keep commands short and focused
2. Use clear, descriptive names
3. Put related commands in folders
4. Document arguments in the description
