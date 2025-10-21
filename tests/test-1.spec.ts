import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://github.com/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('prasenjit-coder');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Passmeplz1@');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.goto("https://github.com/new");
  await page.getByRole('textbox', { name: 'Repository name *' }).click();
  await page.getByRole('textbox', { name: 'Repository name *' }).fill('file-test');
  await page.getByRole('button', { name: 'Create repository' }).click();
  await page.getByRole('link', { name: 'creating a new file' }).click();
  await page.getByRole('textbox', { name: 'Editing file contents Use' }).click();
  await page.getByRole('textbox', { name: 'Editing file contents Use' }).fill('test');
  await page.getByRole('textbox', { name: 'File name' }).click();
  await page.getByRole('textbox', { name: 'File name' }).fill('test-file');
  await page.getByRole('button', { name: 'Commit changes...' }).click();
  await page.getByRole('button', { name: 'Commit changes', exact: true }).click();
});