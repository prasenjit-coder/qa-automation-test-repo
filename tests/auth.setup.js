import { test as setup } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { testData } from './utils/testData.js';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.login(
    testData.credentials.username,
    testData.credentials.password
  );
  
  // Wait for login to complete
  await page.waitForURL('https://github.com/**', { timeout: 10000 });
  
  // Save authenticated state
  await page.context().storageState({ path: authFile });
});
