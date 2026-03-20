# Domain: CLI and Tooling
**Last updated:** 2026-03-20

## Current State of Knowledge
Claude Code runs as both a standalone CLI and a VS Code extension. It provides built-in tools (Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch) and supports external tool integration via MCP servers. The ecosystem is expanding rapidly: community tools now handle agent monitoring, cross-platform portability, and chat-based remote control. A multi-CLI era is emerging where skills and configurations move between Claude Code and competitors like Codex CLI.

## Key Concepts
- **MCP (Model Context Protocol):** The standard way to add new tools and integrations to Claude Code. Many community tools are built on it.
- **Channels (Telegram/Discord):** Research preview feature (requires v2.1.80+). Control Claude Code remotely via chat apps; Claude can also proactively message you.
- **SKILL.md format:** A portable configuration format for skills -- now adopted by OpenAI's Codex CLI as well, meaning skills you write can move between AI tools.
- **Vibecoding:** Workflow of designing visually (e.g., in Figma) then handing the design to Claude Code to build -- full apps built in hours.

## Recent Developments
- **Channels feature (research preview):** Control Claude Code via Telegram or Discord. Requires v2.1.80+, built on MCP. Set up via BotFather (Telegram) or Discord Developer Portal. Async model -- Claude can notify you proactively, not just respond.
- **Clippy agent monitor (community, viral -- 491 RT / 4,707 likes):** Watches running Claude Code agents, catches permission prompts, and jumps you to the right terminal window automatically. Named after Microsoft's Clippy but described as genuinely useful.
- **Claude Code Templates (Anthropic hackathon winner):** Open-source pre-configured setups including agents, skills, hooks, commands, rules, and MCP servers. Includes visual dashboards for agent teams. Being promoted as the best starting point for new users.
- **Skill and MCP portability across CLIs:** Configurations are successfully moving between Claude Code and Codex CLI. OpenAI adopted the SKILL.md format, making skills cross-platform.
- **Blackbox AI cross-model CLI:** Blackbox CLI supports Claude Code with OpenAI models and Codex CLI with Anthropic models. Signals a model-agnostic CLI era where you can mix AI brains with your preferred interface.
- **Figma-to-Claude Code workflow:** Growing pattern -- design in Figma, feed design to Claude Code via Figma MCP, build full apps in hours.
- **Local/free Claude Code (high demand -- 311 RT / 2,400 likes):** Guide circulating for running Claude Code entirely local with no API costs or rate limits.

## Patterns and Best Practices
- Use Claude Code Templates as a starting point -- they bundle agents, skills, rules, and MCP servers in one ready-to-use package.
- For agent-heavy workflows, run Clippy alongside Claude Code to catch permission prompts without babysitting terminals.
- Write skills using SKILL.md format -- they're now portable to Codex CLI, so the work carries over if you ever switch or use multiple tools.
- For UI/design-heavy projects, set up the Figma MCP to pipe designs directly into Claude Code rather than describing them in words.
- If API costs are a concern, look into the local/free Claude Code setup guides circulating in the community.

## Open Questions
- When will Channels (Telegram/Discord control) move out of research preview to general availability?
- How complete is the SKILL.md cross-compatibility between Claude Code and Codex CLI in practice?

## Changes Log
- 2026-03-20: Initial creation
- 2026-03-20: Added Channels feature, Clippy monitor, Templates ecosystem, skill portability, Blackbox CLI, Figma workflow, and local/free setup findings
