# Twitter API Response Structures

JSON paths for extracting data from RapidAPI TwttrAPI responses. Use this for debugging when the parsing script fails.

## MCP Response Wrapper

All MCP tool responses are wrapped:
```json
[{"type": "text", "text": "{...actual JSON...}"}]
```

Parse the wrapper first: `JSON.parse(response[0].text)`

## User_Tweets Response

Path to timeline instructions:
```
data.user_result.result.timeline_response.timeline.instructions
```

Fallback (older format):
```
data.user.result.timeline_v2.timeline.instructions
```

### Instruction Types

| Type | Contains |
|------|----------|
| `TimelineClearCache` | No data (skip) |
| `TimelinePinEntry` | Pinned tweet in `.entry` |
| `TimelineAddEntries` | Regular tweets in `.entries[]` |

### Tweet Data Path

From each entry:
```
entry.content.content.tweetResult.result
```

Fallback:
```
entry.content.itemContent.tweet_results.result
```

### Key Fields Per Tweet

| Field | Path from tweetResult.result |
|-------|------------------------------|
| Tweet ID | `.rest_id` |
| Tweet Text | `.legacy.full_text` |
| Created At | `.legacy.created_at` |
| Retweet Count | `.legacy.retweet_count` |
| Like Count | `.legacy.favorite_count` |
| Reply Count | `.legacy.reply_count` |
| Quote Count | `.legacy.quote_count` |
| Author Username | `.core.user_result.result.legacy.screen_name` |
| Author Display Name | `.core.user_result.result.legacy.name` |
| Blue Verified | `.core.user_result.result.is_blue_verified` |

### Pagination Cursor

Look for entries where `content.cursorType` equals `"Bottom"`:
```
entry.content.value  (when cursorType === "Bottom")
```

## Search_Top / Search_Latest Response

Path to timeline instructions:
```
data.search.timeline_response.timeline.instructions
```

Fallback:
```
data.search_by_raw_query.search_timeline.timeline.instructions
```

Tweet fields are the same once you reach `tweetResult.result`.

## Get_Conversation Response

Path to timeline instructions:
```
data.timeline_response.instructions
```

The first entry (entry 0) is the original tweet, using the same format as User_Tweets:
```
entry.content.content.tweetResult.result
```

Remaining entries are conversation threads (`TimelineTimelineModule`), each containing reply tweets in `items[]`:
```
entry.content.items[].item.content.tweetResult.result
```

Tweet fields inside `tweetResult.result` are the same as User_Tweets/Search.

Pagination cursor is in the last entry where `content.cursorType === "Bottom"`:
```
entry.content.value
```

## Notes

- Timeline may include promoted/ad tweets from other accounts
- Some tweets may be unavailable (deleted, private) and will have empty `tweetResult`
- Retweets have the original tweet nested inside `legacy.retweeted_status_result`
- The parsing script handles all these variations automatically
