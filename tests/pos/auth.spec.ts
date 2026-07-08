// tests/pos/auth.spec.ts
// Test: Login, login gagal, redirect tanpa auth

import { test, expect } from '@playwright/test';

test.describe('Auth - Login', () => {

  test('login sukses dengan kredensial admin', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@simplepos.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/pos');
    await expect(page.locator('text=🍽️ POS')).toBeVisible();
  });

  test('login gagal — password salah', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@simplepos.com');
    await page.fill('input[type="password"]', 'salah');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Email atau password salah.')).toBeVisible();
  });

  test('redirect ke /login jika akses /pos tanpa auth', async ({ page }) => {
    await page.goto('/pos');
    await expect(page).toHaveURL('/login');
  });

  test('link daftar mengarah ke /register', async ({ page }) => {
    await page.goto('/login');
    await page.click('a:has-text("Daftar")');
    await expect(page).toHaveURL('/register');
  });
});
