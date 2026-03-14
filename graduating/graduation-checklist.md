# Graduation Checklist

Use this checklist when you're ready to promote an experiment from this playground to your global `~/.claude/` config.

---

## Before You Graduate

### 1. Testing Complete

- [ ] Tested the happy path (normal use case)
- [ ] Tested edge cases (empty inputs, missing files, errors)
- [ ] Tested in at least 2-3 different scenarios
- [ ] No unexpected behaviors or errors

### 2. Documentation Clear

- [ ] Description is concise and accurate
- [ ] Instructions are clear and complete
- [ ] Any rules or constraints are documented
- [ ] Output format is defined (if applicable)

### 3. Follows Existing Patterns

- [ ] Tool access is minimal (only what's needed)
- [ ] Model choice is appropriate for the task
- [ ] Memory scope makes sense (if using memory)
- [ ] Naming follows your conventions

### 4. No Conflicts

- [ ] Name doesn't conflict with existing agents/skills/commands
- [ ] Doesn't duplicate functionality you already have
- [ ] Fits into your existing workflow

---

## Graduation Steps

### For Agents

1. Copy the agent file:
   ```
   cp .claude/agents/my-agent.md ~/.claude/agents/
   ```

2. Test it works from anywhere:
   ```
   Use the my-agent agent to [task]
   ```

3. Sync your config:
   ```
   /sync-config
   ```

### For Skills

Skills are drafted in `experiments/skills/` but need to go to the global skills directory:

1. Create the skill folder:
   ```
   mkdir -p ~/.claude/skills/my-skill
   ```

2. Copy skill files:
   ```
   cp experiments/skills/my-skill/* ~/.claude/skills/my-skill/
   ```

3. Test the skill triggers correctly

4. Sync your config:
   ```
   /sync-config
   ```

### For Commands

1. Copy the command file:
   ```
   cp .claude/commands/my-command.md ~/.claude/commands/
   ```

2. Test it works:
   ```
   /my-command
   ```

3. Sync your config:
   ```
   /sync-config
   ```

---

## After Graduation

- [ ] Remove or archive the experiment from this playground
- [ ] Note any learnings in your global CLAUDE.md or a rule file
- [ ] Consider if this pattern could help with other experiments

---

## Rollback

If something goes wrong after graduating:

1. Remove from global config:
   ```
   rm ~/.claude/agents/my-agent.md
   ```

2. Sync the removal:
   ```
   /sync-config
   ```

3. Debug in the playground before trying again
