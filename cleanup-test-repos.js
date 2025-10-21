#!/usr/bin/env node

/**
 * Cleanup Script for Test Repositories
 * 
 * This script removes all test repositories created by the automation framework.
 * It's useful for cleaning up any leftover test data.
 * 
 * Usage: node cleanup-test-repos.js
 */

import dotenv from 'dotenv';
import { GitHubAPI } from './tests/api/github.api.js';
import { logger } from './tests/utils/helpers.js';

// Load environment variables
dotenv.config({ path: './tests/.env' });

const PREFIX = process.env.TEST_REPO_PREFIX || 'test-automation-repo';
const USERNAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN;

async function cleanupTestRepositories() {
  console.log('🧹 Test Repository Cleanup Tool');
  console.log('================================\n');

  // Validate credentials
  if (!USERNAME || !TOKEN) {
    console.error('❌ Missing credentials in tests/.env file');
    console.error('   Required: GITHUB_USERNAME, GITHUB_TOKEN\n');
    process.exit(1);
  }

  try {
    const api = new GitHubAPI(TOKEN);
    
    console.log(`👤 User: ${USERNAME}`);
    console.log(`🔍 Looking for repositories with prefix: ${PREFIX}\n`);

    // Get all repositories
    const repos = await api.listRepositories(USERNAME);
    
    // Filter test repositories
    const testRepos = repos.filter(repo => repo.name.startsWith(PREFIX));

    if (testRepos.length === 0) {
      console.log('✅ No test repositories found. Nothing to clean up.\n');
      return;
    }

    console.log(`📋 Found ${testRepos.length} test repositories:\n`);
    testRepos.forEach((repo, index) => {
      console.log(`   ${index + 1}. ${repo.name} (${repo.private ? 'private' : 'public'})`);
    });

    console.log('\n⚠️  These repositories will be deleted.');
    console.log('⏳ Starting cleanup in 3 seconds...\n');

    // Wait 3 seconds before deletion
    await new Promise(resolve => setTimeout(resolve, 3000));

    let deleted = 0;
    let failed = 0;

    for (const repo of testRepos) {
      try {
        await api.deleteRepository(USERNAME, repo.name);
        console.log(`✓ Deleted: ${repo.name}`);
        deleted++;
      } catch (error) {
        console.error(`✗ Failed to delete ${repo.name}: ${error.message}`);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Cleanup complete!`);
    console.log(`   Deleted: ${deleted}`);
    console.log(`   Failed: ${failed}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    logger.error(`Cleanup failed: ${error.message}`);
    process.exit(1);
  }
}

// Confirmation prompt
console.log('⚠️  WARNING: This will DELETE all test repositories!');
console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

setTimeout(() => {
  cleanupTestRepositories();
}, 5000);
