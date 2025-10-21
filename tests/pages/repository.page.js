import { BasePage } from './base.page.js';
import { logger } from '../utils/helpers.js';

export class RepositoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.newRepoButton = 'a[href="/new"]';
    this.repoNameInput = "#repository-name-input";
    this.repoDescriptionInput = 'input[name="Description"]';
    this.privateRepoRadio = 'input[value="private"]';
    this.publicRepoRadio = 'input[value="public"]';
    this.createRepoButton =
      'button[type="submit"]:has-text("Create repository")';
    this.settingsTab = "#settings-tab";
    this.deleteRepoButton = 'summary:has-text("Delete this repository")';
    this.confirmDeleteButton =
      'button:has-text("I want to delete this repository")';
    this.confirmInput = "#verification_field";
  }

  async uploadFile(owner, repo, filePath) {
    await this.goToRepository(owner, repo);
    const emptyUploadLink = this.page.getByRole("link", { name: /uploading an existing file/i });
    if ((await emptyUploadLink.count()) > 0) {
      await emptyUploadLink.first().click();
    } else {
      await this.page.getByRole("button", { name: /add file/i }).click().catch(async () => {
        await this.page.click('summary:has-text("Add file")');
      });
      const uploadMenuItem = this.page.getByRole("menuitem", { name: /upload files/i }).or(
        this.page.locator('a:has-text("Upload files")')
      );
      await uploadMenuItem.first().click();
    }
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    const commitBtn = this.page.getByRole("button", { name: /commit changes/i }).or(
      this.page.locator('button:has-text("Commit changes")')
    );
    await commitBtn.first().click();
    await this.page.waitForLoadState("load", { timeout: 30000 });
  }

  async createRepository(name, description = "", isPrivate = false) {
    // Navigate to new repository page
    await this.goto("https://github.com/new");

    // Fill repository name using more reliable selector
    const nameInput = this.page.getByRole("textbox", {
      name: /repository name/i,
    });
    await nameInput.click();
    await nameInput.clear();
    await nameInput.fill(name);
    await nameInput.press("Tab"); // Trigger validation

    // Wait for validation
    await this.page.waitForTimeout(1000);

    // Fill description if provided
    if (description) {
      const descInput = this.page
        .locator('input[name="Description"]')
        .or(this.page.getByPlaceholder(/description/i))
        .or(this.page.locator("#repository_description"));

      if ((await descInput.count()) > 0) {
        await descInput.first().fill(description);
      }
    }

    // Wait and find the create button
    await this.page.waitForTimeout(1000);

    // Try multiple ways to click the button
    const createButton = this.page
      .getByRole("button", { name: "Create repository" })
      .first();

    // Wait for button to be visible
    await createButton.waitFor({ state: "visible", timeout: 5000 });

    // Scroll into view
    await createButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    // Click
    await createButton.click();

    // Wait for repository page to load
    await this.page.waitForTimeout(3000);
  }

  async goToRepository(owner, repo) {
    await this.goto(`https://github.com/${owner}/${repo}`);
  }

  async goToSettings(owner, repo) {
    await this.goToRepository(owner, repo);
    await this.click(this.settingsTab);
    await this.page.waitForLoadState("load", { timeout: 30000 });
  }

  async deleteRepository(owner, repo) {
    await this.goToSettings(owner, repo);
    const deleteRepoButton = this.page.locator(
      "#dialog-show-repo-delete-menu-dialog"
    );
    await deleteRepoButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    await deleteRepoButton.click();

    const confirmButton = this.page.locator("#repo-delete-proceed-button");
    await confirmButton.click();

    const againConfirmButton = this.page.locator("#repo-delete-proceed-button");
    await againConfirmButton.click();
    await this.page.waitForSelector(this.confirmInput, { timeout: 5000 });
    await this.fill(this.confirmInput, `${owner}/${repo}`);

    const finalConfirmButton = this.page.locator("#repo-delete-proceed-button");
    await finalConfirmButton.click();
    await this.page.waitForLoadState("load", { timeout: 30000 });
  }

  async createFile(owner, repo, fileName, content) {
    await this.goToRepository(owner, repo);
    
    // Click "Create new file" using either the empty-state link or the Add file dropdown
    const emptyStateNewFileLink = this.page.getByRole("link", { name: /creating a new file/i });
    if ((await emptyStateNewFileLink.count()) > 0) {
      await emptyStateNewFileLink.first().click();
    } else {
      await this.page.getByRole("button", { name: /add file/i }).click().catch(async () => {
        await this.page.click('summary:has-text("Add file")');
      });
      const createNewFileItem = this.page.getByRole("menuitem", { name: /create new file/i }).or(
        this.page.locator('a:has-text("Create new file")')
      );
      await createNewFileItem.first().click();
    }

    // Fill file name and content
    const fileNameInput = this.page.locator('input[name="filename"]').or(
      this.page.getByPlaceholder(/file name/i)
    );
    await fileNameInput.first().click();
    await fileNameInput.first().fill(fileName);

    // Modern GitHub uses CodeMirror 6
    const editor = this.page.locator('.cm-editor .cm-content');
    await editor.first().click();
    await editor.first().fill(content);

    // Commit file
    const commitBtn = this.page.getByRole("button", { name: /commit new file/i }).or(
      this.page.locator('button:has-text("Commit new file")')
    );
    await commitBtn.first().click();

    // Wait for navigation to blob page of the created file
    await this.page.waitForURL(/\/blob\//, { timeout: 30000 });
  }

  async editFile(owner, repo, fileName) {
    await this.goto(
      `https://github.com/${owner}/${repo}/blob/main/${fileName}`
    );

    // Click edit button
    await this.page.click('button[aria-label="Edit file"]');
    await this.page.waitForLoadState("load", { timeout: 30000 });
  }

  async updateDescription(owner, repo, newDescription) {
    await this.goToRepository(owner, repo);

    // Click edit description
    await this.page.click('button[aria-label="Edit repository details"]');
    await this.page.fill(
      'input[name="repository[description]"]',
      newDescription
    );
    await this.page.click('button:has-text("Save")');
    await this.page.waitForTimeout(1000);
  }

  async renameRepository(owner, oldName, newName) {
    await this.goToSettings(owner, oldName);
    const nameInput = this.page.getByLabel(/repository name/i).or(
      this.page.locator('input#rename-field, input[name="repository[name]"], input[name="new_name"]')
    );
    await nameInput.first().click();
    await nameInput.first().fill(newName);
    const renameButton = this.page.getByRole('button', { name: /rename/i }).or(
      this.page.locator('button:has-text("Rename")')
    );
    await renameButton.first().click();
    await renameButton.waitFor({ state: "visible", timeout: 5000 });
    await renameButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await renameButton.click();
    const dialog = this.page.getByRole('dialog');
    if (await dialog.isVisible().catch(() => false)) {
      const confirmInput = dialog.getByRole('textbox').or(
        dialog.locator('input[type="text"]')
      );
      if ((await confirmInput.count()) > 0) {
        await confirmInput.first().fill(`${owner}/${newName}`);
      }
      const confirmBtn = dialog.getByRole('button', { name: /rename/i }).or(
        dialog.locator('button:has-text("Rename")')
      );
      await confirmBtn.first().click();
    }

    await this.page.waitForURL(new RegExp(`/${owner}/${newName}(/|$)`), { timeout: 30000 });
  }
}
