#!/usr/bin/env node

/**
 * Engagement Filter Script
 *
 * Filters parsed tweets by engagement thresholds.
 * Use this on search results to remove low-quality/spam tweets.
 *
 * Usage:
 *   node scripts/filter_engagement.js <parsed_tweets.json> [min_likes] [min_total]
 *
 * Arguments:
 *   parsed_tweets.json - Output from parse_tweets.js
 *   min_likes          - Minimum likes to include (default: 10)
 *   min_total          - Minimum total engagement to include (default: 25)
 *
 * A tweet passes if it has >= min_likes OR >= min_total engagement.
 * Total engagement = likes + retweets + replies + quotes
 *
 * Examples:
 *   node scripts/filter_engagement.js parsed.json           # defaults: 10 likes or 25 total
 *   node scripts/filter_engagement.js parsed.json 5 15      # lower thresholds
 *   node scripts/filter_engagement.js parsed.json 0 0       # no filtering (pass all)
 */

const fs = require('fs');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: filter_engagement.js <parsed_tweets.json> [min_likes] [min_total]');
  process.exit(1);
}

const [inputFile, minLikesArg, minTotalArg] = args;
const minLikes = parseInt(minLikesArg) || 10;
const minTotal = parseInt(minTotalArg) || 25;

// Read parsed tweets
let parsed;
try {
  const content = fs.readFileSync(inputFile, 'utf8');
  parsed = JSON.parse(content);
} catch (err) {
  console.error(`Error reading ${inputFile}: ${err.message}`);
  process.exit(1);
}

// Handle both {tweets: [...]} and direct [...] format
const tweets = parsed.tweets || parsed;

if (!Array.isArray(tweets)) {
  console.error('Expected tweets array in input file');
  process.exit(1);
}

const filtered = tweets.filter(tweet => {
  const likes = tweet.likes || 0;
  const retweets = tweet.retweets || 0;
  const replies = tweet.replies || 0;
  const quotes = tweet.quotes || 0;
  const total = likes + retweets + replies + quotes;

  return likes >= minLikes || total >= minTotal;
});

console.log(JSON.stringify({
  tweets: filtered,
  total: filtered.length,
  removed: tweets.length - filtered.length
}, null, 2));
