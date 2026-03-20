#!/usr/bin/env node
/**
 * Direct RapidAPI Twitter Fetcher
 * Replaces MCP tools with direct HTTP calls to the TwttrAPI endpoint.
 *
 * Usage:
 *   node fetch_twitter.js user_tweets <username> [cursor]
 *   node fetch_twitter.js search_top <query> [cursor]
 *   node fetch_twitter.js search_latest <query> [cursor]
 *   node fetch_twitter.js get_user <username>
 *   node fetch_twitter.js get_conversation <tweet_id> [cursor]
 *
 * Environment:
 *   RAPIDAPI_KEY - Your RapidAPI key (required)
 *
 * Output: Raw JSON to stdout (pipe to parse_tweets.js for clean format)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_HOST = 'twttrapi.p.rapidapi.com';

function loadApiKey() {
    if (process.env.RAPIDAPI_KEY) return process.env.RAPIDAPI_KEY;

    // Fallback: read from .env at project root (4 dirs up from this script)
    const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');
    const envPath = path.join(projectRoot, '.env');
    try {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (trimmed.startsWith('#') || !trimmed) continue;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            const key = trimmed.substring(0, eqIndex).trim();
            const value = trimmed.substring(eqIndex + 1).trim();
            if (key === 'RAPIDAPI_KEY') return value;
        }
    } catch (e) {
        // .env file doesn't exist or can't be read
    }
    return null;
}

const API_KEY = loadApiKey();

if (!API_KEY) {
    console.error('Error: RAPIDAPI_KEY is not set.');
    console.error('Set it as an environment variable or add it to a .env file at the project root.');
    process.exit(1);
}

const ENDPOINTS = {
    user_tweets: { method: 'GET', path: '/user-tweets', paramKey: 'username' },
    search_top: { method: 'GET', path: '/search-top', paramKey: 'query' },
    search_latest: { method: 'GET', path: '/search-latest', paramKey: 'query' },
    get_user: { method: 'GET', path: '/get-user', paramKey: 'username' },
    get_conversation: { method: 'GET', path: '/get-tweet-conversation', paramKey: 'tweet_id' },
};

function makeRequest(endpoint, params) {
    return new Promise((resolve, reject) => {
        const queryParts = [];
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }
        const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

        const options = {
            hostname: API_HOST,
            path: `${endpoint.path}${queryString}`,
            method: endpoint.method,
            headers: {
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': API_KEY,
            },
        };

        const req = https.request(options, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                if (res.statusCode !== 200) {
                    reject(new Error(`API returned ${res.statusCode}: ${body.substring(0, 500)}`));
                    return;
                }
                resolve(body);
            });
        });

        req.on('error', (err) => reject(err));
        req.end();
    });
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: node fetch_twitter.js <command> <value> [cursor] [count]');
        console.error('');
        console.error('Commands:');
        console.error('  user_tweets <username> [cursor]');
        console.error('  search_top <query> [cursor]');
        console.error('  search_latest <query> [cursor]');
        console.error('  get_user <username>');
        console.error('  get_conversation <tweet_id> [cursor]');
        process.exit(1);
    }

    const command = args[0];
    const value = args[1];
    const cursor = args[2] || undefined;
    const count = args[3] || undefined;

    const endpoint = ENDPOINTS[command];
    if (!endpoint) {
        console.error(`Unknown command: ${command}`);
        console.error(`Available: ${Object.keys(ENDPOINTS).join(', ')}`);
        process.exit(1);
    }

    const params = { [endpoint.paramKey]: value };
    if (cursor) params.cursor = cursor;
    if (count) params.count = count;

    try {
        const result = await makeRequest(endpoint, params);
        // Output raw JSON -- pipe to parse_tweets.js for clean format
        process.stdout.write(result);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

main();
