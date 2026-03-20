#!/usr/bin/env node

/**
 * Tweet Deduplication Script
 *
 * Tracks which tweets have been seen to avoid reporting the same tweet
 * across multiple research runs.
 *
 * Usage:
 *   node scripts/tweet_dedup.js filter <ticker> <parsed_tweets.json>
 *   node scripts/tweet_dedup.js check <ticker> <tweet_id>
 *   node scripts/tweet_dedup.js add <ticker> <tweet_id>
 *
 * Commands:
 *   filter - Takes a parsed tweets JSON file, outputs only NEW tweets, and marks them as seen.
 *            This is the main command for research workflows.
 *   check  - Check if a single tweet ID has been seen (returns "seen" or "new")
 *   add    - Mark a single tweet ID as seen
 *
 * Examples:
 *   node scripts/tweet_dedup.js filter cc parsed_output.json
 *   node scripts/tweet_dedup.js check cc 1234567890123456789
 *
 * Note: The ticker argument is accepted for compatibility but ignored.
 * All data is stored in a single file: data/seen_tweets.json
 * Retention: 30 days (older entries are pruned automatically)
 */

const fs = require('fs');
const path = require('path');

const RETENTION_DAYS = 30;

function getFilePath() {
  return path.join(__dirname, '..', 'data', 'seen_tweets.json');
}

function loadSeenTweets() {
  const filePath = getFilePath();

  if (!fs.existsSync(filePath)) {
    return { tweets: {} };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`WARNING: Could not load ${filePath}: ${err.message}. All tweets will be treated as new.`);
    return { tweets: {} };
  }
}

function saveSeenTweets(data) {
  const filePath = getFilePath();

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function pruneOldEntries(data) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const cutoffStr = cutoff.toISOString().split('T')[0]; // YYYY-MM-DD

  const pruned = { tweets: {} };

  for (const [id, dateStr] of Object.entries(data.tweets)) {
    if (dateStr >= cutoffStr) {
      pruned.tweets[id] = dateStr;
    }
  }

  return pruned;
}

function check(tweetId) {
  const data = loadSeenTweets();

  // Tweet IDs must be stored as strings to preserve precision
  const idStr = String(tweetId);

  if (data.tweets[idStr]) {
    console.log('seen');
  } else {
    console.log('new');
  }
}

function add(tweetId) {
  let data = loadSeenTweets();

  // Prune old entries before adding
  data = pruneOldEntries(data);

  // Tweet IDs must be stored as strings to preserve precision
  const idStr = String(tweetId);
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  data.tweets[idStr] = today;

  saveSeenTweets(data);
  console.log('added');
}

function filter(inputFile) {
  // Load seen tweets
  let data = loadSeenTweets();
  data = pruneOldEntries(data);

  // Read parsed tweets file
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

  const today = new Date().toISOString().split('T')[0];
  const newTweets = [];

  for (const tweet of tweets) {
    const idStr = String(tweet.id);
    if (!data.tweets[idStr]) {
      // This is a new tweet
      newTweets.push(tweet);
      // Mark it as seen
      data.tweets[idStr] = today;
    }
  }

  // Save updated seen tweets
  saveSeenTweets(data);

  // Output only new tweets
  console.log(JSON.stringify({ tweets: newTweets, total: newTweets.length, filtered: tweets.length - newTweets.length }, null, 2));
}

// Main
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: tweet_dedup.js <filter|check|add> <ticker> <file_or_id>');
  process.exit(1);
}

// ticker arg (args[1]) is accepted for CLI compatibility but ignored
const [command, ticker, arg] = args;

switch (command) {
  case 'filter':
    if (!arg) {
      console.error('Usage: tweet_dedup.js filter <ticker> <parsed_tweets.json>');
      process.exit(1);
    }
    filter(arg);
    break;
  case 'check':
    if (!arg) {
      console.error('Usage: tweet_dedup.js check <ticker> <tweet_id>');
      process.exit(1);
    }
    check(arg);
    break;
  case 'add':
    if (!arg) {
      console.error('Usage: tweet_dedup.js add <ticker> <tweet_id>');
      process.exit(1);
    }
    add(arg);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('Usage: tweet_dedup.js <filter|check|add> <ticker> <file_or_id>');
    process.exit(1);
}
