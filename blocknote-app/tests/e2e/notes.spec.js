const { test, expect } = require('@playwright/test');

const unique = () => `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

async function registerAndLogin(page) {
  const u = unique();
  await page.goto('/');
  await page.click('[data-testid="tab-register"]');
  await page.fill('[data-testid="register-username"]', u);
  await page.fill('[data-testid="register-email"]', `${u}@example.com`);
  await page.fill('[data-testid="register-password"]', 'secret123');
  await page.click('[data-testid="register-submit"]');
  await expect(page.locator('[data-testid="new-note-btn"]')).toBeVisible();
}

test.describe('Notes', () => {
  test('shows empty state before any notes are created', async ({ page }) => {
    await registerAndLogin(page);
    await expect(page.locator('[data-testid="empty-editor"]')).toBeVisible();
  });

  test('creates a new note', async ({ page }) => {
    await registerAndLogin(page);
    await page.click('[data-testid="new-note-btn"]');
    await page.fill('[data-testid="note-title"]', 'My First Note');
    await page.fill('[data-testid="note-content"]', 'This is the content of my first note.');
    await page.click('[data-testid="save-note-btn"]');
    await expect(page.locator('[data-testid="note-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="note-item"]').first()).toContainText('My First Note');
  });

  test('creates multiple notes', async ({ page }) => {
    await registerAndLogin(page);
    for (let i = 1; i <= 3; i++) {
      await page.click('[data-testid="new-note-btn"]');
      await page.fill('[data-testid="note-title"]', `Note ${i}`);
      await page.fill('[data-testid="note-content"]', `Content ${i}`);
      await page.click('[data-testid="save-note-btn"]');
    }
    await expect(page.locator('[data-testid="note-item"]')).toHaveCount(3);
  });

  test('edits an existing note', async ({ page }) => {
    await registerAndLogin(page);
    await page.click('[data-testid="new-note-btn"]');
    await page.fill('[data-testid="note-title"]', 'Original Title');
    await page.fill('[data-testid="note-content"]', 'Original content');
    await page.click('[data-testid="save-note-btn"]');

    await page.locator('[data-testid="note-item"] .note-title-btn').first().click();
    await page.fill('[data-testid="note-title"]', 'Updated Title');
    await page.fill('[data-testid="note-content"]', 'Updated content');
    await page.click('[data-testid="save-note-btn"]');

    await expect(page.locator('[data-testid="note-item"]').first()).toContainText('Updated Title');
  });

  test('deletes a note', async ({ page }) => {
    await registerAndLogin(page);
    await page.click('[data-testid="new-note-btn"]');
    await page.fill('[data-testid="note-title"]', 'Note to Delete');
    await page.click('[data-testid="save-note-btn"]');
    await expect(page.locator('[data-testid="note-item"]')).toHaveCount(1);

    await page.click('[data-testid="delete-note-btn"]');
    await expect(page.locator('[data-testid="note-item"]')).toHaveCount(0);
  });

  test('cancel discards the form', async ({ page }) => {
    await registerAndLogin(page);
    await page.click('[data-testid="new-note-btn"]');
    await page.fill('[data-testid="note-title"]', 'Will be cancelled');
    await page.click('[data-testid="cancel-note-btn"]');
    await expect(page.locator('[data-testid="empty-editor"]')).toBeVisible();
    await expect(page.locator('[data-testid="note-item"]')).toHaveCount(0);
  });

  test('note requires a title to save', async ({ page }) => {
    await registerAndLogin(page);
    await page.click('[data-testid="new-note-btn"]');
    await page.click('[data-testid="save-note-btn"]');
    // HTML5 validation prevents submission — form should still be visible
    await expect(page.locator('[data-testid="note-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="note-item"]')).toHaveCount(0);
  });
});
