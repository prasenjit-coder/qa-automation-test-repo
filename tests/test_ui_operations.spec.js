import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { RepositoryPage } from './pages/repository.page.js';
import { GitHubAPI } from './api/github.api.js';
import { testData, validateTestData } from './utils/testData.js';
import { logger, generateRepoName, sleep } from './utils/helpers.js';

test.describe('Part 2: Repository Operations (UI)', () => {
  let repoName;
  let api;

  test.beforeAll(() => {
    validateTestData();
    api = new GitHubAPI(testData.credentials.token);
    logger.info('Starting Repository Operations (UI) tests');
  });

  test.beforeEach(async ({ page }) => {
    repoName = generateRepoName(testData.repositories.prefix);
    
    // Login before each test using LoginPage
    const loginPage = new LoginPage(page);
    await loginPage.login(
      testData.credentials.username,
      testData.credentials.password
    );
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

  // test('test_create_repository - Create repository via UI', async ({ page }) => {
  //   const repoPage = new RepositoryPage(page);
    
  //   logger.info(`Test: Create Repository - ${repoName}`);
    
  //   // Create repository
  //   await repoPage.createRepository(repoName, 'Test repository created via UI');    
  //   // Verify via API
  //   const repo = await api.getRepository(testData.credentials.username, repoName);
  //   expect(repo.name).toBe(repoName);
    
  //   logger.info('✓ Repository created successfully via UI');
  // });

  test('test_repository_settings - Update repository settings', async ({ page }) => {
    const repoPage = new RepositoryPage(page);
    
    logger.info(`Test: Repository Settings - ${repoName}`);
    
    // Create repository first
    await repoPage.createRepository(repoName);
    await sleep(2000);
    const newName = `${repoName}-renamed`;
    await repoPage.renameRepository(
      testData.credentials.username,
      repoName,
      newName
    );
    await sleep(2000);
    const repo = await api.getRepository(testData.credentials.username, newName);
    expect(repo.name).toBe(newName);
    repoName = newName;
    logger.info('✓ Repository renamed successfully');
  });

  // test('test_delete_repository - Delete repository via UI', async ({ page }) => {
  //   const repoPage = new RepositoryPage(page);
    
  //   logger.info(`Test: Delete Repository - ${repoName}`);
    
  //   // Create repository first
  //   await api.createRepository(repoName, { private: false });
  //   await sleep(2000);
    
  //   // Delete via UI
  //   await repoPage.deleteRepository(testData.credentials.username, repoName);
    
  //   // Verify deletion
  //   await sleep(2000);
  //   const notFound = await api.testResourceNotFound(testData.credentials.username, repoName);
  //   expect(notFound).toBeTruthy();
    
  //   logger.info('✓ Repository deleted successfully via UI');
  //   repoName = null; // Prevent double cleanup
  // });

  // test('test_file_upload - Create file via web editor', async ({ page }) => {
  //   const repoPage = new RepositoryPage(page);
    
  //   logger.info(`Test: File Upload - ${repoName}`);
    
  //   // Create repository with README
  //   await api.createRepository(repoName, { private: false, auto_init: true });
  //   await sleep(2000);
    
  //   // Create file via UI
  //   const fileName = 'test-file.txt';
  //   const fileContent = 'This is a test file created via UI';
  //   await repoPage.createFile(testData.credentials.username, repoName, fileName, fileContent);
    
  //   // Verify file exists via API
  //   await sleep(2000);
  //   const fileData = await api.getFileContent(testData.credentials.username, repoName, fileName);
  //   expect(fileData.name).toBe(fileName);
    
  //   logger.info('✓ File created successfully via UI');
  // });

  // test('test_file_editing - Edit file via web editor', async ({ page }) => {
  //   const repoPage = new RepositoryPage(page);
    
  //   logger.info(`Test: File Editing - ${repoName}`);
    
  //   // Create repository with README
  //   await api.createRepository(repoName, { private: false, auto_init: true });
  //   await sleep(2000);
    
  //   // Navigate to README file
  //   await page.goto(`https://github.com/${testData.credentials.username}/${repoName}`);
    
  //   // Click edit button
  //   const editButton = page.locator('a[aria-label="Edit file"]').first();
  //   if (await editButton.isVisible()) {
  //     await editButton.click();
  //     await page.waitForLoadState('networkidle');
      
  //     logger.info('✓ File editor opened successfully');
  //   }
  // });

  // test('test_multiple_files - Create multiple files', async ({ page }) => {
  //   const repoPage = new RepositoryPage(page);
    
  //   logger.info(`Test: Multiple Files - ${repoName}`);
    
  //   // Create repository
  //   await api.createRepository(repoName, { private: false, auto_init: true });
  //   await sleep(2000);
    
  //   // Create first file
  //   await repoPage.createFile(
  //     testData.credentials.username,
  //     repoName,
  //     'file1.txt',
  //     'Content of file 1'
  //   );
  //   await sleep(2000);
    
  //   // Create second file
  //   await repoPage.createFile(
  //     testData.credentials.username,
  //     repoName,
  //     'file2.txt',
  //     'Content of file 2'
  //   );
    
  //   // Verify both files exist
  //   await sleep(2000);
  //   const file1 = await api.getFileContent(testData.credentials.username, repoName, 'file1.txt');
  //   const file2 = await api.getFileContent(testData.credentials.username, repoName, 'file2.txt');
    
  //   expect(file1.name).toBe('file1.txt');
  //   expect(file2.name).toBe('file2.txt');
    
  //   logger.info('✓ Multiple files created successfully');
  // });

  // test('test_repository_readme - Verify README rendering', async ({ page }) => {
  //   const repoPage = new RepositoryPage(page);
    
  //   logger.info(`Test: README Rendering - ${repoName}`);
    
  //   // Create repository with README
  //   await api.createRepository(repoName, {
  //     private: false,
  //     auto_init: true,
  //     description: 'Test repository with README'
  //   });
  //   await sleep(2000);
    
  //   // Navigate to repository
  //   await page.goto(`https://github.com/${testData.credentials.username}/${repoName}`);
    
  //   // Verify README is visible
  //   const readmeContent = page.locator('#readme');
  //   await expect(readmeContent).toBeVisible();
    
  //   logger.info('✓ README rendered successfully');
  // });
});
