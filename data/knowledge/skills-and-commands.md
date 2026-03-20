# Domain: Skills and Commands
**Last updated:** 2026-03-20

## Current State of Knowledge
Skills are reusable instruction files (SKILL.md format) that load instructions into an agent or session. The SKILL.md format became an open standard in Dec 2025 and is now used by OpenAI Codex CLI, Cursor, and Gemini CLI, not just Claude Code. Skills 2.0 added major capabilities: isolated subagents per skill, per-skill tool restrictions, model overrides, and lifecycle hooks. A community marketplace now lists 65,000+ skills. Slash commands are either hardcoded (built into the tool) or prompt-based (custom .md files that trigger a workflow).

## Key Concepts
- **SKILL.md format:** A structured markdown file defining what a skill does, what tools it can use, and how it runs. Now an open standard adopted beyond Claude Code.
- **Hardcoded vs. prompt-based commands:** Hardcoded = built-in tool behavior (like /help). Prompt-based = custom .md files you write that trigger a workflow when called.
- **Skills 2.0 features:** Skills can now spawn isolated subagents (own context window), restrict which tools are available, override the model used, and hook into lifecycle events (e.g., run something on session start).
- **Skill portability:** A skill written once works in Claude Code, Cursor, Gemini CLI, and Codex CLI.
- **Skills packs:** Bundled collections of skills for a specific use case (e.g., DTC brand marketing, executive planning).

## Recent Developments
- **Mar 2026 -- Skills at scale (Uber):** Thariq hosted a livestream with an Uber engineer on using skills in large teams. Uber open-sourced an iMessage skill as a real-world example. Key quote: "Using skills well is a skill issue" -- best skills transform entire team workflows. Source: Twitter/livestream.
- **Mar 2026 -- 9 types of agentic skills (Anthropic article):** A Claude Code engineer cataloged the 9 most valuable skill categories: library/API reference loaders, product verification (Playwright, tmux testing), data fetching, and more. Covers structure, common mistakes, and internal usage patterns. HIGH value reference.
- **Mar 2026 -- YC CEO skill pack:** Garry Tan (Y Combinator CEO) released 8 skills including `/plan-ceo-review` for founder-perspective analysis. Signals executive-level adoption.
- **Mar 2026 -- DTC brand skills (Mike Futia):** Skills packs for direct-to-consumer brands covering competitor audits, creative briefs, hook variations, ad copy, static ad generation (Nano Banana 2), influencer outreach, and Google Workspace CLI. Practical niche packaging example.
- **Dec 2025 -- SKILL.md open standard:** Format adopted by OpenAI for Codex CLI and ChatGPT. Official `anthropics/skills` repo hit 87,000+ GitHub stars.
- **Ongoing -- 65K+ skills marketplace:** Community-driven directory listing skills across many niches. Growing fast.
- **Ongoing -- Excel & PowerPoint add-ins:** Skills available in Microsoft Office add-ins. Teams save workflows as skills; others run them one-click from the sidebar.
- **Ongoing -- Google DESIGN.md:** Google shipped a DESIGN.md file in their Stitch AI design tool, mirroring the skills concept. Structured .md instruction files spreading industry-wide.

## New Built-in Commands (Skills 2.0 era)
- `/simplify` -- reviews recent changes and removes redundancy
- `/batch` -- applies parallel changes across multiple codebases
- `/loop` -- sets up recurring monitoring tasks
- `/debug` -- reads session debug logs
- `/claude-api` -- loads the Claude API reference into context
- `/rewind` -- reverts both conversation state and file changes
- `/plan` -- lets Claude plan work without executing anything
- `/btw` -- asks a side question without affecting the main conversation context

## Patterns and Best Practices
- Build skills for things you repeat: API lookups, verification steps, data fetches, report formats.
- Restrict tool access per skill -- don't give every skill access to everything.
- Package related skills as a "skills pack" for easy sharing with teammates.
- Non-technical users can run skills from add-ins (Excel, PowerPoint sidebar) without touching config files.
- The 9-category framework (Anthropic article) is a good checklist when deciding what to build.

## Open Questions
- Skill sync between Claude Chat, Claude Code, and team members is a known pain point -- no native solution yet. Community is asking for it.
- Best practice for versioning skills across teams is still unclear.

## Changes Log
- 2026-03-20: Initial creation
- 2026-03-20: Added Skills 2.0 capabilities, SKILL.md open standard, new built-in commands, Uber/YC/DTC examples, marketplace, Office add-ins, open standard spread, and best practices
