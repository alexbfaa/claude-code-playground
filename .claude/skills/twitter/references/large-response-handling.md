# Handling Large Twitter API Responses

Twitter API responses are deeply nested and often very large (150K+ characters of JSON). Since we fetch directly to files, this is handled automatically.

## How It Works

The fetch script writes raw JSON to stdout, which gets redirected to a file:

```bash
node .claude/skills/twitter/scripts/fetch_twitter.js user_tweets "username" > /tmp/cc_raw.json
```

Then the parse script reads that file and outputs clean, smaller JSON:

```bash
node .claude/skills/twitter/scripts/parse_tweets.js /tmp/cc_raw.json > /tmp/cc_parsed.json
```

## Reading Parsed Output

The parsed JSON is much smaller than the raw response (typically under 10K characters for 20 tweets). Read the parsed file, not the raw file.

If you need to inspect the raw response for debugging:
```bash
# Check file size
wc -c /tmp/cc_raw.json

# Preview the structure
python3 -c "import sys,json; d=json.load(open('/tmp/cc_raw.json')); print(json.dumps(list(d.keys()), indent=2))"
```

## Common Issues

### "Could not find timeline instructions in response"

The JSON structure doesn't match expected patterns. This can happen if:
- The API returned an error instead of tweet data
- The response format changed
- The file is corrupted or empty

**Solution**: Note the error, skip this account/search, and continue.

### Empty tweets array

The account has no recent tweets, or the search returned no results.

**Solution**: This is normal. Move on to the next account/search.
