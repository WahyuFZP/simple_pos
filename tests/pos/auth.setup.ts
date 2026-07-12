// tests/pos/auth.setup.ts
// Playwright global setup: login sekali, simpen session storageState
// Semua test file lain bakal pake state ini tanpa perlu login ulang

import { test as setup, expect } from "@playwright/test";

const AUTH_FILE = "tests/pos/auth-state.json";

setup("authenticate sebagai admin", async ({ page }) => {
  await page.goto("/login");
  await page.waitForSelector("#email", { state: "visible" });

  // Pakai ID selector biar lebih robust di semua browser (termasuk WebKit)
  await page.locator("#email").fill("admin@simplepos.com");
  await page.locator("#password").fill("admin123");
  await page.locator('button[type="submit"]').click();

  // Tunggu sampai benar-benar landing di POS
  await page.waitForURL("/pos", { timeout: 15000 });

  // Simpan storage state (cookies + localStorage) ke file
  await page.context().storageState({ path: AUTH_FILE });
});
