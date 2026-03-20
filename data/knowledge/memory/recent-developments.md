# Recent Developments: Memory and Context

**Last updated:** 2026-03-20

## Current Landscape

The 1M token context window is now generally available for Claude Opus 4.6 and Sonnet 4.6. This is the biggest shift in context management since Claude Code launched -- sessions can now hold entire codebases, reducing reliance on context-clearing workarounds. Memory systems (MEMORY.md, agent memory) remain essential for cross-session persistence since the context window still resets between conversations.

## Entries

### 1M Context Window GA
- **Date:** March 2026
- **Source:** Anthropic announcement
- **Details:** The 1 million token context window moved from beta to generally available. Available by default in Claude Code at standard pricing across all plans. Anthropic's Thariq noted: "the performance is so good, I really just don't clear the context window much these days."
- **Impact:** Load full codebases into sessions. Less need for context clearing. Reduces errors from incomplete context.

### Media Limits Expanded
- **Date:** March 2026
- **Source:** Anthropic announcement
- **Details:** Each request now supports up to 600 images or PDF pages, up from previous limits.
- **Impact:** Document-heavy workflows (manuals, design specs, reports) can be fed directly into a session.

### MRCR v2 Benchmark Performance
- **Date:** March 2026
- **Source:** Anthropic benchmark results
- **Details:** Opus 4.6 scores 78.3% on MRCR v2 at 1M tokens -- the highest score among frontier models tested. MRCR v2 tests how well a model finds and uses information buried deep in long contexts.
- **Impact:** Validates that the 1M window isn't just larger but also reliable -- Claude can retrieve information from early in a long session.

### Best Practices Shifting
- **Date:** March 2026
- **Source:** Community patterns
- **Details:** With reliable 1M context, recommended practices are evolving: load full codebases into context, clear context less often, and use MEMORY.md for facts that must persist across sessions rather than as a workaround for limited context.
- **Impact:** Simplifies workflows. The context window handles within-session needs; memory handles between-session needs.

## Open Questions

- Does the 1M context window affect response speed or cost in Claude Code sessions?
- Are there practical limits on how many files can be loaded before performance degrades?
- Will memory auto-load limits (200 lines) increase to match larger context windows?

## Changes Log
- 2026-03-20: Initial creation with 1M context GA, media limits, MRCR v2 benchmark, and best practice shifts
