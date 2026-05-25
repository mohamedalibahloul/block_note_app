const { test, expect } = require('@playwright/test');

const unique = () => `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

test.describe('Registration', () => {
  test('shows register form when Register tab is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="tab-register"]');
    await expect(page.locator('[data-testid="register-form"]')).toBeVisible();
  });

  test('registers a new user and lands on notes page', async ({ page }) => {
    const u = unique();
    await page.goto('/');
    await page.click('[data-testid="tab-register"]');
    await page.fill('[data-testid="register-username"]', u);
    await page.fill('[data-testid="register-email"]', `${u}@example.com`);
    await page.fill('[data-testid="register-password"]', 'secret123');
    await page.click('[data-testid="register-submit"]');
    await expect(page.locator('[data-testid="new-note-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="username-display"]')).toHaveText(u);
  });

  test('shows error for duplicate email', async ({ page }) => {
    const u = unique();
    await page.goto('/');
    await page.click('[data-testid="tab-register"]');

    // Register first time
    await page.fill('[data-testid="register-username"]', u);
    await page.fill('[data-testid="register-email"]', `${u}@example.com`);
    await page.fill('[data-testid="register-password"]', 'secret123');
    await page.click('[data-testid="register-submit"]');
    await expect(page.locator('[data-testid="new-note-btn"]')).toBeVisible();

    // Logout and try to register same email again
    await page.click('[data-testid="logout-btn"]');
    await page.click('[data-testid="tab-register"]');
    await page.fill('[data-testid="register-username"]', `${u}_2`);
    await page.fill('[data-testid="register-email"]', `${u}@example.com`);
    await page.fill('[data-testid="register-password"]', 'secret123');
    await page.click('[data-testid="register-submit"]');
    await expect(page.locator('[data-testid="register-error"]')).toBeVisible();
  });
});

test.describe('Login', () => {
  let email, password, username;

  test.beforeAll(async ({ browser }) => {
    username = unique();
    email = `${username}@example.com`;
    password = 'mypassword';
    const page = await browser.newPage();
    await page.goto('/');
    await page.click('[data-testid="tab-register"]');
    await page.fill('[data-testid="register-username"]', username);
    await page.fill('[data-testid="register-email"]', email);
    await page.fill('[data-testid="register-password"]', password);
    await page.click('[data-testid="register-submit"]');
    await expect(page.locator('[data-testid="new-note-btn"]')).toBeVisible();
    await page.close();
  });

  test('logs in with correct credentials', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="login-email"]', email);
    await page.fill('[data-testid="login-password"]', password);
    await page.click('[data-testid="login-submit"]');
    await expect(page.locator('[data-testid="new-note-btn"]')).toBeVisible();
  });

  test('shows error for wrong password', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="login-email"]', email);
    await page.fill('[data-testid="login-password"]', 'wrongpassword');
    await page.click('[data-testid="login-submit"]');
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
  });

  test('logout returns to login page', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="login-email"]', email);
    await page.fill('[data-testid="login-password"]', password);
    await page.click('[data-testid="login-submit"]');
    await page.click('[data-testid="logout-btn"]');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });
});
