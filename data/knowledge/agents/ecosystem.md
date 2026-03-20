# Agent Ecosystem
**Last updated:** 2026-03-20

## Current Landscape
The Claude Code agent ecosystem spans four layers, from the base CLI up to multi-agent orchestration. A growing community is building and sharing agents, tools, and templates that extend what's possible out of the box.

## Entries

### 4-Layer Mental Model
- **What:** The Claude Code ecosystem stacks in four layers: (1) the base CLI (chatting, reading files, running commands), (2) skills and commands (reusable procedures like /ship), (3) agents and subagents (specialized workers), and (4) multi-agent orchestration (teams of agents coordinated by a manager agent).
- **Why it matters:** Understanding the layers helps you decide where to build. Simple automations belong at the skill layer. Specialized tasks belong at the agent layer. Complex pipelines belong at the orchestration layer. Building at the wrong layer creates unnecessary complexity.
- **Added:** 2026-03-20

### 61-Agent Public Repository
- **What:** A community-maintained repository containing 61 agents covering engineering, design, marketing, product, and testing. Agents are ready to use or adapt.
- **Why it matters:** Instead of writing every agent from scratch, you can grab a proven starting point. The breadth (design, marketing, not just code) shows how far the ecosystem has expanded beyond engineering use cases.
- **Added:** 2026-03-20

### Claude Code Templates
- **What:** Hackathon-winning project that bundles agents, skills, hooks, and settings into shareable starter kits. Includes visual dashboards for monitoring agent activity in real time.
- **Why it matters:** Templates solve the cold-start problem. Visual dashboards solve the visibility problem ("what is my agent actually doing right now?"). Together, they make multi-agent setups practical for people who aren't deep experts.
- **Added:** 2026-03-20

### Clippy Agent Monitor
- **What:** A tool that watches agents running across multiple terminal windows, catches permission prompts, and handles them. Went viral in the Claude Code community.
- **Why it matters:** Solves the "babysitting problem." When you run multiple agents, you're constantly switching between terminals to approve permission requests. Clippy watches all of them and handles approvals so you can focus on other work.
- **Added:** 2026-03-20

### Non-Engineering Agent Use Cases
- **What:** Agents being built for business operations beyond software. Notable examples: DTC (direct-to-consumer) brand management agents that handle product copy and marketing, and Google Maps lead generation agents that scrape and qualify business leads.
- **Why it matters:** Proves that Claude Code agents are a general-purpose automation platform, not just a coding assistant. If your work involves research, data processing, outreach, or content, agents can handle it.
- **Added:** 2026-03-20
