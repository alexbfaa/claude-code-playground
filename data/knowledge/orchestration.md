# Domain: Orchestration
**Last updated:** 2026-03-20

## Current State of Knowledge
Multi-agent orchestration in Claude Code is evolving rapidly. The traditional flat star pattern (one orchestrator dispatches workers) is being extended by native Agent Teams support and third-party frameworks like Claude Flow. Async orchestration is emerging as a new mode -- start work, walk away, come back to results. The ecosystem now spans 4 layers: base CLI, skills/commands, agents/subagents, and multi-agent orchestration.

## Key Concepts

- **4-Layer Stack**: (1) base CLI, (2) skills and slash commands, (3) agents and subagents, (4) multi-agent orchestration. Orchestration is the top layer, built on everything below it.
- **Star pattern**: One orchestrator session dispatches multiple worker subagents. Workers run in isolated contexts. Traditional model in Claude Code.
- **Agent Teams (Experimental)**: Native Claude Code feature where one session acts as team lead and coordinates multiple teammate sessions. Teammates have their own context windows and can communicate directly with each other -- not just through the lead.
- **Queen/Worker model**: Used by Claude Flow framework. Orchestrator (queen) decomposes a task and assigns pieces to specialist workers. Similar to star pattern but with a named framework around it.
- **Async orchestration**: Start a long task, disconnect, come back when it's done. Claude Cowork Dispatch is the main example of this pattern.

## Recent Developments

- **Claude Flow framework (alpha)**: Open-source npm package (`claude-flow@alpha`) for multi-agent orchestration. Features SQLite-based shared memory between agents, direct MCP support, async agent communication, and sub-agent spawning. Requires Claude Code 2.1.0+ and Node.js 18+.
- **Agent Teams (Experimental)**: Now natively supported in Claude Code. Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` env variable. Recommended team size is 3-5 teammates. Teammates can talk directly to each other, not just through the lead session.
- **Claude Cowork Dispatch**: Persistent conversation feature for async orchestration. Send a task from your phone, Claude runs it on your desktop with sandbox execution and local file access, you return to finished work. Available to all Pro users (100%). Can launch Claude Code sessions as part of its workflow.

## Patterns and Best Practices

- **Team size**: Keep Agent Teams to 3-5 members. Too many teammates creates coordination overhead that cancels out the parallelism benefit.
- **Shared memory**: When agents need to share state, use a persistent store (Claude Flow uses SQLite). Passing everything through the orchestrator's context gets expensive fast.
- **Sequential vs parallel**: Default to sequential when steps depend on each other or need verification before continuing. Use parallel dispatch for independent, unrelated tasks.
- **Async for long tasks**: If a task takes more than a few minutes, the async pattern (Cowork Dispatch or similar) lets you reclaim your attention instead of waiting.

## Open Questions

- Agent Teams is experimental -- unclear when it will become stable and what the final API will look like.
- Claude Flow is alpha -- suitable for experimentation, not production use yet.
- How does direct teammate-to-teammate communication work technically? Does it go through a shared context or actual message passing?

## Changes Log
- 2026-03-20: Initial creation
- 2026-03-20: Added Key Concepts, Recent Developments, Patterns, and Open Questions from findings on Claude Flow, Agent Teams, Cowork Dispatch, and the 4-layer framework model
