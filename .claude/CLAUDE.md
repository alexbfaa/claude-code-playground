# Claude Code Playground

This is an experimentation space for learning and building Claude Code capabilities.

## What This Project Is For

- Testing new agents before promoting them to global config
- Learning how agents, skills, MCP tools, and orchestration work
- Drafting skills and commands for later use
- Experimenting with multi-agent patterns

## How to Work Here

### Fetching Documentation

When I need official docs, ask me to fetch them:
- "Look up the Claude Code docs on [topic]"
- "What do the official docs say about [feature]?"

I'll use web search/fetch to get current information rather than relying on potentially outdated local copies.

### Testing Agents

Agents in `.claude/agents/` are project-specific and can be tested here:
```
Use the [agent-name] agent to [task]
```

### Graduating Experiments

When something works well:
1. Check `graduating/graduation-checklist.md`
2. Copy to `~/.claude/` (the global config)
3. Run `/sync-config` to back up to GitHub

## Quick Reference

### Agent Frontmatter Options
```yaml
---
name: agent-name
description: What this agent does (shown in agent picker)
tools: [Read, Write, Edit, Bash, Grep, Glob]  # Tools it can use
model: sonnet  # or opus, haiku
memory: user   # or project, local, false
skills: [skill-name]  # Skills it can load
---
```

### Common Tool Combinations
- **Read-only research**: `[Read, Grep, Glob, WebSearch, WebFetch]`
- **Code modification**: `[Read, Write, Edit, Bash, Grep, Glob]`
- **Full access**: `*` (all tools)

### Memory Scopes
- `user` - Persists across all projects for this user
- `project` - Persists only within this project
- `local` - Agent-specific memory file
- `false` - No memory

## Learning Notes

(Add notes here as you learn things - this section grows over time)

### Agent Orchestration

- Agents can spawn subagents, but only **one level deep** -- subagents cannot spawn their own subagents
- The pattern is a flat star: one orchestrator dispatches multiple parallel workers, workers report back, orchestrator synthesizes
- Each subagent runs in its own isolated context (separate window, tools, permissions) -- no shared state with the main session
- Background subagents cannot ask the user questions -- they fail silently if they need input
- `research-orchestrator.md` is a working example of this pattern in this project
- Orchestrator agents **cannot reference named agents by name** when spawning subagents -- they can only create anonymous workers by passing a prompt and tool list inline. For example, `research-orchestrator` cannot spawn `code-explainer` by name; it would have to copy that agent's instructions into the worker prompt
- To reuse logic across multiple agents, put it in a **skill** instead -- skills can be loaded by any agent via the `skills:` frontmatter field

### Orchestration Patterns

**Pattern 1: Sequential pipeline (subagent per step)**
Each subagent handles one step and returns a short summary. The main session passes relevant results to the next subagent. Good when steps depend on each other. The main session stays lean because only the final message from each subagent comes back -- all the intermediate work (file reads, reasoning, tool calls) stays in the subagent's own context and never touches the main session.

Example flow:
1. Main session asks researcher subagent to explore the auth module
2. Researcher reads 15+ files in its own context, returns a 1-2 paragraph summary
3. Main session passes that summary to an implementer subagent
4. Implementer writes 300+ lines of code, returns "Created X files, all tests passing"

**Pattern 2: Scatter-gather (parallel subagents)**
Launch multiple workers at once for independent tasks, collect all results, synthesize. What `research-orchestrator` does. Coding subagents work well here too -- when a subagent writes code to disk, only a short confirmation comes back to the main context, not the actual code. So parallel coding workers don't bloat the main context.

**Pattern 3: Agent Teams**
A separate, more advanced feature. Multiple full Claude sessions run in parallel and can message each other directly without routing through a coordinator. They share a task list, claim tasks, and talk peer-to-peer. True parallelism but higher token cost since each teammate is a full Claude instance. Best for 3-5 teammates.

**Pattern 4: Worktrees**
Each session gets its own isolated copy of the repo on its own branch. Good when multiple agents need to modify files without stepping on each other.

**Key tradeoff:** Subagents are cheap but can't talk to each other. Agent Teams are expensive but coordinate directly.

### Parallel vs Sequential Subagent Dispatch

- When an orchestrator assigns one subagent per todo list item, there is no default -- the orchestrator decides based on your instructions
- **Parallel:** instruct the orchestrator to launch all subagents at once (using `run_in_background: true`). Faster, but tasks must be independent and shouldn't touch the same files
- **Sequential:** instruct the orchestrator to wait for each subagent to finish before starting the next. Slower, but safe when tasks depend on each other's output
- The right choice depends on dependencies: if task 3 needs the output of task 2, they must be sequential. If all tasks are independent, parallel is fine
- The GSD workflow handles this with "waves" -- independent tasks run in parallel within a wave, and dependent tasks wait for their prerequisites to complete before the next wave starts

### Worktrees

- A worktree is an isolated copy of your project folder on its own branch. Multiple agents or sessions can work in parallel without touching each other's files.
- Worktrees are **not created automatically** when you run parallel subagents. They all share the same file system by default and can overwrite each other if they touch the same files.
- To use a worktree: start a session with `claude --worktree name`, or add `isolation: worktree` to a subagent's frontmatter
- Merging worktree branches back to main is **manual** -- Claude doesn't do it automatically. Each agent commits to its own branch, then you merge with standard Git (or ask Claude to do it)
- If two agents edited the same file, you'll get a merge conflict you have to resolve manually
- Best practice: split work so each agent owns different files -- then merging is painless and conflicts can't happen
- Agent Teams are better than worktrees if agents need to coordinate with each other while working

### Subagent Parallelism and Specialization

- The parallelism in multi-agent workflows comes from subagents doing work simultaneously, not from running multiple orchestrators. One orchestrator (or the main session) dispatches many workers at once -- the speedup is from the workers running in parallel
- You cannot run two orchestrators in parallel and have both fan out into their own workers -- the moment an orchestrator is spawned as a subagent, it loses the ability to spawn workers itself
- Subagents inherit all of the parent's tools by default. To specialize them, define named subagent files with a restricted `tools` list in their frontmatter:

  ```yaml
  # web-researcher.md -- can only search the web
  ---
  name: web-researcher
  tools: [WebSearch, WebFetch]
  ---
  ```

  ```yaml
  # code-explainer.md -- can only read code, no web access
  ---
  name: code-explainer
  tools: [Read, Grep, Glob]
  ---
  ```

  These specialized agents can then be invoked from the **main session** by name. However, an orchestrator spawning anonymous workers inline cannot reference these definitions -- those anonymous workers inherit all tools unless the orchestrator itself has a restricted tool list

---
