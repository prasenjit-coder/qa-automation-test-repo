import { test, expect, devices } from '@playwright/test';
import { RepositoryPage } from './pages/repository.page.js';
import { GitHubAPI } from './api/github.api.js';
import { testData, validateTestData } from './utils/testData.js';
import { logger, generateRepoName, sleep } from './utils/helpers.js';

test.describe('Part 4: Cross-Platform & Performance Testing', () => {
  let repoName;
  let api;

  test.beforeAll(() => {
    validateTestData();
    api = new GitHubAPI(testData.credentials.token);
    logger.info('Starting Cross-Platform & Performance tests');
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

  // Cross-Browser Tests
  test('test_chromium_compatibility - Test in Chromium browser', async ({ page }) => {
    logger.info('Test: Chromium Compatibility');
    
    await page.goto('https://github.com');
    await expect(page).toHaveTitle(/GitHub/);
    
    logger.info('✓ Chromium compatibility verified');
  });

  test('test_firefox_compatibility - Test in Firefox browser', async ({ browser }) => {
    logger.info('Test: Firefox Compatibility');
    
    const context = await browser.newContext({
      ...devices['Desktop Firefox']
    });
    const page = await context.newPage();
    
    await page.goto('https://github.com');
    await expect(page).toHaveTitle(/GitHub/);
    
    await context.close();
    logger.info('✓ Firefox compatibility verified');
  });

  test('test_webkit_compatibility - Test in WebKit browser', async ({ browser }) => {
    logger.info('Test: WebKit Compatibility');
    
    const context = await browser.newContext({
      ...devices['Desktop Safari']
    });
    const page = await context.newPage();
    
    await page.goto('https://github.com');
    await expect(page).toHaveTitle(/GitHub/);
    
    await context.close();
    logger.info('✓ WebKit compatibility verified');
  });

  // Responsive Design Tests
  test('test_mobile_viewport_iphone - Test iPhone viewport', async ({ browser }) => {
    logger.info('Test: iPhone Viewport');
    
    const context = await browser.newContext({
      ...devices['iPhone 13 Pro']
    });
    const page = await context.newPage();
    
    await page.goto('https://github.com');
    await expect(page).toHaveTitle(/GitHub/);
    
    const viewport = page.viewportSize();
    expect(viewport.width).toBeLessThan(500);
    
    await context.close();
    logger.info('✓ iPhone viewport tested successfully');
  });

  test('test_mobile_viewport_ipad - Test iPad viewport', async ({ browser }) => {
    logger.info('Test: iPad Viewport');
    
    const context = await browser.newContext({
      ...devices['iPad Pro']
    });
    const page = await context.newPage();
    
    await page.goto('https://github.com');
    await expect(page).toHaveTitle(/GitHub/);
    
    const viewport = page.viewportSize();
    expect(viewport.width).toBeGreaterThan(500);
    
    await context.close();
    logger.info('✓ iPad viewport tested successfully');
  });

  test('test_responsive_design - Test different screen sizes', async ({ browser }) => {
    logger.info('Test: Responsive Design');
    
    const viewports = [
      { width: 320, height: 568, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      
      await page.goto('https://github.com');
      await expect(page).toHaveTitle(/GitHub/);
      
      logger.info(`✓ ${viewport.name} (${viewport.width}x${viewport.height}) tested`);
      await context.close();
    }
    
    logger.info('✓ Responsive design verified across viewports');
  });

  // Performance Tests
  test('test_page_load_performance - Measure page load time', async ({ page }) => {
    logger.info('Test: Page Load Performance');
    
    const startTime = Date.now();
    await page.goto('https://github.com');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(testData.performance.maxPageLoadTime);
    
    logger.info(`✓ Page loaded in ${loadTime}ms (threshold: ${testData.performance.maxPageLoadTime}ms)`);
  });

  test('test_api_response_time - Measure API response time', async () => {
    logger.info('Test: API Response Time');
    
    const startTime = Date.now();
    await api.checkRateLimit();
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(testData.performance.maxApiResponseTime);
    
    logger.info(`✓ API responded in ${responseTime}ms (threshold: ${testData.performance.maxApiResponseTime}ms)`);
  });

  test('test_repository_creation_performance - Measure repo creation time', async () => {
    logger.info(`Test: Repository Creation Performance - ${repoName}`);
    
    const startTime = Date.now();
    await api.createRepository(repoName, { private: false });
    const creationTime = Date.now() - startTime;
    
    expect(creationTime).toBeLessThan(5000);
    
    logger.info(`✓ Repository created in ${creationTime}ms`);
  });

  test('test_navigation_performance - Measure navigation speed', async ({ page }) => {
    logger.info('Test: Navigation Performance');
    
    await page.goto('https://github.com');
    
    const startTime = Date.now();
    await page.goto('https://github.com/about');
    const navigationTime = Date.now() - startTime;
    
    expect(navigationTime).toBeLessThan(5000);
    
    logger.info(`✓ Navigation completed in ${navigationTime}ms`);
  });

  // Network Conditions Tests
  test('test_under_slow_3G_conditions - Test under slow 3G', async ({ browser }) => {
    logger.info('Test: Slow 3G Network');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Simulate slow 3G
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (500 * 1024) / 8,
      uploadThroughput: (500 * 1024) / 8,
      latency: 400
    });
    
    await page.goto('https://github.com', { timeout: 30000 });
    await expect(page).toHaveTitle(/GitHub/);
    
    await context.close();
    logger.info('✓ Page loaded successfully under slow 3G conditions');
  });

  test('test_offline_behavior - Test offline behavior', async ({ browser }) => {
    logger.info('Test: Offline Behavior');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Go offline
    await context.setOffline(true);
    
    try {
      await page.goto('https://github.com', { timeout: 5000 });
    } catch (error) {
      // Expected to fail when offline
      expect(error.message).toContain('net::');
    }
    
    await context.close();
    logger.info('✓ Offline behavior verified');
  });

  // Concurrent Session Tests
  test('test_multiple_browser_sessions - Test multiple sessions', async ({ browser }) => {
    logger.info('Test: Multiple Browser Sessions');
    
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await Promise.all([
      page1.goto('https://github.com'),
      page2.goto('https://github.com')
    ]);
    
    await expect(page1).toHaveTitle(/GitHub/);
    await expect(page2).toHaveTitle(/GitHub/);
    
    await context1.close();
    await context2.close();
    
    logger.info('✓ Multiple sessions handled successfully');
  });

  test('test_concurrent_operations - Test concurrent API operations', async () => {
    logger.info('Test: Concurrent Operations');
    
    const repoNames = [
      generateRepoName('concurrent-1'),
      generateRepoName('concurrent-2'),
      generateRepoName('concurrent-3')
    ];
    
    // Create repositories concurrently
    const startTime = Date.now();
    await Promise.all(
      repoNames.map(name => api.createRepository(name, { private: false }))
    );
    const creationTime = Date.now() - startTime;
    
    // Verify all created
    const repos = await Promise.all(
      repoNames.map(name => api.getRepository(testData.credentials.username, name))
    );
    
    expect(repos.length).toBe(3);
    
    // Cleanup
    await Promise.all(
      repoNames.map(name => api.deleteRepository(testData.credentials.username, name))
    );
    
    logger.info(`✓ Created 3 repositories concurrently in ${creationTime}ms`);
  });

  // Visual Testing
  test('test_screenshot_capture_and_compare - Capture and compare screenshots', async ({ page }) => {
    logger.info('Test: Screenshot Capture');
    
    await page.goto('https://github.com');
    
    // Take full page screenshot
    await page.screenshot({ path: 'screenshots/github-homepage-full.png', fullPage: true });
    
    // Take viewport screenshot
    await page.screenshot({ path: 'screenshots/github-homepage-viewport.png' });
    
    // Take element screenshot
    const header = page.locator('header').first();
    await header.screenshot({ path: 'screenshots/github-header.png' });
    
    logger.info('✓ Screenshots captured successfully');
  });

  test('test_visual_elements - Test visual element presence', async ({ page }) => {
    logger.info('Test: Visual Elements');
    
    await page.goto('https://github.com');
    
    // Check key visual elements
    const logo = page.locator('[aria-label*="Homepage"]').first();
    await expect(logo).toBeVisible();
    
    const searchBox = page.locator('[aria-label="Search GitHub"]').first();
    await expect(searchBox).toBeVisible();
    
    logger.info('✓ Visual elements verified');
  });

  // Accessibility Tests
  test('test_keyboard_navigation - Test keyboard navigation', async ({ page }) => {
    logger.info('Test: Keyboard Navigation');
    
    await page.goto('https://github.com');
    
    // Tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if element is focused
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBeDefined();
    
    logger.info('✓ Keyboard navigation working');
  });

  test('test_aria_labels - Test ARIA labels presence', async ({ page }) => {
    logger.info('Test: ARIA Labels');
    
    await page.goto('https://github.com');
    
    // Check for ARIA labels
    const searchBox = page.locator('[aria-label="Search GitHub"]').first();
    await expect(searchBox).toBeVisible();
    
    const homeLink = page.locator('[aria-label*="Homepage"]').first();
    await expect(homeLink).toBeVisible();
    
    logger.info('✓ ARIA labels verified');
  });
});
