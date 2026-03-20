# Claude Code Knowledge Hub

A knowledge ingestion system that monitors the Claude Code ecosystem and maps new developments to your active projects.

## What This Project Does

1. **Ingests knowledge** -- monitors Twitter and the web for Claude Code developments (features, agent patterns, skills, MCP servers, CLI tools, orchestration, memory management)
2. **Organizes findings** -- categorizes discoveries into 7 knowledge domains and maintains living knowledge files
3. **Generates suggestions** -- maps new findings to your 9 active projects with specific, actionable recommendations
4. **Maintains a sandbox** -- still supports testing agents, skills, and patterns before promoting them to global config

## How to Use

### Running a Knowledge Ingestion Cycle

```
/ingest
```

This triggers the full pipeline:
1. Searches the web for Claude Code news (background)
2. Checks configured Twitter accounts for relevant tweets
3. Searches Twitter for Claude Code keywords
4. Categorizes findings into knowledge domains
5. Updates domain knowledge files
6. Generates practical suggestions for your projects

Results go to:
- `data/knowledge/` -- updated domain files
- `data/suggestions/latest.md` -- actionable suggestions
- `data/history/` -- raw research findings (for the record)

### Configuring What to Monitor

- **Twitter accounts:** Add handles to `config/topics.json` under `twitter.accounts`
- **Search terms:** Edit `config/topics.json` under `twitter.core_search_terms`
- **Web keywords:** Edit `config/topics.json` under `web.keywords`
- **Your projects:** Update `config/projects.json` when projects change

### Reading Knowledge

Browse `data/knowledge/` for domain-specific knowledge:
- `agents-and-patterns.md` -- agent design and subagent strategies
- `skills-and-commands.md` -- skill development and slash commands
- `mcp-servers.md` -- MCP server ecosystem and integrations
- `memory-and-context.md` -- memory management and persistence
- `orchestration.md` -- multi-agent coordination and pipelines
- `cli-and-tooling.md` -- CLI features and external tool integrations
- `updates-and-releases.md` -- official releases and changelogs

### Reading Suggestions

Check `data/suggestions/latest.md` for the most recent suggestions. Past suggestions are archived in `data/suggestions/archive/`.

## Architecture

```
/ingest command (orchestrator, runs in main session)
    |
    v
Researchers (gather raw data)
  |- cc-web-researcher (background subagent, searches web)
  |- Twitter accounts research (main session, uses fetch scripts)
  |- Twitter search research (main session, uses fetch scripts)
    |
    v
knowledge-categorizer (haiku, routes findings to 7 domains)
    |
    v
knowledge-synthesizer (sonnet, one per updated domain, parallel)
    |
    v
use-case-finder (opus, maps findings to your projects)
```

## Key Directories

- `config/` -- what to monitor and your project profiles
- `data/knowledge/` -- the knowledge base (7 domain files)
- `data/suggestions/` -- practical suggestions for your projects
- `data/history/` -- raw research findings by date
- `data/logs/` -- session logs showing what each researcher did
- `data/routing/` -- categorizer output manifests
- `scripts/` -- dedup, filtering, validation, and cleanup utilities
- `.claude/agents/` -- all agent definitions
- `.claude/commands/` -- the /ingest command
- `.claude/skills/twitter/` -- Twitter API integration (fetch, parse scripts)

## Sandbox Features

- Test agents: `Use the [agent-name] agent to [task]`
- Graduate experiments: check `graduating/graduation-checklist.md`, copy to `~/.claude/`, run `/sync-config`
- Learning notes are in `learning/` for reference
