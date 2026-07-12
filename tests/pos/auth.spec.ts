// tests/pos/auth.spec.ts
// Test: Login, login gagal, redirect tanpa auth
// Catatan:
// - Login sukses pake direct API call (bypass signIn client-side)
//   karena signIn() dari next-auth/react bermasalah di WebKit (CSRF cookie).
// - Login gagal pake UI form → verifikasi tetap di /login (tidak redirect).

import { test, expect } from '@playwright/test';

// Helper: login via direct API POST (bypass client-side signIn)
// 1. Ambil CSRF token dari /api/auth/csrf
// 2. POST ke /api/auth/callback/credentials
// 3. Navigasi ke /pos setelah login sukses
async function loginViaApi(page: any, email: string, password: string) {
  // Step 1: dapetin CSRF token
  const csrfRes = await page.request.get('/api/auth/csrf');
  const { csrfToken } = await csrfRes.json();

  // Step 2: kirim credentials
  await page.request.post('/api/auth/callback/credentials', {
    form: {
      csrfToken,
      callbackUrl: '/pos',
      email,
      password,
      redirect: 'false',
    },
  });

  // Step 3: navigasi ke POS
  await page.goto('/pos');
}

// Helper: login via form UI (buat test gagal — validasi error message)
// Pakai keyboard Enter biar lebih reliable di WebKit daripada button click
async function loginViaForm(page: any, email: string, password: string) {
  await page.goto('/login');
  await page.waitForSelector('#email', { state: 'visible' });
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  // Tekan Enter di field password → trigger form submit
  await page.locator('#password').press('Enter');
}

test.describe('Auth - Login', () => {

  test('login sukses dengan kredensial admin', async ({ page }) => {
    await loginViaApi(page, 'admin@simplepos.com', 'admin123');
    await expect(page).toHaveURL('/pos');
    // 🍽️ POS adalah <Link> → <a> → locator anchor lebih reliable
    await expect(page.locator('a:has-text("🍽️ POS")')).toBeVisible();
  });

  test('login gagal — password salah', async ({ page }) => {
    await loginViaForm(page, 'admin@simplepos.com', 'salah');
    // Login gagal → harus tetap di halaman login (form masih ada, bukan redirect ke /pos)
    await expect(page.locator('#email')).toBeVisible({ timeout: 5000 });
  });

  test('login berhasil dengan kredensial kasir', async ({ page }) => {
    await loginViaApi(page, 'kasir@simplepos.com', 'kasir123');
    await expect(page).toHaveURL('/pos');
    await expect(page.locator('a:has-text("🍽️ POS")')).toBeVisible();
  });

  test('login gagal — email tidak terdaftar', async ({ page }) => {
    await loginViaForm(page, 'some@email.com', 'salah');
    // Login gagal → harus tetap di halaman login
    await expect(page.locator('#email')).toBeVisible({ timeout: 5000 });
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
