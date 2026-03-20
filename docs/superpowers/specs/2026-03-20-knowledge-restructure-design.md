# Knowledge Hub Restructure

## Problem

The knowledge ingestion system has three issues:

1. **No project filtering** -- suggestions are generated for all 9 projects, but only 2 are still active (News-Watcher v2 and Investment Monitor). The other 7 waste suggestion space.

2. **Knowledge files are flat and hard to learn from** -- the 7 domain files in `data/knowledge/` are just dumps of research findings (Current State, Key Concepts, Recent Developments). A daily Claude Code user can't easily build understanding from them. Meanwhile, the `learning/` directory has well-written progressive content that nobody is maintaining or connecting to the pipeline.

3. **One-size-fits-all problem** -- the knowledge files prescribe single approaches rather than showing the landscape. Claude Code has many valid philosophies (agent counts, skill structures, orchestration styles). The system should present the mainstream approach first, then briefly show alternatives with trade-offs.

## Design

### 1. Add Project Status to projects.json

Add a `"status"` field to each project entry.

**Active projects:** News-Watcher-v2, Investment Monitor
**Inactive projects:** News-Watcher, Onchain Backtester, DeFi Arb Monitor, WyndLabs Monitor, Meal Planner, Analyst-2.0, Discord Scraper

The use-case-finder agent filters to `status: "active"` when generating suggestions.

### 2. Restructure Knowledge into Granular Progressive Files

Replace the 7 flat domain files with topic folders, each containing two types of files:

**Guide files** (numbered prefix, e.g. `01-what-are-agents.md`)
- Progressive educational content written for a non-technical daily Claude Code user
- Seeded from existing `learning/` content where available
- The pipeline can only *append* to the "What's New" section -- never rewrites educational content
- 250-line cap per file (some source content like memory and automation guides are 200-300 lines of quality content that shouldn't be cut)
- When "What's New" exceeds 20 lines, the synthesizer removes the oldest entries. The synthesizer never promotes What's New content into the educational sections above -- that's a manual operation.

**Reference files** (no number prefix, e.g. `recent-developments.md`)
- Living documents the pipeline freely updates with news, tools, ecosystem changes
- Prune older entries to make room for new ones
- 100-line cap per file

**How to tell them apart:** Numbered prefix = guide (append-only). No number = reference (freely update).

### 3. Directory Structure

```
data/knowledge/
  agents/
    01-what-are-agents.md
    02-building-agents.md
    03-agent-design-patterns.md
    04-hooks.md
    recent-developments.md
    ecosystem.md
  skills/
    01-what-are-skills.md
    02-building-skills.md
    03-advanced-skills.md
    recent-developments.md
    ecosystem.md
  mcp/
    01-what-is-mcp.md
    02-using-mcp-servers.md
    notable-servers.md
    recent-developments.md
  memory/
    01-context-and-memory.md
    02-advanced-memory.md
    recent-developments.md
  orchestration/
    01-when-to-orchestrate.md
    02-orchestration-patterns.md
    recent-developments.md
  cli/
    01-commands-overview.md
    02-automation-and-scheduling.md
    tools-and-integrations.md
    recent-developments.md
  releases/
    changelog.md
    community.md
```

### 4. Guide File Template

```markdown
# Topic Title

> One-sentence summary of what this file covers.

## What This Is

Plain-language explanation of the concept. Uses analogies.
Written for someone who uses Claude Code daily but isn't a programmer.

## The Standard Approach

What most people do. What Claude and Anthropic recommend.
Concrete examples. This is the "if you only read one section, read this" part.

## Other Approaches

Brief descriptions of alternative methods.
Each with 1-2 sentences on when you might prefer it and what you trade off.

## What's New

(Synthesizer appends here when new developments affect this topic.)
(Newest entries at top. Pruned when the section gets too long.)
```

### 5. Reference File Template

```markdown
# Title

**Last updated:** YYYY-MM-DD

## Current Landscape

2-3 sentence overview.

## Entries

### Entry Title
- **What:** Description
- **Why it matters:** Relevance
- **Added:** Date
```

### 6. Writing Style Rules

These apply to both initial guide content and synthesizer updates:

- Lead with the mainstream/recommended approach, then mention alternatives with trade-offs
- Write for someone who uses Claude Code every day but is not a programmer
- Use analogies to explain concepts (the learning/ files have good examples of this)
- Avoid jargon; if a technical term is needed, define it on first use
- Don't prescribe "the one right way" -- present the landscape of real approaches
- Guide files are progressive: foundational concepts at the top, advanced at the bottom

### 7. Content Migration Plan

Seed guide files from existing content:

| Source | Destination |
|--------|-------------|
| `learning/notes/agents/01-basics.md` | `data/knowledge/agents/01-what-are-agents.md` |
| `learning/notes/agents/03-agent-structure.md` | `data/knowledge/agents/02-building-agents.md` |
| `learning/notes/agents/06-composition.md` + `learning/patterns/agent-patterns.md` | `data/knowledge/agents/03-agent-design-patterns.md` |
| `learning/notes/skills/01-basics.md` | `data/knowledge/skills/01-what-are-skills.md` |
| `learning/notes/skills/02-structure.md` | `data/knowledge/skills/02-building-skills.md` |
| `learning/notes/agents/02-orchestration.md` | `data/knowledge/orchestration/01-when-to-orchestrate.md` |
| `learning/notes/agents/05-memory.md` (split) | `data/knowledge/memory/01-context-and-memory.md` (basics) + `02-advanced-memory.md` (per-subject, curation, bloat) |
| `learning/notes/agents/04-hooks.md` | `data/knowledge/agents/04-hooks.md` |
| `learning/notes/running-claude-code-continuously.md` | `data/knowledge/cli/02-automation-and-scheduling.md` |
| `learning/exercises/01-first-agent.md` | Inline as "Try It" section in `agents/01-what-are-agents.md` |
| `learning/notes/agents/README.md`, `learning/notes/skills/README.md` | Not migrated (index files, no longer needed) |

For topics without existing learning content (MCP, releases, advanced skills), write new guide files from scratch following the template and style rules.

Current `data/knowledge/*.md` content migrates into the corresponding `recent-developments.md` and `ecosystem.md` reference files. Skip content already covered by the learning files being promoted to guides -- only move genuinely new content (recent developments, ecosystem entries) into reference files.

After migration, retire `learning/` (archive or remove -- content lives in its new home).

### 8. Pipeline Changes

The /ingest flow stays the same: researchers -> categorizer -> synthesizer -> use-case-finder.

**Categorizer (`.claude/agents/knowledge-categorizer.md`)** -- domain name rewrite
- Still routes findings to 7 domain-level categories
- Domain names change from old format (`agents-and-patterns`, `skills-and-commands`, `mcp-servers`, etc.) to folder names: `agents`, `skills`, `mcp`, `memory`, `orchestration`, `cli`, `releases`
- The routing table, all JSON examples, and the `domains_unchanged`/`domains_updated` arrays all need to use the new names

**Synthesizer (`.claude/agents/knowledge-synthesizer.md`)** -- main rewrite
- Reads all files in the domain folder (not just one file)
- For each finding, uses the routing decision table below to decide where it goes
- Guide files: append-only to "What's New" section, never touch educational content above it
- Reference files: freely update, prune older entries to make room
- Can create new files only when a genuinely new topic emerges (high bar)
- Set `maxTurns` to 25 (up from 15) since the agent now reads and routes across multiple files per domain
- Follows the writing style rules above

**Synthesizer routing decision table:**

| Finding type | Where it goes | Example |
|-------------|---------------|---------|
| New best practice or pattern | Guide "What's New" section | "Anthropic recommends agent teams of 3-5" |
| Official recommendation change | Guide "What's New" section | "Claude now defaults to Opus for agent orchestration" |
| New tool, framework, or library | Reference `ecosystem.md` or `notable-servers.md` | "Claude Flow framework released" |
| Official release or feature | Reference `recent-developments.md` | "v2.1.76 adds /loop command" |
| Community resource or event | Reference `community.md` or `ecosystem.md` | "Anthropic Academy adds new course" |
| Both best practice AND new development | Brief note in guide "What's New" + full entry in reference file | "Agent Teams experimental support launched with 3-5 member recommendation" |

**Use-case-finder (`.claude/agents/use-case-finder.md`)**
- Filter to active projects only (read status field from projects.json)
- No other structural change

**Ingest command (`.claude/commands/ingest.md`)**
- Update all domain name references from old format to new folder names
- Update synthesizer dispatch path from `data/knowledge/{domain}.md` to `data/knowledge/{domain}/`
- Synthesizer dispatch loop stays parallel (one agent per updated domain)

### 9. Files to Modify

| File | Change |
|------|--------|
| `config/projects.json` | Add `status` field to each project |
| `.claude/agents/use-case-finder.md` | Filter to active projects |
| `.claude/agents/knowledge-synthesizer.md` | Full rewrite: new routing logic, guide vs reference rules, templates, style guide |
| `.claude/agents/knowledge-categorizer.md` | Rewrite domain names in routing table, JSON examples, and domain arrays to match new folder names |
| `.claude/commands/ingest.md` | Update domain references |
| `.claude/CLAUDE.md` | Update directory descriptions, knowledge reading section |
| `data/knowledge/` | Create new folder structure, write all guide and reference files |
| `learning/` | Retire after migration |

### 10. Safety

Before making any structural changes, create a git commit with the current state so `learning/` and the existing knowledge files can be recovered if something goes wrong.

## Verification

1. Review each guide file to confirm it reads progressively (foundational -> advanced) and follows the template
2. Confirm all learning/ content has been migrated -- nothing lost (check every file in the migration table)
3. Confirm projects.json has correct status for all 9 projects
4. Run a test `/ingest` cycle and verify:
   - Categorizer routes findings to correct domain folders using new domain names
   - Synthesizer appends to guide "What's New" sections without touching educational content
   - Synthesizer updates reference files correctly
   - Use-case-finder only generates suggestions for News-Watcher v2 and Investment Monitor
5. Check that no guide file exceeds 250 lines and no reference file exceeds 100 lines
6. Confirm the use-case-finder agent description says "active projects" (not "9 active projects")
