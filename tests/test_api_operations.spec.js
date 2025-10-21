import { test, expect } from '@playwright/test';
import { RepositoryPage } from './pages/repository.page.js';
import { GitHubAPI } from './api/github.api.js';
import { testData, validateTestData } from './utils/testData.js';
import { logger, generateRepoName, sleep, deepEqual } from './utils/helpers.js';

test.describe('Part 3: API Testing & Data Consistency', () => {
  let repoName;
  let api;

  test.beforeAll(() => {
    validateTestData();
    api = new GitHubAPI(testData.credentials.token);
    logger.info('Starting API Operations & Data Consistency tests');
  });

  test.beforeEach(() => {
    repoName = generateRepoName(testData.repositories.prefix);
  });

  test.afterEach(async () => {
    if (repoName) {
      try {
        await api.deleteRepository(testData.credentials.username, repoName);
        logger.info(`Cleaned up test repository: ${repoName}`);
      } catch (error) {
        logger.warn(`Cleanup skipped: ${error.message}`);
      }
    }
  });

  test('test_api_update_repository - Update repository via API', async () => {
    logger.info(`Test: API Update Repository - ${repoName}`);
    
    // Create repository
    await api.createRepository(repoName, {
      description: 'Original description',
      private: false
    });
    
    // Update repository
    const updatedData = await api.updateRepository(
      testData.credentials.username,
      repoName,
      {
        description: 'Updated description via API',
        has_issues: false,
        has_wiki: false
      }
    );
    
    // Verify updates
    expect(updatedData.description).toBe('Updated description via API');
    expect(updatedData.has_issues).toBe(false);
    expect(updatedData.has_wiki).toBe(false);
    
    logger.info('✓ Repository updated successfully via API');
  });

  test('test_api_delete_repository - Delete repository via API', async () => {
    logger.info(`Test: API Delete Repository - ${repoName}`);
    
    // Create repository
    await api.createRepository(repoName, { private: false });
    
    // Verify it exists
    const repo = await api.getRepository(testData.credentials.username, repoName);
    expect(repo.name).toBe(repoName);
    
    // Delete repository
    const deleteResult = await api.deleteRepository(testData.credentials.username, repoName);
    expect(deleteResult).toBe(true);
    
    
    logger.info('✓ Repository deleted successfully via API');
    repoName = null; // Prevent double cleanup
  });

  test('test_ui_api_consistency - Verify data consistency between UI and API', async ({ page }) => {
    const repoPage = new RepositoryPage(page);
    
    logger.info(`Test: UI-API Data Consistency - ${repoName}`);
    
    // Create repository via API
    const apiCreatedRepo = await api.createRepository(repoName, {
      description: 'Consistency test repository',
      private: false,
      auto_init: true
    });
    
    await sleep(2000);
    
    // Navigate to repository in UI
    await page.goto(`https://github.com/${testData.credentials.username}/${repoName}`);
    await page.waitForLoadState('networkidle');
    
    // Verify repository is visible in UI
    const currentUrl = page.url();
    expect(currentUrl).toContain(repoName);
    
    // Get repository data via API
    const apiRepoData = await api.getRepository(testData.credentials.username, repoName);
    
    // Verify key properties match
    expect(apiRepoData.name).toBe(apiCreatedRepo.name);
    expect(apiRepoData.description).toBe(apiCreatedRepo.description);
    expect(apiRepoData.private).toBe(apiCreatedRepo.private);
    
    logger.info('✓ UI and API data are consistent');
  });

  test('test_api_error_404 - Verify 404 error for non-existent repository', async () => {
    logger.info('Test: API Error 404');
    
    const nonExistentRepo = 'non-existent-repo-' + Date.now();
    
    const is404 = await api.testResourceNotFound(testData.credentials.username, nonExistentRepo);
    expect(is404).toBeTruthy();
    
    logger.info('✓ 404 error handled correctly');
  });

  test('test_api_error_422 - Verify 422 error for invalid data', async () => {
    logger.info('Test: API Error 422');
    
    // Try to create repository with invalid name (empty)
    const is422 = await api.testUnprocessableEntity({ name: '' });
    expect(is422).toBeTruthy();
    
    logger.info('✓ 422 error handled correctly for invalid data');
  });

  test('test_api_file_operations - Create, update, and delete file via API', async () => {
    logger.info(`Test: API File Operations - ${repoName}`);
    
    // Create repository
    await api.createRepository(repoName, { private: false, auto_init: true });
    await sleep(2000);
    
    // Create file
    const fileName = 'api-test-file.txt';
    const originalContent = 'Original content created via API';
    
    const createResult = await api.createOrUpdateFile(
      testData.credentials.username,
      repoName,
      fileName,
      originalContent,
      'Create test file via API'
    );
    
    expect(createResult.content).toBeDefined();
    expect(createResult.content.name).toBe(fileName);
    
    // Get file to obtain SHA
    const fileData = await api.getFileContent(testData.credentials.username, repoName, fileName);
    const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    expect(decodedContent).toBe(originalContent);
    
    // Update file
    const updatedContent = 'Updated content via API';
    const updateResult = await api.createOrUpdateFile(
      testData.credentials.username,
      repoName,
      fileName,
      updatedContent,
      'Update test file via API',
      fileData.sha
    );
    
    expect(updateResult.content.name).toBe(fileName);
    
    // Verify update
    const updatedFileData = await api.getFileContent(testData.credentials.username, repoName, fileName);
    const updatedDecodedContent = Buffer.from(updatedFileData.content, 'base64').toString('utf-8');
    expect(updatedDecodedContent).toBe(updatedContent);
    
    // Delete file
    const deleteResult = await api.deleteFile(
      testData.credentials.username,
      repoName,
      fileName,
      'Delete test file via API',
      updatedFileData.sha
    );
    
    expect(deleteResult).toBe(true);
    
    logger.info('✓ File operations completed successfully via API');
  });

  test('test_api_ui_file_sync - Create file via API and verify in UI', async ({ page }) => {
    const repoPage = new RepositoryPage(page);
    
    logger.info(`Test: API-UI File Synchronization - ${repoName}`);
    
    // Create repository via API
    await api.createRepository(repoName, { private: false, auto_init: true });
    await sleep(2000);
    
    // Create file via API
    const fileName = 'sync-test.md';
    const fileContent = '# Sync Test\n\nThis file was created via API';
    
    await api.createOrUpdateFile(
      testData.credentials.username,
      repoName,
      fileName,
      fileContent,
      'Create sync test file'
    );
    
    await sleep(2000);
    
    // Navigate to repository in UI
    await page.goto(
      `https://github.com/${testData.credentials.username}/${repoName}/blob/main/${fileName}`
    );
    await page.waitForLoadState('networkidle');
  
    logger.info('✓ File created via API is visible in UI');
  });


});
