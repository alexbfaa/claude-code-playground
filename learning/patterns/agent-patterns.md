# Agent Patterns

Best practices for building effective agents in Claude Code.

---

## Pattern 1: Single Responsibility

Each agent should do one thing well.

**Good:**
```yaml
name: test-generator
description: Generate tests for code files
```

**Avoid:**
```yaml
name: code-helper
description: Generate tests, fix bugs, refactor code, write docs
```

Why: Focused agents are easier to prompt, debug, and improve.

---

## Pattern 2: Minimal Tool Access

Only grant tools the agent actually needs.

**Read-only research agent:**
```yaml
tools: [Read, Grep, Glob, WebSearch, WebFetch]
```

**Code modification agent:**
```yaml
tools: [Read, Write, Edit, Bash, Grep, Glob]
```

**Full autonomy (use sparingly):**
```yaml
tools: *
```

Why: Limited tools prevent accidents and make the agent more predictable.

---

## Pattern 3: Model Selection by Task

Match the model to the task complexity.

| Model | Best For | Trade-off |
|-------|----------|-----------|
| `haiku` | Fast, simple tasks | Cheapest, least capable |
| `sonnet` | Most tasks (default) | Balanced |
| `opus` | Complex reasoning | Most capable, slowest |

**Examples:**
- File search/grep operations: `haiku`
- Code generation: `sonnet`
- Architecture decisions: `opus`

---

## Pattern 4: Structured Output

Tell the agent exactly how to format its results.

**In the agent prompt:**
```markdown
## Output Format

Return your analysis as:

### Summary
[1-2 sentence overview]

### Findings
- Finding 1
- Finding 2

### Recommendations
1. First recommendation
2. Second recommendation
```

Why: Structured output is easier to read and parse.

---

## Pattern 5: Memory Scope Selection

Choose memory scope based on what persists.

| Scope | Persists Across | Use Case |
|-------|-----------------|----------|
| `user` | All projects | User preferences, learned patterns |
| `project` | This project only | Project-specific knowledge |
| `local` | Agent's own file | Agent state, history |
| `false` | Nothing | Stateless operations |

**Example - Learning user preferences:**
```yaml
memory: user
---
When you learn something about how the user likes things done, save it to memory.
```

---

## Pattern 6: Explicit Instructions

Be specific about what the agent should and shouldn't do.

**Vague:**
```markdown
Analyze the code and give feedback.
```

**Specific:**
```markdown
## What You Do

1. Read the specified file
2. Check for these issues:
   - Unused variables
   - Missing error handling
   - Functions over 50 lines
3. For each issue found, explain:
   - What the problem is
   - Why it matters
   - How to fix it

## What You Don't Do

- Don't modify any files
- Don't suggest style changes (formatting, naming)
- Don't comment on test files
```

---

## Pattern 7: Error Handling

Tell the agent what to do when things go wrong.

```markdown
## When Things Go Wrong

- If the file doesn't exist: Report which file was missing and stop
- If you can't complete the analysis: Explain what blocked you
- If results are uncertain: Say so explicitly
```

---

## Pattern 8: Context Loading via Skills

Use skills to provide reference material without bloating the agent prompt.

```yaml
skills: [api-reference, coding-standards]
---
Use the api-reference skill when you need to look up API details.
Follow the coding-standards skill for style guidelines.
```

Why: Skills load on-demand, keeping the base prompt lean.

---

## Anti-Patterns to Avoid

### 1. Kitchen Sink Agent
An agent that tries to do everything. Split it up.

### 2. Copy-Paste Prompts
Duplicating instructions across agents. Use skills instead.

### 3. Overly Clever Prompts
Complex, multi-layered instructions. Keep it simple and direct.

### 4. No Exit Conditions
Agent keeps going forever. Define when the task is complete.

### 5. Unrestricted Tools
Giving `tools: *` when only a few tools are needed.

---

## Testing Your Agent

Before promoting to global config:

1. **Happy path**: Does it work for the normal case?
2. **Edge cases**: What about empty files, missing inputs, errors?
3. **Boundaries**: Does it stay within its defined scope?
4. **Output quality**: Is the output useful and well-formatted?

Run several test cases and note any improvements needed.
