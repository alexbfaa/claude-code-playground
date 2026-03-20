# Releases: Changelog

**Last updated:** 2026-03-20

## Current Landscape

Claude Code and the broader Claude platform have been on an aggressive release cadence in early 2026. Major changes include a new default model (Opus 4.6), 1M context window, cloud-hosted execution, and a wave of CLI features. The platform is expanding from a developer tool toward broader business use with Excel/PowerPoint support and a marketplace.

## Entries

### Opus 4.6 as Default Model
- **What:** Claude Opus 4.6 is now the default model in Claude Code. It supports 64K token output (128K upper bound), making it capable of producing much longer responses than previous versions.
- **Why it matters:** Longer outputs mean Claude can write larger files, more detailed analyses, and complete implementations in a single response without being cut off.
- **Added:** 2026-03-20

### 1M Context Window GA
- **What:** The 1 million token context window is now generally available. This means Claude can hold roughly 700,000 words of context (code, conversation, documents) in a single session.
- **Why it matters:** Entire codebases can fit in one conversation. Less need to compact or restart sessions. Especially valuable for understanding large projects.
- **Added:** 2026-03-20

### v2.1.63-v2.1.76 Feature Wave (March 2026)
- **What:** A rapid series of Claude Code releases adding: voice mode (`/voice`), `/loop` for scheduled tasks, `/effort` for controlling response depth, `/color` for terminal themes, memory usage reduction, and fewer prompt re-renders for smoother UX.
- **Why it matters:** This burst of features made Claude Code significantly more capable and pleasant to use day-to-day. Voice mode and /loop in particular changed how people interact with it.
- **Added:** 2026-03-20

### 2x Off-Peak Usage Bonus
- **What:** From March 13-28, 2026, Pro and Max users get double usage during off-peak hours.
- **Why it matters:** Effectively doubles your capacity if you schedule heavy work during off-peak times. Good for automated tasks that do not need to run during business hours.
- **Added:** 2026-03-20

### Interactive Charts in Chat (Beta)
- **What:** Claude Code can now render interactive charts directly in the chat interface. Supports bar charts, line charts, and other visualizations.
- **Why it matters:** Data analysis and reporting can happen visually inside Claude Code instead of requiring external tools or separate notebooks.
- **Added:** 2026-03-20

### Claude for Excel and PowerPoint
- **What:** Claude integration for Microsoft Office. Work with spreadsheets and presentations using Claude's capabilities.
- **Why it matters:** Extends Claude beyond code into everyday business tools. Useful for data analysis in Excel and creating presentations in PowerPoint.
- **Added:** 2026-03-20

### Claude Marketplace (Limited Preview)
- **What:** A marketplace for sharing and discovering Claude skills, agents, and configurations. Currently in limited preview.
- **Why it matters:** Could become the "app store" for Claude capabilities. Makes it easy to find and use community-built tools instead of building everything yourself.
- **Added:** 2026-03-20

### Claude Code Review (Research Preview)
- **What:** Automated code review feature for Team and Enterprise plans. Claude reviews pull requests for bugs, style issues, and improvement opportunities.
- **Why it matters:** Automated code review at the platform level, without needing to set up GitHub Actions or custom workflows.
- **Added:** 2026-03-20

### Cowork Dispatch (All Pro Users)
- **What:** Async task execution. Start a Claude Code task, disconnect, and come back for results later. Now available to all Pro users (previously limited).
- **Why it matters:** Removes the need to babysit long-running tasks. Especially valuable for research, large refactors, and orchestration pipelines.
- **Added:** 2026-03-20

### claude.ai Architecture Upgrade
- **What:** The claude.ai web interface was rebuilt using Vite and TanStack Router, resulting in 65% faster page loads.
- **Why it matters:** The web interface is now significantly more responsive. Faster navigation and reduced latency when switching between conversations.
- **Added:** 2026-03-20
