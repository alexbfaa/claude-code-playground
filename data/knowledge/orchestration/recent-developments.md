# Orchestration: Recent Developments

**Last updated:** 2026-03-20

## Current Landscape

Multi-agent orchestration in Claude Code is moving from DIY setups toward native platform support. Agent Teams is the biggest shift, offering built-in coordination, while third-party frameworks like Claude Flow provide structured alternatives. Async orchestration via Cowork Dispatch removes the need to babysit long-running pipelines.

## Entries

### Claude Flow Framework
- **What:** A third-party npm package (alpha) that provides a structured "Queen/Worker" model for orchestration. Formalizes the star pattern with built-in communication channels between orchestrator and workers.
- **Why it matters:** Lowers the barrier for setting up multi-agent workflows. Instead of building coordination logic from scratch, you get a framework with conventions and tooling.
- **Added:** 2026-03-20

### Agent Teams (Experimental)
- **What:** Native Claude Code feature where a team lead coordinates teammates, each with their own context windows. Enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable.
- **Why it matters:** This is Anthropic building orchestration directly into Claude Code. If it stabilizes, it could replace most DIY orchestration setups. Teammates may eventually communicate directly with each other, not just through the lead.
- **Added:** 2026-03-20

### Cowork Dispatch
- **What:** Anthropic's async orchestration feature. Start a task, disconnect, come back for results. Now available to all Pro users.
- **Why it matters:** Removes the biggest friction point in orchestration: having to stay connected. Long-running pipelines (research, large refactors, multi-step analysis) can run unattended.
- **Added:** 2026-03-20

### Open Questions
- **What:** Key unknowns in the orchestration space: When will Agent Teams move from experimental to stable? Is Claude Flow production-ready? How exactly does teammate-to-teammate communication work in Agent Teams? What are the cost implications of Agent Teams vs. traditional subagents?
- **Why it matters:** These answers will determine which orchestration approach to invest in for production workflows.
- **Added:** 2026-03-20
