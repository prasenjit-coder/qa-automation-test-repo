export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    // Use load instead of networkidle to prevent hanging on pages with continuous network activity
    await this.page.waitForLoadState('load', { timeout: 30000 });
  }

  async click(selector, options = {}) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout: 10000, ...options });
    await this.page.click(selector);
  }

  async fill(selector, text) {
    await this.page.fill(selector, text);
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  async waitForSelector(selector, options = {}) {
    await this.page.waitForSelector(selector, options);
  }

  async screenshot(path) {
    await this.page.screenshot({ path, fullPage: true });
  }
}
