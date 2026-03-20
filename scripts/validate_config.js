#!/usr/bin/env node

/**
 * Config Validator
 *
 * Validates config/topics.json before a research run.
 * Checks required fields, structure, and sensible values.
 *
 * Usage:
 *   node scripts/validate_config.js
 *
 * Exit codes:
 *   0 - Config is valid
 *   1 - Config has errors
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'topics.json');

function validate() {
  // Check file exists
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('ERROR: config/topics.json not found');
    process.exit(1);
  }

  // Parse JSON
  let config;
  try {
    const content = fs.readFileSync(CONFIG_PATH, 'utf8');
    config = JSON.parse(content);
  } catch (err) {
    console.error(`ERROR: Could not parse config/topics.json: ${err.message}`);
    process.exit(1);
  }

  const errors = [];
  const warnings = [];

  // Required fields
  if (!config.name) errors.push('Missing "name" field');
  if (!config.research_modules) errors.push('Missing "research_modules" array');
  if (!Array.isArray(config.research_modules)) errors.push('"research_modules" must be an array');

  // Web config
  if (config.research_modules?.includes('web')) {
    if (!config.web) errors.push('research_modules includes "web" but no "web" config found');
    if (!config.web?.keywords?.length) errors.push('web.keywords is empty -- need at least one keyword');
    if (!config.web?.focus_areas?.length) warnings.push('web.focus_areas is empty -- searches may be too broad');
  }

  // Twitter config
  if (config.research_modules?.includes('twitter-accounts')) {
    if (!config.twitter) errors.push('research_modules includes "twitter-accounts" but no "twitter" config found');
    if (!config.twitter?.accounts?.length) warnings.push('twitter.accounts is empty -- twitter-accounts module will be skipped');
  }

  if (config.research_modules?.includes('twitter-search')) {
    if (!config.twitter) errors.push('research_modules includes "twitter-search" but no "twitter" config found');
    if (!config.twitter?.core_search_terms?.length) errors.push('twitter.core_search_terms is empty -- need at least one search term');
  }

  // Domains
  if (!config.domains?.length) errors.push('Missing or empty "domains" array');

  // Report
  if (errors.length > 0) {
    console.error('Config validation FAILED:');
    errors.forEach(e => console.error(`  ERROR: ${e}`));
    warnings.forEach(w => console.warn(`  WARNING: ${w}`));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log('Config valid with warnings:');
    warnings.forEach(w => console.warn(`  WARNING: ${w}`));
  } else {
    console.log('Config valid.');
  }

  // Summary
  console.log(`  Name: ${config.name}`);
  console.log(`  Modules: ${config.research_modules.join(', ')}`);
  console.log(`  Web keywords: ${config.web?.keywords?.length || 0}`);
  console.log(`  Twitter accounts: ${config.twitter?.accounts?.length || 0}`);
  console.log(`  Twitter search terms: ${config.twitter?.core_search_terms?.length || 0}`);
  console.log(`  Domains: ${config.domains?.length || 0}`);
}

validate();
