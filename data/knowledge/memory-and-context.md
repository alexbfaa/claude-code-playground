# Domain: Memory and Context
**Last updated:** 2026-03-20

## Current State of Knowledge
Claude Code has two memory systems: auto-memory (MEMORY.md files managed by the system) and agent-level memory (per-agent persistence). Memory scopes include user (global), project (per-repo), and local (agent-specific). MEMORY.md files have a 200-line auto-load limit. The context window for Claude Opus 4.6 and Sonnet 4.6 is now 1 million tokens and generally available -- large enough to hold entire codebases in a single session, reducing the need to clear context or rely on external memory tricks.

## Key Concepts

- **Context window:** How much text (code, conversation, documents) Claude can hold in memory at once during a session. Measured in "tokens" -- roughly 1 token per word.
- **1M token context (GA):** Claude Opus 4.6 and Sonnet 4.6 now support 1 million token context windows, generally available on all plans and by default in Claude Code at standard pricing.
- **MEMORY.md files:** Persistent notes Claude writes between sessions. Auto-loaded up to 200 lines. Scoped to user (global), project (per-repo), or local (agent-specific) levels.
- **MRCR v2:** A benchmark that tests how well a model finds and uses information buried deep in a long context. Opus 4.6 scores 78.3% at 1M tokens -- highest among frontier models tested.

## Recent Developments

- **1M context window is now GA (2026-03):** Previously a beta feature, the 1 million token context window is now generally available for Claude Opus 4.6 and Sonnet 4.6. Available by default in Claude Code at standard pricing. Anthropic's Thariq noted: "the performance is so good, I really just don't clear the context window much these days."
- **Media limits expanded:** Each request now supports up to 600 images or PDF pages, up from previous limits. Useful for document-heavy workflows.
- **Benchmark leadership:** Opus 4.6 scores 78.3% on MRCR v2 at 1M tokens, the highest score among frontier models on this long-context retrieval benchmark.

## Patterns and Best Practices

- **Load full codebases into context:** With 1M tokens, you can load entire repos into a single session rather than reading files one at a time. This reduces errors from incomplete context.
- **Reduce context clearing:** The improved retrieval performance at long contexts means clearing the window is less necessary than before -- Claude can reliably use information from early in a long session.
- **Use MEMORY.md for cross-session facts:** The context window resets between sessions. For things that must persist (project goals, key decisions, learned lessons), write them to MEMORY.md files.
- **Media in context:** You can now include up to 600 images or PDF pages per request, making it practical to feed large document sets (manuals, design specs, reports) directly into a session.

## Open Questions

- Does the 1M context window affect response speed or cost in Claude Code sessions?
- Are there practical limits on how many files can be loaded before performance degrades?

## Changes Log
- 2026-03-20: Initial creation
- 2026-03-20: Added 1M context window GA details (Opus 4.6, Sonnet 4.6), MRCR v2 benchmark score, expanded media limits, and best practices for large-context workflows
