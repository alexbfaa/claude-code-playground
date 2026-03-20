# Hooks: Automatic Triggers for Agents

Hooks are scripts that run automatically at specific moments -- like tripwires that fire when certain things happen. They let you add safety checks, logging, testing, and notifications to any agent without changing the agent's core instructions.

---

## The Three Hook Types

| Hook | When It Fires | Analogy |
|------|---------------|---------|
| **PreToolUse** | Right before a tool runs | A security guard checking ID before someone enters |
| **PostToolUse** | Right after a tool completes | A quality inspector checking work after it's done |
| **Stop** | When the agent finishes its task | A final checklist before clocking out |

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

In plain English: "After any Bash command runs, execute `date`."

Every hook follows this structure:
1. **When** -- which hook type (PreToolUse, PostToolUse, or Stop)
2. **Which tool** -- the matcher that says which tool triggers it
3. **What to run** -- the script or command to execute

---

## Matchers

Matchers determine which tool triggers the hook. Think of them as filters.

| Matcher | Triggers On |
|---------|-------------|
| `"Bash"` | Any Bash command |
| `"Edit"` | Any file edit |
| `"Write"` | Any file write |
| `"Read"` | Any file read |
| `"*"` | Everything (any tool) |

For Stop hooks, there's no matcher needed -- it just fires when the agent is done.

---

## Practical Examples

### Validate before running dangerous commands

Catch potentially harmful commands before they execute:

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/check-if-safe.sh $COMMAND"
```

If the script exits with an error, the command gets blocked. This is like having a safety net that catches you before you fall.

### Log every file change

Keep a record of what the agent modifies:

```yaml
hooks:
  PostToolUse:
    - matcher: "Edit"
      hooks:
        - type: command
          command: "echo 'File edited' >> ./logs/changes.log"
```

Useful for auditing -- you can review exactly what changed after the agent finishes.

### Run tests after the agent finishes

Automatically verify the agent's work:

```yaml
hooks:
  Stop:
    - hooks:
        - type: command
          command: "npm test"
```

Notice there's no matcher for Stop hooks. They fire once when the agent completes, regardless of what tools were used.

### Send a notification when done

Alert yourself (or a system) that the agent finished:

```yaml
hooks:
  Stop:
    - hooks:
        - type: command
          command: "curl -X POST https://my-webhook.com/done"
```

You could connect this to Slack, email, or any notification service.

---

## The Full Flow

Here's how hooks fit into an agent's lifecycle:

```
You: "Use site-checker to verify example.com"

Agent decides to run a Bash command
    |
    |-- PreToolUse hook fires (if defined)
    |       --> Script runs. Can BLOCK the command if it fails.
    |
    |-- Bash command executes
    |
    +-- PostToolUse hook fires (if defined)
            --> Script runs. Can log, validate, or notify.

Agent decides to edit a file
    |
    |-- PreToolUse hook fires for Edit (if defined)
    |
    |-- File edit happens
    |
    +-- PostToolUse hook fires for Edit (if defined)

Agent finishes all its work
    |
    +-- Stop hook fires (if defined)
            --> Final script runs (tests, notifications, cleanup)
```

Each tool call can trigger its own pre/post hooks. The Stop hook fires once at the very end.

---

## Why Use Hooks

| Purpose | Hook Type | Example |
|---------|-----------|---------|
| **Safety** | PreToolUse | Block dangerous commands before they run |
| **Logging** | PostToolUse | Track what the agent changes |
| **Validation** | PostToolUse | Check that outputs meet requirements |
| **Testing** | Stop | Run the test suite after the agent finishes |
| **Integration** | Stop | Notify Slack, trigger deployments, update dashboards |

---

## Where Hooks Live

Hooks can be defined in two places:

1. **Inside an agent's frontmatter** -- hooks that only apply to that specific agent
2. **In your settings** -- hooks that apply globally to all agents

For agent-specific hooks, put them in the frontmatter as shown in the examples above. This keeps the hook logic close to the agent that uses it.

---

## Tips

- **Start simple.** Your first hook should be something small like logging. Add complexity once you're comfortable.
- **PreToolUse hooks can block.** If the script returns an error (non-zero exit code), the tool call gets blocked. Use this for safety, but be careful not to block things unintentionally.
- **Stop hooks run once.** They fire when the agent is completely done, not after each tool call.
- **Test your hook scripts independently.** Run them manually in the terminal first to make sure they work before wiring them into an agent.
