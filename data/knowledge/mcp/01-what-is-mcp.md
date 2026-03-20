# What Is MCP

## What This Is

MCP stands for **Model Context Protocol**. It is the universal standard for connecting AI tools to external services. Think of it like a universal power adapter: instead of every AI tool needing a custom connection to every service, MCP provides one standard plug that any AI and any tool can use.

Before MCP, if you wanted Claude to talk to your database, you would need to write custom code. With MCP, someone creates an "MCP server" for that database once, and any AI tool that supports MCP can use it immediately.

MCP was created by Anthropic and donated to the Linux Foundation in December 2025. It has been adopted by OpenAI, Google DeepMind, Microsoft, and others. It is not an Anthropic-only thing -- it is an industry standard.

## The Standard Approach

### How MCP Works

An MCP server is a small program that wraps an external tool (an API, a database, a service) and makes it accessible to Claude through a standard interface. Here is the flow:

1. You install an MCP server (usually a small package)
2. You add its configuration to your Claude Code settings
3. Claude can now use that tool as naturally as it uses its built-in tools

For example, if you install the Supabase MCP server, Claude can directly query your database, run migrations, and manage tables -- without you needing to explain how your database works each time.

### Where to Find MCP Servers

Before building your own, check if one already exists. The ecosystem is large and growing:

| Source | What It Is |
|--------|-----------|
| **Official MCP Registry** | Anthropic's curated list of vetted servers |
| **mcp.so** | Community directory with search and categories |
| **Smithery** | Another community marketplace for MCP servers |
| **awesome-mcp-servers** | GitHub repository with 83,000+ stars listing community servers |

The ecosystem covers most popular services: databases, design tools, project management, cloud platforms, browser automation, communication tools, and more.

### Setting Up an MCP Server

MCP servers are configured in your Claude Code settings file. Here is what a typical configuration looks like:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@package/mcp-server"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

This goes in your project's `.mcp.json` file (for project-specific servers) or your global settings (for servers you want everywhere).

### When to Use MCP vs. Built-In Tools

Claude Code already has built-in tools for reading files, running commands, searching the web, and more. MCP adds capabilities beyond those defaults:

| Need | Use |
|------|-----|
| Read/write local files | Built-in tools (Read, Write, Edit) |
| Run shell commands | Built-in Bash tool |
| Search the web | Built-in WebSearch |
| Talk to a specific API or service | MCP server |
| Access a design tool like Figma | MCP server |
| Manage cloud deployments | MCP server (or CLI tools) |
| Automate a browser | MCP server (Playwright) or built-in if installed |

## Other Approaches

### Direct API Calls via Bash

You can always have Claude make API calls directly using curl or other command-line tools. This works fine for one-off tasks but gets messy for repeated use. MCP servers provide a cleaner, more reliable interface.

### CLI Tools

Some services (like Vercel, Supabase, GitHub) have their own command-line tools that Claude can use through the Bash tool. This is a perfectly valid approach and sometimes simpler than setting up an MCP server. The trade-off is that MCP servers often provide a more structured interaction.

### Building Your Own MCP Server

If no existing server covers your use case, you can build one. The MCP specification is open, and there are starter templates in multiple languages. However, this requires programming knowledge and is usually not necessary given the size of the existing ecosystem.

## What's New

- **Linux Foundation governance** (Dec 2025): MCP was donated to the Linux Foundation, making it a true open standard rather than a single company's project. This is why adoption has accelerated across the industry.
- **Massive ecosystem growth**: The awesome-mcp-servers repository has over 83,000 GitHub stars, indicating strong community investment.
- **Cross-platform adoption**: OpenAI, Google DeepMind, and Microsoft all support MCP now, meaning servers you set up for Claude also work with other AI tools.
- **Channels MCP** (research preview): A new server type that lets Claude Code connect to Telegram and Discord, enabling remote control and notifications. See the next guide for details.
