// tests/pos/navigation.spec.ts
// Test: Navigasi header — Riwayat & Dashboard

import { test, expect } from '@playwright/test';

test.describe('Navigasi', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@simplepos.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/pos');
  });

  test('navigasi ke riwayat transaksi', async ({ page }) => {
    await page.click('a:has-text("Riwayat")');
    await expect(page).toHaveURL('/pos/history');
    await expect(page.locator('h1:has-text("Riwayat Transaksi")')).toBeVisible();
  });

  test('navigasi ke dashboard', async ({ page }) => {
    await page.click('a:has-text("Dashboard")');
    await expect(page).toHaveURL('/pos/dashboard');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('text=Transaksi Hari Ini')).toBeVisible();
  });

  test('navigasi kembali ke menu dari riwayat', async ({ page }) => {
    await page.click('a:has-text("Riwayat")');
    await expect(page).toHaveURL('/pos/history');

    await page.click('a:has-text("Menu")');
    await expect(page).toHaveURL('/pos');
  });

  test('tombol logout berfungsi', async ({ page }) => {
    // Klik avatar untuk buka dropdown
    await page.locator('button:has-text("Admin")').click();
    // Klik "Keluar"
    await page.locator('button:has-text("Keluar")').click();

    await expect(page).toHaveURL('/login');
  });
});
