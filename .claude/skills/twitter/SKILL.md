---
name: twitter
description: Fetches Twitter/X data via direct RapidAPI HTTP calls using fetch_twitter.js. Use when fetching tweets from accounts, searching tweets, getting user profiles, or working with any Twitter data through the API.
---

# Twitter Data Collection

This skill guides Twitter/X data collection for the knowledge ingestion system using direct API calls.

## Prerequisites

- `RAPIDAPI_KEY` environment variable must be set in ~/.zshrc
- Fetch script: `.claude/skills/twitter/scripts/fetch_twitter.js`
- Parse script: `.claude/skills/twitter/scripts/parse_tweets.js`

## When to Use This Skill

- Fetching tweets from accounts listed in `config/topics.json` twitter.accounts
- Searching Twitter for Claude Code discussions
- Getting user profile information
- Any time you need Twitter data for knowledge research

## Available Commands

All commands go through the fetch script:

```bash
node .claude/skills/twitter/scripts/fetch_twitter.js <command> <value> [cursor] [count]
```

| Command | Purpose | Value |
|---------|---------|-------|
| `user_tweets` | Get tweets from an account | username (no @ symbol) |
| `search_top` | Search for high-engagement tweets | search query |
| `search_latest` | Search for recent tweets | search query |
| `get_user` | Get user profile info | username (no @ symbol) |
| `get_conversation` | Get replies to a tweet | tweet_id (as string) |

## Workflow: Fetching and Parsing Tweets

### Step 1: Fetch raw data

```bash
node .claude/skills/twitter/scripts/fetch_twitter.js user_tweets "username" > /tmp/cc_raw.json
```

Remove the `@` symbol from usernames.

### Step 2: Parse the response

```bash
node .claude/skills/twitter/scripts/parse_tweets.js /tmp/cc_raw.json > /tmp/cc_parsed.json
```

### Step 3: Filter and deduplicate

For **search results**, apply engagement filtering first:
```bash
node scripts/filter_engagement.js /tmp/cc_parsed.json > /tmp/cc_filtered.json
```

Then deduplicate (for both accounts and search):
```bash
node scripts/tweet_dedup.js filter cc /tmp/cc_filtered.json
```

The dedup script outputs only NEW tweets and marks them as seen for future runs.

### Step 4: Clean up

```bash
rm /tmp/cc_*.json
```

## Workflow: Searching Tweets

1. **Fetch search results:**
   ```bash
   node .claude/skills/twitter/scripts/fetch_twitter.js search_top "\"Claude Code\"" > /tmp/search_raw.json
   ```

2. **Parse and paginate** using the same process as user tweets

3. **Handle pagination** if more results are needed:
   - The parsed output includes a `cursor` value
   - Fetch the next page:
     ```bash
     node .claude/skills/twitter/scripts/fetch_twitter.js search_top "\"Claude Code\"" "CURSOR_VALUE" > /tmp/search_page2.json
     ```

## Output Format

The parsing script outputs JSON compatible with the project's filter and dedup scripts:

```json
{
  "tweets": [
    {
      "id": "1234567890123456789",
      "text": "Tweet content here...",
      "created_at": "Mon Mar 15 14:30:00 +0000 2026",
      "likes": 150,
      "retweets": 45,
      "replies": 12,
      "quotes": 3,
      "author": {
        "username": "exampleuser",
        "display_name": "Example User",
        "verified": true
      },
      "is_retweet": false,
      "is_reply": false
    }
  ],
  "cursor": "next_page_cursor_here"
}
```

## Error Handling

1. **"RAPIDAPI_KEY not set"** -- The environment variable is missing. It should be in ~/.zshrc.
2. **"API returned 404"** -- The endpoint path may have changed. Check the fetch script.
3. **Parse error** -- The response structure may have changed. Note the error and continue.
4. **Empty results** -- The account may have no recent tweets, or the search returned nothing. This is normal.
5. **Large tweet IDs** -- Always quote tweet IDs to avoid JavaScript number precision issues.
6. **Rate limits** -- Space out requests if hitting limits.

**Always produce an output file**, even if all API calls failed.

## Reference Files

- `references/large-response-handling.md` -- Guide for handling large responses
- `references/response-structures.md` -- JSON paths for manual debugging
