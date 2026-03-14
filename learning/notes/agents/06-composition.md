# Composition: Layering Agents and Skills

Agents and skills compose together. You can layer them to build complex workflows from simple pieces.

---

## How They Combine

| Combination | How It Works |
|-------------|--------------|
| **Agent loads skills** | Frontmatter `skills:` preloads skill knowledge into agent |
| **Agent spawns agents** | Agent uses the Agent tool to dispatch subagents |
| **Skill spawns agents** | Skill instructions tell Claude to launch agents |
| **Skill calls skills** | One skill's instructions reference another |

---

## Examples

### Agent Loading Skills

```yaml
---
name: site-checker
skills:
  - playwright-cli    # Agent "knows" Playwright
  - vercel-deploy     # Agent "knows" Vercel
---
```

The agent gets both skills' knowledge baked into its context.

---

### Agent Spawning Agents

The research-orchestrator does this:

```markdown
## How You Work

1. Break topic into angles
2. Launch one agent per angle (using Agent tool)
3. Collect results
4. Synthesize
```

One agent coordinating many subagents.

---

### Skill Spawning Agents

A `/deep-research` skill could say:

```markdown
## Steps

1. Ask user for topic
2. Launch 4 research agents in parallel
3. Wait for results
4. Synthesize into report
```

The skill is the workflow; agents do the heavy lifting.

---

### Skill Referencing Skills

A `/ship` skill might internally use:

```markdown
## Steps

1. Run /simplify to clean up code
2. Run linter
3. Commit and push
4. Run deploy-verifier agent
```

Skills chaining into other skills and agents.

---

## The Full Stack

```
User says: "/ship"
    │
    └── Skill: ship-workflow
            │
            ├── Calls: /simplify (another skill)
            │
            ├── Runs: linter (bash)
            │
            ├── Commits and pushes
            │
            └── Spawns: deploy-verifier agent
                    │
                    └── Uses skills: playwright-cli
                            │
                            └── Uses MCP: vercel
```

Each layer adds capability without the layers above needing to know the details.

---

## Constraints

| Constraint | Why |
|------------|-----|
| **Agents can't spawn infinitely** | Subagents can't spawn their own subagents (one level deep) |
| **Skills don't have memory** | Only agents get persistent storage |
| **Project agents aren't subprocesses** | They're instructions Claude follows, not separate workers |

---

## Mental Model

Think of it like a company:

| Concept | Company Analogy |
|---------|-----------------|
| **Skill** | Standard operating procedure (SOP) |
| **Agent** | Specialist employee |
| **Agent with skills** | Employee trained in specific SOPs |
| **Agent spawning agents** | Manager delegating to team |
| **Skill spawning agents** | SOP that says "assign to specialists" |

---

## When to Use Each Pattern

| Pattern | Use When |
|---------|----------|
| Agent loads skills | Agent needs specific knowledge but you don't want to repeat instructions |
| Agent spawns agents | Work can be parallelized or needs isolated contexts |
| Skill spawns agents | Workflow involves delegation to specialists |
| Skill calls skills | Complex procedure built from simpler procedures |
