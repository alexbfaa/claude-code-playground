# Hooks

Hooks are scripts that run automatically at specific moments - like tripwires that trigger when certain things happen.

---

## The Three Hook Types

| Hook | When It Fires |
|------|---------------|
| **PreToolUse** | Right before a tool runs |
| **PostToolUse** | Right after a tool completes |
| **Stop** | When the agent finishes |

---

## Basic Syntax

```yaml
hooks:
  PostToolUse:                    # When to fire
    - matcher: "Bash"             # Which tool triggers it
      hooks:
        - type: command
          command: "date"         # What to run
```

This says: "After any Bash command, run `date`"

---

## Matchers

Matchers determine which tool triggers the hook:

```yaml
matcher: "Bash"           # Any Bash command
matcher: "Edit"           # Any file edit
matcher: "Write"          # Any file write
matcher: "Read"           # Any file read
matcher: "*"              # Everything
```

---

## Practical Examples

### Validate before running dangerous commands

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/check-if-safe.sh $COMMAND"
```

### Log every file change

```yaml
hooks:
  PostToolUse:
    - matcher: "Edit"
      hooks:
        - type: command
          command: "echo 'File edited' >> ./logs/changes.log"
```

### Run tests after the agent finishes

```yaml
hooks:
  Stop:
    - hooks:
        - type: command
          command: "npm test"
```

### Send a notification when done

```yaml
hooks:
  Stop:
    - hooks:
        - type: command
          command: "curl -X POST https://my-webhook.com/done"
```

---

## The Flow

```
You: "Use site-checker to verify example.com"

Agent runs Bash command
    │
    ├── PreToolUse hook fires (if defined)
    │       └── Script runs, can block the command
    │
    ├── Bash command executes
    │
    └── PostToolUse hook fires (if defined)
            └── Script runs, can log/validate/notify

Agent finishes
    │
    └── Stop hook fires (if defined)
            └── Final script runs
```

---

## Why Use Hooks

- **Safety** - Block dangerous operations before they happen
- **Logging** - Track what the agent does
- **Validation** - Check outputs meet requirements
- **Integration** - Notify other systems (Slack, webhooks, etc.)
