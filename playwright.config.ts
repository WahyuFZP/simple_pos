import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
// Local: pakai .env.staging untuk pointing ke Supabase
// CI/CD: pake ${{ secrets.SUPABASE_DATABASE_URL }} (dari GitHub Secrets)
dotenv.config({ path: path.resolve(__dirname, '.env.staging') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/pos',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  /* Auto-start dev server jika belum jalan */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    /* Setup: login sekali, simpan session */
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    /* Auth: test login flow — butuh browser clean tanpa session tersimpan */
    {
      name: 'auth-chromium',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'auth-firefox',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'auth-webkit',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    /* Main tests: pake session dari setup (checkout, navigation, dll) */
    {
      name: 'chromium',
      testIgnore: /auth\./,
      use: { ...devices['Desktop Chrome'], storageState: 'tests/pos/auth-state.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testIgnore: /auth\./,
      use: { ...devices['Desktop Firefox'], storageState: 'tests/pos/auth-state.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      testIgnore: /auth\./,
      use: { ...devices['Desktop Safari'], storageState: 'tests/pos/auth-state.json' },
      dependencies: ['setup'],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
