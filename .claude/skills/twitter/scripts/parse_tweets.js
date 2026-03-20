#!/usr/bin/env node
/**
 * Twitter API Response Parser
 * Extracts tweet data from RapidAPI TwttrAPI responses
 *
 * Parses raw Twitter API responses into clean structured JSON.
 *
 * Usage: node parse_tweets.js <json_file> [output_format]
 * Formats: json (default), csv, summary
 *
 * Handles:
 * - MCP wrapper format: [{type: "text", text: "..."}]
 * - User_Tweets responses
 * - Search_Top / Search_Latest responses
 * - Missing or malformed entries (skips gracefully)
 */

const fs = require('fs');
const path = require('path');

function extractTweets(data) {
    const tweets = [];

    // Handle MCP wrapper format: [{type: "text", text: "..."}]
    if (Array.isArray(data) && data[0]?.type === 'text') {
        data = JSON.parse(data[0].text);
    }

    // Handle User_Tweets response structure (RapidAPI TwttrAPI format)
    let instructions = data?.data?.user_result?.result?.timeline_response?.timeline?.instructions;

    // Fallback: older format
    if (!instructions) {
        instructions = data?.data?.user?.result?.timeline_v2?.timeline?.instructions;
    }

    // Handle Search response structure (RapidAPI format)
    if (!instructions) {
        instructions = data?.data?.search?.timeline_response?.timeline?.instructions;
    }

    // Fallback: older search format
    if (!instructions) {
        instructions = data?.data?.search_by_raw_query?.search_timeline?.timeline?.instructions;
    }

    // Handle Conversation response structure
    if (!instructions) {
        instructions = data?.data?.timeline_response?.instructions;
    }

    if (!instructions) {
        console.error('Could not find timeline instructions in response');
        return { tweets: [], cursor: null };
    }

    let cursor = null;

    for (const instruction of instructions) {
        // Handle TimelineAddEntries
        const entries = instruction.entries || [];
        for (const entry of entries) {
            processTweetEntry(entry, tweets);

            // Handle conversation thread modules (items[] inside a module entry)
            if (entry.content?.items) {
                for (const moduleItem of entry.content.items) {
                    if (moduleItem.item?.content?.tweetResult) {
                        const tweet = extractTweetData(moduleItem.item.content.tweetResult.result);
                        if (tweet) tweets.push(tweet);
                    }
                }
            }

            // Check for cursor
            if (entry.content?.cursorType === 'Bottom') {
                cursor = entry.content.value;
            }
        }

        // Handle TimelinePinEntry (pinned tweets)
        if (instruction.entry) {
            processTweetEntry(instruction.entry, tweets);
        }
    }

    return { tweets, cursor };
}

function processTweetEntry(entry, tweets) {
    // Format 1: content.content.tweetResult.result (RapidAPI format)
    let tweetResult = entry.content?.content?.tweetResult?.result;

    // Format 2: content.itemContent.tweet_results.result (older format)
    if (!tweetResult) {
        tweetResult = entry.content?.itemContent?.tweet_results?.result;
    }

    if (!tweetResult) return;

    const tweet = extractTweetData(tweetResult);
    if (tweet) tweets.push(tweet);
}

function extractTweetData(result) {
    try {
        const legacy = result.legacy;
        if (!legacy) return null;

        // Handle both formats: user_result (RapidAPI) and user_results (older)
        const userResult = result.core?.user_result?.result || result.core?.user_results?.result;
        const userLegacy = userResult?.legacy;

        return {
            id: result.rest_id,
            text: legacy.full_text,
            created_at: legacy.created_at,
            retweets: legacy.retweet_count,
            likes: legacy.favorite_count,
            replies: legacy.reply_count,
            quotes: legacy.quote_count,
            author: {
                username: userLegacy?.screen_name,
                display_name: userLegacy?.name,
                verified: userResult?.is_blue_verified || false
            },
            is_retweet: !!legacy.retweeted_status_result,
            is_reply: !!legacy.in_reply_to_status_id_str
        };
    } catch (e) {
        return null;
    }
}

function formatOutput(result, format) {
    const { tweets, cursor } = result;

    if (format === 'summary') {
        console.log(`Found ${tweets.length} tweets`);
        console.log(`Next cursor: ${cursor || 'none'}`);
        console.log('\nTweets:');
        tweets.forEach((t, i) => {
            const preview = t.text.substring(0, 80).replace(/\n/g, ' ');
            console.log(`${i + 1}. @${t.author.username}: ${preview}...`);
        });
        return;
    }

    if (format === 'csv') {
        console.log('id,username,created_at,text,likes,retweets');
        tweets.forEach(t => {
            const text = t.text.replace(/"/g, '""').replace(/\n/g, ' ');
            console.log(`"${t.id}","${t.author.username}","${t.created_at}","${text}",${t.likes},${t.retweets}`);
        });
        return;
    }

    // Default: JSON
    console.log(JSON.stringify({ tweets, cursor }, null, 2));
}

// Main
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: node parse_tweets.js <json_file> [format]');
    console.log('Formats: json (default), csv, summary');
    process.exit(1);
}

const filePath = args[0].replace('~', process.env.HOME || process.env.USERPROFILE);
const format = args[1] || 'json';

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    const result = extractTweets(data);
    formatOutput(result, format);
} catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
}
