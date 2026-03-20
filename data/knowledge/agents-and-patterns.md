# Domain: Agents and Patterns
**Last updated:** 2026-03-20

## Current State of Knowledge
Claude Code agents are specialized markdown files that define autonomous workers. They can be scoped with specific tools, models, and memory. Use is expanding far beyond coding: agents now handle marketing, lead generation, competitor research, and creative work. The community has moved toward large multi-agent setups (30-60+ agents) covering entire business functions, and Anthropic itself is shipping native multi-agent features like automated code review.

## Key Concepts

- **Agent file**: A markdown file in `.claude/agents/` that defines a specialized worker -- its role, tools it can use, which model to run on, and any memory/context it needs.
- **Orchestrator**: An agent (or the main session) that breaks a task into subtasks and dispatches other agents to handle them in parallel or in sequence.
- **Subagent**: An agent that does one focused job and reports back. Gets a clean context window, which avoids polluting the orchestrator's memory.
- **4-Layer System (community mental model)**: (1) base CLI, (2) skills/slash commands, (3) agents/subagents, (4) multi-agent orchestration. Most users stop at layer 1 or 2, treating Claude Code as a chatbot instead of a system.
- **Agent babysitting problem**: Long-running agents can stall waiting for permission prompts, requiring a human to watch terminals and respond. Community tools like Clippy exist to reduce this friction.

## Recent Developments

- **Claude Code Review (Anthropic, 2026)**: Official feature in research preview for Team and Enterprise plans. A PR triggers a team of agents that hunt for bugs. Costs $15-25 per review and optimizes for depth, not speed. Anthropic's own showcase of multi-agent code review.
- **61-Agent Public Repository**: Community-shared repo covering engineering, design, marketing, product, and testing -- billed as "a complete AI agency for Claude Code." Multiple people independently shared similar 30+ agent structures, suggesting this pattern is becoming standard.
- **Clippy Agent Monitor (viral community tool)**: Watches Claude Code agents across terminals, catches permission prompts, and jumps to the right terminal automatically. Directly solves the agent babysitting problem.
- **Claude Code Templates Ecosystem**: Hackathon-winning open-source setups bundling agents, skills, hooks, commands, rules, and MCP servers together, with visual dashboards for monitoring agent teams.
- **Non-engineering agent use cases growing**: DTC brand agents for competitor audits, creative briefs, ad copy, influencer outreach, and lead generation. Google Maps lead gen agent (keyword + city + state produces contact lists). Shows agents are moving from dev tools to general business automation.

## Patterns and Best Practices

- **One agent, one job**: Specialized agents outperform generalist ones. Narrow scope = better output and easier debugging.
- **Orchestrator stays thin**: The orchestrator's job is routing and assembling results, not doing the work itself. Keep its context clean.
- **Parallel dispatch for independent tasks**: If subtasks don't depend on each other's output, run them simultaneously -- major speed and cost benefits.
- **Sequential for dependent steps**: If step 2 needs step 1's output, wait. Don't guess or use placeholders.
- **Model matching**: Use a cheaper/faster model (e.g., Haiku) for categorization or routing tasks; use a stronger model (Sonnet/Opus) for synthesis or judgment calls.
- **Bundle agents with their context**: Agent files work best when paired with relevant skills, rules, and MCP servers -- see the Templates Ecosystem pattern above.

## Open Questions

- What's the practical upper limit of agents in one system before coordination overhead outweighs gains?
- How do visual dashboards for agent teams work -- are there open-source options beyond the hackathon entries?
- Will Anthropic expand Claude Code Review beyond Team/Enterprise?

## Changes Log
- 2026-03-20: Initial creation
- 2026-03-20: Added 4-layer mental model, Claude Code Review, 61-agent repo, Clippy tool, templates ecosystem, non-engineering use cases (DTC/lead gen), key concepts, and best practices
