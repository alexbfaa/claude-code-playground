# Agent Design Patterns

This guide covers how to build agents well and how agents, skills, and other pieces layer together into bigger workflows.

---

## The Company Analogy

Think of the whole Claude Code system like a company:

| Concept | Company Analogy |
|---------|-----------------|
| **Skill** | Standard operating procedure (SOP) -- a documented process |
| **Agent** | Specialist employee who does one type of work |
| **Agent with skills** | Employee trained in specific SOPs |
| **Agent spawning agents** | Manager delegating to a team |
| **Skill spawning agents** | An SOP that says "assign to specialists" |

A company works best when each person has a clear role, follows documented procedures, and managers coordinate without micromanaging. Same with agents.

---

## How Agents and Skills Layer Together

| Combination | How It Works |
|-------------|--------------|
| **Agent loads skills** | Frontmatter `skills:` preloads skill knowledge into the agent |
| **Agent spawns agents** | Agent uses the Agent tool to dispatch subagents |
| **Skill spawns agents** | Skill instructions tell Claude to launch agents |
| **Skill calls skills** | One skill's instructions reference another |

**Agent loads skills:** Add `skills: [playwright-cli, vercel-deploy]` to the frontmatter. The agent "knows" both skills' content without you explaining it each time.

**Agent spawns agents:** An orchestrator agent breaks work into angles, launches one subagent per angle using the Agent tool, collects results, and synthesizes a final report.

**Skill spawns agents:** A `/deep-research` skill asks the user for a topic, launches 4 research agents in parallel, waits for results, and synthesizes a report. The skill is the workflow; agents do the heavy lifting.

**Skill calls skills:** A `/ship` skill might run `/simplify` to clean up code, run the linter, commit and push, then spawn a deploy-verifier agent. Skills chaining into other skills and agents.

---

## The Full Composition Stack

Here's what a real workflow looks like with all layers working together:

```
User says: "/ship"
    |
    +-- Skill: ship-workflow
            |
            |-- Calls: /simplify (another skill)
            |
            |-- Runs: linter (bash)
            |
            |-- Commits and pushes
            |
            +-- Spawns: deploy-verifier agent
                    |
                    +-- Uses skills: playwright-cli
                            |
                            +-- Uses MCP: vercel
```

Each layer adds capability without the layers above needing to know the details.

---

## Constraints to Know

| Constraint | Why It Matters |
|------------|----------------|
| **Agents can't spawn infinitely** | Subagents can't spawn their own subagents (one level deep only) |
| **Skills don't have memory** | Only agents get persistent storage |
| **Project agents aren't subprocesses** | They're instructions Claude follows, not separate workers |

---

## 8 Patterns for Building Good Agents

### 1. Single Responsibility

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

A focused agent is easier to prompt, debug, and improve. If you need all four of those things, make four agents.

### 2. Minimal Tool Access

Only grant tools the agent actually needs.

| Agent Type | Tools to Grant |
|-----------|----------------|
| Read-only research | `[Read, Grep, Glob, WebSearch, WebFetch]` |
| Code modification | `[Read, Write, Edit, Bash, Grep, Glob]` |
| Full autonomy (rare) | `*` (all tools) |

Limited tools prevent accidents and make the agent more predictable. Think of it like giving someone the keys only to the rooms they need.

### 3. Model Selection by Task

Match the model to the task complexity:

| Model | Best For | Trade-off |
|-------|----------|-----------|
| `haiku` | Fast, simple tasks (file search, categorization) | Cheapest, least capable |
| `sonnet` | Most tasks (default choice) | Balanced cost and capability |
| `opus` | Complex reasoning, synthesis, judgment calls | Most capable, slowest and most expensive |

### 4. Structured Output

Tell the agent exactly how to format its results:

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

Structured output is easier to read and easier for other agents to parse if they're working downstream.

### 5. Explicit Instructions

Be specific about what the agent should and shouldn't do.

**Vague (bad):**
```markdown
Analyze the code and give feedback.
```

**Specific (good):**
```markdown
## What You Do

1. Read the specified file
2. Check for these issues:
   - Unused variables
   - Missing error handling
   - Functions over 50 lines
3. For each issue, explain what it is, why it matters, and how to fix it

## What You Don't Do

- Don't modify any files
- Don't suggest style changes
- Don't comment on test files
```

### 6. Error Handling

Tell the agent what to do when things go wrong:

```markdown
## When Things Go Wrong

- If the file doesn't exist: Report which file was missing and stop
- If you can't complete the analysis: Explain what blocked you
- If results are uncertain: Say so explicitly
```

Without this, agents tend to either silently fail or keep trying forever.

### 7. Context Loading via Skills

Use skills to provide reference material without bloating the agent's instructions:

```yaml
skills: [api-reference, coding-standards]
---
Use the api-reference skill when you need to look up API details.
Follow the coding-standards skill for style guidelines.
```

Skills load on-demand, keeping the base prompt lean.

### 8. Memory Scope Selection

Choose memory scope based on what should persist:

| Scope | Persists Across | Use Case |
|-------|-----------------|----------|
| `user` | All projects | User preferences, learned patterns |
| `project` | This project only | Project-specific knowledge |
| `local` | Agent's own file | Agent state, history |
| `false` | Nothing | Stateless operations |

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| **Kitchen Sink Agent** | One agent that tries to do everything | Split into focused agents |
| **Copy-Paste Prompts** | Same instructions duplicated across agents | Extract into skills |
| **Overly Clever Prompts** | Complex, multi-layered instructions | Keep it simple and direct |
| **No Exit Conditions** | Agent keeps going forever | Define when the task is complete, set `maxTurns` |
| **Unrestricted Tools** | `tools: *` when only a few are needed | Grant only what's necessary |

---

## Testing Your Agent

Before relying on an agent for real work:

1. **Happy path** -- does it work for the normal case?
2. **Edge cases** -- what about empty files, missing inputs, errors?
3. **Boundaries** -- does it stay within its defined scope?
4. **Output quality** -- is the output useful and well-formatted?

Run several test cases and note improvements. This is an iterative process -- most agents get better after 2-3 rounds of testing and adjusting.
