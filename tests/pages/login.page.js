import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.loginField = '#login_field';
    this.passwordField = '#password';
    this.submitButton = 'input[type="submit"][value="Sign in"]';
    this.errorMessage = '.flash-error';
    // More robust selectors for logged-in state detection
    this.avatarMenuSelectors = [
      '[data-target="react-app.embeddedData"] img.avatar',
      'img.avatar-user',
      'summary img.avatar',
      '[aria-label="Open user navigation menu"]'
    ];
    this.signOutButton = 'button:has-text("Sign out")';
  }

  async login(username, password) {
    await this.goto('https://github.com/login');
    await this.fill(this.loginField, username);
    await this.fill(this.passwordField, password);
    await this.click(this.submitButton);
    // Wait for navigation after login, using load instead of networkidle to avoid hanging
    await this.page.waitForLoadState('load', { timeout: 30000 });
  }

  async isLoggedIn() {
    // Try multiple selectors as fallback
    for (const selector of this.avatarMenuSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 2000 });
        return true;
      } catch {
        // Continue to next selector
      }
    }
    return false;
  }

  async logout() {
    // Ensure we're on a page with the header (navigate to GitHub home if needed)
    const currentUrl = this.page.url();
    if (!currentUrl.includes('github.com') || currentUrl.includes('/login')) {
      await this.goto('https://github.com');
    }
    
    // Try different strategies to open the user menu
    let menuOpened = false;
    
    // Strategy 1: Look for summary/details dropdown
    try {
      const summaries = await this.page.$$('summary');
      for (const summary of summaries) {
        const hasAvatar = await summary.$('img.avatar, img.avatar-user');
        if (hasAvatar) {
          await summary.click();
          await this.page.waitForSelector('button:has-text("Sign out"), a:has-text("Sign out")', { timeout: 2000 });
          menuOpened = true;
          break;
        }
      }
    } catch (e) {
      // Continue to next strategy
    }
    
    // Strategy 2: Direct aria-label approach
    if (!menuOpened) {
      const ariaSelectors = [
        '[aria-label*="Open user menu"]',
        '[aria-label*="User account"]',
        'button[aria-label*="user" i]'
      ];
      
      for (const selector of ariaSelectors) {
        try {
          await this.page.click(selector, { timeout: 2000 });
          await this.page.waitForSelector('button:has-text("Sign out"), a:has-text("Sign out")', { timeout: 2000 });
          menuOpened = true;
          break;
        } catch {
          continue;
        }
      }
    }
    
    if (!menuOpened) {
      throw new Error('Could not open user menu to logout');
    }
    
    // Click Sign out from dropdown menu
    await this.page.click('button:has-text("Sign out"), a:has-text("Sign out")');
    
    // Handle intermediate "Select account to sign out" page
    try {
      // Wait for the intermediate page to load
      await this.page.waitForURL('**/logout**', { timeout: 5000 });
      
      // Click "Sign out" button for current account or "Sign out from all accounts"
      const signOutButton = await this.page.$('button:has-text("Sign out")');
      if (signOutButton) {
        await signOutButton.click();
      } else {
        // Fallback to sign out from all accounts if available
        await this.page.click('a:has-text("Sign out from all accounts")');
      }
      
      // Wait for navigation to complete after clicking
      await this.page.waitForURL('**/login**', { timeout: 10000 }).catch(() => {
        // Sometimes redirects to homepage instead of login
      });
      
    } catch (e) {
      // If intermediate page doesn't appear, might have been logged out directly
      console.log('No intermediate logout page, continuing...');
    }
    
    // Give page time to settle after logout
    await this.page.waitForTimeout(1000);
  }

  async logoutFromAllAccounts() {
    // Ensure we're on a page with the header
    const currentUrl = this.page.url();
    if (!currentUrl.includes('github.com') || currentUrl.includes('/login')) {
      await this.goto('https://github.com');
    }
    
    // Open user menu (same as logout)
    let menuOpened = false;
    
    try {
      const summaries = await this.page.$$('summary');
      for (const summary of summaries) {
        const hasAvatar = await summary.$('img.avatar, img.avatar-user');
        if (hasAvatar) {
          await summary.click();
          await this.page.waitForSelector('button:has-text("Sign out"), a:has-text("Sign out")', { timeout: 2000 });
          menuOpened = true;
          break;
        }
      }
    } catch (e) {
      // Continue
    }
    
    if (!menuOpened) {
      throw new Error('Could not open user menu to logout');
    }
    
    // Click Sign out from dropdown
    await this.page.click('button:has-text("Sign out"), a:has-text("Sign out")');
    
    // Wait for intermediate page and click "Sign out from all accounts"
    await this.page.waitForURL('**/logout**', { timeout: 5000 });
    await this.page.click('a:has-text("Sign out from all accounts")');
    
    // Wait for logout to complete
    await this.page.waitForURL('**/login**', { timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async getErrorMessage() {
    try {
      return await this.getText(this.errorMessage);
    } catch {
      return null;
    }
  }
}
