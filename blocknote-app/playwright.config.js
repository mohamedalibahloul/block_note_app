const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'cross-env NODE_OPTIONS=--experimental-sqlite node backend/src/app.js',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      env: {
        PORT: '3001',
        DB_PATH: './data/e2e_test.db',
      },
    },
    {
      command: 'npm run dev --prefix frontend',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
