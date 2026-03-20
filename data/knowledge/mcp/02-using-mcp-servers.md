# Using MCP Servers

## What This Is

This guide covers practical use cases for MCP servers -- the specific servers that are most useful for everyday Claude Code workflows, and how to set them up. If you have not read "What Is MCP" yet, start there for the basics.

## The Standard Approach

### Common MCP Servers by Use Case

Here are the most widely used MCP servers and what they do for you:

| Server | What It Does | Why You'd Want It |
|--------|-------------|-------------------|
| **Figma MCP** | Reads your Figma designs and gives Claude the layout, colors, and component details | Turn designs into working code without manually describing what you want |
| **Supabase MCP** | Connects Claude directly to your Supabase database | Claude can query data, create tables, run migrations, and manage your backend |
| **Vercel MCP** | Manages your Vercel deployments | Claude can deploy, check build logs, and manage projects |
| **Playwright MCP** | Controls a web browser | Claude can visit pages, click buttons, fill forms, take screenshots |
| **Context7** | Fetches up-to-date documentation for libraries | Claude gets current docs instead of relying on training data |

### The Figma-to-Code Pipeline

One of the most powerful MCP workflows is turning Figma designs into working applications. Here is how it works:

1. **Design in Figma** -- create your layouts, pick colors, set up components
2. **Connect the Figma MCP server** -- configure it with your Figma API token
3. **Give Claude the Figma file link** -- Claude reads the design through MCP
4. **Claude builds the app** -- it translates the design into actual code, matching layouts, colors, spacing, and typography

People have reported building working applications in hours using this pipeline, compared to days or weeks of manual development. The key is that Claude gets the precise design details (exact hex colors, pixel measurements, component hierarchy) rather than a vague description.

### Setting Up a Server: Step by Step

Here is a concrete example using a typical MCP server:

1. **Find the server** on the MCP Registry or mcp.so
2. **Check the requirements** -- most need an API key from the service
3. **Add to your config file** -- either `.mcp.json` in your project root or global settings

Example `.mcp.json` for a project:
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic/figma-mcp-server"],
      "env": {
        "FIGMA_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

4. **Restart Claude Code** -- it picks up new MCP servers on startup
5. **Test it** -- ask Claude to use the new server (e.g., "read my Figma file at [URL]")

### Multiple Servers Working Together

You can have many MCP servers active at once. Claude will use whichever one is appropriate for the task. For example, with Figma, Supabase, and Vercel servers all configured:

- "Look at this Figma design and build the page" (uses Figma MCP)
- "Create a database table for user profiles" (uses Supabase MCP)
- "Deploy the latest changes" (uses Vercel MCP)

Claude figures out which server to use based on what you are asking it to do.

## Other Approaches

### Channels MCP (Telegram/Discord)

This is a newer feature (research preview, requires Claude Code v2.1.80+) that takes MCP in a different direction. Instead of connecting Claude to a service, Channels connects Claude to a messaging platform so you can communicate with it remotely.

How it works:
- You set up a Channels MCP server connected to your Telegram or Discord
- Claude Code sends you notifications when something happens (a build finishes, a test fails, a task completes)
- You can send commands back to Claude through the messaging app

The main benefit: instead of babysitting Claude Code in a terminal, you get a notification on your phone and can respond from anywhere.

**Status**: Research preview. Works but still evolving.

### HeyGen MCP (Video Generation)

For non-traditional use cases, the HeyGen MCP server lets Claude generate videos with AI avatars. This is useful for creating demo videos, explainer content, or marketing material without recording yourself.

### CAD MCP Server (Hardware Design)

The CAD MCP server extends Claude Code into physical product design -- creating 3D models, adjusting dimensions, working with manufacturing specifications. This shows how MCP is expanding AI coding tools beyond just software.

## What's New

- **Figma MCP pipeline** is emerging as one of the highest-impact uses of MCP. Anthropic is hosting a livestream demo on March 31, 2026.
- **Channels MCP** (research preview) enables async communication with Claude via Telegram and Discord. This changes the interaction model from "sit and watch" to "get notified."
- **HeyGen MCP** brings video generation into coding workflows -- a use case nobody expected from a coding tool.
- **CAD MCP** extends AI-assisted development to hardware design, showing MCP's flexibility beyond software.
- **Ecosystem size** continues to grow rapidly. The awesome-mcp-servers list has 83,000+ GitHub stars, and new servers appear daily.
