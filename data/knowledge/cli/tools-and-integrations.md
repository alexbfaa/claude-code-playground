# CLI: Tools and Integrations

**Last updated:** 2026-03-20

## Current Landscape

The Claude Code ecosystem is expanding beyond Anthropic's own tools. Community-built utilities, cross-platform skill portability, and third-party CLIs are creating a broader landscape of options. The trend is toward tools and skills that work across multiple AI coding assistants, not just Claude Code.

## Entries

### Clippy Agent Monitor
- **What:** A community-built tool that went viral. It sits on your screen as a small animated character (like the old Microsoft Clippy) and monitors your Claude Code agent's activity in real time. Shows what the agent is doing, which files it is reading, and its progress.
- **Why it matters:** Makes agent activity visible without reading terminal output. Especially useful when running long tasks or orchestration pipelines where you want a quick visual check on progress.
- **Added:** 2026-03-20

### Claude Code Templates
- **What:** A hackathon-winning project that provides starter templates for common Claude Code setups. Includes pre-configured skills, commands, agents, and project structures for different use cases.
- **Why it matters:** Reduces the time to set up a new project with Claude Code best practices. Instead of building your CLAUDE.md, skills, and commands from scratch, start with a template.
- **Added:** 2026-03-20

### Skill/MCP Portability Across CLIs
- **What:** The SKILL.md format and MCP protocol now work across Claude Code, Codex CLI (OpenAI), Cursor, and Gemini CLI (Google). Skills and MCP servers you create are not locked to one tool.
- **Why it matters:** Protects your investment in building skills and configuring MCP servers. If you switch tools or use multiple tools, your setup comes with you.
- **Added:** 2026-03-20

### Blackbox AI Cross-Model CLI
- **What:** A third-party CLI tool that can use multiple AI models (Claude, GPT, Gemini, etc.) for coding tasks. Provides a unified interface regardless of which model you choose.
- **Why it matters:** For users who want flexibility to switch between models based on the task. Not as deep as Claude Code for Claude-specific features, but broader in model support.
- **Added:** 2026-03-20

### Local/Free Claude Code Guides
- **What:** Community guides for running Claude Code with local models or free-tier setups. Covers using Claude Code with alternative API providers and self-hosted models.
- **Why it matters:** Lowers the barrier to entry for people who want to try Claude Code without a paid subscription. Also useful for air-gapped environments where cloud APIs are not available.
- **Added:** 2026-03-20
