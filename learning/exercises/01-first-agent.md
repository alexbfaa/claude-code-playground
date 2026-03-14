# Exercise 1: Build Your First Agent

In this exercise, you'll create a simple agent that explains code in plain English.

**Time**: 10-15 minutes
**Difficulty**: Beginner

---

## Goal

Create an agent called `code-explainer` that:
- Takes a file path
- Reads the code
- Explains what it does in simple, non-technical language

---

## Step 1: Create the Agent File

Create a new file at `.claude/agents/code-explainer.md`:

```markdown
---
name: code-explainer
description: Explains code in simple, non-technical language
tools: [Read, Glob]
model: sonnet
---

## What You Do

You explain code to people who aren't programmers. Your job is to help them understand what code does without using technical jargon.

## How You Work

1. Read the file the user specifies
2. Understand what the code does at a high level
3. Explain it as if talking to a smart 15-year-old

## Your Explanation Style

- Start with a one-sentence summary of what the file does
- Use analogies to everyday things
- Avoid technical terms - if you must use one, explain it
- Focus on the "what" and "why", not the "how"
- Keep it concise - aim for 3-5 short paragraphs

## Example Output

"This file handles user login. Think of it like a bouncer at a club - it checks if you have the right credentials (username and password) before letting you in. If everything checks out, it gives you a special pass (called a token) that proves you're allowed to be here. If not, it politely turns you away with an error message."

## What You Don't Do

- Don't explain every line of code
- Don't use programming terms without explaining them
- Don't suggest improvements or changes
- Don't criticize the code quality
```

---

## Step 2: Test the Agent

Try using your new agent:

```
Use the code-explainer agent to explain [pick any file in a project]
```

---

## Step 3: Evaluate

Ask yourself:
- Did the explanation make sense to a non-programmer?
- Was the language simple enough?
- Did it capture the essence of what the code does?

---

## Step 4: Iterate

Based on your testing, you might want to adjust:
- The explanation style
- The level of detail
- Specific rules about what to include or exclude

Edit the agent file and test again.

---

## Bonus Challenges

1. **Add examples**: Include 2-3 more example outputs for different types of files
2. **Handle errors**: What should the agent do if the file doesn't exist?
3. **Scope it**: Make the agent only explain certain types of files (e.g., just JavaScript)

---

## What You Learned

- How to create an agent file with frontmatter
- The basic structure: name, description, tools, instructions
- How to define the agent's personality and output style
- The importance of testing and iterating

---

## Next Exercise

In [Exercise 2: Agent with Memory](02-agent-with-memory.md), you'll add memory so your agent can learn and improve over time.
