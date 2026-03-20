# Domain: MCP Servers
**Last updated:** 2026-03-20

## Current State of Knowledge
MCP (Model Context Protocol) is now the universal standard for connecting AI tools to external services -- donated to the Linux Foundation in Dec 2025 and adopted by OpenAI, Google DeepMind, and Anthropic. The ecosystem has exploded with 83K+ starred community lists and official discovery hubs. Servers now cover creative tools (video, CAD, design), communication channels (Telegram, Discord), and workflows that connect design to code in hours.

## Key Concepts
- **MCP (Model Context Protocol)**: The standard way for AI assistants to talk to external tools. Think of it as a universal plug -- one protocol that any AI and any tool can use to connect. Now governed by the Linux Foundation.
- **MCP Server**: A piece of software that wraps an external tool (API, database, service) and makes it accessible to Claude via MCP.
- **Configured in**: `settings.json` under `mcpServers`
- **Discovery hubs**: Official MCP Registry, mcp.so, Smithery, awesome-mcp-servers (83K+ GitHub stars)

## Recent Developments
- **MCP donated to Linux Foundation** (Dec 2025): Anthropic handed MCP governance to the Linux Foundation's Agentic AI Foundation. OpenAI and Google DeepMind officially adopted it. MCP is now the industry-wide standard for AI-to-tool communication. Source: multiple outlets.
- **Claude Code Channels** (research preview): MCP-based integration lets you control Claude Code sessions via Telegram or Discord. Uses an async model -- Claude proactively messages you with updates rather than you having to wait at the terminal. Requires Claude Code v2.1.80+.
- **HeyGen MCP**: HeyGen launched an MCP server for generating AI videos directly from Claude Code, Claude Web, Gemini CLI, and Cursor. Video creation is now a native agent capability.
- **CAD MCP Server**: Hardware design via MCP -- create compound shapes, extrusions, fillets, and counterbore holes from inside Claude Code. Supports image input for reference. Bridges AI coding with physical product design.
- **Figma MCP for engineer-designer collaboration**: A March 31 livestream with Figma is focused on using Claude Code + Figma MCP to close the gap between designers and engineers. Growing fast as a workflow pattern.

## Patterns and Best Practices
- **Figma-to-code pipeline**: Design in Figma, feed the design to Claude Code via Figma MCP, get a working app in hours. Full applications are being built this way. This is becoming a standard rapid prototyping workflow.
- **Async notifications via Channels MCP**: Instead of watching Claude work in the terminal, use the Channels MCP (Telegram/Discord) to let Claude ping you when it needs input or finishes a task. Frees you from babysitting long-running jobs.
- **Find servers before building**: Check mcp.so, Smithery, or awesome-mcp-servers before writing a custom integration -- the ecosystem is large enough that a server likely already exists.

## Open Questions
- When will Claude Code Channels exit research preview and become generally available?
- What CAD formats does the CAD MCP server export to (STL, STEP, etc.)?

## Changes Log
- 2026-03-20: Initial creation
- 2026-03-20: Added MCP Linux Foundation governance, Claude Code Channels, HeyGen MCP, CAD MCP, Figma MCP workflow, discovery hubs, and async notification pattern
