# Advanced Skills (Skills 2.0)

**Last updated:** 2026-03-20

## What This Is

Skills 2.0 is a major upgrade to how skills work in Claude Code. The basics (folder with SKILL.md, `/slash` command trigger) stay the same, but you now have much more control over what a skill can do, what tools it has access to, and how it runs. This guide covers the new capabilities and the broader skills ecosystem.

## The Standard Approach

### Skills 2.0 Features

Skills 2.0 added four big capabilities:

**1. Isolated subagents per skill.** A skill can now spawn its own subagent with a separate context window. Before, skills always ran in your main conversation. Now a skill can say "run this part in the background with its own memory." This is useful for heavy tasks that would clutter your main conversation.

**2. Per-skill tool restrictions.** You can control exactly which tools a skill has access to. A skill that only needs to read files doesn't need write access. A skill that generates reports doesn't need to run shell commands. This is a safety feature -- it prevents skills from doing things they shouldn't.

**3. Model overrides.** A skill can specify which AI model to use. A simple formatting skill might use a fast, cheap model (Haiku). A complex analysis skill might demand the most capable model (Opus). You pick the right model for the job instead of using the default for everything.

**4. Lifecycle hooks.** Skills can hook into events like "when a session starts" or "before a commit." This lets skills run automatically at the right moment instead of only when you type a command.

### SKILL.md as an Open Standard

In December 2025, the SKILL.md format was adopted beyond Claude Code:

- **OpenAI** adopted it for Codex CLI and ChatGPT
- **Cursor** supports SKILL.md files
- **Gemini CLI** (Google) reads SKILL.md format

This means a skill you write once works across multiple AI coding tools. You don't need to rewrite your workflows when switching tools or working with teammates who use different editors. The `anthropics/skills` repository on GitHub (87,000+ stars) became the central hub for sharing portable skills.

### The 9 Types of Agentic Skills

An Anthropic engineer cataloged the 9 most valuable categories of skills. Use this as a checklist when deciding what to build:

| Category | What It Does | Example |
|----------|-------------|---------|
| **Library/API reference loaders** | Loads documentation into context | `/claude-api` loads the Claude API docs |
| **Product verification** | Tests that something works correctly | Playwright skill that checks deployed pages |
| **Data fetching** | Pulls in external data | Skill that fetches latest pricing from an API |
| **Code generation templates** | Produces code following a pattern | Skill that scaffolds a new React component |
| **Report/analysis builders** | Generates structured reports | Skill that audits accessibility compliance |
| **Workflow automation** | Chains multiple steps together | `/ship` (lint, commit, push, verify) |
| **Environment setup** | Configures tools and settings | `/init-project` sets up project structure |
| **Monitoring/observability** | Watches for changes or issues | `/loop` that checks deployment status |
| **Communication/outreach** | Drafts messages or communications | Skill that writes release notes from commits |

**The recommended approach:** Start by building skills for things you repeat. Look at your daily workflow and spot the patterns: API lookups, verification steps, data fetches, report formats. Each one is a candidate for a skill. Use the 9 categories above as a checklist to find opportunities you might miss.

**Restrict tool access per skill.** Don't give every skill access to everything. A skill that reads documentation doesn't need write permissions. A skill that formats text doesn't need shell access. Tighter permissions mean fewer accidents.

### New Built-in Commands

Skills 2.0 brought several new built-in slash commands:

| Command | What It Does |
|---------|-------------|
| `/simplify` | Reviews recent changes and removes unnecessary complexity |
| `/batch` | Applies the same change across multiple codebases at once |
| `/loop` | Sets up recurring monitoring tasks (checks something repeatedly) |
| `/debug` | Reads session debug logs to help troubleshoot problems |
| `/claude-api` | Loads the Claude API reference documentation into context |
| `/rewind` | Undoes both conversation state and file changes (like a time machine) |
| `/plan` | Lets Claude plan work without actually doing anything yet |
| `/btw` | Asks a side question without derailing the main conversation |

### Skills Packs

A skills pack is a bundle of related skills packaged together for a specific use case. Instead of sharing skills one at a time, you share a whole collection that works together.

Examples that exist today:
- **YC CEO pack** (8 skills): founder-perspective analysis, planning reviews, strategic assessments
- **DTC brand pack**: competitor audits, creative briefs, hook variations, ad copy, influencer outreach
- **Uber iMessage skill**: open-sourced from Uber's internal tooling

Skills packs are the main way teams share workflows. You install a pack and immediately get a set of `/slash` commands tailored to a specific job.

## Other Approaches

**Package skills as packs for team sharing.** Instead of telling teammates "install these 5 skills," bundle them into a pack with a single install step. This is especially useful for onboarding new team members -- they get the team's workflows instantly.

**Non-technical users can run skills from Office add-ins.** Excel and PowerPoint have Claude add-ins where skills appear as buttons in the sidebar. A team can build skills (the technical work) and then non-technical colleagues run them with one click from their spreadsheet. No command line needed.

**Custom skills registries.** Some teams maintain their own internal skills collections instead of using the public marketplace. This keeps proprietary workflows private while still getting the benefits of the skills format.

## What's New

- **65,000+ skills** are now listed in the community marketplace, covering everything from API integrations to niche business workflows.
- **Office add-ins** (Excel, PowerPoint) let people run skills without touching the command line.
- **Google's DESIGN.md** in their Stitch AI tool mirrors the skills concept -- structured markdown instruction files are spreading across the industry, not just AI coding tools.
- **Skill sync** between Claude Chat and Claude Code remains a known pain point. There's no native solution yet for keeping skills in sync across these tools. The community is actively requesting this.
