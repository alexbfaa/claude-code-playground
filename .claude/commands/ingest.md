---
name: ingest
description: Run a knowledge ingestion cycle -- searches web and Twitter for Claude Code developments, updates the knowledge base, and generates practical suggestions for your projects
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Agent, WebSearch, WebFetch]
---

Run a knowledge ingestion cycle for Claude Code developments.

## How to Run (Step by Step)

You are the orchestrator now. Follow these steps directly in the main session. Twitter research runs in the main session because MCP tools are needed. Web research runs as a background subagent.

### Step 0: Validate config and generate timestamp

1. Validate the config:
   ```bash
   node scripts/validate_config.js
   ```
   If validation fails, stop and report the error.

2. Read `config/topics.json` to get the research modules, keywords, accounts, and search terms.

3. Generate a single timestamp for this run using YYYY-MM-DD-HHmm format (e.g., `2026-03-20-1430`). All files from this run share the same timestamp.

4. **Check for interrupted runs:** Check if `data/run-state.json` exists. If it has today's date, a previous run was interrupted. Report which phase it stopped at and resume from there (skip completed phases, reuse the existing timestamp). If the state file is from a previous day, delete it and start fresh.

5. Update `data/run-state.json` at each major phase transition. Delete it when the run completes successfully.

### Step 1: Dispatch web research (background subagent)

If `research_modules` includes `web`:

1. Launch a **cc-web-researcher** subagent with **`run_in_background: true`**:
   - The full `web` config section (keywords, focus_areas)
   - The timestamp
   - The path: `data/history/{TIMESTAMP}-web.md`
   - Any research directives from topics.json

**Do NOT wait for web research to finish.** Proceed immediately to Step 2.

### Step 2: Run Twitter accounts research (main session)

If `research_modules` includes `twitter-accounts` AND `twitter.accounts` is non-empty:

Do this yourself in the main session. Follow the cc-twitter-accounts workflow:

1. For each account in `twitter.accounts`:
   - Remove the @ symbol from the username
   - Fetch their recent tweets:
     ```bash
     node .claude/skills/twitter/scripts/fetch_twitter.js user_tweets "USERNAME" > /tmp/cc_{USERNAME}_raw.json
     ```
   - Parse the response:
     ```bash
     node .claude/skills/twitter/scripts/parse_tweets.js /tmp/cc_{USERNAME}_raw.json > /tmp/cc_{USERNAME}_parsed.json
     ```
   - Run dedup: `node scripts/tweet_dedup.js filter cc /tmp/cc_{USERNAME}_parsed.json`
   - Filter for tweets relevant to Claude Code, vibecoding, AI tools
2. Write findings to `data/history/{TIMESTAMP}-twitter-accounts.md`
3. Write a session log to `data/logs/{TIMESTAMP}-twitter-accounts-session.md`
4. Clean up temp files: `rm -f /tmp/cc_*.json`

If `twitter.accounts` is empty, skip this step and note "Twitter accounts: not configured" in the final summary.

### Step 3: Run Twitter search research (main session)

If `research_modules` includes `twitter-search`:

Do this yourself in the main session. Follow the cc-twitter-search workflow:

1. Use `core_search_terms` from the twitter config for searches
2. Use research directives from topics.json for contextual searches
3. For each search term, fetch both:
   - `search_top` (high engagement)
   - `search_latest` (most recent)
   Using:
   ```bash
   node .claude/skills/twitter/scripts/fetch_twitter.js search_top "QUERY" > /tmp/cc_top_raw.json
   node .claude/skills/twitter/scripts/parse_tweets.js /tmp/cc_top_raw.json > /tmp/cc_top_parsed.json
   ```
4. Filter: `node scripts/filter_engagement.js /tmp/cc_top_parsed.json > /tmp/cc_top_filtered.json`
5. Dedup: `node scripts/tweet_dedup.js filter cc /tmp/cc_top_filtered.json`
6. Write findings to `data/history/{TIMESTAMP}-twitter-search.md`
7. Write a session log to `data/logs/{TIMESTAMP}-twitter-search-session.md`
8. Clean up temp files: `rm -f /tmp/cc_*.json`

### Step 3.5: Wait for background web research

Before proceeding, verify the background web-researcher subagent has completed. You will be automatically notified when it finishes. Check that the history file exists.

If the web researcher failed or produced no output, note it and continue with Twitter findings only.

### Step 4: Dispatch knowledge-categorizer (subagent)

After all research is complete:

1. Ensure `data/routing/` directory exists
2. Collect all history files created in this run
3. Extract the date portion from the timestamp (YYYY-MM-DD format)
4. Launch a **knowledge-categorizer** subagent with:
   - Paths to all today's history files
   - The full contents of each history file
   - The date string
5. Wait for the categorizer to complete
6. Read the routing manifest from `data/routing/{DATE}-routing.json`
7. Parse the `domains_updated` array
8. **Fallback if categorizer fails:** If it fails or produces invalid JSON, fall back to dispatching the synthesizer for ALL domains with ALL findings. Log: "Categorizer failed -- updating all domains."

### Step 5: Dispatch knowledge-synthesizer (parallel subagents)

Based on the routing manifest, for each domain in `domains_updated`:

1. Launch a **knowledge-synthesizer** subagent with `run_in_background: true`:
   - The domain name
   - The findings routed to this domain (from the manifest's `findings` array, filtered to those with this domain in their `route_to`)
   - The path: `data/knowledge/{domain}.md`
   - Today's date

2. Multiple synthesizers can run in parallel since each writes to its own domain file
3. Wait for all synthesizers to complete

If `domains_updated` is empty, skip this step.

### Step 6: Dispatch use-case-finder (subagent)

After synthesizers complete (or immediately if no domains were updated):

1. Launch a **use-case-finder** subagent with:
   - The path to today's routing manifest
   - The full contents of the routing manifest
   - Today's date
   - The path to `config/projects.json`

2. Wait for completion

If there were no findings at all, skip this step.

### Step 7: Clean up and report summary

1. Delete `data/run-state.json` (successful completion)
2. Give a brief summary:
   - What sources were checked (web, twitter-accounts, twitter-search)
   - How many findings were categorized
   - Which knowledge domains were updated
   - Top suggestions (read from `data/suggestions/latest.md` and highlight the high-priority ones)
   - Any errors or issues during the run

## Important Rules

- **Twitter research happens in the main session.** This is necessary because the fetch scripts run here.
- **Web research runs as a background subagent.** It doesn't need MCP tools.
- **Pass data explicitly to subagents.** Include file contents in prompts.
- **Use the twitter skill** (`.claude/skills/twitter/`) for guidance on parsing.
- **Two files per research module.** Research report + session log, nothing else.
- **Always run dedup filters.** Prevents repeated reporting.
- **If a Twitter API call fails, note it and continue.** One failure shouldn't stop the run.
- **Generate the timestamp once** at the start and reuse it everywhere.
- **Categorizer runs after researchers, before synthesizers.**
- **Run synthesizers in parallel** -- each writes to its own file.
- **Use-case-finder runs last** -- it needs the routing manifest.
