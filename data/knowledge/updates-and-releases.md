# Domain: Updates and Releases
**Last updated:** 2026-03-20

## Current State of Knowledge
Claude Code is in an active release period (v2.1.63-v2.1.76 as of March 2026), shipping major features like voice mode, loop commands, and a 1M context window. Opus 4.6 is now the default model. Anthropic is expanding the ecosystem with a marketplace, enterprise integrations, and developer education programs.

## Key Concepts
- **1M context window**: Generally available on Opus 4.6 and Sonnet 4.6. Handles 600 images/PDF pages per request. 78.3% accuracy at 1M tokens -- best among frontier models.
- **Opus 4.6 as default**: 64k output tokens standard, 128k upper bound. 1M context available for Max/Team/Enterprise plans.
- **Claude Cowork Dispatch**: Persistent background sessions on your computer. Message from phone, come back to finished work. Runs in a sandbox; files stay local. Now available to all Pro users (was Max-only).
- **Claude Code Review**: Agent team reviews PRs automatically when opened. Costs $15-25 per review by complexity. Research preview for Team and Enterprise only.

## Recent Developments
- **v2.1.63-v2.1.76 feature wave (Mar 2026)**: Push-to-talk voice mode (/voice, spacebar to speak), /loop for recurring prompts, /effort and /color commands. ~16MB memory reduction, ~74% fewer prompt re-renders.
- **1M context window GA**: Available by default in Claude Code on all plans.
- **2x usage bonus off-peak (Mar 13-28)**: Doubled usage limits outside 5-11am PT weekdays and all day weekends. All plans including Claude Code.
- **Interactive charts/diagrams in chat**: Claude builds live interactive visuals directly in chat. Beta, all plans including free.
- **Claude for Excel & PowerPoint**: Cross-file context sharing between Office apps via add-ins. Available on Bedrock, Vertex AI, Microsoft Foundry.
- **Claude Marketplace (limited preview)**: Enterprise procurement hub. Launch partners include GitLab, Harvey, Lovable, Replit, Snowflake, Rogo AI.
- **claude.ai architecture upgrade**: Moved from SSR to static Vite + TanStack Router at edge. 65% faster page loads at p75.

## Patterns and Best Practices
- Use /loop for tasks you repeat regularly (daily standups, code reviews, report generation).
- Use /voice for hands-free coding -- useful when switching between tasks or reviewing code on the go.
- Take advantage of the off-peak usage bonus by scheduling heavy Claude Code work outside 5-11am PT on weekdays.
- For PR review automation, Claude Code Review is cost-effective at $15-25 vs manual review time -- evaluate for Team/Enterprise plans.
- 1M context window is active by default; no configuration needed.

## Open Questions
- When does Claude Code Review exit research preview and become generally available?
- Will Claude Marketplace open beyond limited preview to all enterprise customers?
- Will Cowork Dispatch expand to Team/Enterprise with shared sandboxes?

## Community and Education
- **Anthropic Academy**: 6 free courses including "Claude Code in Action" covering workflows, commands, planning, automation, GitHub integration, and MCP.
- **Code with Claude conference**: Returns spring 2026 in SF, London, and Tokyo. Workshops, demos, 1:1 office hours.
- **Community Ambassadors Program**: Open to any background, worldwide.

## Changes Log
- 2026-03-20: Initial creation
- 2026-03-20: Added v2.1.63-v2.1.76 feature wave, 1M context GA, Cowork Dispatch, Code Review, Office integrations, Marketplace, off-peak bonus, Anthropic Academy, Code with Claude conference, Ambassadors Program, claude.ai architecture update
