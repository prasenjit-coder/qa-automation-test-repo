import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { GitHubAPI } from './api/github.api.js';
import { testData, validateTestData } from './utils/testData.js';
import { logger } from './utils/helpers.js';

test.describe('Part 1: Authentication & Session Management', () => {
  
  test.beforeAll(() => {
    validateTestData();
    logger.info('Starting Authentication & Session Management tests');
  });

  test('test_github_login_flow - Verify GitHub login flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    logger.info('Test: GitHub Login Flow');
    
    // Navigate to login page
    await loginPage.goto('https://github.com/login');
    
    // Perform login
    await loginPage.login(
      testData.credentials.username,
      testData.credentials.password
    );
    
    // Verify successful login
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    logger.info('✓ Login successful');
  });

  test('test_session_persistence - Verify session state persistence', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    
    logger.info('Test: Session Persistence');
    
    // Login
    await loginPage.login(
      testData.credentials.username,
      testData.credentials.password
    );
    
    // Save session state
    const state = await context.storageState();
    expect(state.cookies.length).toBeGreaterThan(0);
    
    // Navigate away and back
    await page.goto('https://github.com/about');
    await page.goto('https://github.com');
    
    // Verify still logged in
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    logger.info('✓ Session persisted successfully');
  });

  test('test_logout_flow - Verify logout functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    logger.info('Test: Logout Flow');
    
    // Login first
    await loginPage.login(
      testData.credentials.username,
      testData.credentials.password
    );
    
    // Verify logged in
    expect(await loginPage.isLoggedIn()).toBeTruthy();
    
    // Logout
    await loginPage.logout();
    
    // Wait for logout to complete and navigate to GitHub home to verify
    await page.waitForTimeout(1500);
    
    // Navigate to GitHub home to check logged out state
    if (page.url().includes('/login')) {
      await page.goto('https://github.com', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('load');
    }
    
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeFalsy();
    
    logger.info('✓ Logout successful');
  });

  test('test_api_authentication - Verify API token authentication', async () => {
    logger.info('Test: API Authentication');
    
    const api = new GitHubAPI(testData.credentials.token);
    
    // Test API authentication by checking rate limit
    const rateLimit = await api.checkRateLimit();
    
    expect(rateLimit).toBeDefined();
    expect(rateLimit.rate).toBeDefined();
    expect(rateLimit.rate.limit).toBeGreaterThan(0);
    
    logger.info(`✓ API authenticated successfully. Rate limit: ${rateLimit.rate.remaining}/${rateLimit.rate.limit}`);
  });

  test('test_invalid_login - Verify invalid credentials handling', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    logger.info('Test: Invalid Login');
    
    // Attempt login with invalid credentials
    await loginPage.goto('https://github.com/login');
    await loginPage.fill(loginPage.loginField, 'invaliduser');
    await loginPage.fill(loginPage.passwordField, 'invalidpassword');
    await loginPage.click(loginPage.submitButton);
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    // Verify error message or stay on login page
    const currentUrl = page.url();
    expect(currentUrl).toContain("session");
    
    logger.info('✓ Invalid login handled correctly');
  });

  test('test_api_rate_limiting - Verify API rate limit information', async () => {
    logger.info('Test: API Rate Limiting');
    
    const api = new GitHubAPI(testData.credentials.token);
    
    // Check rate limit
    const rateLimit = await api.checkRateLimit();
    
    expect(rateLimit.resources).toBeDefined();
    expect(rateLimit.resources.core).toBeDefined();
    expect(rateLimit.resources.core.limit).toBeGreaterThan(0);
    expect(rateLimit.resources.core.remaining).toBeGreaterThanOrEqual(0);
    
    logger.info(`✓ Rate limit info retrieved: ${rateLimit.resources.core.remaining}/${rateLimit.resources.core.limit}`);
  });

  test('test_invalid_token - Verify invalid token returns 401 Unauthorized', async () => {
    logger.info('Test: Invalid API Token');
    
    // Create API instance with invalid token
    const invalidToken = 'ghp_invalid_token_12345678901234567890';
    const api = new GitHubAPI(invalidToken);
    
    // Test with invalid token
    const result = await api.testInvalidToken();
    
    expect(result.success).toBeFalsy();
    expect(result.status).toBe(401);
    expect(result.message).toBeDefined();
    
    logger.info(`✓ Invalid token correctly returned 401 Unauthorized: ${result.message}`);
  });
});
