#!/usr/bin/env node

/**
 * URL Deduplication Script
 *
 * Tracks which web URLs have been seen to avoid reading the same article
 * across multiple research runs.
 *
 * Usage:
 *   node scripts/url_dedup.js filter <ticker> <urls.json>
 *   node scripts/url_dedup.js check <ticker> <url>
 *   node scripts/url_dedup.js add <ticker> <url>
 *
 * Commands:
 *   filter - Takes a JSON file of URLs, outputs only NEW ones, and marks them as seen.
 *            This is the main command for research workflows.
 *   check  - Check if a single URL has been seen (returns "seen" or "new")
 *   add    - Mark a single URL as seen
 *
 * Examples:
 *   node scripts/url_dedup.js filter cc search_results.json
 *   node scripts/url_dedup.js check cc "https://example.com/article"
 *
 * Note: The ticker argument is accepted for compatibility but ignored.
 * All data is stored in a single file: data/seen_urls.json
 * Retention: 30 days (older entries are pruned automatically)
 */

const fs = require('fs');
const path = require('path');

const RETENTION_DAYS = 30;

function getFilePath() {
  return path.join(__dirname, '..', 'data', 'seen_urls.json');
}

function normalizeUrl(url) {
  let normalized = url.trim().toLowerCase();
  // Remove trailing slash
  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  // Remove common tracking parameters
  try {
    const parsed = new URL(normalized);
    parsed.searchParams.delete('utm_source');
    parsed.searchParams.delete('utm_medium');
    parsed.searchParams.delete('utm_campaign');
    parsed.searchParams.delete('utm_content');
    parsed.searchParams.delete('utm_term');
    normalized = parsed.toString();
    // Remove trailing slash again after URL reconstruction
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
  } catch {
    // If URL parsing fails, just use the trimmed/lowered version
  }
  return normalized;
}

function loadSeenUrls() {
  const filePath = getFilePath();

  if (!fs.existsSync(filePath)) {
    return { urls: {} };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`WARNING: Could not load ${filePath}: ${err.message}. All URLs will be treated as new.`);
    return { urls: {} };
  }
}

function saveSeenUrls(data) {
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

  const pruned = { urls: {} };

  for (const [url, dateStr] of Object.entries(data.urls)) {
    if (dateStr >= cutoffStr) {
      pruned.urls[url] = dateStr;
    }
  }

  return pruned;
}

function check(url) {
  const data = loadSeenUrls();
  const normalized = normalizeUrl(url);

  if (data.urls[normalized]) {
    console.log('seen');
  } else {
    console.log('new');
  }
}

function add(url) {
  let data = loadSeenUrls();

  // Prune old entries before adding
  data = pruneOldEntries(data);

  const normalized = normalizeUrl(url);
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  data.urls[normalized] = today;

  saveSeenUrls(data);
  console.log('added');
}

function filter(inputFile) {
  // Load seen URLs
  let data = loadSeenUrls();
  data = pruneOldEntries(data);

  // Read input file
  let parsed;
  try {
    const content = fs.readFileSync(inputFile, 'utf8');
    parsed = JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${inputFile}: ${err.message}`);
    process.exit(1);
  }

  // Handle both {urls: [...]} and direct [...] format
  const urls = parsed.urls || parsed;

  if (!Array.isArray(urls)) {
    console.error('Expected urls array in input file');
    process.exit(1);
  }

  const today = new Date().toISOString().split('T')[0];
  const newUrls = [];

  for (const item of urls) {
    // Support both string URLs and objects with a url property
    const rawUrl = typeof item === 'string' ? item : item.url;
    if (!rawUrl) continue;

    const normalized = normalizeUrl(rawUrl);
    if (!data.urls[normalized]) {
      // This is a new URL
      newUrls.push(item);
      // Mark it as seen
      data.urls[normalized] = today;
    }
  }

  // Save updated seen URLs
  saveSeenUrls(data);

  // Output only new URLs
  console.log(JSON.stringify({ urls: newUrls, total: newUrls.length, filtered: urls.length - newUrls.length }, null, 2));
}

// Main
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: url_dedup.js <filter|check|add> <ticker> <url_or_file>');
  process.exit(1);
}

// ticker arg (args[1]) is accepted for CLI compatibility but ignored
const [command, ticker, arg] = args;

switch (command) {
  case 'filter':
    if (!arg) {
      console.error('Usage: url_dedup.js filter <ticker> <urls.json>');
      process.exit(1);
    }
    filter(arg);
    break;
  case 'check':
    if (!arg) {
      console.error('Usage: url_dedup.js check <ticker> <url>');
      process.exit(1);
    }
    check(arg);
    break;
  case 'add':
    if (!arg) {
      console.error('Usage: url_dedup.js add <ticker> <url>');
      process.exit(1);
    }
    add(arg);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('Usage: url_dedup.js <filter|check|add> <ticker> <url_or_file>');
    process.exit(1);
}
