# Claude Code Playground

A sandbox for experimenting with Claude Code capabilities - agents, skills, MCP tools, and orchestration patterns.

## What's Here

```
.claude/           Project-specific Claude config (experimental agents live here)
experiments/       Sandbox for trying new ideas
learning/          Patterns and hands-on exercises
templates/         Copy-paste starters for building things
graduating/        Checklist for promoting experiments to global config
```

## Quick Start

### Try an Experimental Agent

The `.claude/agents/` folder contains experimental agents you can test:

```
Hey Claude, use the test-generator agent to create tests for [file]
```

### Learn Something New

Check out `learning/exercises/` for hands-on tutorials:
1. **01-first-agent.md** - Build your first agent
2. **02-agent-with-memory.md** - Add persistent memory
3. **03-multi-agent-coordination.md** - Coordinate multiple agents
4. **04-building-mcp-tools.md** - Connect to external APIs

### Build Something

Grab a template from `templates/` and start building:
- `agent-template.md` - Create a new agent
- `skill-template.md` - Create a new skill
- `command-template.md` - Create a slash command

### Graduate an Experiment

When something works well enough to use everywhere:
1. Review `graduating/graduation-checklist.md`
2. Move it to `~/.claude/` (agents, skills, or commands)
3. Run `/sync-config` to back it up

## How This Relates to Your Global Config

Your global Claude Code setup lives at `~/.claude/`. This playground is for:
- **Trying ideas safely** before adding them globally
- **Learning patterns** without risking your working setup
- **Drafting skills** (skills can't run from project folders, but you can draft them here)

Think of this as your "dev environment" for Claude Code itself.

## Folder Details

### experiments/
Organized by type:
- `agents/` - Agent experiments with READMEs explaining each
- `skills/` - Skill drafts (move to ~/.claude/skills/ to activate)
- `orchestration/` - Multi-agent coordination patterns
- `mcp-tools/` - MCP server experiments

### learning/
- `patterns/` - Best practices distilled from official docs
- `exercises/` - Step-by-step tutorials

### templates/
Ready-to-copy starters with all options documented.

## Getting Official Docs

When you need to reference Claude Code documentation, just ask:
- "Fetch the Claude Code docs on agents"
- "Look up how MCP tools work"

I'll pull the latest docs on-demand rather than storing outdated copies here.
