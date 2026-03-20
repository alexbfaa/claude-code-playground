# Commands Overview

## What This Is

Claude Code is an AI coding assistant that runs in your terminal or as a VS Code extension. It comes with a set of built-in tools and commands that let it read your code, make changes, run programs, search the web, and more. Think of it as having a developer sitting next to you who can do anything on your computer that you ask.

This guide covers what comes built in and how to extend it with your own commands.

## The Standard Approach

### Built-In Tools

These are the core capabilities Claude Code has out of the box. You do not need to install or configure anything:

| Tool | What It Does |
|------|-------------|
| **Read** | Opens and reads any file on your computer |
| **Write** | Creates new files |
| **Edit** | Makes changes to existing files (only sends the changed parts) |
| **Bash** | Runs any terminal command |
| **Glob** | Finds files by name pattern (e.g., "all .ts files in src/") |
| **Grep** | Searches file contents for text or patterns |
| **WebSearch** | Searches the web for information |
| **WebFetch** | Downloads content from a specific URL |

Claude picks which tool to use based on what you ask. You do not need to tell it "use the Read tool" -- just say "look at the auth file" and it will figure it out.

### Built-In Slash Commands

Slash commands are shortcuts you type in the Claude Code chat. They start with `/`:

| Command | What It Does |
|---------|-------------|
| `/help` | Shows available commands and how to use them |
| `/clear` | Clears the current conversation (starts fresh) |
| `/compact` | Compresses the conversation to save context space |
| `/plan` | Enters planning mode (Claude thinks through approach before acting) |
| `/voice` | Enables voice input for speaking instead of typing |
| `/loop` | Schedules a task to repeat on an interval (e.g., every 5 minutes) |
| `/debug` | Focuses Claude on debugging a specific problem |
| `/simplify` | Asks Claude to simplify complex code |
| `/batch` | Runs a task across multiple files |
| `/rewind` | Goes back to an earlier point in the conversation |
| `/btw` | Mentions something without interrupting the current task |
| `/claude-api` | Quick access to Anthropic API documentation |

### Custom Slash Commands

You can create your own slash commands by adding markdown files to the `.claude/commands/` directory in your project. Each file becomes a command:

```
.claude/commands/
  review.md        -> /review
  ship.md          -> /ship
  ingest.md        -> /ingest
```

The file contains the instructions Claude follows when you use the command. This is how the `/ingest` command in this project works -- it is a markdown file with step-by-step orchestration instructions.

### The SKILL.md Format

Skills are a standardized way to package instructions that Claude Code can follow. A SKILL.md file tells Claude:
- What the skill does
- When to use it
- Step-by-step instructions for execution

The important thing about SKILL.md is that it is **portable**. The same skill file works across:
- Claude Code (Anthropic's CLI)
- Codex CLI (OpenAI)
- Cursor
- Gemini CLI (Google)

This means if you invest time creating a skill, it is not locked into one tool.

## Other Approaches

### MCP Servers for Extended Capabilities

While built-in tools cover most needs, MCP servers add specialized capabilities. For example, the Figma MCP server lets Claude read design files, and the Playwright MCP server lets Claude control a web browser. See the MCP domain guides for details.

### CLI Tools via Bash

Any command-line tool installed on your computer is available to Claude through the Bash tool. This includes `gh` (GitHub), `vercel`, `supabase`, `npm`, and anything else you have installed. You do not need an MCP server for tools that already have a good CLI.

### Agents

Agents are more advanced than commands. While a command is a set of instructions Claude follows, an agent is a specialized role with its own context. Agent files go in `.claude/agents/` and are invoked when you tell Claude to "use the [agent-name] agent." Agents are useful when you need persistent specialization (like a dedicated researcher or code reviewer).

## What's New

- **SKILL.md portability**: The skill format now works across Claude Code, Codex CLI, Cursor, and Gemini CLI. This cross-platform compatibility is a recent development and means skills are a safe long-term investment.
- **Voice mode**: The `/voice` command is relatively new, letting you speak instructions instead of typing.
- **`/loop` command**: Session-scoped task scheduling is now built in. You can set up recurring checks without external tools.
- **`/batch` command**: Process multiple files with the same operation, useful for bulk refactoring or formatting.
- **Interactive charts** (beta): Claude Code can now render charts directly in the chat for data visualization.
